// import LineChart from './components/LineChart'
// import BarChart from './components/BarChart'
// import DoughnutChart from './components/DoughnutChart'
// import PieChart from './components/PieChart'
// import ScatterChart from './components/ScatterChart'
// import StackBarChart from './components/StackBarChart'
// import Datepicker from "react-tailwindcss-datepicker"; 
import React,{ useState } from 'react';
import TopProductsDistributors from './components/TopProductsDistributors';
import LeastProductsDistributors from './components/LeastProductsDistributors';





function Charts(){

    // const [dateValue, setDateValue] = useState({ 
    //     startDate: new Date(), 
    //     endDate: new Date() 
    // }); 
    
    // const handleDatePickerValueChange = (newValue) => {
    //     console.log("newValue:", newValue); 
    //     setDateValue(newValue); 
    // } 

    return(
        <>
        {/* <Datepicker 
                containerClassName="w-72 h-7" 
                value={dateValue} 
                theme={"light"}
                inputClassName="input input-bordered w-72 h-7" 
                popoverDirection={"down"}
                toggleClassName="invisible"
                onChange={handleDatePickerValueChange} 
                showShortcuts={true} 
                primaryColor={"white"} 
            />  */}
        {/** ---------------------- Different charts ------------------------- */}
            <div className="grid lg:grid-cols-2 mt-0 grid-cols-1 gap-6">
                {/* <StackBarChart /> */}
                {/* <BarChart /> */}
            </div>

        
            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <DoughnutChart />
                <PieChart />
            </div> */}

            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <ScatterChart />
                <LineChart />
            </div> */}

            <TopProductsDistributors/>

            <LeastProductsDistributors/>
        </>
    )
}

export default Charts