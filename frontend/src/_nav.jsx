import React from 'react'
import CIcon from '@coreui/icons-react'

import {
  cilSpeedometer,
  cilPlus,
  cilList,
  cilWarning,
  cilChartPie,
  cilMap,
  cilBell,
} from '@coreui/icons'

import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // =========================
  // LANDPREDICT
  // =========================
  {
    component: CNavTitle,
    name: 'LANDPREDICT',
  },

  // Dashboard
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  // =========================
  // CASE MANAGEMENT
  // =========================
  {
    component: CNavTitle,
    name: 'CASE MANAGEMENT',
  },

  // Add New Case
  {
    component: CNavItem,
    name: 'Add New Case',
    to: '/add-case',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },

  // All Cases
  {
    component: CNavItem,
    name: 'All Cases',
    to: '/all-cases',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },

  // =========================
  // RISK ANALYSIS
  // =========================
  {
    component: CNavTitle,
    name: 'RISK ANALYSIS',
  },

  // Predict Risk
  {
    component: CNavItem,
    name: 'Predict Risk',
    to: '/predict-risk',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },

  // High Risk Cases
  {
    component: CNavItem,
    name: 'High Risk Cases',
    to: '/high-risk-cases',
    icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
  },

  // =========================
  // MONITORING
  // =========================
  {
    component: CNavTitle,
    name: 'MONITORING',
  },

  // GIS Map
  {
    component: CNavItem,
    name: 'GIS Map',
    to: '/gis-map',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },

  // Alerts
  {
    component: CNavItem,
    name: 'Alerts',
    to: '/alerts',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
]

export default _nav
