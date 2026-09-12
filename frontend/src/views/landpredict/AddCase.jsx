import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'

const AddCase = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    caseId: '',
    state: '',
    district: '',
    projectType: '',
    landArea: '',
    landowners: '',
    acquisitionStage: '',
    objections: '',
    courtCases: '',
    compensation: '',
    pendingApprovals: '',
    daysInCurrentStage: '',
  })

  const [prediction, setPrediction] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let riskScore = 0
    let factors = []

    const courtCases = Number(formData.courtCases)
    const objections = Number(formData.objections)
    const pendingApprovals = Number(formData.pendingApprovals)
    const compensation = Number(formData.compensation)
    const days = Number(formData.daysInCurrentStage)

    // Court Cases
    if (courtCases >= 5) {
      riskScore += 25
      factors.push('High number of court cases')
    } else if (courtCases >= 2) {
      riskScore += 15
      factors.push('Multiple court cases')
    }

    // Pending Approvals
    if (pendingApprovals >= 5) {
      riskScore += 20
      factors.push('High number of pending approvals')
    } else if (pendingApprovals >= 2) {
      riskScore += 10
      factors.push('Pending approvals may cause delays')
    }

    // Objections
    if (objections >= 10) {
      riskScore += 15
      factors.push('High number of objections')
    } else if (objections >= 3) {
      riskScore += 8
      factors.push('Multiple objections received')
    }

    // Compensation
    if (compensation < 50) {
      riskScore += 20
      factors.push('Low compensation completion')
    } else if (compensation < 80) {
      riskScore += 10
      factors.push('Compensation is partially completed')
    }

    // Days in Current Stage
    if (days >= 180) {
      riskScore += 20
      factors.push('Case has been in the current stage for a long time')
    } else if (days >= 90) {
      riskScore += 10
      factors.push('Long duration in current acquisition stage')
    }

    let risk = ''
    let delay = ''

    if (riskScore >= 50) {
      risk = 'High'
      delay = '120+ Days'
    } else if (riskScore >= 25) {
      risk = 'Medium'
      delay = '60–120 Days'
    } else {
      risk = 'Low'
      delay = 'Less than 60 Days'
    }

    if (factors.length === 0) {
      factors.push('No major delay risk factors detected')
    }

    dispatch({
      type: 'ADD_CASE',
      payload: {
        ...formData,
        risk,
        score: riskScore,
        delay,
      },
    })

    setPrediction({
      risk,
      score: `${riskScore}%`,
      delay,
      factors,
    })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add New Land Acquisition Case</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6}>
                  <CFormLabel>Case ID</CFormLabel>
                  <CFormInput
                    name="caseId"
                    value={formData.caseId}
                    onChange={handleChange}
                    placeholder="Enter Case ID"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>State</CFormLabel>
                  <CFormInput
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter State"
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>District</CFormLabel>
                  <CFormInput
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter District"
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Project Type</CFormLabel>
                  <CFormSelect
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                  >
                    <option value="">Select Project Type</option>
                    <option value="Highway">Highway</option>
                    <option value="Railway">Railway</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Land Area (Acres)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    placeholder="Enter Land Area"
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Landowners</CFormLabel>
                  <CFormInput
                    type="number"
                    name="landowners"
                    value={formData.landowners}
                    onChange={handleChange}
                    placeholder="Enter Number of Landowners"
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Acquisition Stage</CFormLabel>
                  <CFormSelect
                    name="acquisitionStage"
                    value={formData.acquisitionStage}
                    onChange={handleChange}
                  >
                    <option value="">Select Stage</option>
                    <option value="Notification">Notification</option>
                    <option value="Survey">Survey</option>
                    <option value="Compensation">Compensation</option>
                    <option value="Possession">Possession</option>
                    <option value="Completed">Completed</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Objections</CFormLabel>
                  <CFormInput
                    type="number"
                    name="objections"
                    value={formData.objections}
                    onChange={handleChange}
                    placeholder="Enter Number of Objections"
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Court Cases</CFormLabel>
                  <CFormInput
                    type="number"
                    name="courtCases"
                    value={formData.courtCases}
                    onChange={handleChange}
                    placeholder="Enter Number of Court Cases"
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Compensation Completed (%)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="compensation"
                    value={formData.compensation}
                    onChange={handleChange}
                    placeholder="Enter Percentage"
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Pending Approvals</CFormLabel>
                  <CFormInput
                    type="number"
                    name="pendingApprovals"
                    value={formData.pendingApprovals}
                    onChange={handleChange}
                    placeholder="Enter Pending Approvals"
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Days in Current Stage</CFormLabel>
                  <CFormInput
                    type="number"
                    name="daysInCurrentStage"
                    value={formData.daysInCurrentStage}
                    onChange={handleChange}
                    placeholder="Enter Number of Days"
                  />
                </CCol>

                <CCol xs={12} className="mt-4">
                  <CButton color="primary" size="lg" type="submit">
                    🤖 Predict Delay Risk
                  </CButton>
                </CCol>
              </CRow>
            </CForm>

            {prediction && (
              <CCard
                className="mt-4"
                style={{
                  borderLeft: `6px solid ${
                    prediction.risk === 'High'
                      ? '#dc3545'
                      : prediction.risk === 'Medium'
                        ? '#ffc107'
                        : '#198754'
                  }`,
                  backgroundColor:
                    prediction.risk === 'High'
                      ? '#fff5f5'
                      : prediction.risk === 'Medium'
                        ? '#fffdf0'
                        : '#f2fff7',
                }}
              >
                <CCardHeader>
                  <strong>🤖 LANDPREDICT Prediction Result</strong>
                </CCardHeader>

                <CCardBody>
                  {/* Prediction Summary Boxes */}
                  <CRow className="mt-3">
                    <CCol md={4} className="mb-3">
                      <div className="p-3 bg-white rounded shadow-sm text-center">
                        <small className="text-muted">DELAY RISK</small>

                        <h4
                          className={`mt-2 ${
                            prediction.risk === 'High'
                              ? 'text-danger'
                              : prediction.risk === 'Medium'
                                ? 'text-warning'
                                : 'text-success'
                          }`}
                        >
                          {prediction.risk.toUpperCase()}
                        </h4>
                      </div>
                    </CCol>

                    <CCol md={4} className="mb-3">
                      <div className="p-3 bg-white rounded shadow-sm text-center">
                        <small className="text-muted">RISK SCORE</small>

                        <h4 className="mt-2">{prediction.score}</h4>
                      </div>
                    </CCol>

                    <CCol md={4} className="mb-3">
                      <div className="p-3 bg-white rounded shadow-sm text-center">
                        <small className="text-muted">EXPECTED DELAY</small>

                        <h4 className="mt-2">{prediction.delay}</h4>
                      </div>
                    </CCol>
                  </CRow>

                  {/* Major Risk Factors */}
                  <hr />

                  <h5 className="mb-3">⚠️ Major Risk Factors</h5>

                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="bg-white rounded shadow-sm p-3 mb-2">
                      <strong className="me-2">•</strong>
                      {factor}
                    </div>
                  ))}
                </CCardBody>
              </CCard>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddCase
