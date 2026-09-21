import React from 'react'

import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const featureImportance = [
  { feature: 'Days in current stage', value: 16.49 },
  { feature: 'Acquisition stage', value: 11.78 },
  { feature: 'Pending approvals', value: 7.22 },
  { feature: 'Number of objections', value: 4.90 },
  { feature: 'Land area (acres)', value: 4.84 },
  { feature: 'Project type', value: 3.58 },
  { feature: 'District', value: 3.52 },
  { feature: 'State', value: 2.33 },
  { feature: 'Number of court cases', value: 2.33 },
  { feature: 'Number of landowners', value: 1.54 },
]

const ModelInsights = () => {
  const maxImportance = featureImportance[0].value

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2 className="fw-bold">Model Insights</h2>
          <p className="text-body-secondary">
            Performance and explainability of the LANDPREDICT delay prediction model
          </p>
        </CCol>
      </CRow>

      <CAlert color="warning" className="mb-4">
        <strong>Prototype Data Notice:</strong>{' '}
        These results are based on synthetic data and demonstrate prototype
        model performance. They do not establish performance on real
        government land acquisition cases.
      </CAlert>

      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CCard className="h-100 shadow-sm">
            <CCardBody>
              <div className="text-body-secondary">BEST MODEL</div>
              <div className="fs-4 fw-bold">Linear Regression</div>
              <small className="text-body-secondary">
                Selected using test-set performance
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="h-100 shadow-sm">
            <CCardBody>
              <div className="text-body-secondary">TEST MAE</div>
              <div className="fs-2 fw-bold">9.78 days</div>
              <small className="text-body-secondary">
                Mean absolute error
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="h-100 shadow-sm">
            <CCardBody>
              <div className="text-body-secondary">TEST RMSE</div>
              <div className="fs-2 fw-bold">12.34 days</div>
              <small className="text-body-secondary">
                Root mean squared error
              </small>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="h-100 shadow-sm">
            <CCardBody>
              <div className="text-body-secondary">TEST R²</div>
              <div className="fs-2 fw-bold">0.860</div>
              <small className="text-body-secondary">
                Coefficient of determination
              </small>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol lg={7}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <strong>🧠 Top Prediction Factors</strong>
            </CCardHeader>

            <CCardBody>
              {featureImportance.map((item) => (
                <div className="mb-3" key={item.feature}>
                  <div className="d-flex justify-content-between mb-1">
                    <span>{item.feature}</span>
                    <strong>{item.value.toFixed(2)}</strong>
                  </div>

                  <CProgress
                    value={(item.value / maxImportance) * 100}
                    color="primary"
                  />
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={5}>
          <CCard className="h-100 shadow-sm">
            <CCardHeader>
              <strong>📊 Model Evaluation</strong>
            </CCardHeader>

            <CCardBody>
              <p>
                The model was evaluated using a separate test dataset of{' '}
                <strong>3,000 records</strong>.
              </p>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span>Training records</span>
                <strong>11,997</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Testing records</span>
                <strong>3,000</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Input features</span>
                <strong>22</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Median absolute error</span>
                <strong>8.31 days</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span>MAPE</span>
                <strong>15.51%</strong>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader>
              <strong>🔍 SHAP Explainability</strong>
            </CCardHeader>

            <CCardBody>
              <p>
                SHAP analysis explains how individual features contribute to
                the predicted delay relative to the model's baseline
                prediction.
              </p>

              <CTable responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Feature</CTableHeaderCell>
                    <CTableHeaderCell>
                      Mean Absolute SHAP Contribution
                    </CTableHeaderCell>
                    <CTableHeaderCell>Interpretation</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {featureImportance.slice(0, 5).map((item) => (
                    <CTableRow key={item.feature}>
                      <CTableDataCell>
                        <strong>{item.feature}</strong>
                      </CTableDataCell>

                      <CTableDataCell>
                        {item.value.toFixed(2)} days
                      </CTableDataCell>

                      <CTableDataCell>
                        Higher absolute contribution means the feature has
                        greater influence on model predictions.
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader>
              <strong>💡 Example Explanation</strong>
            </CCardHeader>

            <CCardBody>
              <p>
                Example case <strong>AH101254</strong> had an actual delay of{' '}
                <strong>86 days</strong> and a predicted delay of{' '}
                <strong>84.99 days</strong>.
              </p>

              <p>
                The strongest positive contribution in this example came from{' '}
                <strong>pending approvals</strong>, while{' '}
                <strong>days in the current stage</strong> contributed
                negatively relative to the baseline.
              </p>

              <p className="mb-0 text-body-secondary">
                Positive SHAP values increase predicted delay relative to the
                baseline; negative SHAP values decrease it.
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ModelInsights