# Model Evaluation Report

## Objective

Predict `approximate_delay_days` as a continuous regression target using the
cleaned synthetic SIH26017 prototype dataset.

## Experimental setup

- Records: 14,997
- Training records: 11,997
- Testing records: 3,000
- Raw model inputs: 22
- Split: reproducible 80/20 random split (`random_state=42`)
- Missing-value imputation and one-hot encoding were fitted on training data only
- Excluded inputs: `case_id` and three raw date columns

## Results

| Model | Test MAE | Test RMSE | Test R-squared | Median AE |
|---|---:|---:|---:|---:|
| Linear Regression | 9.78 days | 12.34 days | 0.860 | 8.31 days |
| Random Forest | 10.89 days | 13.94 days | 0.821 | 8.93 days |
| Median Baseline | 25.29 days | 32.97 days | -0.002 | 20.00 days |

Linear Regression is the current selected model because it achieved the lowest
test error and highest test R-squared. Its training R-squared (0.860) closely
matches its test R-squared (0.860), indicating stable generalization within this
synthetic dataset.

Random Forest performed well but showed more overfitting: training R-squared was
0.959 compared with test R-squared of 0.821. It remains saved for comparison and
future SHAP analysis.

## Interpretation

The selected model explains approximately 86% of target variance in the held-out
synthetic test set, and its predictions differ from the synthetic target by about
9.78 days on average. This exceeds the requested 0.60-0.70 R-squared prototype
threshold.

R-squared is not classification accuracy. The project should report R-squared,
MAE, RMSE, and median absolute error rather than calling the result 86% accuracy.

## Limitation

These results demonstrate performance only on synthetic prototype data. They do
not establish performance on real government land-acquisition cases. The target
generation process must be documented and checked for formula leakage before the
results are presented as evidence of predictive usefulness.
