import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import DistributorsDashboardComponent from "../../features/Distributor Dashboard/index"

const DistributorsDashboard = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Distributers Dashboard"}))
      }, [])
      
    return <DistributorsDashboardComponent />
}

export default DistributorsDashboard