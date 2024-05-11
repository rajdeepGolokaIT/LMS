import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddProductForm from '../../features/settings/billing/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Products Entry Operations"}))
      }, [])


    return(
        <AddProductForm />
    )
}

export default InternalPage