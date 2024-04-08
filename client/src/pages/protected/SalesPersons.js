import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import SalesPerson from '../../features/Sales-Persons/index'

const SalesPersons = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sales Persons Dashboard"}))
      }, [])
      
    return <SalesPerson/>
    
  
}

export default SalesPersons