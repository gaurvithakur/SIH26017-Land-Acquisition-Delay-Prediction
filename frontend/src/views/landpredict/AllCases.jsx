import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { apiFetch } from '../../api'

const AllCases = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // Load cases from PostgreSQL through authenticated FastAPI
  const fetchCases = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await apiFetch('/api/cases/')

      if (!response.ok) {
        throw new Error(`Failed to load cases. Status: ${response.status}`)
      }

      const data = await response.json()

      setCases(data)

      // Keep Redux updated too
      dispatch({
        type: 'SET_CASES',
        payload: data,
      })
    } catch (err) {
      console.error('Error loading cases:', err)

      // apiFetch already handles 401/session expiry
      if (err.message !== 'Not authenticated') {
        setError('Unable to load cases from the server.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  // Search/filter
  const filteredCases = cases.filter((item) => {
    const searchText = search.toLowerCase()

    return (
      item.case_id?.toLowerCase().includes(searchText) ||
      item.state?.toLowerCase().includes(searchText) ||
      item.district?.toLowerCase().includes(searchText) ||
      item.project_type?.toLowerCase().includes(searchText)
    )
  })

  // Delete case from database
  const handleDelete = async (caseId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete case ${caseId}?`,
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await apiFetch(
        `/api/cases/${encodeURIComponent(caseId)}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        throw new Error(`Delete failed. Status: ${response.status}`)
      }

      await fetchCases()
    } catch (err) {
      console.error('Error deleting case:', err)

      if (err.message !== 'Not authenticated') {
        alert('Unable to delete the case.')
      }
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

      {/* Error */}
      {error && <CAlert color="danger">{error}</CAlert>}

      {/* Cases */}
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
              {/* Loading */}
              {loading ? (
                <div className="text-center py-5">
                  <CSpinner />

                  <p className="mt-3 text-body-secondary">
                    Loading cases from database...
                  </p>
                </div>
              ) : cases.length === 0 ? (
                /* No cases */
                <div className="text-center py-5">
                  <h5>No cases added yet.</h5>

                  <p className="text-body-secondary">
                    Add your first land acquisition case to start managing
                    predictions.
                  </p>

                  <CButton
                    color="primary"
                    onClick={() => navigate('/add-case')}
                  >
                    ➕ Add New Case
                  </CButton>
                </div>
              ) : filteredCases.length === 0 ? (
                /* No search results */
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
                /* Table */
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
                    {filteredCases.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell>
                          <strong>{item.case_id}</strong>
                        </CTableDataCell>

                        <CTableDataCell>{item.state}</CTableDataCell>

                        <CTableDataCell>{item.district}</CTableDataCell>

                        <CTableDataCell>{item.project_type}</CTableDataCell>

                        <CTableDataCell>
                          {item.predicted_delay_days !== undefined &&
                          item.predicted_delay_days !== null
                            ? `${item.predicted_delay_days} days`
                            : 'Not predicted'}
                        </CTableDataCell>

                        <CTableDataCell className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            {/* View */}
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/view-case/${encodeURIComponent(
                                    item.case_id,
                                  )}`,
                                )
                              }
                            >
                              👁️ View
                            </CButton>

                            {/* Edit */}
                            <CButton
                              color="primary"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/edit-case/${encodeURIComponent(
                                    item.case_id,
                                  )}`,
                                )
                              }
                            >
                              ✏️ Edit
                            </CButton>

                            {/* Delete */}
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(item.case_id)}
                            >
                              🗑️
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
    </>
  )
}

export default AllCases