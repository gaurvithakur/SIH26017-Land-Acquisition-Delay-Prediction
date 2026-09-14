"""Generate the land-acquisition EDA notebook with reproducible cells."""

from __future__ import annotations

import argparse
from pathlib import Path

import nbformat as nbf


def code(source: str):
    return nbf.v4.new_code_cell(source.strip())


def markdown(source: str):
    return nbf.v4.new_markdown_cell(source.strip())


def build_notebook(output_path: Path) -> None:
    notebook = nbf.v4.new_notebook()
    notebook["metadata"]["kernelspec"] = {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3",
    }
    notebook["metadata"]["language_info"] = {"name": "python", "version": "3"}

    notebook["cells"] = [
        markdown(
            """
# Exploratory Data Analysis: Land Acquisition Delay Prediction

## TL;DR

- The cleaned prototype contains **14,997 unique cases** and a complete regression target.
- Median approximate delay is **84 days**; 90% of records are at or below **126 days**.
- `days_in_current_stage` has the strongest numerical association with delay, followed by
  land area, number of landowners, pending approvals, objections, and court cases.
- Possession-stage cases have substantially lower average delay than Objection, Award,
  and Compensation cases in this synthetic dataset.
- Several plausible contextual fields, including dispute severity, have little univariate
  relationship with the target and should earn their place through validation.

These findings describe **synthetic prototype data**, not verified government records.
"""
        ),
        markdown(
            """
## Context & Methods

This notebook examines data quality after cleaning, the target distribution, numerical
relationships, and categorical differences to inform feature selection for regression.

### Key Assumptions

- One row represents one land-acquisition case.
- `approximate_delay_days` is the continuous prediction target.
- Association does not establish causation.
- Raw date columns are inspected but excluded from feature recommendations because the
  synthetic records contain widespread date-order contradictions.
- Missing values remain in the cleaned file intentionally; the model pipeline imputes them
  using training-only statistics.
"""
        ),
        markdown("## Data\n\n### 1. Load Libraries and Set Plot Style"),
        code(
            """
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from IPython.display import display

pd.set_option("display.max_columns", 40)
pd.set_option("display.float_format", lambda value: f"{value:,.2f}")

sns.set_theme(style="whitegrid", context="notebook")
COLORS = {
    "blue": "#2563EB",
    "gold": "#D99A00",
    "orange": "#E76F51",
    "olive": "#6B7C32",
    "pink": "#C45578",
    "charcoal": "#263238",
    "grey": "#D7DCE2",
}
plt.rcParams.update({
    "figure.figsize": (10, 5.5),
    "axes.titleweight": "bold",
    "axes.titlepad": 12,
    "axes.labelcolor": COLORS["charcoal"],
    "text.color": COLORS["charcoal"],
    "figure.facecolor": "white",
    "axes.facecolor": "white",
})
"""
        ),
        markdown("### 2. Load the Cleaned Dataset"),
        code(
            """
DATA_CANDIDATES = [
    Path("data/processed/land_acquisition_cleaned.csv"),
    Path("../data/processed/land_acquisition_cleaned.csv"),
]
DATA_PATH = next((path for path in DATA_CANDIDATES if path.exists()), DATA_CANDIDATES[0])
TARGET = "approximate_delay_days"

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Run this notebook from the repository root. Missing: {DATA_PATH}")

data = pd.read_csv(
    DATA_PATH,
    parse_dates=["notification_3a_date", "notification_3d_date", "sanction_date"],
)

print(f"Rows: {len(data):,}")
print(f"Columns: {data.shape[1]}")
print(f"Unique case IDs: {data['case_id'].nunique():,}")
display(data.head(5))
"""
        ),
        markdown("### 3. Validate Structure and Completeness"),
        code(
            """
quality_checks = pd.Series({
    "Rows": len(data),
    "Columns": data.shape[1],
    "Exact duplicate rows": data.duplicated().sum(),
    "Duplicate case IDs": data["case_id"].duplicated().sum(),
    "Missing target values": data[TARGET].isna().sum(),
    "Minimum target (days)": data[TARGET].min(),
    "Maximum target (days)": data[TARGET].max(),
}, name="Value").to_frame()
display(quality_checks)

missing = (
    data.isna().sum()
    .rename("Missing Values")
    .to_frame()
    .assign(**{"Missing (%)": lambda table: table["Missing Values"] / len(data) * 100})
    .query("`Missing Values` > 0")
    .sort_values("Missing (%)", ascending=False)
)
display(missing.round(2))
"""
        ),
        markdown("## Results\n\n### 4. Target Distribution"),
        code(
            """
target_summary = data[TARGET].describe(percentiles=[0.10, 0.25, 0.50, 0.75, 0.90, 0.95, 0.99])
display(target_summary.rename("Delay Days").to_frame().round(2))

fig, axes = plt.subplots(1, 2, figsize=(13, 4.8))
sns.histplot(data=data, x=TARGET, bins=35, color=COLORS["blue"], ax=axes[0])
axes[0].axvline(data[TARGET].median(), color=COLORS["orange"], linestyle="--", label="Median")
axes[0].set(title="Distribution of Approximate Delay", xlabel="Approximate delay (days)", ylabel="Cases")
axes[0].legend(frameon=False)

sns.boxplot(data=data, x=TARGET, color=COLORS["gold"], ax=axes[1])
axes[1].set(title="Spread and High-Delay Cases", xlabel="Approximate delay (days)")
plt.tight_layout()
plt.show()
"""
        ),
        markdown(
            "The target is moderately right-skewed. MAE and median absolute error will therefore complement RMSE during model evaluation."
        ),
        markdown("### 5. Numerical Relationships With Delay"),
        code(
            """
numeric_features = data.select_dtypes(include="number").columns.drop(TARGET)
target_correlations = (
    data[list(numeric_features) + [TARGET]]
    .corr(method="spearman")[TARGET]
    .drop(TARGET)
    .sort_values(key=np.abs, ascending=True)
)

fig, ax = plt.subplots(figsize=(9, 6))
bar_colors = [COLORS["orange"] if value < 0 else COLORS["blue"] for value in target_correlations]
ax.barh(target_correlations.index, target_correlations.values, color=bar_colors)
ax.axvline(0, color=COLORS["charcoal"], linewidth=1)
ax.set(title="Spearman Correlation With Approximate Delay", xlabel="Spearman correlation", ylabel="")
ax.set_xlim(-1, 1)
for index, value in enumerate(target_correlations.values):
    ax.text(value + (0.02 if value >= 0 else -0.02), index, f"{value:.2f}",
            va="center", ha="left" if value >= 0 else "right")
plt.tight_layout()
plt.show()

display(target_correlations.sort_values(key=np.abs, ascending=False).rename("Spearman correlation").to_frame().round(3))
"""
        ),
        markdown("### 6. Operational Drivers"),
        code(
            """
relationship_features = [
    "days_in_current_stage",
    "pending_approvals",
    "number_of_objections",
    "number_of_court_cases",
]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
plot_sample = data.sample(min(4_000, len(data)), random_state=42)

for feature, ax in zip(relationship_features, axes.flat):
    sns.regplot(
        data=plot_sample,
        x=feature,
        y=TARGET,
        scatter_kws={"alpha": 0.18, "s": 14, "color": COLORS["blue"]},
        line_kws={"color": COLORS["orange"], "linewidth": 2},
        ci=None,
        ax=ax,
    )
    ax.set(
        title=f"Delay vs {feature.replace('_', ' ').title()}",
        xlabel=feature.replace("_", " ").title(),
        ylabel="Approximate delay (days)",
    )

plt.tight_layout()
plt.show()
"""
        ),
        markdown("### 7. Compensation and Case Scale"),
        code(
            """
fig, axes = plt.subplots(1, 3, figsize=(16, 4.8))
scale_features = ["compensation_completed_pct", "land_area_acres", "number_of_landowners"]

for feature, ax in zip(scale_features, axes):
    sns.regplot(
        data=plot_sample,
        x=feature,
        y=TARGET,
        scatter_kws={"alpha": 0.16, "s": 12, "color": COLORS["olive"]},
        line_kws={"color": COLORS["pink"], "linewidth": 2},
        ci=None,
        ax=ax,
    )
    ax.set(
        title=f"Delay vs {feature.replace('_', ' ').title()}",
        xlabel=feature.replace("_", " ").title(),
        ylabel="Approximate delay (days)",
    )

plt.tight_layout()
plt.show()
"""
        ),
        markdown("### 8. Delay by Acquisition Stage"),
        code(
            """
stage_order = (
    data.groupby("acquisition_stage", observed=True)[TARGET]
    .median()
    .sort_values(ascending=False)
    .index
)

fig, ax = plt.subplots(figsize=(11, 5.5))
sns.boxplot(
    data=data,
    x="acquisition_stage",
    y=TARGET,
    order=stage_order,
    color=COLORS["blue"],
    showfliers=False,
    ax=ax,
)
ax.set(title="Delay Distribution by Acquisition Stage", xlabel="Acquisition stage", ylabel="Approximate delay (days)")
plt.xticks(rotation=25, ha="right")
plt.tight_layout()
plt.show()

stage_summary = data.groupby("acquisition_stage", observed=True)[TARGET].agg(Cases="size", Mean="mean", Median="median")
display(stage_summary.sort_values("Mean", ascending=False).round(1))
"""
        ),
        markdown("### 9. Delay by Dispute and Payment Status"),
        code(
            """
fig, axes = plt.subplots(1, 2, figsize=(14, 5.2))

for column, ax, color in [
    ("dispute_severity", axes[0], COLORS["orange"]),
    ("payment_status", axes[1], COLORS["olive"]),
]:
    order = data.groupby(column, observed=True)[TARGET].mean().sort_values(ascending=False).index
    summary = data.groupby(column, observed=True)[TARGET].agg(["count", "mean", "median"]).loc[order]
    ax.barh(summary.index, summary["mean"], color=color)
    ax.invert_yaxis()
    ax.set(title=f"Mean Delay by {column.replace('_', ' ').title()}", xlabel="Mean delay (days)", ylabel="")
    ax.set_xlim(0, max(100, summary["mean"].max() * 1.15))
    for index, value in enumerate(summary["mean"]):
        ax.text(value + 1, index, f"{value:.1f}", va="center")

plt.tight_layout()
plt.show()
"""
        ),
        markdown("### 10. Numerical Correlation Matrix"),
        code(
            """
core_numeric = [
    "land_area_acres",
    "number_of_landowners",
    "number_of_objections",
    "number_of_court_cases",
    "compensation_completed_pct",
    "pending_approvals",
    "days_in_current_stage",
    TARGET,
]

correlation_matrix = data[core_numeric].corr(method="spearman")
fig, ax = plt.subplots(figsize=(11, 8))
sns.heatmap(
    correlation_matrix,
    annot=True,
    fmt=".2f",
    cmap=sns.diverging_palette(25, 240, as_cmap=True),
    center=0,
    vmin=-1,
    vmax=1,
    square=True,
    linewidths=0.5,
    cbar_kws={"label": "Spearman correlation"},
    ax=ax,
)
ax.set_title("Correlation Matrix for Core Numerical Features")
plt.xticks(rotation=45, ha="right")
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()
"""
        ),
        markdown("### 11. Data-Driven Feature Screening"),
        code(
            """
numeric_screen = target_correlations.abs().rename("association_score").to_frame()
numeric_screen["feature_type"] = "numeric"

categorical_columns = [
    column for column in data.select_dtypes(include="object").columns
    if column != "case_id"
]

categorical_rows = []
for column in categorical_columns:
    grouped = data.groupby(column, observed=True)[TARGET]
    means = grouped.mean()
    categorical_rows.append({
        "feature": column,
        "feature_type": "categorical",
        "association_score": (means.max() - means.min()) / data[TARGET].std(),
        "group_mean_range_days": means.max() - means.min(),
    })

categorical_screen = pd.DataFrame(categorical_rows).set_index("feature")
feature_screen = pd.concat([numeric_screen, categorical_screen], axis=0).sort_values(
    "association_score", ascending=False
)
display(feature_screen.round(3))
"""
        ),
        markdown(
            """
## Takeaways

### Recommended initial feature set

Keep the operational and scale features with clear signal, including:

- `days_in_current_stage`
- `land_area_acres`
- `number_of_landowners`
- `pending_approvals`
- `number_of_objections`
- `number_of_court_cases`
- `compensation_completed_pct`
- `acquisition_stage`
- `project_type`
- `state` and `district`, with careful validation for geographic memorization

Retain the remaining contextual features initially for nonlinear models, then assess them
using cross-validation and permutation importance. Weak univariate association does not
prove that a feature has no interaction value.

### Exclude from the first model

- `case_id`: identifier with no transferable predictive meaning
- Raw date columns: unreliable chronology in this synthetic version
- `approximate_delay_days`: target, never an input feature

### Next modeling step

Train a median baseline, linear regression, and Random Forest using the same held-out split.
Compare MAE, RMSE, R-squared, and median absolute error. Inspect train-versus-test performance
and subgroup errors before selecting the model for SHAP explanations.

### Caveat

The target-generation process must be documented. If the synthetic target was calculated
from these same predictors, strong model performance represents recovery of that formula,
not proven performance on real land-acquisition cases.
"""
        ),
    ]

    output_path.parent.mkdir(parents=True, exist_ok=True)
    nbf.write(notebook, output_path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    build_notebook(args.output)
    print(f"Created {args.output}")


if __name__ == "__main__":
    main()
