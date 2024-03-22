// import moment from "moment"
// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { showNotification } from "../common/headerSlice"
// import TitleCard from "../../components/Cards/TitleCard"
// import { RECENT_TRANSACTIONS } from "../../utils/dummyData"
// import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
// import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
// import SearchBar from "../../components/Input/SearchBar"
import React from "react"
import TopCategory from "./components/TopCategory"
import LeastCategory from "./components/LeastCategory"
import Top5sold from "./components/Top5sold"
import Least5sold from "./components/Least5sold"

// const TopSideButtons = ({removeFilter, applyFilter, applySearch}) => {

//     const [filterParam, setFilterParam] = useState("")
//     const [searchText, setSearchText] = useState("")
//     const locationFilters = ["Paris", "London", "Canada", "Peru", "Tokyo"]

//     const showFiltersAndApply = (params) => {
//         applyFilter(params)
//         setFilterParam(params)
//     }

//     const removeAppliedFilter = () => {
//         removeFilter()
//         setFilterParam("")
//         setSearchText("")
//     }

//     useEffect(() => {
//         if(searchText == ""){
//             removeAppliedFilter()
//         }else{
//             applySearch(searchText)
//         }
//     }, [searchText])

//     return(
//         <div className="inline-block float-right">
//             <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
//             {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
//             <div className="dropdown dropdown-bottom dropdown-end">
//                 <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
//                 <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
//                     {
//                         locationFilters.map((l, k) => {
//                             return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
//                         })
//                     }
//                     <div className="divider mt-0 mb-0"></div>
//                     <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
//                 </ul>
//             </div>
//         </div>
//     )
// }


function Transactions(){



    return(
        <>
           <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
           <Top5sold/>
           <Least5sold/>
           </div>
           <TopCategory/>
           <LeastCategory/>
        </>
    )
}


export default Transactions