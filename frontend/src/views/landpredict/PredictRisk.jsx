import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

const PredictRisk = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const calculatePrediction = (e) => {
    e.preventDefault()

    let score = 0
    const factors = []

    // Temporary frontend prediction logic
    // Later this will be replaced with ML Model API

    if (Number(formData.courtCases) >= 5) {
      score += 30
      factors.push('High number of court cases')
    }

    if (Number(formData.objections) >= 10) {
      score += 20
      factors.push('Large number of landowner objections')
    }

    if (Number(formData.compensation) < 50) {
      score += 20
      factors.push('Low compensation completion')
    }

    if (Number(formData.pendingApprovals) >= 3) {
      score += 15
      factors.push('Multiple pending approvals')
    }

    if (Number(formData.daysInCurrentStage) >= 180) {
      score += 15
      factors.push('Long duration in current acquisition stage')
    }

    let risk = 'Low'
    let delay = '0-3 Months'

    if (score >= 60) {
      risk = 'High'
      delay = '6-12 Months'
    } else if (score >= 30) {
      risk = 'Medium'
      delay = '3-6 Months'
    }

    setPrediction({
      risk: risk,
      score: score,
      delay: delay,
      factors: factors,
    })
  }

  const getRiskColor = (risk) => {
    if (risk === 'High') return 'danger'

    if (risk === 'Medium') return 'warning'

    return 'success'
  }

  return (
    <CRow>
      <CCol xs={12}>
        {/* Prediction Form */}
        <CCard className="mb-4 shadow-sm">
          <CCardHeader>
            <strong>Predict Land Acquisition Risk</strong>
          </CCardHeader>

          <CCardBody>
            <p className="text-body-secondary">
              Enter the land acquisition details to predict the possible delay risk.
            </p>

            <CForm onSubmit={calculatePrediction}>
              {/* Basic Information */}
              <h5 className="mb-3">Basic Information</h5>

              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>State</CFormLabel>

                  <CFormInput
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>District</CFormLabel>

                  <CFormInput
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter district"
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Project Type</CFormLabel>

                  <CFormInput
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    placeholder="Highway, Metro, Railway..."
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Land Area (Acres)</CFormLabel>

                  <CFormInput
                    type="number"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Number of Landowners</CFormLabel>

                  <CFormInput
                    type="number"
                    name="landowners"
                    value={formData.landowners}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Acquisition Stage</CFormLabel>

                  <CFormSelect
                    name="acquisitionStage"
                    value={formData.acquisitionStage}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select stage</option>
                    <option value="Notification">Notification</option>
                    <option value="Survey">Survey</option>
                    <option value="Compensation">Compensation</option>
                    <option value="Possession">Possession</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <hr />

              {/* Risk Factors */}
              <h5 className="mb-3">Risk Analysis Factors</h5>

              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Number of Objections</CFormLabel>

                  <CFormInput
                    type="number"
                    name="objections"
                    value={formData.objections}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Number of Court Cases</CFormLabel>

                  <CFormInput
                    type="number"
                    name="courtCases"
                    value={formData.courtCases}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Compensation Completed (%)</CFormLabel>

                  <CFormInput
                    type="number"
                    name="compensation"
                    value={formData.compensation}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Pending Approvals</CFormLabel>

                  <CFormInput
                    type="number"
                    name="pendingApprovals"
                    value={formData.pendingApprovals}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                <CCol md={4} className="mb-3">
                  <CFormLabel>Days in Current Stage</CFormLabel>

                  <CFormInput
                    type="number"
                    name="daysInCurrentStage"
                    value={formData.daysInCurrentStage}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>

              <CButton color="primary" type="submit">
                Predict Risk
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Prediction Result */}
        {prediction && (
          <CCard className="shadow-sm">
            <CCardHeader>
              <strong>Prediction Result</strong>
            </CCardHeader>

            <CCardBody>
              <CRow>
                {/* Predicted Risk */}
                <CCol md={4} className="mb-3">
                  <CCard className="h-100">
                    <CCardBody className="text-center">
                      <small className="text-body-secondary">PREDICTED RISK</small>

                      <h2 className={`mt-2 text-${getRiskColor(prediction.risk)}`}>
                        {prediction.risk}
                      </h2>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Risk Score */}
                <CCol md={4} className="mb-3">
                  <CCard className="h-100">
                    <CCardBody className="text-center">
                      <small className="text-body-secondary">RISK SCORE</small>

                      <h2 className="mt-2">{prediction.score}%</h2>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Expected Delay */}
                <CCol md={4} className="mb-3">
                  <CCard className="h-100">
                    <CCardBody className="text-center">
                      <small className="text-body-secondary">EXPECTED DELAY</small>

                      <h5 className="mt-2">{prediction.delay}</h5>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              {/* Major Risk Factors */}
              <h5 className="mt-3">Major Risk Factors</h5>

              {prediction.factors.length > 0 ? (
                <ul>
                  {prediction.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-success">No major risk factors detected.</p>
              )}

              <CButton color="secondary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </CButton>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default PredictRisk
