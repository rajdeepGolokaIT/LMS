import React, { useState, useEffect } from "react";
import moment from "moment";
import TitleCard from "../../../components/Cards/TitleCard";
import Autocomplete from "../../leads/components/Autocomplete"; // Import Autocomplete component
import DatePicker from "react-tailwindcss-datepicker";
import { BASE_URL } from "../../../Endpoint";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TopCategory = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().format("MMMM"));
  const [selectedLocation, setSelectedLocation] = useState("East");
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
            `${BASE_URL}/api/v1/distributors/all`
        );
        const data = await response.json();
        console.log(data);
        const category = selectedCategory.toLowerCase();
        console.log(category);

        // Extract all locations based on the selected category
        const allLocations = data.map(item => item.distributorProfile[category]);
        console.log(allLocations);

        // Filter out unique locations
        const uniqueLocations = new Set();
        allLocations.forEach(location => {
          if (location !== null) {
            // Trim the location before adding it to the set
            uniqueLocations.add(location.trim());
          }
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
        apiUrl = `${BASE_URL}/api/v1/invoices/most-selling-products-by-category?${locationType}=${locationValue}&year=${selectedYear}&interval=annually`;
        console.log(apiUrl);
        //````````https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/most-selling-products-by-category?${locationType}=${locationValue}&year=${selectedYear}&interval=annually
      } else if (selectedInterval === "Monthly") {
        const monthYearArray = selectedMonth.split(" ");
        const apiMonth = monthYearArray[0].toLowerCase();
        const apiYear = monthYearArray[1];
        apiUrl = `${BASE_URL}/api/v1/invoices/most-selling-products-by-category?${locationType}=${locationValue}&year=${apiYear}&month=${apiMonth}&interval=monthly`;
        console.log(apiUrl);
        //````````https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/most-selling-products-by-category?${locationType}=${locationValue}&year=${selectedYear}&month=${monthParam}&interval=monthly
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
            setSelectedDateRange({ startDate: fromDate, endDate: toDate });
          } else if (selectedInterval === "Daily") {
            fromDate = moment().startOf("day").format("YYYY-MM-DD");
            toDate = moment().endOf("day").format("YYYY-MM-DD");
            setSelectedDateRange({ startDate: fromDate, endDate: toDate });
          }
        }
        apiUrl = `${BASE_URL}/api/v1/invoices/most-selling-products-by-category?${locationType}=${locationValue}&customFromDate=${fromDate}&customToDate=${toDate}&interval=${intervalParam}`;
        console.log(apiUrl);
        //````````https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/most-selling-products-by-category?${locationType}=${locationValue}&customFromDate=${fromDate}&customToDate=${toDate}&interval=${intervalParam}
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
    const currentMonth = moment().startOf("month");
    const currentYear = currentMonth.year();
    const fiscalStartMonth = moment().month("April").startOf("month");
    
    // Determine the start month for the first fiscal year
    let startMonth = fiscalStartMonth.clone().year(currentYear - 2);
  
    // Loop through each month for the past three fiscal years
    for (let i = 0; i < 36; i++) { // 3 years * 12 months
      const monthYearString = startMonth.format("MMMM YYYY");
      months.push(monthYearString);
      startMonth.add(1, "month"); // Move to the next month
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
    setSelectedLocation("");
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
    setSelectedLocation("");
    setSelectedInterval("Yearly");
    setSelectedCategory("zone");
    setSelectedDateRange({ startDate: null, endDate: null });
  };

  const downloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    const logoImg = new Image();
    logoImg.src = "/c.png";
    const imageWidth = 10;
    const imageHeight = 10;
    const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
    const imageY = 10;
    pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);
  
    const title = "Top Sold Category";
    const fontSize = 14;
    const textWidth =
      (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
    const textX = (pdf.internal.pageSize.width - textWidth) / 2;
    const textY = imageY + imageHeight + 10;
    pdf.setFontSize(fontSize);
    pdf.text(title, textX, textY);
    pdf.setFontSize(fontSize);
  
    // const newData = selectedInvoice !== null ? [selectedInvoice] : data;
  
    // console.log(newData);
  
    const rows = [topProducts[0]].map((data, index) => [
      index + 1,
      data[0],
      data[1],
      data[2],
      data[3]
    ]);

    console.log(rows);
  
    const textHeight = fontSize / pdf.internal.scaleFactor;
  
    const tableStartY = textY + textHeight + 10;
  
    pdf.autoTable({
      styles: {
        cellPadding: 0.5,
        fontSize: 12,
      },
      headStyles: {
        fillColor: '#3f51b5',
        textColor: '#fff',
        halign: 'center'
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle',
  
      },
      margin: {
        left: 5,
        right: 5
      },
      tableLineWidth: 1,
      head: [
        [
          "S.No",
          "Category Name",
          "Quantity Sold",
          "Distributor Name",
          "Contact Person Name"
        ],
      ],
      body: rows,
      startY: tableStartY,
    });
  
    pdf.save("Top Sold Category.pdf");
  };

 console.log([topProducts[0]]);

  return (
    <>
      <TitleCard
        title="Top Sold Categories"
        topMargin="mt-2"
        TopSideButtons2={
          <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-sm">Filters</div>
          <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box">
            <li className="flex gap-1"><select
              className="select select-bordered mx-auto my-2 select-sm w-full"
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
                    className="select select-bordered mx-auto my-2 select-sm"
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
                    className="select select-bordered mx-auto my-2 select-sm"
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
            
            </li>
            
            <li className="flex gap-1">
            <select
              className="select select-bordered mx-auto my-2 select-sm "
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
      /></li>
      <li>
      <button
        className="btn btn-primary my-2 btn-sm w-full"
        onClick={downloadPDF}
      >
        Download PDF
      </button>
      </li>
            <li>
            <button
              className="btn btn-bordered btn-sm w-full"
              onClick={resetFilters}
            >
              Reset
            </button>
            </li>

          </ul>
        </div>
        }
        TopSideButtons1={
          <>
           {(selectedInterval === "Weekly" ||
              selectedInterval === "Daily") && (
              <DatePicker
              className="input input-bordered"
              range
              // containerClassName="w-72 h-7 "
              onChange={handleDateRangeChange}
              value={selectedDateRange}
              inputClassName="input input-bordered w-56 h-7"
              toggleClassName="invisible"
            />
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
                <th>Distributer Agency Name</th>
                <th>Contact Person Name</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 && (
                <tr>
                  <td>{topProducts[0][0]}</td>
                  <td>{topProducts[0][1]}</td>
                  <td>{topProducts[0][2]}</td>
                  <td>{topProducts[0][3]}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
};

export default TopCategory;
