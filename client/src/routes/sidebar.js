/** Icons are imported separatly to reduce build time */
import BellIcon from '@heroicons/react/24/outline/BellIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/PaperClipIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import BoltIcon from '@heroicons/react/24/outline/CurrencyRupeeIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/Bars4Icon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'

import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

  {
    path: '/app/dashboard',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Dashboard',
  },
  {
    path: '', // url
    icon: <InboxArrowDownIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Products', // name that appear in Sidebar
    submenu : [
          {
            path: '/app/Products-Dashboard',   //'/app/settings-profile', //url
            icon:  <Squares2X2Icon className={iconClasses}/>,   //<UserIcon className={submenuIconClasses}/>, // icon component
            name: 'Products Dashboard', // name that appear in Sidebar
          },
          {
            path: '/app/Products-Entry-Operations',
            icon: <WalletIcon className={submenuIconClasses}/>,
            name: 'Products Entry Operations',
          }
        ]
  },
  {
    path: '', // url
    icon: <CurrencyDollarIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Categories', // name that appear in Sidebar
    submenu : [
      {
            path: '/app/Categories-Dashboard',   // //url
            icon:  <Squares2X2Icon className={iconClasses}/>,   //<UserIcon className={submenuIconClasses}/>, // icon component
            name: 'Categories Dashboard', // name that appear in Sidebar
      },
      {
        path: '/app/Categories-Entry-Operations',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Categories Entry Operations',
      },
    ]
  },
  {
    path: '', // url
    icon: <ChartBarIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Distributers', // name that appear in Sidebar
    submenu : [
      {
            path: '/app/Distributers-Dashboard', //url
            icon:  <Squares2X2Icon className={iconClasses}/>, //<UserIcon className={submenuIconClasses}/>, // icon component
            name: 'Distributers Dashboard', // name that appear in Sidebar
      },
      {
        path: '/app/Products-by-Distributers-Dashboard', //url
        icon:  <Squares2X2Icon className={iconClasses}/>, //<UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Products sold to distributers dashboard', // name that appear in Sidebar
  },
      {
        path: '/app/Categories-by-Distributors-Dashboard',
        icon: <Squares2X2Icon className={iconClasses}/>,
        name: 'Categories sold to distributers dashboard',
      },
      {
        path: '/app/Distributors-Entry-Operations',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Distributors Entry Operations',
      },
    ]
  },
  {
    path: '', // url
    icon: <BoltIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Expenses', // name that appear in Sidebar
    submenu : [
      {
        path: '/app/Expenses',   //'/app/settings-profile', //url
        icon:  <Squares2X2Icon className={iconClasses}/>,   //<UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Expenses Dashboard', // name that appear in Sidebar
      },
      {
        path: '',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Expenses Entry Operations',
      }
    ]
  },
  {
    path: '/app/Invoices', // url
    icon: <CalendarDaysIcon className={iconClasses}/>, // icon component
    name: 'Invoices', // name that appear in Sidebar
  },

  {
    path: '/app/Notes', //no url needed as this has submenu
    icon: <DocumentDuplicateIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Notes', // name that appear in Sidebar
    // submenu : [
    //   {
    //     path: '/login',
    //     icon: <ArrowRightOnRectangleIcon className={submenuIconClasses}/>,
    //     name: 'Login',
    //   },
    //   {
    //     path: '/register', //url
    //     icon: <UserIcon className={submenuIconClasses}/>, // icon component
    //     name: 'Register', // name that appear in Sidebar
    //   },
    //   {
    //     path: '/forgot-password',
    //     icon: <KeyIcon className={submenuIconClasses}/>,
    //     name: 'Forgot Password',
    //   },
    //   {
    //     path: '/app/blank',
    //     icon: <DocumentIcon className={submenuIconClasses}/>,
    //     name: 'Blank Page',
    //   },
    //   {
    //     path: '/app/404',
    //     icon: <ExclamationTriangleIcon className={submenuIconClasses}/>,
    //     name: '404',
    //   },
    // ]
  },
  // {
  //   path: '', //no url needed as this has submenu
  //   icon: <Cog6ToothIcon className={`${iconClasses} inline` }/>, // icon component
  //   name: 'Settings', // name that appear in Sidebar
  //   // submenu : [
  //   //   {
  //   //     path: '/app/settings-profile', //url
  //   //     icon: <UserIcon className={submenuIconClasses}/>, // icon component
  //   //     name: 'Profile', // name that appear in Sidebar
  //   //   },
  //   //   {
  //   //     path: '/app/settings-billing',
  //   //     icon: <WalletIcon className={submenuIconClasses}/>,
  //   //     name: 'Billing',
  //   //   },
  //   //   {
  //   //     path: '/app/settings-team', // url
  //   //     icon: <UsersIcon className={submenuIconClasses}/>, // icon component
  //   //     name: 'Team Members', // name that appear in Sidebar
  //   //   },
  //   // ]
  // },
  // {
  //   path: '', //no url needed as this has submenu
  //   icon: <DocumentTextIcon className={`${iconClasses} inline` }/>, // icon component
  //   name: 'Documentation', // name that appear in Sidebar
  //   // submenu : [
  //   //   {
  //   //     path: '/app/getting-started', // url
  //   //     icon: <DocumentTextIcon className={submenuIconClasses}/>, // icon component
  //   //     name: 'Getting Started', // name that appear in Sidebar
  //   //   },
  //   //   {
  //   //     path: '/app/features',
  //   //     icon: <TableCellsIcon className={submenuIconClasses}/>, 
  //   //     name: 'Features',
  //   //   },
  //   //   {
  //   //     path: '/app/components',
  //   //     icon: <CodeBracketSquareIcon className={submenuIconClasses}/>, 
  //   //     name: 'Components',
  //   //   }
  //   // ]
  // },
  
]

export default routes


