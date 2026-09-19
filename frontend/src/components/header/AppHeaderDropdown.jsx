import React from 'react'
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

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================
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

  return (
    <CDropdown variant="nav-item" placement="bottom-end">

      {/* =====================================================
          AVATAR
      ====================================================== */}
      <CDropdownToggle
        caret={false}
        className="py-0 pe-0"
      >
        <CAvatar
          color="primary"
          textColor="white"
          size="md"
        >
          {userName.charAt(0).toUpperCase()}
        </CAvatar>
      </CDropdownToggle>

      {/* =====================================================
          USER DROPDOWN
      ====================================================== */}
      <CDropdownMenu className="pt-0">

        {/* User information */}
        <CDropdownHeader className="bg-body-secondary fw-semibold py-2">

          <div>
            {userName}
          </div>

          {userEmail && (
            <small className="text-body-secondary">
              {userEmail}
            </small>
          )}

        </CDropdownHeader>

        {/* =================================================
            UPDATES
        ================================================== */}
        <CDropdownHeader className="fw-semibold">

          Updates

          <CBadge
            color={alerts.length > 0 ? 'danger' : 'secondary'}
            className="ms-2"
          >
            {alerts.length}
          </CBadge>

        </CDropdownHeader>

        {/* No notifications */}
        {alerts.length === 0 ? (

          <CDropdownItem disabled>

            <CIcon
              icon={cilBell}
              className="me-2"
            />

            No new updates

          </CDropdownItem>

        ) : (

          /* Notifications */
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

        {/* View all */}
        {alerts.length > 0 && (

          <>
            <CDropdownDivider />

            <CDropdownItem
              onClick={() => navigate('/high-risk-cases')}
              style={{ cursor: 'pointer' }}
            >

              <CIcon
                icon={cilBell}
                className="me-2"
              />

              View all updates

            </CDropdownItem>
          </>

        )}

        <CDropdownDivider />

        {/* Profile */}
        <CDropdownItem>

          <CIcon
            icon={cilUser}
            className="me-2"
          />

          Profile

        </CDropdownItem>

        {/* Settings */}
        <CDropdownItem>

          <CIcon
            icon={cilSettings}
            className="me-2"
          />

          Settings

        </CDropdownItem>

        {/* Payments */}
        <CDropdownItem>

          <CIcon
            icon={cilCreditCard}
            className="me-2"
          />

          Payments

        </CDropdownItem>

        <CDropdownDivider />

        {/* Lock */}
        <CDropdownItem>

          <CIcon
            icon={cilLockLocked}
            className="me-2"
          />

          Lock Account

        </CDropdownItem>

      </CDropdownMenu>

    </CDropdown>
  )
}

export default AppHeaderDropdown