import React, { useEffect, useState } from 'react'
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

const API_URL = 'http://127.0.0.1:8000'

const EditCase = () => {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
    sanctionAmount: '',
    landAcquisitionAgency: '',
    environmentalClearance: '',
    forestClearance: '',
    relocationRequired: '',
    structuresAffected: '',
    disputeSeverity: '',
    paymentStatus: '',
    documentVerificationStatus: '',
    projectLength: '',
    lastReviewDaysAgo: '',
  })

  // Load case from database
  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/api/cases/${encodeURIComponent(caseId)}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to load case. Status: ${response.status}`)
        }

        const data = await response.json()

        setFormData({
          caseId: data.case_id || '',
          state: data.state || '',
          district: data.district || '',
          projectType: data.project_type || '',
          landArea: data.land_area_acres ?? '',
          landowners: data.number_of_landowners ?? '',
          acquisitionStage: data.acquisition_stage || '',
          objections: data.number_of_objections ?? '',
          courtCases: data.number_of_court_cases ?? '',
          compensation: data.compensation_completed_pct ?? '',
          pendingApprovals: data.pending_approvals ?? '',
          daysInCurrentStage: data.days_in_current_stage ?? '',
          sanctionAmount: data.sanction_amount_lakh ?? '',
          landAcquisitionAgency: data.land_acquisition_agency || '',
          environmentalClearance: data.environmental_clearance || '',
          forestClearance: data.forest_clearance || '',
          relocationRequired: data.relocation_required || '',
          structuresAffected: data.structures_affected ?? '',
          disputeSeverity: data.dispute_severity || '',
          paymentStatus: data.payment_status || '',
          documentVerificationStatus:
            data.document_verification_status || '',
          projectLength: data.project_length_km ?? '',
          lastReviewDaysAgo: data.last_review_days_ago ?? '',
        })
      } catch (err) {
        console.error(err)
        setError('Unable to load the case from the database.')
      } finally {
        setLoading(false)
      }
    }

    if (caseId) {
      fetchCase()
    }
  }, [caseId])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSaving(true)
    setError('')

    try {
      // Data for ML prediction
      const predictionPayload = {
        state: formData.state,
        district: formData.district,
        project_type: formData.projectType,
        land_area_acres: Number(formData.landArea),
        number_of_landowners: Number(formData.landowners),
        acquisition_stage: formData.acquisitionStage,
        number_of_objections: Number(formData.objections),
        number_of_court_cases: Number(formData.courtCases),
        compensation_completed_pct: Number(formData.compensation),
        pending_approvals: Number(formData.pendingApprovals),
        days_in_current_stage: Number(formData.daysInCurrentStage),
        sanction_amount_lakh: Number(formData.sanctionAmount),
        land_acquisition_agency: formData.landAcquisitionAgency,
        environmental_clearance: formData.environmentalClearance,
        forest_clearance: formData.forestClearance,
        relocation_required: formData.relocationRequired,
        structures_affected: Number(formData.structuresAffected),
        dispute_severity: formData.disputeSeverity,
        payment_status: formData.paymentStatus,
        document_verification_status:
          formData.documentVerificationStatus,
        project_length_km: Number(formData.projectLength),
        last_review_days_ago: Number(formData.lastReviewDaysAgo),
      }

      // Step 1: Generate new prediction
      const predictionResponse = await fetch(
        `${API_URL}/api/predict`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(predictionPayload),
        },
      )

      if (!predictionResponse.ok) {
        throw new Error('Prediction request failed.')
      }

      const prediction = await predictionResponse.json()

      // Step 2: Update database
      const updatePayload = {
        ...predictionPayload,
        predicted_delay_days: prediction.predicted_delay_days,
      }

      const updateResponse = await fetch(
        `${API_URL}/api/cases/${encodeURIComponent(caseId)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload),
        },
      )

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => null)

        throw new Error(
          errorData?.detail ||
            `Case update failed. Status: ${updateResponse.status}`,
        )
      }

      alert(
        `Case ${caseId} updated successfully!\nNew predicted delay: ${prediction.predicted_delay_days} days`,
      )

      navigate('/all-cases')
    } catch (err) {
      console.error(err)
      setError(
        err.message ||
          'Unable to update the case. Make sure the backend is running.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <CCard>
        <CCardBody>
          <h4>Loading case...</h4>
        </CCardBody>
      </CCard>
    )
  }

  if (error && !formData.caseId) {
    return (
      <CCard>
        <CCardBody>
          <h4>Case not found.</h4>

          <p className="text-danger">{error}</p>

          <CButton
            color="primary"
            onClick={() => navigate('/all-cases')}
          >
            Back to All Cases
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
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <CForm onSubmit={handleSubmit}>
              <CRow>
                {/* Case ID */}
                <CCol md={6}>
                  <CFormLabel>Case ID</CFormLabel>
                  <CFormInput
                    name="caseId"
                    value={formData.caseId}
                    disabled
                  />
                </CCol>

                {/* State */}
                <CCol md={6}>
                  <CFormLabel>State</CFormLabel>
                  <CFormInput
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* District */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>District</CFormLabel>
                  <CFormInput
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Project Type */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Project Type</CFormLabel>
                  <CFormInput
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Land Area */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Land Area (Acres)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Landowners */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Landowners</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="landowners"
                    value={formData.landowners}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Acquisition Stage */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Acquisition Stage</CFormLabel>
                  <CFormInput
                    name="acquisitionStage"
                    value={formData.acquisitionStage}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Objections */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Objections</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="objections"
                    value={formData.objections}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Court Cases */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Number of Court Cases</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="courtCases"
                    value={formData.courtCases}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Compensation */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Compensation Completed (%)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    max="100"
                    name="compensation"
                    value={formData.compensation}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Pending Approvals */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Pending Approvals</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="pendingApprovals"
                    value={formData.pendingApprovals}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Days in Current Stage */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Days in Current Stage</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="daysInCurrentStage"
                    value={formData.daysInCurrentStage}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Sanction Amount */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Sanction Amount (Lakh)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="sanctionAmount"
                    value={formData.sanctionAmount}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Agency */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Land Acquisition Agency</CFormLabel>
                  <CFormSelect
                    name="landAcquisitionAgency"
                    value={formData.landAcquisitionAgency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Agency</option>
                    <option value="NHAI">NHAI</option>
                    <option value="State PWD">State PWD</option>
                    <option value="District Administration">
                      District Administration
                    </option>
                    <option value="Special LA Unit">
                      Special LA Unit
                    </option>
                  </CFormSelect>
                </CCol>

                {/* Environmental Clearance */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Environmental Clearance</CFormLabel>
                  <CFormSelect
                    name="environmentalClearance"
                    value={formData.environmentalClearance}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Required">Not Required</option>
                  </CFormSelect>
                </CCol>

                {/* Forest Clearance */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Forest Clearance</CFormLabel>
                  <CFormSelect
                    name="forestClearance"
                    value={formData.forestClearance}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Required">Not Required</option>
                  </CFormSelect>
                </CCol>

                {/* Relocation */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Relocation Required</CFormLabel>
                  <CFormSelect
                    name="relocationRequired"
                    value={formData.relocationRequired}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </CFormSelect>
                </CCol>

                {/* Structures */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Structures Affected</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="structuresAffected"
                    value={formData.structuresAffected}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Dispute Severity */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Dispute Severity</CFormLabel>
                  <CFormSelect
                    name="disputeSeverity"
                    value={formData.disputeSeverity}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Severity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </CFormSelect>
                </CCol>

                {/* Payment Status */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Payment Status</CFormLabel>
                  <CFormSelect
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                  </CFormSelect>
                </CCol>

                {/* Document Verification */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Document Verification Status</CFormLabel>
                  <CFormSelect
                    name="documentVerificationStatus"
                    value={formData.documentVerificationStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                  </CFormSelect>
                </CCol>

                {/* Project Length */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Project Length (KM)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="projectLength"
                    value={formData.projectLength}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Last Review */}
                <CCol md={6} className="mt-3">
                  <CFormLabel>Last Review (Days Ago)</CFormLabel>
                  <CFormInput
                    type="number"
                    min="0"
                    name="lastReviewDaysAgo"
                    value={formData.lastReviewDaysAgo}
                    onChange={handleChange}
                    required
                  />
                </CCol>

                {/* Buttons */}
                <CCol xs={12} className="mt-4">
                  <CButton
                    color="primary"
                    type="submit"
                    className="me-2"
                    disabled={saving}
                  >
                    {saving
                      ? '⏳ Updating...'
                      : '💾 Update Case & Prediction'}
                  </CButton>

                  <CButton
                    color="secondary"
                    type="button"
                    onClick={() => navigate('/all-cases')}
                  >
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