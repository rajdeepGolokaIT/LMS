import React, { useState, useEffect } from "react";
import moment from "moment";
import TitleCard from "../../components/Cards/TitleCard";

function Leads() {
  const [selectedInterval, setSelectedInterval] = useState("Yearly");
  const [selectedYear, setSelectedYear] = useState(moment().year()); // Current year as default
  const [selectedMonth, setSelectedMonth] = useState(moment().format("MMMM")); // Current month as default
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
    // console.log(months.reverse());
    return months;
  };
  
  
  const financialYears = generateFinancialYears();
  const months = generateMonths().reverse(); 
//   console.log(months);

  const fetchTopSellingProducts = async () => {
    try {
      let apiUrl;
      if (selectedInterval === "Yearly") {
        apiUrl = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/top-selling-products?interval=annually&year=${selectedYear}`;
      } else if (selectedInterval === "Monthly") {
        // const monthIndex = moment.months().indexOf(selectedMonth);
        // console.log(monthIndex);
        const yearForMonth = selectedYear  // If selected month is before April, consider previous year   - (monthIndex >= 3 ? 0 : 1);
        const apiMonth = selectedMonth.split(" ")[0];
        apiUrl = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/top-selling-products?interval=monthly&year=${yearForMonth}&month=${apiMonth.toLowerCase()}`;
        // console.log(yearForMonth);
        // console.log(selectedYear);
      }
    //   console.log(apiUrl);
      const response = await fetch(apiUrl);

      const data = await response.json();
      setTopProducts(data);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      // Handle error
    }
  };
//   console.log(selectedMonth)

  useEffect(() => {
    fetchTopSellingProducts();
  }, [selectedInterval, selectedYear, selectedMonth]);

  const handleIntervalChange = (event) => {
    setSelectedInterval(event.target.value);
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
  
//   console.log(months)


  return (
    <>
      <TitleCard
        title="Top 5 Sold Products"
        topMargin="mt-2"
        TopSideButtons1={
          <>
            <select
              className="px-2 border border-gray-300 rounded-md h-12 mr-2"
              onChange={handleIntervalChange}
              value={selectedInterval}
            >
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
            </select>
            {selectedInterval === "Yearly" && (
              <select
                className="px-2 border border-gray-300 rounded-md h-12"
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
                className="px-2 border border-gray-300 rounded-md h-12"
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
  );
}

export default Leads;
