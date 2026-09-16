import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const HighRiskCases = () => {
  const navigate = useNavigate()

  // Get all cases from Redux
  const cases = useSelector((state) => state.cases)

  // Show cases with predicted delay of 120 days or more.
  // This is a UI filter, not a model-generated risk score.
  const highDelayCases = cases
    .map((item, index) => ({
      ...item,
      originalIndex: index,
    }))
    .filter(
      (item) => item.predictedDelayDays !== undefined && Number(item.predictedDelayDays) >= 120,
    )
    .sort((a, b) => Number(b.predictedDelayDays) - Number(a.predictedDelayDays))

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>🔴 High Delay Cases</strong>
              <div className="small text-body-secondary mt-1">
                Cases with predicted delay of 120 days or more
              </div>
            </div>

            <span className="badge bg-danger fs-6">{highDelayCases.length} Cases</span>
          </CCardHeader>

          <CCardBody>
            {highDelayCases.length === 0 ? (
              <div className="text-center py-5">
                <h5>🎉 No High Delay Cases Found</h5>

                <p className="text-body-secondary">
                  No saved cases currently have a predicted delay of 120 days or more.
                </p>

                <CButton color="primary" onClick={() => navigate('/add-case')}>
                  ➕ Add New Case
                </CButton>
              </div>
            ) : (
              <CTable responsive hover align="middle">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Case ID</CTableHeaderCell>
                    <CTableHeaderCell>State</CTableHeaderCell>
                    <CTableHeaderCell>District</CTableHeaderCell>
                    <CTableHeaderCell>Project Type</CTableHeaderCell>
                    <CTableHeaderCell>Predicted Delay</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {highDelayCases.map((item) => (
                    <CTableRow key={`${item.caseId}-${item.originalIndex}`}>
                      <CTableDataCell>
                        <strong>{item.caseId}</strong>
                      </CTableDataCell>

                      <CTableDataCell>{item.state}</CTableDataCell>

                      <CTableDataCell>{item.district}</CTableDataCell>

                      <CTableDataCell>{item.projectType}</CTableDataCell>

                      <CTableDataCell>
                        <span className="badge bg-danger fs-6">{item.predictedDelayDays} days</span>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => navigate(`/view-case/${item.originalIndex}`)}
                          >
                            👁️ View
                          </CButton>

                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => navigate(`/edit-case/${item.originalIndex}`)}
                          >
                            ✏️ Edit
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HighRiskCases
