import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

// Sidebar navigation configuration
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()

  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* LANDPREDICT BRAND */}
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/dashboard" className="text-decoration-none d-flex align-items-center">
          <div className="sidebar-brand-full">
            <div
              className="fw-bold"
              style={{
                fontSize: '20px',
                letterSpacing: '1px',
              }}
            >
              LAND<span className="text-primary">PREDICT</span>
            </div>

            <small className="text-body-secondary" style={{ fontSize: '9px' }}>
              LAND ACQUISITION RISK ANALYSIS
            </small>
          </div>

          {/* Narrow sidebar branding */}
          <div
            className="sidebar-brand-narrow fw-bold"
            style={{
              fontSize: '18px',
            }}
          >
            LP
          </div>
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() =>
            dispatch({
              type: 'set',
              sidebarShow: false,
            })
          }
        />
      </CSidebarHeader>

      {/* Navigation */}
      <AppSidebarNav items={navigation} />

      {/* Sidebar Toggle */}
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({
              type: 'set',
              sidebarUnfoldable: !unfoldable,
            })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
