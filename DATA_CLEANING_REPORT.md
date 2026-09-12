# Data Cleaning and Preprocessing Report

## Dataset summary

- Source: synthetic/prototype land-acquisition dataset
- Raw shape: 15,050 rows and 27 columns
- Intended grain: one row per `case_id`
- Target: `approximate_delay_days` (regression)
- Clean shape: 14,997 rows and 27 columns
- Modeling shape: 14,997 rows and 23 columns

## Cleaning results

| Check | Result |
|---|---:|
| Exact duplicate rows removed | 50 |
| Invalid target rows removed | 3 |
| Remaining duplicate case IDs | 0 |
| Invalid date strings | 0 |
| Missing cells before cleaning | 2,481 |
| Missing cells after validation, before imputation | 2,500 |

The increase in missing cells is expected: clearly impossible feature values
were replaced with missing values so that the train-fitted preprocessing
pipeline can impute them without treating sentinels as real measurements.

## Invalid feature values handled

| Feature | Values set to missing |
|---|---:|
| `land_area_acres` | 2 |
| `number_of_landowners` | 2 |
| `number_of_objections` | 4 |
| `number_of_court_cases` | 4 |
| `compensation_completed_pct` | 2 |
| `pending_approvals` | 4 |
| `days_in_current_stage` | 4 |
| `structures_affected` | 2 |
| `project_length_km` | 2 |

These counts include deliberately injected extreme values and negative values.
Ordinary IQR outliers were retained because difficult land-acquisition cases can
legitimately sit in the distribution tail.

## Standardization

- Column names were converted to `snake_case`.
- Whitespace and casing inconsistencies were normalized.
- Punjab variants were standardized to `Punjab`.
- Compensation stage variants were standardized to `Compensation`.
- Invalid/unknown stage labels were consolidated as `Unknown`.
- Agency abbreviations such as `NHAI` and `State PWD` were preserved.
- Date strings were parsed as `DD-MM-YYYY` and exported as ISO `YYYY-MM-DD`.

## Preprocessing

- Split: 80% training (11,997 rows), 20% testing (3,000 rows)
- Random state: 42
- Numeric missing values: training-set median
- Categorical missing values: training-set mode
- Numeric features: standardized
- Categorical features: one-hot encoded with unknown-category support
- Final transformed feature count: 91
- All values in both transformed matrices are finite

The preprocessing object was fitted only on the training data and then applied
to the test data, preventing test-set leakage.

## Excluded fields

`case_id` is excluded because it is an identifier. The three raw date columns
are excluded from the default model table because their chronology is not
reliable in this synthetic dataset:

- 5,793 records have `notification_3d_date` before `notification_3a_date`.
- 7,400 records have `sanction_date` before `notification_3a_date`.

These contradictions should be corrected at synthetic-data generation time
before deriving elapsed-time features from the dates.

## Important modeling caveat

The cleaned data is suitable for prototype model development, but results must
be described as synthetic-data results. Before training, the team should also
document how `approximate_delay_days` was generated and verify that no feature
directly encodes the target formula.
