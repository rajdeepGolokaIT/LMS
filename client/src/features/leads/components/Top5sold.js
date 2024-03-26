import React, { useState, useEffect } from 'react';
import moment from "moment";
import TitleCard from "../../../components/Cards/TitleCard";
import DatePicker from "react-tailwindcss-datepicker";

const Top5sold = () => {

    const [selectedInterval, setSelectedInterval] = useState("Yearly");
  const [selectedYear, setSelectedYear] = useState(moment().year()); // Current year as default
  const [selectedMonth, setSelectedMonth] = useState(moment().format("MMMM")); // Current month as default
  const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null }); // For weekly and daily intervals
  const [topProducts, setTopProducts] = useState([]);

  const generateFinancialYears = () => {
    const currentYear = moment().year();
    const years = [];
    for (let i = 0; i < 3; i++) {
      const startYear = currentYear - i;
      years.push(`${startYear}-${startYear + 1}`);
    }
    return years;
  };

  const generateMonths = () => {
    const months = [];
    const fiscalStartMonth = moment().month("April").startOf("month");
    const currentYear = moment().year();
    for (let i = 0; months.length < 36; i++) { // 3 years * 12 months
      const monthYear = fiscalStartMonth.clone().subtract(i, "months");
      const monthName = monthYear.format("MMMM");
      const year = monthYear.year(); // Extract the year for the current month
      const monthYearString = `${monthName} ${year}`; // Combine month and year
      months.unshift(monthYearString); // Unshift to prepend the month-year string to the beginning of the array
    }
    return months;
  };
  
  const financialYears = generateFinancialYears();
  const months = generateMonths().reverse(); 

  const fetchTopSellingProducts = async () => {
    try {
      let apiUrl;
      let fromDate, toDate, intervalParam;
      
      if (selectedInterval === "Yearly") {
        apiUrl = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/top-selling-products?interval=annually&year=${selectedYear}`;
      } else if (selectedInterval === "Monthly") {
        const apiMonth = selectedMonth.split(" ")[0];
        apiUrl = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/top-selling-products?interval=monthly&year=${selectedYear}&month=${apiMonth.toLowerCase()}`;
      } else if (selectedInterval === "Weekly" || selectedInterval === "Daily") {
        intervalParam = "customdate"; // Set intervalParam
        
        // Set fromDate and toDate based on selectedDateRange or current week/day
        if (selectedDateRange) {
          fromDate = selectedDateRange.startDate;
          toDate = selectedDateRange.endDate;
        //   console.log(fromDate, toDate);
        //   console.log(selectedDateRange);
        } else {
            if(selectedInterval === "Weekly"){
                fromDate = moment().startOf("week").format("YYYY-MM-DD");
                toDate = moment().endOf("week").format("YYYY-MM-DD");
            } else if(selectedInterval === "Daily"){
                fromDate = moment().startOf("day").format("YYYY-MM-DD");
                toDate = moment().endOf("day").format("YYYY-MM-DD");
            }
        //   fromDate = moment().startOf("week").format("YYYY-MM-DD");
        //   toDate = moment().endOf("week").format("YYYY-MM-DD");
        //   console.log(fromDate, toDate);
        }
        
        apiUrl = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/top-selling-products?interval=${intervalParam}&fromDate=${fromDate}&toDate=${toDate}`;
      }
      
    //   console.log(fromDate, toDate, intervalParam); 
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      setTopProducts(data);
    //   console.log(data);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      // Handle error
    }
  };
  

  useEffect(() => {
    fetchTopSellingProducts();
  }, [selectedInterval, selectedYear, selectedMonth, selectedDateRange]);

  const handleIntervalChange = (event) => {
    setSelectedInterval(event.target.value);
    // Clear date range when switching interval
    setSelectedDateRange(null);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    const selectedMonthValue = event.target.value;
    const selectedYear = selectedMonthValue.split(" ")[1];
    const selectedMonth = selectedMonthValue.split(" ")[0]; // Extract month name
    setSelectedMonth(`${selectedMonth} ${selectedYear}`); // Set selectedMonth as month-year
  };

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    // console.log(dateRange);
  };

  const handleReset = () => {
    setSelectedInterval("Yearly");
    setSelectedYear(moment().year());
    setSelectedMonth(moment().format("MMMM"));
    setSelectedDateRange(null);
  };

  return (
    <>
    <TitleCard
      title="Top 5 Sold Products"
      topMargin="mt-2"
      TopSideButtons1={
        <>
          <select
            className="px-2 border border-gray-300 rounded-md h-7 mr-2"
            onChange={handleIntervalChange}
            value={selectedInterval}
          >
            <option value="Yearly">Yearly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </select>
          {(selectedInterval === "Yearly" || selectedInterval === "Monthly") && (
            <>
              {selectedInterval === "Yearly" && (
                <select
                  className="px-2 border border-gray-300 rounded-md h-7"
                  onChange={handleYearChange}
                  value={selectedYear}
                >
                  {financialYears.map((year) => (
                    <option key={year} value={parseInt(year.split("-")[0])}>
                      {year}
                    </option>
                  ))}
                </select>
              )}
              {selectedInterval === "Monthly" && (
                <select
                  className="px-2 border border-gray-300 rounded-md h-7"
                  onChange={handleMonthChange}
                  value={selectedMonth}
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
          {(selectedInterval === "Weekly" || selectedInterval === "Daily") && (
            <DatePicker
              className="border border-gray-300 rounded-md px-2 h-7"
              range
              // containerClassName="w-72 h-7 "
              onChange={handleDateRangeChange}
              value={selectedDateRange}
              inputClassName="input input-bordered w-72 h-7"
              // toggleClassName="invisible"
            />
          )}
        </>
      }
      TopSideButtons3={
          <button onClick={handleReset} className="btn btn-ghost btn-xs h-7">
            Reset
          </button>
        }
    >
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index}>
                <td>{product[0].productName}</td>
                <td>{product[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TitleCard>
  </>
  )
}

export default Top5sold