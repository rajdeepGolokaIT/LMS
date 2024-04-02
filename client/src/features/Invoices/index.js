import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { setPageTitle} from "../common/headerSlice"
import InvoicesTable from './components/InvoicesTable'

const Invoices = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Invoices"}))
      }, [])
  return (
    <>

        <InvoicesTable />
    </>
  )
}

export default Invoices