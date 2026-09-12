import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

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

const EditCase = () => {
  const { index } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cases = useSelector((state) => state.cases)

  // Get selected case
  const selectedCase = cases[Number(index)]

  const [formData, setFormData] = useState({
    caseId: selectedCase?.caseId || '',
    state: selectedCase?.state || '',
    district: selectedCase?.district || '',
    projectType: selectedCase?.projectType || '',
    landArea: selectedCase?.landArea || '',
    landowners: selectedCase?.landowners || '',
    acquisitionStage: selectedCase?.acquisitionStage || '',
    objections: selectedCase?.objections || '',
    courtCases: selectedCase?.courtCases || '',
    compensation: selectedCase?.compensation || '',
    pendingApprovals: selectedCase?.pendingApprovals || '',
    daysInCurrentStage: selectedCase?.daysInCurrentStage || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Recalculate prediction
  const calculatePrediction = () => {
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

    return {
      risk,
      score: riskScore,
      delay,
      factors,
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const prediction = calculatePrediction()

    const updatedCase = {
      ...formData,
      ...prediction,
    }

    dispatch({
      type: 'UPDATE_CASE',
      payload: {
        index: Number(index),
        updatedCase,
      },
    })

    alert('Case updated successfully!')

    navigate('/')
  }

  // If invalid case index
  if (!selectedCase) {
    return (
      <CCard>
        <CCardBody>
          <h4>Case not found.</h4>

          <CButton color="primary" onClick={() => navigate('/')}>
            Back to Dashboard
          </CButton>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>✏️ Edit Land Acquisition Case</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6}>
                  <CFormLabel>Case ID</CFormLabel>
                  <CFormInput name="caseId" value={formData.caseId} onChange={handleChange} />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>State</CFormLabel>
                  <CFormInput name="state" value={formData.state} onChange={handleChange} />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>District</CFormLabel>
                  <CFormInput name="district" value={formData.district} onChange={handleChange} />
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
                    <option value="Metro">Metro</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Land Area (Acres)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Landowners</CFormLabel>
                  <CFormInput
                    type="number"
                    name="landowners"
                    value={formData.landowners}
                    onChange={handleChange}
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
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Court Cases</CFormLabel>
                  <CFormInput
                    type="number"
                    name="courtCases"
                    value={formData.courtCases}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Compensation Completed (%)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="compensation"
                    value={formData.compensation}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Pending Approvals</CFormLabel>
                  <CFormInput
                    type="number"
                    name="pendingApprovals"
                    value={formData.pendingApprovals}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol md={6} className="mt-3">
                  <CFormLabel>Days in Current Stage</CFormLabel>
                  <CFormInput
                    type="number"
                    name="daysInCurrentStage"
                    value={formData.daysInCurrentStage}
                    onChange={handleChange}
                  />
                </CCol>

                <CCol xs={12} className="mt-4">
                  <CButton color="primary" type="submit" className="me-2">
                    💾 Update Case & Prediction
                  </CButton>

                  <CButton color="secondary" onClick={() => navigate('/')}>
                    Cancel
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditCase
