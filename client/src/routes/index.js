// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
// const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))
const DistributersDashboard = lazy(() => import('../pages/protected/DistributorsDashboard'))


const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  // {
  //   path: '/welcome', // the url
  //   component: Welcome, // view rendered
  // },
  {
    path: '/Products-Dashboard',
    component: Leads,
  },
  {
    path: '/Categories-Entry-Operations',
    component: Team,
  },
  {
    path: '/Invoices',
    component: Calendar,
  },
  {
    path: '/Categories-Dashboard',
    component: Transactions,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/Products-Entry-Operations',
    component: Bills,
  },
  {
    path: '/Categories-by-Distributors-Dashboard',
    component: GettingStarted,
  },
  {
    path: '/Distributers-Dashboard',
    component: DistributersDashboard,
  },
  {
    path: '/Notes',
    component: DocFeatures,
  },
  {
    path: '/Distributors-Entry-Operations',
    component: DocComponents,
  },
  {
    path: '/Expenses',
    component: Integration,
  },
  {
    path: '/Products-by-Distributers-Dashboard',
    component: Charts,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
]

export default routes
