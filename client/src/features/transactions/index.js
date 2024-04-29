
import React from "react"
import TopCategory from "./components/TopCategory"
import LeastCategory from "./components/LeastCategory"
import Top5sold from "./components/Top5sold"
import Least5sold from "./components/Least5sold"
import CurrentVsPrevCategory from "./components/CurrentVsPrevCategory"
import AllCategorySalesTable from "./components/AllCategorySalesTable"


function Transactions(){

    return(
        <>
           <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
           <Top5sold/>
           <Least5sold/>
           </div>
           <div className="grid mt-10 grid-cols-1 gap-6">
           <TopCategory/>
           <LeastCategory/>
           <CurrentVsPrevCategory/>
           <AllCategorySalesTable/>
           </div>
        </>
    )
}


export default Transactions