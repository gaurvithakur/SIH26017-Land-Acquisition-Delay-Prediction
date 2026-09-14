"""Generate global and local SHAP explanations for the selected delay model."""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import shap
from sklearn.model_selection import train_test_split


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "processed" / "land_acquisition_modeling.csv"
CLEAN_DATA_PATH = ROOT / "data" / "processed" / "land_acquisition_cleaned.csv"
MODEL_PATH = ROOT / "models" / "best_delay_model.joblib"
REPORTS_DIR = ROOT / "reports" / "explainability"
FIGURES_DIR = REPORTS_DIR / "figures"
TARGET = "approximate_delay_days"
RANDOM_STATE = 42
EXPLANATION_SAMPLE_SIZE = 1_000


def readable_name(name: str) -> str:
    return name.replace("numeric__", "").replace("categorical__", "")


def source_feature(name: str, categorical_columns: list[str]) -> str:
    clean_name = readable_name(name)
    for column in sorted(categorical_columns, key=len, reverse=True):
        if clean_name.startswith(f"{column}_"):
            return column
    return clean_name


def main() -> None:
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)

    data = pd.read_csv(DATA_PATH)
    clean_data = pd.read_csv(CLEAN_DATA_PATH, usecols=["case_id"])
    X = data.drop(columns=TARGET)
    y = data[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    pipeline = joblib.load(MODEL_PATH)
    preprocessor = pipeline.named_steps["preprocessor"]
    model = pipeline.named_steps["model"]
    if model.__class__.__name__ != "LinearRegression":
        raise TypeError("This script expects the selected Linear Regression pipeline.")

    transformed_train = preprocessor.transform(X_train)
    transformed_test = preprocessor.transform(X_test)
    if hasattr(transformed_train, "toarray"):
        transformed_train = transformed_train.toarray()
    if hasattr(transformed_test, "toarray"):
        transformed_test = transformed_test.toarray()

    rng = np.random.default_rng(RANDOM_STATE)
    background_indices = rng.choice(
        len(transformed_train), size=min(500, len(transformed_train)), replace=False
    )
    explain_indices = rng.choice(
        len(transformed_test),
        size=min(EXPLANATION_SAMPLE_SIZE, len(transformed_test)),
        replace=False,
    )

    feature_names = [readable_name(name) for name in preprocessor.get_feature_names_out()]
    background = transformed_train[background_indices]
    explained_matrix = transformed_test[explain_indices]

    explainer = shap.LinearExplainer(model, background)
    explanations = explainer(explained_matrix)
    explanations.feature_names = feature_names

    predictions = pipeline.predict(X_test)
    prediction_check = np.max(
        np.abs(
            explanations.base_values
            + explanations.values.sum(axis=1)
            - predictions[explain_indices]
        )
    )

    plt.figure()
    shap.plots.beeswarm(explanations, max_display=15, show=False)
    plt.title("SHAP Summary: Features Driving Predicted Delay")
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "shap_global_beeswarm.png", dpi=180, bbox_inches="tight")
    plt.close()

    plt.figure()
    shap.plots.bar(explanations, max_display=15, show=False)
    plt.title("Global SHAP Importance")
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "shap_global_bar.png", dpi=180, bbox_inches="tight")
    plt.close()

    categorical_columns = X.select_dtypes(exclude="number").columns.tolist()
    transformed_to_source = [
        source_feature(name, categorical_columns) for name in feature_names
    ]
    global_rows = []
    for column in X.columns:
        positions = [i for i, source in enumerate(transformed_to_source) if source == column]
        global_rows.append(
            {
                "feature": column,
                "mean_absolute_shap_days": float(
                    np.abs(explanations.values[:, positions]).sum(axis=1).mean()
                ),
            }
        )
    global_importance = pd.DataFrame(global_rows).sort_values(
        "mean_absolute_shap_days", ascending=False
    )
    global_importance.to_csv(REPORTS_DIR / "shap_global_importance.csv", index=False)

    # Pick an understandable example near 85 predicted days for the project demo.
    local_test_position = int(np.argmin(np.abs(predictions - 85)))
    local_explanation = explainer(transformed_test[local_test_position : local_test_position + 1])[0]
    local_explanation.feature_names = feature_names
    local_prediction = float(predictions[local_test_position])
    original_index = int(X_test.index[local_test_position])

    plt.figure()
    shap.plots.waterfall(local_explanation, max_display=12, show=False)
    plt.title(f"SHAP Explanation for One Prediction ({local_prediction:.1f} days)")
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "shap_local_waterfall.png", dpi=180, bbox_inches="tight")
    plt.close()

    local_rows = []
    for column in X.columns:
        positions = [i for i, source in enumerate(transformed_to_source) if source == column]
        local_rows.append(
            {
                "feature": column,
                "feature_value": str(X_test.iloc[local_test_position][column]),
                "shap_contribution_days": float(local_explanation.values[positions].sum()),
            }
        )
    local_contributions = pd.DataFrame(local_rows)
    local_contributions["absolute_contribution_days"] = local_contributions[
        "shap_contribution_days"
    ].abs()
    local_contributions = local_contributions.sort_values(
        "absolute_contribution_days", ascending=False
    )
    local_contributions.to_csv(REPORTS_DIR / "shap_example_explanation.csv", index=False)

    top_local = local_contributions.head(10).sort_values("shap_contribution_days")
    colors = np.where(top_local["shap_contribution_days"] >= 0, "#E76F51", "#2563EB")
    fig, ax = plt.subplots(figsize=(10, 6.2))
    ax.barh(top_local["feature"], top_local["shap_contribution_days"], color=colors)
    ax.axvline(0, color="#263238", linewidth=1)
    ax.set(
        title=f"Main Factors for Predicted Delay of {local_prediction:.1f} Days",
        xlabel="Contribution to prediction (days)",
        ylabel="",
    )
    fig.tight_layout()
    fig.savefig(FIGURES_DIR / "shap_local_contributions.png", dpi=180, bbox_inches="tight")
    plt.close(fig)

    example = {
        "case_id": str(clean_data.iloc[original_index]["case_id"]),
        "actual_delay_days": float(y_test.iloc[local_test_position]),
        "predicted_delay_days": local_prediction,
        "baseline_prediction_days": float(np.ravel(local_explanation.base_values)[0]),
        "top_factors": local_contributions.head(8).to_dict(orient="records"),
    }
    (REPORTS_DIR / "shap_example_explanation.json").write_text(
        json.dumps(example, indent=2), encoding="utf-8"
    )

    summary = {
        "explained_model": model.__class__.__name__,
        "background_rows": int(len(background)),
        "explained_test_rows": int(len(explained_matrix)),
        "transformed_features": int(len(feature_names)),
        "maximum_additivity_error_days": float(prediction_check),
        "global_top_features": global_importance.head(10).to_dict(orient="records"),
        "example": example,
        "interpretation": (
            "Positive SHAP values increase predicted delay relative to the baseline; "
            "negative values decrease it."
        ),
        "synthetic_data_warning": (
            "Explanations describe a model trained on synthetic prototype data and "
            "must not be presented as verified government evidence."
        ),
    }
    (REPORTS_DIR / "shap_summary.json").write_text(
        json.dumps(summary, indent=2), encoding="utf-8"
    )

    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
