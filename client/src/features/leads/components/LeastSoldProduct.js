import React, { useState, useEffect } from "react";
import moment from "moment";
import TitleCard from "../../../components/Cards/TitleCard";
import Autocomplete from "./Autocomplete"; // Import Autocomplete component
import DatePicker from "react-tailwindcss-datepicker";

const LeastSoldProduct = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().format("MMMM"));
    const [selectedLocation, setSelectedLocation] = useState("South");
    const [selectedInterval, setSelectedInterval] = useState("Yearly");
    const [selectedCategory, setSelectedCategory] = useState("zone");
  //   const [yearlyOptions, setYearlyOptions] = useState([]);
  //   const [monthlyOptions, setMonthlyOptions] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState({
      startDate: null,
      endDate: null,
    });
  
    useEffect(() => {
      fetchLocations();
      // generateYearlyOptions();
      // generateMonthlyOptions();
    }, [selectedCategory, selectedYear, selectedMonth]);
  
    const fetchLocations = async () => {
      try {
          const response = await fetch(
              "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/all"
          );
          const data = await response.json();
          console.log(data);
          const category = selectedCategory.toLowerCase();
          console.log(category);
  
          // Extract all locations based on the selected category
          const allLocations = data.map(item => item.distributor.distributorProfile[category]);
          console.log(allLocations);
  
          // Filter out unique locations
          const uniqueLocations = new Set();
          allLocations.forEach(location => {
              // Trim the location before adding it to the set
              uniqueLocations.add(location.trim());
          });
  
          // Convert the set back to an array
          const uniqueLocationsArray = Array.from(uniqueLocations);
  
          setLocations(uniqueLocationsArray);
          console.log(uniqueLocationsArray);
      } catch (error) {
          console.error("Error fetching locations:", error);
      }
  };
  
    
  
    const fetchTopSellingProducts = async () => {
      try {
        let apiUrl;
        let fromDate, toDate, locationParam;
  
        const locationType = selectedCategory.toLowerCase(); // Get selected location type
        const locationValue = encodeURIComponent(selectedLocation);
        console.log(locationType, locationValue);
  
        if (selectedInterval === "Yearly") {
          apiUrl = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/least-selling-products-by-${locationType}?${locationType}=${locationValue}&year=${selectedYear}&interval=annually`;
          console.log(apiUrl);
        } else if (selectedInterval === "Monthly") {
            const monthYearArray = (selectedMonth.split(" "));
            const apiMonth = monthYearArray[0].toLowerCase();
            const apiYear = monthYearArray[1].toString();
          apiUrl = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/least-selling-products-by-${locationType}?${locationType}=${locationValue}&year=${apiYear}&month=${apiMonth}&interval=monthly`;
          console.log(apiUrl);
        } else if (
          selectedInterval === "Weekly" ||
          selectedInterval === "Daily"
        ) {
          const intervalParam = "customdate";
          if (selectedDateRange) {
            fromDate = selectedDateRange.startDate;
            toDate = selectedDateRange.endDate;
            //   console.log(fromDate, toDate);
            //   console.log(selectedDateRange);
          } else {
            if (selectedInterval === "Weekly") {
              fromDate = moment().startOf("week").format("YYYY-MM-DD");
              toDate = moment().endOf("week").format("YYYY-MM-DD");
              setSelectedDateRange({startDate: fromDate, endDate: toDate});
            } else if (selectedInterval === "Daily") {
              fromDate = moment().startOf("day").format("YYYY-MM-DD");
              toDate = moment().endOf("day").format("YYYY-MM-DD");
              setSelectedDateRange({startDate: fromDate, endDate: toDate});
            }
          }
          apiUrl = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/least-selling-products-by-${locationType}?${locationType}=${locationValue}&interval=${intervalParam}&fromDate=${fromDate}&toDate=${toDate}`;
          console.log(apiUrl);
        }
  
        const response = await fetch(apiUrl);
        const data = await response.json();
        setTopProducts(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      }
    };
  
  //   const generateYearlyOptions = () => {
  //     const currentYear = moment().year();
  //     const yearlyOptions = [currentYear, currentYear - 1, currentYear - 2].map(
  //       (year) => ({
  //         label: `${year - 1}-${year}`,
  //         value: year,
  //       })
  //     );
  //     // setYearlyOptions(yearlyOptions);
  //   };
  
    const generateFinancialYears = () => {
      const currentYear = moment().year();
      const years = [];
      for (let i = 0; i < 3; i++) {
        const startYear = currentYear - i;
        years.push(`${startYear}-${startYear + 1}`);
      }
      return years;
    };
  
    const financialYears = generateFinancialYears();
  
  //   const generateMonthlyOptions = () => {
  //     const currentYear = moment().year();
  //     const months = moment.months();
  //     const monthlyOptions = [];
  //     for (let i = 0; i < 3; i++) {
  //       for (let j = 0; j < months.length; j++) {
  //         monthlyOptions.push({
  //           label: `${months[j]} ${currentYear - i}`,
  //           value: `${months[j]} ${currentYear - i}`,
  //         });
  //       }
  //     }
  //     // setMonthlyOptions(monthlyOptions);
  //   };
  
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
    const months = generateMonths().reverse(); 
  
    useEffect(() => {
      fetchTopSellingProducts();
    }, [
      selectedLocation,
      selectedInterval,
      selectedYear,
      selectedMonth,
      selectedDateRange,
    ]);
  
    const handleIntervalChange = (event) => {
      setSelectedInterval(event.target.value);
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
    };
  
    const handleCategoryChange = (event) => {
      setSelectedCategory(event.target.value);
      setSelectedLocation("")
    };
  
    const handleLocationChange = (value) => {
      setSelectedLocation(value);
    };
  
    //   const handleCategoryChange = (event) => {
    //     setSelectedCategory(event.target.value);
    //     fetchLocations(); // Call fetchLocations when category changes
    //     console.log(selectedCategory);
    //     console.log(locations);
    //   };
  //   const handleCategoryChange = (event) => {
  //     const newCategory = event.target.value;
  //     setSelectedCategory(newCategory);
  //     // Fetch locations when the category changes
  //     fetchLocations();
  //   };
  
    const resetFilters = () => {
      setSelectedYear(moment().year());
      setSelectedMonth(moment().format("MMMM"));
      setSelectedLocation("South");
      setSelectedInterval("Yearly");
      setSelectedCategory("zone");
      setSelectedDateRange({ startDate: null, endDate: null });
    };
  
    return (
      <>
        <TitleCard
          title="Least Sold Products"
          topMargin="mt-2"
          TopSideButtons1={
            <>
              <select
                className="px-2 border border-gray-300 rounded-md h-7 ml-2"
                onChange={handleIntervalChange}
                value={selectedInterval}
              >
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
              </select>
              {(selectedInterval === "Yearly" ||
                selectedInterval === "Monthly") && (
                <>
                  {selectedInterval === "Yearly" && (
                    <select
                      className="px-2 border border-gray-300 rounded-md h-7 ml-2"
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
                      className="px-2 border border-gray-300 rounded-md h-7 ml-2"
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
              {(selectedInterval === "Weekly" ||
                selectedInterval === "Daily") && (
                <DatePicker
                  className="border border-gray-300 rounded-md px-2 h-7"
                  range
                  onChange={handleDateRangeChange}
                  value={selectedDateRange}
                  inputClassName="input input-bordered w-72 h-7"
                />
              )}
              <select
                className="px-2 border text-base border-gray-300 rounded-md h-7 ml-2"
                onChange={handleCategoryChange}
                value={selectedCategory}
              >
                {/* <option value="">Select Category</option> */}
                <option value="Zone">Zone</option>
                <option value="Region">Region</option>
                <option value="City">City</option>
              </select>
              <Autocomplete
          items={locations}
          value={selectedLocation}
          onChange={handleLocationChange}
        />
              <button
                className="btn btn-ghost btn-xs h-7"
                onClick={resetFilters}
              >
                Reset
              </button>
            </>
          }
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity Sold</th>
                  <th>Distributer Agency Name</th>
                  <th>Contact Person Name</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product[0].productName}</td>
                    <td>{product[1]}</td>
                    <td>{product[2]}</td>
                    <td>{product[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </>
    );
  };

export default LeastSoldProduct