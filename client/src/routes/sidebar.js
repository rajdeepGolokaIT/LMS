/** Icons are imported separatly to reduce build time */
import BellIcon from '@heroicons/react/24/outline/BellIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/PaperClipIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import BoltIcon from '@heroicons/react/24/outline/CurrencyRupeeIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/Bars4Icon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import TableIcon from '@heroicons/react/24/outline/TableCellsIcon'
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
          },
          {
            path: '/app/All-Products-Table',
            icon: <TableIcon className={submenuIconClasses}/>,
            name: 'All Products List',
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
      {
        path: '/app/All-Categories-Table',
        icon: <TableIcon className={submenuIconClasses}/>,
        name: 'All Categories Table',
      }
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
      {
        path: '/app/All-Distributors-Details',
        icon: <TableIcon className={submenuIconClasses}/>,
        name: 'All Distributors Details',
      }
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
        path: '/app/Expenses-Form',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Expenses Entry Operations',
      },
      {
        path: '/app/All-Expenses-Table',
        icon: <TableIcon className={submenuIconClasses}/>,
        name: 'All Expenses ',
      }
    ]
  },
  // {
  //   path: '/app/Sales', // url
  //   icon: <BellIcon className={iconClasses}/>, // icon component
  //   name: 'Sales', // name that appear in Sidebar
  // },
  {
    path: '', // url
    icon: <CalendarDaysIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Invoices', // name that appear in Sidebar
    submenu : [
      {
        path: '/app/Invoices',   
        icon:  <Squares2X2Icon className={iconClasses}/>,   
        name: 'Invoices Dashboard', // 
      },
      {
        path: '/app/Invoices-Form',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Invoices Entry Operations',
      },
      {
        path: '/app/Invoice-Outstanding',
        icon: <TableIcon className={submenuIconClasses}/>,
        name: 'Invoice Outstanding',
      }
    ]
  },
  {
    path: '', // url
    icon: <UserIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Sales Persons', // name that appear in Sidebar
    submenu : [
      {
        path: '/app/Sales-Persons',   
        icon:  <Squares2X2Icon className={iconClasses}/>,   
        name: 'Sales Persons Dashboard', // 
      },
      {
        path: '/app/Sales-Persons-Form',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Sales Persons Entry Operations',
      }
    ]
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


