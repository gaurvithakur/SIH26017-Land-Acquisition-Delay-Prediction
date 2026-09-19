/**
 * AppHeader Component
 *
 * Main application header with navigation, theme switcher, notifications,
 * and user menu.
 */

import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CBadge,
  CContainer,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormInput,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CNavLink,
  CNavItem,
  CSearchButton,
  useColorModes,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { apiFetch } from '../api'

const AppHeader = () => {
  const headerRef = useRef()
  const navigate = useNavigate()

  const { colorMode, setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme',
  )

  const [searchVisible, setSearchVisible] = useState(false)

  // Notification state
  const [alerts, setAlerts] = useState([])
  const [loadingAlerts, setLoadingAlerts] = useState(false)

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================
  const loadAlerts = async () => {
    setLoadingAlerts(true)

    try {
      const response = await apiFetch('/api/cases/')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to load cases')
      }

      const caseAlerts = data
        .map((item) => {
          const delay = Number(item.predicted_delay_days) || 0

          // High delay
          if (delay >= 120) {
            return {
              caseId: item.case_id,
              delay,
              type: 'high',
              title: 'High Delay Alert',
              message: `${item.case_id} has a predicted delay of ${delay.toFixed(
                2,
              )} days.`,
            }
          }

          // Moderate delay
          if (delay >= 60) {
            return {
              caseId: item.case_id,
              delay,
              type: 'moderate',
              title: 'Moderate Delay Alert',
              message: `${item.case_id} has a predicted delay of ${delay.toFixed(
                2,
              )} days.`,
            }
          }

          return null
        })
        .filter(Boolean)
        .sort((a, b) => b.delay - a.delay)

      setAlerts(caseAlerts)
    } catch (error) {
      console.error('Unable to load notifications:', error)
      setAlerts([])
    } finally {
      setLoadingAlerts(false)
    }
  }

  // =========================================================
  // LOAD NOTIFICATIONS ON START + EVERY 30 SECONDS
  // =========================================================
  useEffect(() => {
    loadAlerts()

    const interval = setInterval(() => {
      loadAlerts()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // =========================================================
  // HEADER SHADOW ON SCROLL
  // =========================================================
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle(
          'shadow-sm',
          document.documentElement.scrollTop > 0,
        )
      }
    }

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // =========================================================
  // OPEN CASE FROM NOTIFICATION
  // =========================================================
  const handleAlertClick = (caseId) => {
    navigate(`/view-case/${encodeURIComponent(caseId)}`)
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        {/* Sidebar button */}
        <CHeaderToggler
          onClick={() =>
            dispatch({
              type: 'set',
              sidebarShow: !sidebarShow,
            })
          }
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        {/* Search */}
        <CSearchButton
          onTrigger={() => setSearchVisible(true)}
          aria-label="Open search dialog"
          aria-controls="app-header-search-modal"
        />

        <CModal
          id="app-header-search-modal"
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          aria-labelledby="app-header-search-modal-title"
        >
          <CModalHeader>
            <CModalTitle
              id="app-header-search-modal-title"
              className="w-100"
            >
              <CFormInput
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </CModalTitle>
          </CModalHeader>

          <CModalBody>
            <p className="text-body-secondary small mb-2">
              Recent searches
            </p>

            <CListGroup flush>
              <CListGroupItem
                as="button"
                type="button"
                className="d-flex justify-content-between align-items-center"
              >
                CoreUI components overview

                <CBadge color="secondary" shape="rounded-pill">
                  Open
                </CBadge>
              </CListGroupItem>

              <CListGroupItem
                as="button"
                type="button"
                className="d-flex justify-content-between align-items-center"
              >
                Modal dialog examples

                <CBadge color="secondary" shape="rounded-pill">
                  Open
                </CBadge>
              </CListGroupItem>

              <CListGroupItem
                as="button"
                type="button"
                className="d-flex justify-content-between align-items-center"
              >
                Sidebar navigation customization

                <CBadge color="secondary" shape="rounded-pill">
                  Open
                </CBadge>
              </CListGroupItem>
            </CListGroup>
          </CModalBody>
        </CModal>

        {/* Right-side header icons */}
        <CHeaderNav className="ms-auto">
          {/* Notifications */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle
              caret={false}
              className="position-relative"
              title="Notifications"
            >
              <CIcon icon={cilBell} size="lg" />

              {alerts.length > 0 && (
                <CBadge
                  color="danger"
                  shape="rounded-pill"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {alerts.length}
                </CBadge>
              )}
            </CDropdownToggle>

            <CDropdownMenu
              className="pt-0"
              placement="bottom-end"
              style={{ minWidth: '360px' }}
            >
              <CDropdownHeader className="bg-body-secondary fw-semibold">
                Notifications

                <CBadge
                  color={alerts.length > 0 ? 'danger' : 'secondary'}
                  className="ms-2"
                >
                  {alerts.length}
                </CBadge>
              </CDropdownHeader>

              {loadingAlerts ? (
                <CDropdownItem disabled>
                  Loading notifications...
                </CDropdownItem>
              ) : alerts.length === 0 ? (
                <CDropdownItem disabled>
                  No delay alerts
                </CDropdownItem>
              ) : (
                alerts.map((alert) => (
                  <CDropdownItem
                    key={`${alert.caseId}-${alert.type}`}
                    onClick={() => handleAlertClick(alert.caseId)}
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

              {alerts.length > 0 && <CDropdownDivider />}

              {alerts.length > 0 && (
                <CDropdownItem
                  onClick={() => navigate('/high-risk-cases')}
                  style={{ cursor: 'pointer' }}
                >
                  View all high-risk cases
                </CDropdownItem>
              )}
            </CDropdownMenu>
          </CDropdown>

          {/* List */}
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>

          {/* Messages */}
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        {/* Theme + User */}
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          {/* Theme selector */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>

            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon
                  className="me-2"
                  icon={cilSun}
                  size="lg"
                />
                Light
              </CDropdownItem>

              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon
                  className="me-2"
                  icon={cilMoon}
                  size="lg"
                />
                Dark
              </CDropdownItem>

              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon
                  className="me-2"
                  icon={cilContrast}
                  size="lg"
                />
                Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          {/* User dropdown */}
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      {/* Breadcrumb */}
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader