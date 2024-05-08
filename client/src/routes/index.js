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
const Sales = lazy(() => import('../pages/protected/Sales'))
const InvoicesForm = lazy(() => import('../pages/protected/InvoicesForm'))
const SalesPersons = lazy(() => import('../pages/protected/SalesPersons'))
const AddSalesPerson = lazy(() => import('../features/Sales-Persons/components/AddSalesPerson'))
const ExpensesForm = lazy(() => import('../features/Expenses/components/ExpensesForm'))
const AllProductsTable = lazy(() => import('../features/leads/components/AllProductTable'))
const AllCategoriesTable = lazy(() => import('../features/transactions/components/AllCategoryTable'))
const AllExpensesTable = lazy(() => import('../features/Expenses/components/ExpanseTable'))
const AllDistributors = lazy(() => import('../pages/protected/AllDistributors'))
const SalesGraph = lazy(() => import('../features/dashboard/components/SalesGraph'))



const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/dashboard/Total-Sales-Graph', // the url
    component: SalesGraph, // view rendered
  },
  {
    path: '/Products-Dashboard',
    component: Leads,
  },
  {
    path: '/Products-Entry-Operations',
    component: Bills,
  },
  {
    path: '/All-Products-Table',
    component: AllProductsTable,
  },
  {
    path: '/Categories-Dashboard',
    component: Transactions,
  },
  {
    path: '/Categories-Entry-Operations',
    component: Team,
  },
  {
    path: '/All-Categories-Table',
    component: AllCategoriesTable,
  },
  {
    path: '/Distributers-Dashboard',
    component: DistributersDashboard,
  },
  {
    path: '/Products-by-Distributers-Dashboard',
    component: Charts,
  },
  {
    path: '/Categories-by-Distributors-Dashboard',
    component: GettingStarted,
  },
  {
    path: '/Distributors-Entry-Operations',
    component: DocComponents,
  },
  {
    path: '/All-Distributors-Details',
    component: AllDistributors,
  },
  {
    path: '/Expenses',
    component: Integration,
  },
  {
    path: '/Expenses-Form',
    component: ExpensesForm,
  },
  {
    path: '/All-Expenses-Table',
    component: AllExpensesTable,
  },
  {
    path: '/Sales',
    component: Sales,
  },
  {
    path: '/Invoices',
    component: DocFeatures,
  },
  {
    path: '/Invoices-Form',
    component: InvoicesForm,
  },
  {
    path: '/Sales-Persons',
    component: SalesPersons,
  },
  {
    path: '/Sales-Persons-Form',
    component: AddSalesPerson,
  },
  {
    path: '/Notes',
    component: Calendar,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
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
