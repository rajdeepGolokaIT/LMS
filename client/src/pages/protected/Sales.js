import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Sale from '../../features/Sales/index'

const Sales = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Sales Dashboard"}))
      }, [])
      
    return <Sale/>
}

export default Sales