import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilAccountLogout,
  cilBell,
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'

const AppHeaderDropdown = ({ alerts = [], onAlertClick }) => {
  const navigate = useNavigate()

  const storedUser =
    localStorage.getItem('user') ||
    sessionStorage.getItem('user')

  let user = null

  try {
    user = storedUser ? JSON.parse(storedUser) : null
  } catch {
    user = null
  }

  const name = user?.name || 'User'
  const email = user?.email || ''

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')

    navigate('/authentication/login')
  }

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <CAvatar color="primary" textColor="white" size="md">
          {name.charAt(0).toUpperCase()}
        </CAvatar>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0">
        <CDropdownItem
          className="bg-body-secondary fw-semibold py-2"
          disabled
        >
          <div>{name}</div>

          {email && (
            <small className="text-body-secondary">
              {email}
            </small>
          )}
        </CDropdownItem>

        <CDropdownItem disabled>
          <CIcon icon={cilBell} className="me-2" />

          Updates

          <CBadge
            color={alerts.length > 0 ? 'danger' : 'secondary'}
            className="ms-2"
          >
            {alerts.length}
          </CBadge>
        </CDropdownItem>

        {alerts.length === 0 ? (
          <CDropdownItem disabled>
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
            >
              <CIcon icon={cilBell} className="me-2" />
              View all updates
            </CDropdownItem>
          </>
        )}

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
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem>

        <CDropdownDivider />

        <CDropdownItem
          component="button"
          onClick={handleLogout}
          style={{
            width: '100%',
            textAlign: 'left',
          }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown