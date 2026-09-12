"""Clean and preprocess the synthetic land-acquisition delay dataset."""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


ROOT = Path(__file__).resolve().parents[1]
RAW_PATH = ROOT / "data" / "raw" / "land_acquisition_raw.csv"
OUTPUT_DIR = ROOT / "data" / "processed"
TARGET = "approximate_delay_days"
RANDOM_STATE = 42


def snake_case(name: str) -> str:
    return (
        name.strip()
        .lower()
        .replace(" (%)", "_pct")
        .replace("(", "")
        .replace(")", "")
        .replace(" ", "_")
        .replace("__", "_")
    )


def invalid_to_nan(series: pd.Series, lower: float, upper: float) -> tuple[pd.Series, int]:
    invalid = series.notna() & ~series.between(lower, upper, inclusive="both")
    result = series.copy()
    result.loc[invalid] = np.nan
    return result, int(invalid.sum())


def clean_dataset(raw: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    report: dict[str, object] = {
        "raw_rows": int(len(raw)),
        "raw_columns": int(raw.shape[1]),
        "raw_missing_cells": int(raw.isna().sum().sum()),
    }

    df = raw.copy()
    duplicate_rows = int(df.duplicated().sum())
    df = df.drop_duplicates().copy()
    report["exact_duplicate_rows_removed"] = duplicate_rows

    df.columns = [snake_case(column) for column in df.columns]

    text_columns = df.select_dtypes(include="object").columns
    for column in text_columns:
        df[column] = df[column].str.strip()
        df[column] = df[column].replace(
            {"": np.nan, "N/A": np.nan, "NA": np.nan, "null": np.nan}
        )

    df["state"] = df["state"].str.title()
    df["acquisition_stage"] = (
        df["acquisition_stage"]
        .str.title()
        .replace({"Acquisition": "Unknown", "Unknown Stage": "Unknown"})
    )

    for column in [
        "project_type",
        "environmental_clearance",
        "forest_clearance",
        "relocation_required",
        "dispute_severity",
        "payment_status",
        "document_verification_status",
    ]:
        df[column] = df[column].str.title()

    agency_lookup = {
        "nhai": "NHAI",
        "state pwd": "State PWD",
        "special la unit": "Special LA Unit",
        "district administration": "District Administration",
    }
    df["land_acquisition_agency"] = (
        df["land_acquisition_agency"].str.lower().map(agency_lookup)
    )

    date_columns = ["notification_3a_date", "notification_3d_date", "sanction_date"]
    invalid_dates: dict[str, int] = {}
    for column in date_columns:
        parsed = pd.to_datetime(df[column], format="%d-%m-%Y", errors="coerce")
        invalid_dates[column] = int(parsed.isna().sum() - df[column].isna().sum())
        df[column] = parsed
    report["invalid_date_values_coerced"] = invalid_dates

    # Wide bounds identify deliberately impossible/sentinel values without deleting
    # plausible difficult acquisition cases. Missing features are imputed downstream.
    valid_ranges = {
        "land_area_acres": (0.01, 10_000),
        "number_of_landowners": (1, 10_000),
        "number_of_objections": (0, 1_000),
        "number_of_court_cases": (0, 1_000),
        "compensation_completed_pct": (0, 100),
        "pending_approvals": (0, 1_000),
        "days_in_current_stage": (0, 3_650),
        "sanction_amount_lakh": (0.01, 1_000_000),
        "structures_affected": (0, 10_000),
        "project_length_km": (0.01, 1_000),
        "last_review_days_ago": (0, 3_650),
    }
    invalid_numeric: dict[str, int] = {}
    for column, (lower, upper) in valid_ranges.items():
        df[column], invalid_numeric[column] = invalid_to_nan(df[column], lower, upper)
    report["invalid_feature_values_set_to_missing"] = invalid_numeric

    target_invalid = df[TARGET].isna() | ~df[TARGET].between(0, 3_650, inclusive="both")
    report["rows_removed_for_invalid_target"] = int(target_invalid.sum())
    df = df.loc[~target_invalid].copy()

    report.update(
        {
            "clean_rows": int(len(df)),
            "clean_columns": int(df.shape[1]),
            "remaining_missing_cells_before_imputation": int(df.isna().sum().sum()),
            "unique_case_ids": int(df["case_id"].nunique()),
            "notification_3d_before_3a": int(
                (df["notification_3d_date"] < df["notification_3a_date"]).sum()
            ),
            "sanction_before_notification_3a": int(
                (df["sanction_date"] < df["notification_3a_date"]).sum()
            ),
        }
    )
    return df, report


def build_preprocessor(df: pd.DataFrame) -> tuple[ColumnTransformer, list[str], list[str]]:
    excluded = {
        "case_id",
        TARGET,
        "notification_3a_date",
        "notification_3d_date",
        "sanction_date",
    }
    features = df.drop(columns=list(excluded))
    numeric_columns = features.select_dtypes(include=["number"]).columns.tolist()
    categorical_columns = features.select_dtypes(exclude=["number"]).columns.tolist()

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=True)),
        ]
    )
    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, numeric_columns),
            ("categorical", categorical_pipeline, categorical_columns),
        ]
    )
    return preprocessor, numeric_columns, categorical_columns


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    raw = pd.read_csv(RAW_PATH)
    cleaned, report = clean_dataset(raw)

    cleaned_for_csv = cleaned.copy()
    for column in ["notification_3a_date", "notification_3d_date", "sanction_date"]:
        cleaned_for_csv[column] = cleaned_for_csv[column].dt.strftime("%Y-%m-%d")
    cleaned_for_csv.to_csv(OUTPUT_DIR / "land_acquisition_cleaned.csv", index=False)

    excluded_dates = ["notification_3a_date", "notification_3d_date", "sanction_date"]
    modeling = cleaned.drop(columns=["case_id", *excluded_dates])
    modeling.to_csv(OUTPUT_DIR / "land_acquisition_modeling.csv", index=False)

    X = modeling.drop(columns=TARGET)
    y = modeling[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    preprocessor, numeric_columns, categorical_columns = build_preprocessor(cleaned)
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    sparse.save_npz(OUTPUT_DIR / "X_train_processed.npz", sparse.csr_matrix(X_train_processed))
    sparse.save_npz(OUTPUT_DIR / "X_test_processed.npz", sparse.csr_matrix(X_test_processed))
    pd.DataFrame({TARGET: y_train}).to_csv(OUTPUT_DIR / "y_train.csv", index=False)
    pd.DataFrame({TARGET: y_test}).to_csv(OUTPUT_DIR / "y_test.csv", index=False)
    joblib.dump(preprocessor, OUTPUT_DIR / "preprocessor.joblib")

    feature_names = preprocessor.get_feature_names_out().tolist()
    report["train_rows"] = int(len(X_train))
    report["test_rows"] = int(len(X_test))
    report["processed_feature_count"] = len(feature_names)
    report["numeric_model_features"] = numeric_columns
    report["categorical_model_features"] = categorical_columns
    report["excluded_model_fields"] = ["case_id", *excluded_dates]
    report["split_random_state"] = RANDOM_STATE

    (OUTPUT_DIR / "feature_names.json").write_text(
        json.dumps(feature_names, indent=2), encoding="utf-8"
    )
    (OUTPUT_DIR / "data_quality_report.json").write_text(
        json.dumps(report, indent=2), encoding="utf-8"
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
