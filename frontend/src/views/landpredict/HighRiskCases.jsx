import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
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

const HighRiskCases = () => {
  const navigate = useNavigate()

  // Get all cases from Redux
  const cases = useSelector((state) => state.cases)

  // Get only High Risk cases
  const highRiskCases = cases
    .map((item, index) => ({
      ...item,
      originalIndex: index,
    }))
    .filter((item) => item.risk === 'High')

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>🔴 High Risk Cases</strong>
              <div className="small text-body-secondary mt-1">
                Cases that require immediate attention
              </div>
            </div>

            <span className="badge bg-danger fs-6">{highRiskCases.length} Cases</span>
          </CCardHeader>

          <CCardBody>
            {highRiskCases.length === 0 ? (
              <div className="text-center py-5">
                <h5>🎉 No High Risk Cases Found</h5>

                <p className="text-body-secondary">
                  Currently, there are no land acquisition cases with high delay risk.
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
                    <CTableHeaderCell>Risk Score</CTableHeaderCell>
                    <CTableHeaderCell>Expected Delay</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {highRiskCases.map((item) => (
                    <CTableRow key={`${item.caseId}-${item.originalIndex}`}>
                      <CTableDataCell>
                        <strong>{item.caseId}</strong>
                      </CTableDataCell>

                      <CTableDataCell>{item.state}</CTableDataCell>

                      <CTableDataCell>{item.district}</CTableDataCell>

                      <CTableDataCell>{item.projectType}</CTableDataCell>

                      <CTableDataCell style={{ minWidth: '120px' }}>
                        <CProgress color="danger" value={item.score} />

                        <small className="text-danger fw-semibold">{item.score}%</small>
                      </CTableDataCell>

                      <CTableDataCell>{item.delay}</CTableDataCell>

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
