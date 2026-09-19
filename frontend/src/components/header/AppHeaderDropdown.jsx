import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'

import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'

import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const API_URL = 'http://127.0.0.1:8000'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  const [alerts, setAlerts] = useState([])
  const [loadingAlerts, setLoadingAlerts] = useState(false)

  // ==================== LOAD CASE ALERTS ====================
  const loadAlerts = async () => {
    setLoadingAlerts(true)

    try {
      const response = await fetch(`${API_URL}/api/cases/`)
      const cases = await response.json()

      if (!response.ok) {
        throw new Error('Failed to load alerts')
      }

      const caseAlerts = cases
        .map((item) => {
          const delay = Number(item.predicted_delay_days) || 0

          if (delay >= 120) {
            return {
              caseId: item.case_id,
              delay,
              type: 'high',
              title: 'High Delay Alert',
              message: `${item.case_id} has a predicted delay of ${delay.toFixed(2)} days.`,
            }
          }

          if (delay >= 60) {
            return {
              caseId: item.case_id,
              delay,
              type: 'moderate',
              title: 'Moderate Delay Alert',
              message: `${item.case_id} has a predicted delay of ${delay.toFixed(2)} days.`,
            }
          }

          return null
        })
        .filter(Boolean)
        .sort((a, b) => b.delay - a.delay)

      setAlerts(caseAlerts)
    } catch (error) {
      console.error('Unable to load alerts:', error)
      setAlerts([])
    } finally {
      setLoadingAlerts(false)
    }
  }

  // Load alerts when dropdown component starts
  useEffect(() => {
    loadAlerts()

    // Refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000)

    return () => clearInterval(interval)
  }, [])

  // ==================== OPEN CASE ====================
  const handleAlertClick = (caseId) => {
    navigate(`/view-case/${encodeURIComponent(caseId)}`)
  }

  // ==================== LOCK ACCOUNT / LOGOUT ====================
  const handleLockAccount = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')

    navigate('/authentication/login', { replace: true })
  }

  return (
    <CDropdown variant="nav-item">

      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>

      <CDropdownMenu
        className="pt-0"
        placement="bottom-end"
        style={{ minWidth: '340px' }}
      >

        {/* ==================== ACCOUNT ==================== */}
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>

        {/* ==================== REAL ALERTS ==================== */}
        <CDropdownHeader className="fw-semibold">
          <CIcon icon={cilBell} className="me-2" />
          Updates

          <CBadge
            color={alerts.length > 0 ? 'danger' : 'secondary'}
            className="ms-2"
          >
            {alerts.length}
          </CBadge>
        </CDropdownHeader>

        {loadingAlerts ? (
          <CDropdownItem disabled>
            Loading alerts...
          </CDropdownItem>
        ) : alerts.length === 0 ? (
          <CDropdownItem disabled>
            <span className="text-body-secondary">
              No delay alerts
            </span>
          </CDropdownItem>
        ) : (
          alerts.map((alert) => (
            <CDropdownItem
              key={`${alert.caseId}-${alert.type}`}
              onClick={() => handleAlertClick(alert.caseId)}
              style={{ cursor: 'pointer' }}
            >
              <CIcon
                icon={cilBell}
                className={`me-2 text-${
                  alert.type === 'high'
                    ? 'danger'
                    : 'warning'
                }`}
              />

              <span>
                <strong>
                  {alert.title}
                </strong>

                <br />

                <small className="text-body-secondary">
                  {alert.message}
                </small>
              </span>
            </CDropdownItem>
          ))
        )}

        {/* ==================== OTHER ITEMS ==================== */}
        <CDropdownDivider />

        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            0
          </CBadge>
        </CDropdownItem>

        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            0
          </CBadge>
        </CDropdownItem>

        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            0
          </CBadge>
        </CDropdownItem>

        {/* ==================== SETTINGS ==================== */}
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
          Settings
        </CDropdownHeader>

        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>

        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            0
          </CBadge>
        </CDropdownItem>

        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            0
          </CBadge>
        </CDropdownItem>

        <CDropdownDivider />

        {/* ==================== LOCK ACCOUNT ==================== */}
        <CDropdownItem onClick={handleLockAccount}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem>

      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown