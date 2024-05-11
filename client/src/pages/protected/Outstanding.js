import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import OutstandingInvoice from '../../features/Invoices/components/OutstandingInvoice'

const Outstanding = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Invoice Outstanding"}))
      }, [])


    return (
        <>
        <div role="alert" className="alert bg-base-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <span className="flex justify-center items-center text-xs"><span className="w-3 h-3 animate-pulse rounded-full m-3  border-gray-300 border bg-green-500"></span>For less than 15 days old invoices</span>
          <span className="flex justify-center items-center text-xs"><span className="w-3 h-3 animate-pulse rounded-full m-3  border-gray-300 grid border bg-yellow-500"></span> For less than 45 days old invoices</span>
          <span className="flex justify-center items-center text-xs"><span className="w-3 h-3 animate-pulse rounded-full m-3  border-gray-300 grid border bg-orange-500"></span> For less than 60 days old invoices</span>
          <span className="flex justify-center items-center text-xs"><span className="w-3 h-3 animate-pulse rounded-full m-3  border-gray-300 grid border bg-red-600"></span> For less than 90 days old invoices</span>
          <span className="flex justify-center items-center text-xs"><span className="w-3 h-3 animate-pulse rounded-full m-3  border-gray-300 grid border bg-red-900"></span> For more than 90 days old invoices</span>
        </span>
      </div>
        <OutstandingInvoice/>
        </>
    )
}

export default Outstanding