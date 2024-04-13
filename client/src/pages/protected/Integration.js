import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Expenses from '../../features/Expenses/index'

function InternalPage(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Expenses Dashboard"}))
      }, [])
      
    return <Expenses />
    
}

export default InternalPage