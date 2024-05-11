import React, { useState, useEffect } from "react";
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import PDF from "./DistributorPDF"
import Pagination from "../../../components/Input/PaginationInvoice";
import TitleCard from "../../../components/Cards/TitleCard";
import { BASE_URL } from "../../../Endpoint";
import MenuIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import Autocomplete from "../../leads/components/Autocomplete";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
import axios from "axios";


const DistributorSalesDetails = () => {


    const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [Pages, setPages] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productList, setProductList] = useState([]);
  const [productApiData, setProductApiData] = useState([]);
  const [productId, setProductId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryApiData, setCategoryApiData] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("search");
  const [selectedTimeInterval, setSelectedTimeInterval] = useState("annually");
  const [searchTerm, setSearchTerm] = useState("");
  const [invoice, setInvoice] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [distributorDetails, setDistributorDetails] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().format("MMMM"));
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "",
    endDate: "",
  });

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

    
      const fetchData = async () => {
        try {
          let apiUrl;
      let fromDate, toDate, intervalParam;

      if (selectedTimeInterval === "annually") {
          apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details?page=${currentPage.toString()}&query=${searchTerm}&productId=${productId}&categoryId=${categoryId}&invoiceNumber=${invoiceSearch}&interval=annually&year=${selectedYear}`
        } else if (selectedTimeInterval === "monthly") {
          const monthYearArray = (selectedMonth.split(" "));
          const apiMonth = monthYearArray[0];
          const apiYear = monthYearArray[1];
          apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details?page=${currentPage.toString()}&query=${searchTerm}&productId=${productId}&categoryId=${categoryId}&invoiceNumber=${invoiceSearch}&interval=monthly&year=${apiYear}&month=${apiMonth.toLowerCase()}`
        } else if (selectedTimeInterval === "weekly" || selectedTimeInterval === "daily") {
          intervalParam = "customdate"; // Set intervalParam
          
          // Set fromDate and toDate based on selectedDateRange or current week/day
          if (selectedDateRange) {
            fromDate = selectedDateRange.startDate;
            toDate = selectedDateRange.endDate;
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
          }
          apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details?page=${currentPage.toString()}&query=${searchTerm}&productId=${productId}&categoryId=${categoryId}&invoiceNumber=${invoiceSearch}&interval=${intervalParam}&customFromDate=${fromDate}&customToDate=${toDate}`
        }

        const response = await axios.get(apiUrl);
        
        console.log(response.data);
          const newData = response.data.DistributorDetails.map((item) => ({
            ...item,
            // productsLength: item.products.length,
            invoices: item.invoices.map((invoice) => {
                const [number, amount] = invoice.split(":");
                return { number: number.trim(), amount: amount.trim() };
             }),
             products: item.products.map((product) => {
               const [name, quantity] = product.split(":");
               return { name: name.trim(), quantity: quantity.trim() };
             })
            }));
            console.log(newData);
          setData(newData);
          setPages(response.data.totalPages);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      useEffect(() => {
    
        fetchData();
      }, [currentPage, searchTerm, productId, categoryId, invoiceSearch, selectedTimeInterval, selectedYear, selectedMonth, selectedDateRange]);
      

      useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchInvoiceNo();
      }, []);

      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/v1/products/productlist?size=10000`);
          setProductApiData(response.data);
          const list = response.data.map((item) => item.name);
          setProductList(list);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const fetchCategories = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/v1/categories/categorieslist?size=10000`);
          setCategoryApiData(response.data);
          const list = response.data.map((item) => item.name);
          setCategoryList(list);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const fetchInvoiceNo = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/v1/invoices/invoiceNumbers`);
          setInvoiceList(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      // console.log(invoiceList)

      const handleProductModal = (item) => {
        document.getElementById("product_Modal").showModal();
        setProducts(item.products);
      }

      const handleCategoryModal = (item) => {
        document.getElementById("category_Modal").showModal();
        setCategories(item.categories);
      }

      const handleInvoiceModal = (item) => {
        document.getElementById("invoice_Modal").showModal();
        setInvoice(item.invoices);
      }

      const handleIntervalChange = (event) => {
        setSelectedInterval(event.target.value);
        
      };
      const handleProductChange = (value) => {
        setSelectedProduct(value);
        const product = productApiData.find((item) => item.name === value)?.id;
        setProductId(product);
      };

      const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        const category = categoryApiData.find((item) => item.name === value)?.id;
        setCategoryId(category);
      };

      const handleInvoiceChange = (value) => {
        setInvoiceSearch(value);
      };

      const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };

      const handleTimeIntervalChange = (event) => {
        setSelectedTimeInterval(event.target.value);
        setSelectedDateRange({ startDate: "", endDate: "" });
      };
    
      const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
      };
    
      const handleMonthChange = (event) => {
        const selectedMonthValue = event.target.value;
        const selectedYear = selectedMonthValue.split(" ")[1];
        const selectedMonth = selectedMonthValue.split(" ")[0];
        setSelectedMonth(`${selectedMonth} ${selectedYear}`);
      };
    
      const handleDateRangeChange = (dateRange) => {
        setSelectedDateRange(dateRange);
      };

      const handleReset = () => {
        setSelectedInterval("search");
        setSelectedProduct("");
        setProductId("");
        setSelectedCategory("");
        setCategoryId("");
        setInvoiceSearch("");
        setSearchTerm("");
        setInvoice([]);
        setDistributorDetails([]);
        setSelectedDistributor(null);
        setSelectedDateRange({ startDate: "", endDate: "" });
        setSelectedYear(moment().year());
        setSelectedMonth(moment().format("MMMM"));
        setSelectedTimeInterval("annually");
        fetchData();
      };

      const handleCheckboxChange = async (e, id, interval, month, year, date) => {
        if(e.target.checked){
          try{
            let apiUrl;
            if(interval === "annually"){
              apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details/${id}?interval=annually&year=${year}`;
            } else if(interval === "monthly"){
              const monthYearArray = (month.split(" "));
          const apiMonth = monthYearArray[0];
          const apiYear = monthYearArray[1];
              apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details/${id}?interval=monthly&monthName=${apiMonth.toLowerCase()}&year=${apiYear}`;
            } else if(interval === "daily" || interval === "weekly"){
              apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details/${id}?interval=customdate&customFromDate=${date.startDate}&customToDate=${date.endDate}`;
            }

            console.log(apiUrl)
            const response = await axios.get(apiUrl);

            const newData = response.data.map((item) => ({
              ...item,
              // productsLength: item.products.length,
              invoices: item.invoices.map((invoice) => {
                  const [number, amount, date] = invoice.split(":");
                  return { number: number.trim(), amount: amount.trim(), date: date.trim() };
               }),
               products: item.products.map((product) => {
                const [name, quantity, date] = product.split(":");
                return { name: name.trim(), quantity: quantity.trim(), date: date.trim() };
             }),
             categories: item.categories.map((category) => {
              const [name, date, quantity] = category.split(":");
              return { name: name.trim(), date: date.trim(), quantity: quantity.trim() };
             }),
             interval: interval,
             month: month,
             year: year,
             date: date
            }));
            
            setDistributorDetails(newData);
          } catch(error){
            console.error("Error fetching data:", error);
          }
          setSelectedDistributor(id);
        } else {
          setSelectedDistributor(null);
          setDistributorDetails([]);
        }
      }

      console.log(distributorDetails)

      // const handleDateRangeChange = (dateRange) => {
      //   setSelectedDateRange(dateRange);
      // };
  

      const options = {
        filename: "distributor-sales-details.pdf",
        method: "save",
        resolution: Resolution.EXTREME,
        page: {
          margin: Margin.SMALL,
          // format: "A4",
          // orientation: "landscape"
        },
        canvas: {
          mimeType: "image/jpeg",
          qualityRatio: 1
        },
        overrides: {
          pdf: {
            compress: true
          },
          canvas: {
            useCORS: true
          }
        }
      };
const getTargetElement = () => document.getElementById('print');

const downloadPdf = () => generatePDF(getTargetElement, options);

  return (
    <>
    <TitleCard
      title="Distributor Sales Details"
      TopSideButtons2={
        <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="">
          <MenuIcon className="btn btn-sm btn-circle"/>
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box">
        <li className="flex gap-1">
            <select
            className="select select-bordered mx-auto my-2 select-sm w-full"
            onChange={handleTimeIntervalChange}
            value={selectedTimeInterval}
          >
            <option value="annually">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
          {(selectedTimeInterval === "annually" || selectedTimeInterval === "monthly") && (
            <>
              {selectedTimeInterval === "annually" && (
                <select
                  className="select select-bordered my-2 mx-auto select-sm w-36"
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
              {selectedTimeInterval === "monthly" && (
                <select
                  className="select select-bordered my-2 mx-auto select-sm w-36"
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
            className="select select-bordered mx-auto my-2 select-sm w-36"
            onChange={handleIntervalChange}
            value={selectedInterval}
          >
            <option value="search">Search Terms</option>
            <option value="category">Category Wise</option>
            <option value="product">Product Wise</option>
            <option value="invoice">Invoice No. Wise</option>
          </select>
          {selectedInterval === "product" && (
          <Autocomplete
          items={productList}
          value={selectedProduct}
          onChange={handleProductChange}/>
        )}
        {selectedInterval === "category" && (
          <Autocomplete
          items={categoryList}
          value={selectedCategory}
          onChange={handleCategoryChange}/>
        )}
        {selectedInterval === "search" && (
          <input
          type="text"
          className="input input-sm input-bordered mx-auto my-2 w-40"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        )}
        {selectedInterval === "invoice" && (
         <Autocomplete
         items={invoiceList}
         value={invoiceSearch}
         onChange={handleInvoiceChange}/>
       
        )}
          </li>
          {selectedDistributor && (
        <li>
          <button className="btn btn-sm w-full" onClick={downloadPdf}>Generate PDF</button>
      </li>
      )}
      {/* {selectedDistributor && ( */}
        <li>
            <button className="btn btn-sm w-full" onClick={handleReset}>Reset</button>
          </li>
      {/* )} */}
          
        </ul>
      </div>
      }
      TopSideButtons1={
        <>
         {(selectedTimeInterval === "weekly" || selectedTimeInterval === "daily") && (
           <Datepicker
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
         <div
          className="overflow-x-auto w-full"
        //   style={{ overflowY: "auto", maxHeight: "450px" }}
        >
        <table className="table table-zebra-zebra table-xs">
            <thead>
            <tr className="table-row text-center">
                <th className="table-cell">Select</th>
                <th className="table-cell">Serial Number</th>
                <th className="table-cell">Distributor Name</th>
                <th className="table-cell">Contace Person</th>
                {/* <th className="table-cell">Number of Products</th> */}
                <th className="table-cell">Products</th>
                <th className="table-cell">Categories</th>
                <th className="table-cell">Invoices</th>
                <th className="table-cell">City</th>
                <th className="table-cell">Region</th>
                <th className="table-cell">Zone</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr className="table-row text-center" key={index}>
                    <td className="table-cell">
                    <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    onChange={(e) => handleCheckboxChange(e, item.id, selectedTimeInterval, selectedMonth, selectedYear, selectedDateRange)}
                    checked={selectedDistributor === item.id}
                    />
                    </td>
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{item.agencyname}</td>
                    <td className="table-cell">{item.contactperson}</td>
                    {/* <td className="table-cell">{item.productsLength}</td> */}
                    <td className="table-cell"><button className="btn btn-sm btn-primary" onClick={() => handleProductModal(item)}>View</button></td>
                    <td className="table-cell"><button className="btn btn-sm btn-primary" onClick={() => handleCategoryModal(item)}>View</button></td>
                    <td className="table-cell"><button className="btn btn-sm btn-primary" onClick={() => handleInvoiceModal(item)}>View</button></td>
                    <td className="table-cell">{item.city}</td>
                    <td className="table-cell">{item.region}</td>
                    <td className="table-cell">{item.zone}</td>
                    </tr>
            ))}
            </tbody>
            </table>
            <Pagination
          nPages={Pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        </div>
      </TitleCard>
      {selectedDistributor > 0 && (
        <div id="print" className="">
      <PDF data={distributorDetails}/>
      </div>
      )}
      
      <dialog id="product_Modal" className="modal">
        <div className="modal-box">
          <TitleCard title="Products">
            <div className="overflow-x-auto w-full">
              {products.length > 0 ? (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Products Found!!!</p>
              )}
            </div>
          </TitleCard>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("product_Modal").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="category_Modal" className="modal">
        <div className="modal-box">
          <TitleCard title="Categories">
            <div className="overflow-x-auto w-full">
              {categories.length > 0 ? (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>Category Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Categories Found!!!</p>
              )}
            </div>
          </TitleCard>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("category_Modal").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="invoice_Modal" className="modal">
        <div className="modal-box">
          <TitleCard title="Invoices">
            <div className="overflow-x-auto w-full">
              {invoice.length > 0 ? (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>Invoice Number</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.number}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Invoices Found!!!</p>
              )}
            </div>
          </TitleCard>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("invoice_Modal").close()}  
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
      </>
  )
}

export default DistributorSalesDetails