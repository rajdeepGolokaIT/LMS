import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { setPageTitle, showNotification } from "../common/headerSlice"
import GettingStartedNav from "./components/GettingStartedNav"
import ReadMe from "./components/GettingStartedContent"
import GettingStartedContent from "./components/GettingStartedContent"
import TopCategoryDistributor from "./components/TopCategoryDistributor"
import LeastCategoryDistributor from "./components/LeastCategoryDistributor"



function GettingStarted(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Categories to Distributors Dashboard"}))
      }, [])


    return(
        <>
    <div className="grid mt-10 grid-cols-1 gap-6">
                <TopCategoryDistributor/>
                <LeastCategoryDistributor/>
           </div>
        </>
    )
}

export default GettingStarted