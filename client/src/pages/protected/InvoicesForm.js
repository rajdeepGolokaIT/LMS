import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import InvoicesForms from '../../features/Invoices/components/InvoicesForm'

const InvoicesForm = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Invoices Form"}))
      }, [])


  return <InvoicesForms/>
   
  
}

export default InvoicesForm