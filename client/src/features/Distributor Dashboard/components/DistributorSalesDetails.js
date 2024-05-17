import React, { useState, useEffect, useRef } from "react";
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
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryApiData, setCategoryApiData] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [valueDistributor, setValueDistributor] = useState("");
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

  const [searchDistributor, setSearchDistributor] = useState("");
  const [searchPerson, setSearchPerson] = useState("");
  const [agency, setAgency] = useState("");
  const [salespersonList, setSalespersonList] = useState([]);

  const ref = useRef();

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
          apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details/by-filters?page=${currentPage.toString()}&query=${searchTerm}&productName=${productName}&categoryName=${categoryName}&invoiceNumber=${invoiceSearch}&distributor=${searchDistributor}&salespersonName=${searchPerson}&interval=annually&year=${selectedYear}`
        } else if (selectedTimeInterval === "monthly") {
          const monthYearArray = (selectedMonth.split(" "));
          const apiMonth = monthYearArray[0];
          const apiYear = monthYearArray[1];
          apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details/by-filters?page=${currentPage.toString()}&query=${searchTerm}&productName=${productName}&categoryName=${categoryName}&invoiceNumber=${invoiceSearch}&distributor=${searchDistributor}&salespersonName=${searchPerson}&interval=monthly&year=${apiYear}&month=${apiMonth.toLowerCase()}`
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
          apiUrl = `${BASE_URL}/api/v1/invoices/distributors/details/by-filters?page=${currentPage.toString()}&query=${searchTerm}&productName=${productName}&categoryName=${categoryName}&invoiceNumber=${invoiceSearch}&distributor=${searchDistributor}&salespersonName=${searchPerson}&interval=${intervalParam}&customFromDate=${fromDate}&customToDate=${toDate}`
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
      }, [currentPage, searchTerm, productName, categoryName, selectedCategory, selectedProduct, invoiceSearch , searchDistributor,searchPerson, selectedTimeInterval, selectedYear, selectedMonth, selectedDateRange]);
      
      
      useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchInvoiceNo();
        fetchDistributors();
        fetchSalespersons();
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
      
      const fetchDistributors = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/v1/distributorProfiles/distributorslist?size=10000`);
          const list = response.data.map((item) => item.name);
          setAgencyList(list);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const fetchSalespersons = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/v1/salespersons/salespersonlist`);
          setSalespersonList(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      // console.log(agencyList);

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
        const product = productApiData.find((item) => item.name === value)?.name;
        setProductName(product ? product : "");
      };

      const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        const category = categoryApiData.find((item) => item.name === value)?.name;
        setCategoryName(category ? category : "");
      };

      const handleInvoiceChange = (value) => {
        setInvoiceSearch(value);
      };

      const handleSearchDistributor = (value) => {
        setValueDistributor(value);
        if (value) {
          const name = agencyList.find((item) => item === value);
          console.log(name);
          setSearchDistributor(name ? name : "");
        } else if (agency) {
          setSearchDistributor(agency);
        }
      }
      
      // Call this function on the input change event
      const handleInputChange = (value) => {
        handleSearchDistributor(value);
      }
      
      useEffect(() => {
        // Update searchDistributor based on agency changes
        if (agency) {
          setSearchDistributor(agency);
        } 
      }, [agency]);
      
      const handleSearchPerson = (value) => {
        setSearchPerson(value);
      }
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
        setProductName("");
        setSelectedCategory("");
        setCategoryName("");
        setInvoiceSearch("");
        setSearchTerm("");
        setInvoice([]);
        setDistributorDetails([]);
        setSelectedDistributor(null);
        setSelectedDateRange({ startDate: "", endDate: "" });
        setSelectedYear(moment().year());
        setSelectedMonth(moment().format("MMMM"));
        setSelectedTimeInterval("annually");
        setSearchDistributor("");
        setSearchPerson("");
        setValueDistributor("");
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
            setAgency(newData[0].agencyname);
          } catch(error){
            console.error("Error fetching data:", error);
          }
          setSelectedDistributor(id);
          // setAgency(agencyName);
        } else {
          setSelectedDistributor(null);
          setAgency("");
          setDistributorDetails([]);
        }
      }

      useEffect(() => {
        if (selectedDistributor) {
          // Fetch distributor details when selectedDistributor changes...
          handleCheckboxChange(
            { target: { checked: true } },
            selectedDistributor,
            selectedTimeInterval,
            selectedMonth,
            selectedYear,
            selectedDateRange
          );
        }
      }, [selectedDistributor, selectedTimeInterval, selectedMonth, selectedYear, selectedDateRange]);




const downloadPDF = async (id, interval, month, year, date) => {
  try {
    let apiUrl;
    if(interval === "annually"){
      apiUrl = `${BASE_URL}/api/v1/invoices/invoices/distributor/${id}/pdf?interval=annually&year=${year}`;
    } else if(interval === "monthly"){
      const monthYearArray = (month.split(" "));
  const apiMonth = monthYearArray[0];
  const apiYear = monthYearArray[1];
      apiUrl = `${BASE_URL}/api/v1/invoices/invoices/distributor/${id}/pdf?interval=monthly&monthName=${apiMonth.toLowerCase()}&year=${apiYear}`;
    } else if(interval === "daily" || interval === "weekly"){
      apiUrl = `${BASE_URL}/api/v1/invoices/invoices/distributor/${id}/pdf?interval=customdate&customFromDate=${date.startDate}&customToDate=${date.endDate}`;
    }

    console.log(apiUrl)
    const response = await axios.get(apiUrl, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Distributor_Sales_Details.pdf'); // Replace with the desired file name
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch(error){
    console.error("Error fetching data:", error);
  }
}

console.log(selectedCategory)


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
            className={`select select-bordered mx-auto my-2 select-sm ${selectedTimeInterval === "weekly" || selectedTimeInterval === "daily" ? "w-full" : "w-28"}`}
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
          {(selectedTimeInterval === "weekly" || selectedTimeInterval === "daily") && (
           <Datepicker
           className="input input-bordered"
           range
           containerClassName="h-7 mb-2"
           onChange={handleDateRangeChange}
           value={selectedDateRange}
           inputClassName="input input-bordered input-sm w-60"
           toggleClassName="invisible"
         />
        )}
        
          </li>
          {selectedDistributor && (
        <li>
          <button className="btn btn-primary btn-sm w-full mx-auto my-2" onClick={() => downloadPDF(selectedDistributor, selectedTimeInterval, selectedMonth, selectedYear, selectedDateRange)}>Generate PDF</button>
      </li>
      )}
        <li>
            <button className="btn btn-sm w-full mx-auto my-2" onClick={handleReset}>Reset</button>
          </li>
          
        </ul>
      </div>
      }
      TopSideButtons1={
        <>
        
         <input
          type="text"
          className="input input-sm input-bordered w-48"
          placeholder="City/Region/Zone Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        </>
      }
    >
         <div
          className="overflow-x-auto w-full"
        //   style={{ overflowY: "auto", maxHeight: "450px" }}
        >
        <table className="table table-zebra-zebra table-xs">
            <thead>
            <tr className="table-row">
                <th className="table-cell">Select</th>
                <th className="table-cell">Serial Number</th>
                <th className="table-cell">
                  <Autocomplete
          type="text"
          className="input input-xs input-bordered placeholder:text-center w-36"
          disabled={invoiceSearch || selectedCategory || selectedProduct ? true : null}
          placeholder={"Distributor Name"}
          items={agencyList}
          value={valueDistributor || searchDistributor}
          onChange={handleInputChange}
        /></th>
                <th className="table-cell">
                <Autocomplete
          className="input input-xs input-bordered placeholder:text-center w-36"
          items={salespersonList}
          placeholder={"Sales Person Name"}
          value={searchPerson}
          onChange={handleSearchPerson}
        />
                </th>
                {/* <th className="table-cell">Number of Products</th> */}
                <th className="table-cell">
                <Autocomplete
                className="input input-bordered input-xs placeholder:text-center w-36"
                disabled={searchDistributor || selectedCategory || invoiceSearch ? true : null}
                placeholder={"Products"}
          items={productList}
          value={selectedProduct}
          onChange={handleProductChange}/>
                </th>
                <th className="table-cell">
                <Autocomplete
                className="input input-bordered input-xs placeholder:text-center w-36"
                disabled={searchDistributor || invoiceSearch || selectedProduct ? true : null}
                placeholder={"Categories"}
          items={categoryList}
          value={selectedCategory}
          onChange={handleCategoryChange}/>
                </th>
                <th className="table-cell">
                <Autocomplete
                className={`input input-bordered input-xs placeholder:text-center w-36`}
                disabled={searchDistributor || selectedCategory || selectedProduct ? true : null}
                placeholder={"Invoices"}
         items={invoiceList}
         value={invoiceSearch}
         onChange={handleInvoiceChange}/>
                </th>
                <th className="table-cell text-center">
                City
                </th>
                <th className="table-cell text-center">
                Region
                </th>
                <th className="table-cell text-center">
                Zone
                </th>
            </tr>
            </thead>
            <tbody>
              {data.length === 0 && <tr className="table-row"><td className="text-center text-xl font-bold text-gray-300 dark:text-gray-700" colSpan={9}>No data available</td></tr>}
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
                    <td className="table-cell">{item.salespersonName}</td>
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
      {distributorDetails.length > 0 && (
        <div id="pdf-content" ref={ref}>
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