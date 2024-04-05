import React from "react";
import Top5sold from "./components/Top5sold";
import { Least5sold } from "./components/Least5sold";
import TopSoldProduct from "./components/TopSoldProduct";
import LeastSoldProduct from "./components/LeastSoldProduct";
import CurrentVsPrevProduct from "./components/CurrentVsPrevProduct";
import AllProductSalesTable from "./components/AllProductSalesTable";

function Leads() {

  return (
    <>
    <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        <Top5sold/>
    <Least5sold/>
    </div>
    
    <TopSoldProduct/>
    <LeastSoldProduct/>
    <CurrentVsPrevProduct/>

    <AllProductSalesTable/>
    </>
  );
}

export default Leads;
