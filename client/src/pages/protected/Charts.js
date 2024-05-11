import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import ProductsToDistributors from '../../features/charts'
import { setPageTitle } from '../../features/common/headerSlice'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Products to Distributors Dashboard"}))
      }, [])


    return  <ProductsToDistributors />
    
}

export default InternalPage