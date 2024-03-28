import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { setPageTitle, showNotification } from "../common/headerSlice"
import DocComponentsNav from "./components/DocComponentsNav"
import ReadMe from "./components/GettingStartedContent"
import DocComponentsContent from "./components/DocComponentsContent"
import FeaturesNav from "./components/FeaturesNav"
import FeaturesContent from "./components/FeaturesContent"
import DistributorProfileForm from "./components/DistributorProfileForm"
// import AddProductOfDistributorForm from "./components/AddProductOfDistributorForm"



function DocComponents(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Distributors Entry Operations"}))
      }, [])


    return(
        <>
            <DistributorProfileForm />
            {/* <AddProductOfDistributorForm /> */}
           
        </>
    )
}

export default DocComponents