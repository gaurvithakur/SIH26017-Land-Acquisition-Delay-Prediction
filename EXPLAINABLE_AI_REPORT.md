# Explainable AI Report

## Purpose

SHAP was applied to the selected Linear Regression pipeline to explain both the
model's overall behavior and individual delay predictions. The analysis uses
1,000 held-out test records and a reproducible 500-record background sample.

Positive SHAP values increase predicted delay relative to the model's baseline.
Negative SHAP values reduce predicted delay.

## Global explanation

The most influential source features ranked by mean absolute SHAP contribution
are:

| Rank | Feature | Mean absolute contribution |
|---:|---|---:|
| 1 | Days in current stage | 16.49 days |
| 2 | Acquisition stage | 11.78 days |
| 3 | Pending approvals | 7.22 days |
| 4 | Number of objections | 4.90 days |
| 5 | Land area | 4.84 days |
| 6 | Project type | 3.58 days |
| 7 | District | 3.52 days |
| 8 | State | 2.33 days |
| 9 | Number of court cases | 2.33 days |
| 10 | Number of landowners | 1.54 days |

Mean absolute contribution measures average influence size, not direction or
causality. The SHAP beeswarm plot shows whether observed feature values push
individual predictions higher or lower.

## Individual example

- Case ID: `AH101254`
- Actual delay: 86 days
- Predicted delay: 84.99 days
- Model baseline: 89.15 days

Main contributions:

| Feature | Case value | Contribution |
|---|---:|---:|
| Days in current stage | 38 | -15.75 days |
| Pending approvals | 3 | +11.24 days |
| Number of objections | 1 | +2.80 days |
| Land area | 13.48 acres | -1.46 days |
| Acquisition stage | Compensation | +1.28 days |
| Number of landowners | 4 | -1.04 days |
| Number of court cases | 0 | -0.78 days |
| State | Uttarakhand | -0.69 days |

The contributions start from the 89.15-day baseline and collectively produce
the 84.99-day prediction. Small remaining contributions from other fields are
included in the complete CSV and waterfall plot.

## Validation

The maximum difference between the model prediction and the SHAP baseline plus
all feature contributions was approximately `5.68e-14` days. This is effectively
zero and confirms that the explanations reconstruct the predictions correctly.

## Limitations

- SHAP explains what this trained model learned; it does not prove causality.
- Correlated features can share or redistribute apparent importance.
- One-hot encoded categories were aggregated back to their original source
  columns for stakeholder-friendly tables.
- These explanations are based on synthetic prototype data and must not be
  presented as verified government evidence.
