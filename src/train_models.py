"""Train and evaluate regression models for approximate delay prediction."""

from __future__ import annotations

import json
from pathlib import Path
from time import perf_counter

import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    median_absolute_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "processed" / "land_acquisition_modeling.csv"
MODELS_DIR = ROOT / "models"
REPORTS_DIR = ROOT / "reports"
FIGURES_DIR = REPORTS_DIR / "figures"
TARGET = "approximate_delay_days"
RANDOM_STATE = 42


def make_preprocessor(data: pd.DataFrame) -> ColumnTransformer:
    numeric_columns = data.select_dtypes(include="number").columns.tolist()
    categorical_columns = data.select_dtypes(exclude="number").columns.tolist()

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
    return ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, numeric_columns),
            ("categorical", categorical_pipeline, categorical_columns),
        ]
    )


def metrics(y_true: pd.Series, predictions: np.ndarray) -> dict[str, float]:
    mse = mean_squared_error(y_true, predictions)
    nonzero = y_true != 0
    mape = np.mean(np.abs((y_true[nonzero] - predictions[nonzero]) / y_true[nonzero])) * 100
    return {
        "MAE_days": float(mean_absolute_error(y_true, predictions)),
        "RMSE_days": float(np.sqrt(mse)),
        "R2": float(r2_score(y_true, predictions)),
        "Median_AE_days": float(median_absolute_error(y_true, predictions)),
        "MAPE_nonzero_pct": float(mape),
    }


def save_diagnostics(y_test: pd.Series, predictions: np.ndarray, model_name: str) -> None:
    residuals = y_test.to_numpy() - predictions

    fig, axes = plt.subplots(1, 2, figsize=(13, 5.2))
    axes[0].scatter(y_test, predictions, alpha=0.25, s=16, color="#2563EB")
    lower = min(float(y_test.min()), float(predictions.min()))
    upper = max(float(y_test.max()), float(predictions.max()))
    axes[0].plot([lower, upper], [lower, upper], linestyle="--", color="#E76F51")
    axes[0].set(
        title=f"{model_name}: Actual vs Predicted Delay",
        xlabel="Actual delay (days)",
        ylabel="Predicted delay (days)",
    )

    axes[1].hist(residuals, bins=35, color="#D99A00", edgecolor="white")
    axes[1].axvline(0, linestyle="--", color="#263238")
    axes[1].set(
        title=f"{model_name} Residual Distribution",
        xlabel="Actual minus predicted delay (days)",
        ylabel="Cases",
    )
    fig.tight_layout()
    fig.savefig(FIGURES_DIR / "best_model_diagnostics.png", dpi=160, bbox_inches="tight")
    plt.close(fig)


def save_feature_importance(pipeline: Pipeline) -> None:
    feature_names = [
        name.replace("numeric__", "").replace("categorical__", "")
        for name in pipeline.named_steps["preprocessor"].get_feature_names_out()
    ]
    importances = pipeline.named_steps["model"].feature_importances_
    importance = (
        pd.DataFrame({"feature": feature_names, "importance": importances})
        .sort_values("importance", ascending=False)
        .reset_index(drop=True)
    )
    importance.to_csv(REPORTS_DIR / "random_forest_feature_importance.csv", index=False)

    top = importance.head(15).sort_values("importance")
    fig, ax = plt.subplots(figsize=(10, 6.5))
    ax.barh(top["feature"], top["importance"], color="#6B7C32")
    ax.set(title="Top Random Forest Feature Importances", xlabel="Impurity-based importance", ylabel="")
    fig.tight_layout()
    fig.savefig(FIGURES_DIR / "random_forest_feature_importance.png", dpi=160, bbox_inches="tight")
    plt.close(fig)


def main() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)

    data = pd.read_csv(DATA_PATH)
    X = data.drop(columns=TARGET)
    y = data[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    estimators = {
        "Median Baseline": DummyRegressor(strategy="median"),
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(
            n_estimators=120,
            max_depth=18,
            min_samples_leaf=2,
            max_features=0.7,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
    }

    rows: list[dict[str, object]] = []
    fitted: dict[str, Pipeline] = {}
    test_predictions: dict[str, np.ndarray] = {}

    for name, estimator in estimators.items():
        pipeline = Pipeline(
            steps=[("preprocessor", make_preprocessor(X_train)), ("model", estimator)]
        )
        started = perf_counter()
        pipeline.fit(X_train, y_train)
        elapsed = perf_counter() - started
        train_predictions = pipeline.predict(X_train)
        predictions = pipeline.predict(X_test)
        row = {
            "Model": name,
            **{f"Train_{key}": value for key, value in metrics(y_train, train_predictions).items()},
            **{f"Test_{key}": value for key, value in metrics(y_test, predictions).items()},
            "Fit_seconds": elapsed,
        }
        rows.append(row)
        fitted[name] = pipeline
        test_predictions[name] = predictions

    results = pd.DataFrame(rows).sort_values("Test_RMSE_days").reset_index(drop=True)
    results.to_csv(REPORTS_DIR / "model_comparison.csv", index=False)

    best_name = str(results.iloc[0]["Model"])
    best_pipeline = fitted[best_name]
    joblib.dump(best_pipeline, MODELS_DIR / "best_delay_model.joblib", compress=3)
    joblib.dump(
        fitted["Linear Regression"], MODELS_DIR / "linear_regression_pipeline.joblib", compress=3
    )
    joblib.dump(
        fitted["Random Forest"], MODELS_DIR / "random_forest_pipeline.joblib", compress=3
    )

    prediction_output = X_test.copy()
    prediction_output["actual_delay_days"] = y_test
    prediction_output["predicted_delay_days"] = test_predictions[best_name]
    prediction_output["residual_days"] = (
        prediction_output["actual_delay_days"] - prediction_output["predicted_delay_days"]
    )
    prediction_output.to_csv(REPORTS_DIR / "test_predictions.csv", index=False)

    save_diagnostics(y_test, test_predictions[best_name], best_name)
    save_feature_importance(fitted["Random Forest"])

    summary = {
        "dataset_rows": int(len(data)),
        "training_rows": int(len(X_train)),
        "testing_rows": int(len(X_test)),
        "input_features": int(X.shape[1]),
        "random_state": RANDOM_STATE,
        "best_model": best_name,
        "best_test_metrics": {
            key.removeprefix("Test_"): float(value)
            for key, value in results.iloc[0].items()
            if str(key).startswith("Test_")
        },
        "synthetic_data_warning": (
            "Metrics demonstrate prototype performance on synthetic data and do not "
            "establish performance on real government cases."
        ),
    }
    (REPORTS_DIR / "model_summary.json").write_text(
        json.dumps(summary, indent=2), encoding="utf-8"
    )

    print(results.round(4).to_string(index=False))
    print("\n" + json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
