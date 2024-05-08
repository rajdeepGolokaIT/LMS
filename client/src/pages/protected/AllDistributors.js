import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AllDistributorsList from "../../features/Distributor Dashboard/components/AllDistributorsTable"
import AllDistributorDetails from '../../features/Distributor Dashboard/components/DistributorSalesDetails'

const AllDistributors = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Distributers Details"}))
      }, [])
      
    return (
        <>
        <AllDistributorsList />
        <AllDistributorDetails />
        </>
    )
}

export default AllDistributors