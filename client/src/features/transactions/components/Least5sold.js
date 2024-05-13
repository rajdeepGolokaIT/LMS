import React, { useState, useEffect } from 'react';
import moment from "moment";
import TitleCard from "../../../components/Cards/TitleCard";
import DatePicker from "react-tailwindcss-datepicker";
import { BASE_URL } from "../../../Endpoint";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Least5sold = () => {

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
    
    const financialYears = generateFinancialYears();
    const months = generateMonths().reverse(); 
  
    const fetchTopSellingProducts = async () => {
      try {
        let apiUrl;
        let fromDate, toDate, intervalParam;
        
        if (selectedInterval === "Yearly") {
          apiUrl = `${BASE_URL}/api/v1/invoices/top-least-products-by-category?interval=annually&year=${selectedYear}`;
        } else if (selectedInterval === "Monthly") {
            const monthYearArray = (selectedMonth.split(" "));
            const apiMonth = monthYearArray[0];
            const apiYear = monthYearArray[1];
          apiUrl = `${BASE_URL}/api/v1/invoices/top-least-products-by-category?interval=monthly&year=${apiYear}&month=${apiMonth.toLowerCase()}`;
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
                  setSelectedDateRange({startDate: fromDate, endDate: toDate});
              } else if(selectedInterval === "Daily"){
                  fromDate = moment().startOf("day").format("YYYY-MM-DD");
                  toDate = moment().endOf("day").format("YYYY-MM-DD");
                  setSelectedDateRange({startDate: fromDate, endDate: toDate});
              }
          //   fromDate = moment().startOf("week").format("YYYY-MM-DD");
          //   toDate = moment().endOf("week").format("YYYY-MM-DD");
          //   console.log(fromDate, toDate);
          }
          
          apiUrl = `${BASE_URL}/api/v1/invoices/top-least-products-by-category?interval=${intervalParam}&fromDate=${fromDate}&toDate=${toDate}`;
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

    const downloadPDF = () => {
      const pdf = new jsPDF('p', 'mm', 'a4');
    
      const logoImg = new Image();
      logoImg.src = "/c.png";
      const imageWidth = 10;
      const imageHeight = 10;
      const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
      const imageY = 10;
      pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);
    
      const title = "Least 5 Sold Categories";
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
    
      const rows = topProducts.map((data, index) => [
        index + 1,
        data[0],
        data[1]
        
      ]);
    
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
          ],
        ],
        body: rows,
        startY: tableStartY,
      });
    
      pdf.save("Least 5 Sold Categories.pdf");
    };

  return (
    <>
    <TitleCard
      title="Least 5 Sold Categories"
      topMargin="mt-2"
      TopSideButtons2={
        <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-sm">Filters</div>
        <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box">
          <li className="flex gap-1"><select
            className="select select-bordered mx-auto my-2 select-sm"
            onChange={handleIntervalChange}
            value={selectedInterval}
          >
            <option value="Yearly">Yearly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
            <option value="Daily">Daily</option>
          </select>{(selectedInterval === "Yearly" || selectedInterval === "Monthly") && (
            <>
              {selectedInterval === "Yearly" && (
                <select
                  className="select select-bordered my-2 mx-auto select-sm"
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
                  className="select select-bordered my-2 mx-auto select-sm"
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
          )}</li>
          <li>
      <button
        className="btn btn-primary my-2 btn-sm w-full"
        onClick={downloadPDF}
      >
        Download PDF
      </button>
      </li>
          <li><button onClick={handleReset} className="btn btn-bordered btn-sm w-full">
            Reset
          </button></li>
        </ul>
      </div>
      }
      TopSideButtons1={
        <>
        {(selectedInterval === "Weekly" || selectedInterval === "Daily") && (
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
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index}>
                <td>{product[0]}</td>
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

export default Least5sold