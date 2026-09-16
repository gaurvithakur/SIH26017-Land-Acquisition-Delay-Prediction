import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const AllCases = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get all cases from Redux
  const cases = useSelector((state) => state.cases)

  // Search state
  const [search, setSearch] = useState('')

  // Filter cases
  const filteredCases = cases.filter((item) => {
    const searchText = search.toLowerCase()

    return (
      item.caseId?.toLowerCase().includes(searchText) ||
      item.state?.toLowerCase().includes(searchText) ||
      item.district?.toLowerCase().includes(searchText) ||
      item.projectType?.toLowerCase().includes(searchText)
    )
  })

  // Delete case
  const handleDelete = (index, caseId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete case ${caseId}?`)

    if (confirmDelete) {
      dispatch({
        type: 'DELETE_CASE',
        payload: index,
      })
    }
  }

  return (
    <>
      {/* Page Heading */}
      <CRow className="mb-4">
        <CCol>
          <h2 className="fw-bold">All Land Acquisition Cases</h2>

          <p className="text-body-secondary">
            View, search and manage all LANDPREDICT cases.
          </p>
        </CCol>
      </CRow>

      {/* Search */}
      <CCard className="mb-4 shadow-sm">
        <CCardBody>
          <CFormInput
            type="text"
            placeholder="🔍 Search by Case ID, State, District or Project Type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CCardBody>
      </CCard>

      {/* Cases Table */}
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>📋 Case Management</strong>

              <span className="text-body-secondary">
                Showing {filteredCases.length} of {cases.length} cases
              </span>
            </CCardHeader>

            <CCardBody>
              {cases.length === 0 ? (
                <div className="text-center py-5">
                  <h5>No cases added yet.</h5>

                  <p className="text-body-secondary">
                    Add your first land acquisition case to start managing predictions.
                  </p>

                  <CButton color="primary" onClick={() => navigate('/add-case')}>
                    ➕ Add New Case
                  </CButton>
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="text-center py-5">
                  <h5>No matching cases found.</h5>

                  <p className="text-body-secondary">
                    Try changing your search.
                  </p>

                  <CButton
                    color="secondary"
                    onClick={() => setSearch('')}
                  >
                    Clear Search
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
                      <CTableHeaderCell className="text-center">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {filteredCases.map((item) => {
                      // Find original index because filtered list index
                      // may be different from Redux array index
                      const originalIndex = cases.indexOf(item)

                      return (
                        <CTableRow key={`${item.caseId}-${originalIndex}`}>
                          <CTableDataCell>
                            <strong>{item.caseId}</strong>
                          </CTableDataCell>

                          <CTableDataCell>
                            {item.state}
                          </CTableDataCell>

                          <CTableDataCell>
                            {item.district}
                          </CTableDataCell>

                          <CTableDataCell>
                            {item.projectType}
                          </CTableDataCell>

                          <CTableDataCell>
                            {item.predictedDelayDays !== undefined &&
                            item.predictedDelayDays !== null
                              ? `${item.predictedDelayDays} days`
                              : 'Not predicted'}
                          </CTableDataCell>

                          {/* Action Buttons */}
                          <CTableDataCell className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              {/* View */}
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() =>
                                  navigate(`/view-case/${originalIndex}`)
                                }
                              >
                                👁️ View
                              </CButton>

                              {/* Edit */}
                              <CButton
                                color="primary"
                                size="sm"
                                onClick={() =>
                                  navigate(`/edit-case/${originalIndex}`)
                                }
                              >
                                ✏️ Edit
                              </CButton>

                              {/* Delete */}
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete(originalIndex, item.caseId)
                                }
                              >
                                🗑️
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AllCases

