import React, { useState } from 'react'
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

import CIcon from '@coreui/icons-react'

import {
  cilBell,
  cilCreditCard,
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'

const AppHeaderDropdown = ({ alerts = [], onAlertClick }) => {
  const navigate = useNavigate()

  const [showUpdates, setShowUpdates] = useState(false)

  const storedUser = localStorage.getItem('user')
  const sessionUser = sessionStorage.getItem('user')

  let user = null

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : sessionUser
        ? JSON.parse(sessionUser)
        : null
  } catch {
    user = null
  }

  const userName = user?.name || 'User'
  const userEmail = user?.email || ''

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')

    navigate('/authentication/login', { replace: true })
  }

  const handleUpdatesClick = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setShowUpdates((previous) => !previous)
  }

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle caret={false} className="py-0 pe-0">
        <CAvatar color="primary" textColor="white" size="md">
          {userName.charAt(0).toUpperCase()}
        </CAvatar>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0">

        {/* User Information */}
        <CDropdownHeader className="bg-body-secondary fw-semibold py-2">
          <div>{userName}</div>

          {userEmail && (
            <small className="text-body-secondary">
              {userEmail}
            </small>
          )}
        </CDropdownHeader>

        {/* Updates Toggle */}
        <div
          role="button"
          tabIndex={0}
          onMouseDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onClick={handleUpdatesClick}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              event.stopPropagation()
              setShowUpdates((previous) => !previous)
            }
          }}
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <CIcon icon={cilBell} className="me-2" />

          <strong>Updates</strong>

          <CBadge
            color={alerts.length > 0 ? 'danger' : 'secondary'}
            className="ms-2"
          >
            {alerts.length}
          </CBadge>

          <span className="float-end">
            {showUpdates ? '▲' : '▼'}
          </span>
        </div>

        {/* Updates Content */}
        {showUpdates && (
          <>
            {alerts.length === 0 ? (
              <CDropdownItem disabled>
                <CIcon icon={cilBell} className="me-2" />
                No new updates
              </CDropdownItem>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <CDropdownItem
                  key={`${alert.caseId}-${alert.type}`}
                  onClick={() => onAlertClick?.(alert.caseId)}
                  style={{
                    cursor: 'pointer',
                    whiteSpace: 'normal',
                  }}
                >
                  <CIcon
                    icon={cilBell}
                    className={`me-2 ${
                      alert.type === 'high'
                        ? 'text-danger'
                        : 'text-warning'
                    }`}
                  />

                  <span>
                    <strong>{alert.title}</strong>

                    <br />

                    <small className="text-body-secondary">
                      {alert.message}
                    </small>
                  </span>
                </CDropdownItem>
              ))
            )}

            {alerts.length > 0 && (
              <>
                <CDropdownDivider />

                <CDropdownItem
                  onClick={() => navigate('/high-risk-cases')}
                  style={{ cursor: 'pointer' }}
                >
                  <CIcon icon={cilBell} className="me-2" />
                  View all updates
                </CDropdownItem>
              </>
            )}
          </>
        )}

        {/* Account Options */}
        <CDropdownDivider />

        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>

        <CDropdownItem>
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
        </CDropdownItem>

        <CDropdownDivider />

        <CDropdownItem>
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem>

        {/* Logout */}
        <CDropdownItem
          component="button"
          onClick={handleLogout}
          style={{
            width: '100%',
            textAlign: 'left',
          }}
        >
          Logout
        </CDropdownItem>

      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown