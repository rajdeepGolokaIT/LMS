import React from 'react'
import Top5Distributor from './components/Top5Distributor'
import Least5Distributors from './components/Least5Distributors'
import CurrentVsPrevDistributor from './components/CurrentVsPrevDistributor'
import AllDistributorSalesTable from './components/AllDistributorSalesTable'

const index = () => {
  return (
    <>
    <div className="grid mt-10 grid-cols-1 gap-6">
        <Top5Distributor/>
        <Least5Distributors/>
        <CurrentVsPrevDistributor/>
        <AllDistributorSalesTable/>
    </div>
    </>
  )
}

export default index