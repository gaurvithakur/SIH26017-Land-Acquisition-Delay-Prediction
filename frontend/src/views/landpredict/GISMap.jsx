import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CBadge, CAlert } from '@coreui/react'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

// ==========================================
// Approximate coordinates of Indian states
// ==========================================

const stateCoordinates = {
  'Andhra Pradesh': [15.9129, 79.74],
  'Arunachal Pradesh': [28.218, 94.7278],
  Assam: [26.2006, 92.9376],
  Bihar: [25.0961, 85.3131],
  Chhattisgarh: [21.2787, 81.8661],
  Goa: [15.2993, 74.124],
  Gujarat: [22.2587, 71.1924],
  Haryana: [29.0588, 76.0856],
  'Himachal Pradesh': [31.1048, 77.1734],
  Jharkhand: [23.6102, 85.2799],
  Karnataka: [15.3173, 75.7139],
  Kerala: [10.8505, 76.2711],
  'Madhya Pradesh': [22.9734, 78.6569],
  Maharashtra: [19.7515, 75.7139],
  Manipur: [24.6637, 93.9063],
  Meghalaya: [25.467, 91.3662],
  Mizoram: [23.1645, 92.9376],
  Nagaland: [26.1584, 94.5624],
  Odisha: [20.9517, 85.0985],
  Punjab: [31.1471, 75.3412],
  Rajasthan: [27.0238, 74.2179],
  Sikkim: [27.533, 88.5122],
  'Tamil Nadu': [11.1271, 78.6569],
  Telangana: [18.1124, 79.0193],
  Tripura: [23.9408, 91.9882],
  'Uttar Pradesh': [26.8467, 80.9462],
  Uttarakhand: [30.0668, 79.0193],
  'West Bengal': [22.9868, 87.855],
  Delhi: [28.7041, 77.1025],
  'Jammu and Kashmir': [33.7782, 76.5762],
  Ladakh: [34.1526, 77.5771],
}

// ==========================================
// Get color according to risk
// ==========================================

const getRiskColor = (risk) => {
  if (!risk) return '#198754'

  const riskValue = risk.toLowerCase()

  if (riskValue === 'high') return '#dc3545'
  if (riskValue === 'medium') return '#ffc107'

  return '#198754'
}

// ==========================================
// Get risk badge color
// ==========================================

const getBadgeColor = (risk) => {
  if (!risk) return 'success'

  const riskValue = risk.toLowerCase()

  if (riskValue === 'high') return 'danger'
  if (riskValue === 'medium') return 'warning'

  return 'success'
}

// ==========================================
// GIS MAP COMPONENT
// ==========================================

const GISMap = () => {
  const [cases, setCases] = useState([])

  useEffect(() => {
    // Try reading cases from localStorage

    const savedCases = localStorage.getItem('landCases') || localStorage.getItem('cases')

    if (savedCases) {
      try {
        setCases(JSON.parse(savedCases))
      } catch (error) {
        console.error('Error loading cases:', error)
        setCases([])
      }
    }
  }, [])

  // ==========================================
  // Filter only cases having valid states
  // ==========================================

  const mappedCases = cases.filter((item) => {
    return item.state && stateCoordinates[item.state]
  })

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader>
            <strong>📍 India Land Acquisition Risk Map</strong>
          </CCardHeader>

          <CCardBody>
            <p className="text-body-secondary">
              Land acquisition cases are displayed according to their state and predicted risk
              level.
            </p>

            {/* ==========================================
                LEGEND
            ========================================== */}

            <div className="d-flex flex-wrap gap-4 mb-4">
              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#dc3545',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>

                <span>High Risk</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#ffc107',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>

                <span>Medium Risk</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#198754',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>

                <span>Low Risk</span>
              </div>
            </div>

            {/* ==========================================
                MAP
            ========================================== */}

            <div
              style={{
                height: '550px',
                width: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <MapContainer
                center={[22.5937, 78.9629]}
                zoom={5}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* ======================================
                    CASE MARKERS
                ====================================== */}

                {mappedCases.map((item, index) => {
                  const coordinates = stateCoordinates[item.state]

                  // Different possible risk field names
                  const risk = item.risk || item.predictedRisk || item.prediction?.risk || 'Low'

                  return (
                    <CircleMarker
                      key={index}
                      center={coordinates}
                      radius={12}
                      pathOptions={{
                        color: getRiskColor(risk),
                        fillColor: getRiskColor(risk),
                        fillOpacity: 0.8,
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: '180px' }}>
                          <h6>{item.projectName || item.projectType || 'Land Acquisition Case'}</h6>

                          <hr />

                          <p className="mb-1">
                            <strong>State:</strong> {item.state}
                          </p>

                          <p className="mb-1">
                            <strong>District:</strong> {item.district || 'Not Available'}
                          </p>

                          <p className="mb-2">
                            <strong>Project:</strong>{' '}
                            {item.projectType || item.projectName || 'Not Available'}
                          </p>

                          <CBadge color={getBadgeColor(risk)}>{risk} Risk</CBadge>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )
                })}
              </MapContainer>
            </div>

            {/* ==========================================
                CASE INFORMATION
            ========================================== */}

            <div className="mt-4">
              <h5>📊 Map Summary</h5>

              <p className="text-body-secondary mb-2">
                Total Cases Available: <strong>{cases.length}</strong>
              </p>

              <p className="text-body-secondary">
                Cases Displayed on Map: <strong>{mappedCases.length}</strong>
              </p>

              {cases.length === 0 && (
                <CAlert color="info">
                  No cases available yet. Add cases using <strong>Add New Case</strong> and they
                  will appear on the GIS Map.
                </CAlert>
              )}

              {cases.length > 0 && mappedCases.length === 0 && (
                <CAlert color="warning">
                  Cases were found, but their state names do not match the available Indian state
                  locations.
                </CAlert>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default GISMap
