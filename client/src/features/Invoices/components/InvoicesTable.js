import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import TitleCard from "../../../components/Cards/TitleCard";
import DatePicker from "react-tailwindcss-datepicker";
import InvoiceUpdateProducts from "./InvoiceUpdateProducts";
import Pagination from "../../../components/Input/PaginationInvoice";
import MenuIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import { BASE_URL } from "../../../Endpoint";
import jsPDF from "jspdf";
import "jspdf-autotable";


const TableComponent = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage] = useState(10);
  // const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const [ewayTableData, setEwayTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [salesPersons, setSalesPersons] = useState([]);
  const [fetchInvoiceNo, setFetchInvoiceNo] = useState([]);
  const [fetchIrnNo, setFetchIrnNo] = useState([]);
  const [invoiceExists, setInvoiceExists] = useState(false);
  const [irnExists, setIrnExists] = useState(false);
  const [Pages, setPages] = useState(null);
  const [isReceived, setIsReceived] = useState("");



  useEffect(() => {
    
    fetchData();
  }, [currentPage, searchTerm, isReceived]);
  
  const fetchData = async () => {
    try {
      const url = `${BASE_URL}/api/v1/invoices/all-pages?page=${currentPage.toString()}&selectQuery=${searchTerm}&isReceived=${isReceived.toString()}`
      console.log(url)
      const response = await axios.get(url);
      console.log(response.data)
      setData(response.data.invoices);
      // setCurrentPage(response.data.currentPage);
      setPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(isReceived)

  useEffect(() => {
    // Fetch distributors and products when component mounts
    fetchDistributors();
    fetchSalesPersons();
    fetchInvoiceNumber();
    fetchIrn();
    // fetchProducts(); // Uncomment this line if you need products
  }, []);

  const fetchDistributors = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/distributors/all`
      );
      setDistributors(response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  const fetchSalesPersons = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/salespersons/all`
      );
      setSalesPersons(response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      // Handle error, show error message to the user, etc.
    }
  };


  const handleDelete = async () => {
    try {
      // Iterate over selectedInvoices array and delete each invoice
      for (const id of selectedInvoices) {
        await axios.delete(
          `${BASE_URL}/api/v1/invoices/delete-invoice/${id}`
        );
      }
      // Clear selectedInvoices array after successful deletion
      setSelectedInvoices([]);
      // Reload data after deletion
      // const response = await axios.get(
      //   `${BASE_URL}/api/v1/invoices/all`
      // );
      // setData(response.data.reverse());
      fetchData();

    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  console.log(selectedInvoice);
  console.log(selectedInvoices);
  const handleUpdate = (invoice) => {
    setSelectedInvoice(invoice);
    document.getElementById("update_modal").showModal();
  };

  const handleProduct = (invoice) => {
    setSelectedInvoice(invoice);
    document.getElementById("product_modal").showModal();
  };
  const handleEway = (invoice) => {
    setSelectedInvoice(invoice);
    document.getElementById("eway_modal").showModal();
  };

  const handleCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      // Set selectedInvoice to the invoice object when checkbox is checked
      setSelectedInvoice(data.find((invoice) => invoice.id === id));
      // Add the id to the selectedInvoices array
      setSelectedInvoices([id]);
    } else {
      // Remove the id from the selectedInvoices array
      setSelectedInvoices(
        selectedInvoices.filter((invoiceId) => invoiceId !== id)
      );
      setEwayTableData([]);
    }
  };

  const handleUpdateInvoice = async () => {
    try {
      const params = new URLSearchParams();
      for (const key in selectedInvoice) {
        params.append(key, selectedInvoice[key]);
      }
      console.log(params.toString());
      await axios.put(
        `${BASE_URL}/api/v1/invoices/update-invoice/${selectedInvoices[0]}`,
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Invoice updated successfully");
      document.getElementById("update_modal").close();
      document.getElementById("update_modal_2").showModal();


      fetchData();

    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  console.log(selectedInvoice);

  const invoiceProduct = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/invoices/get-invoice-products-by-id/${selectedInvoices[0]}`
      );
      setInvoiceProducts(response.data);
      console.log("Selected Invoice Products:" + response.data);
    } catch (error) {
      console.error("Error fetching invoice products:", error);
    }
  };

  useEffect(() => {
    invoiceProduct();
  }, [selectedInvoices]);

  // console.log(invoiceProducts);
  // console.log(selectedInvoice);
  // console.log(selectedInvoices[0]);

  useEffect(() => {
    const fetchEwayBills = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/eways/invoice/${selectedInvoices}`
        );

        if (response.data != []) {
          setEwayTableData(response.data);
        } else {
          setEwayTableData([]);
          console.log("Eway Bill not found for invoiceID:", selectedInvoices);
        }
      } catch (error) {
        console.error("Error fetching Eway Bills:", error);
      }
    };

    fetchEwayBills();
  }, [selectedInvoices]);

  const handleIsReceivedToggle = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/invoices/invoice-received-status?id=${selectedInvoices[0]}`
      );
      console.log(response);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

 
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };

    const handleIsReceivedChange = (event) => {
      setIsReceived(event.target.value);
    };
    
  const fetchInvoiceNumber = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/invoices/invoiceNumbers`);
      
      setFetchInvoiceNo(response.data)
    } catch (error) {
      console.error('Error fetching invoice number:', error);
    }
  };

  const fetchIrn = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/invoices/irns`);
      setFetchIrnNo(response.data)
    } catch (error) {
      console.error('Error fetching IRN:', error);
    }
  };

//  console.log(fetchIrnNo)

  const handleInvoiceNumberChange = (e) => {
    setSelectedInvoice({
      ...selectedInvoice,
      invoiceNumber: parseInt(e.target.value)
    });
    const check = fetchInvoiceNo.includes(e.target.value)
    setInvoiceExists(check)
  };
  
  const handleIrnChange = (e) => {
    setSelectedInvoice({
      ...selectedInvoice,
      irn: parseInt(e.target.value)});
    const check = fetchIrnNo.includes(e.target.value)
    setIrnExists(check)
  };

const downloadPDF = () => {
  const pdf = new jsPDF('l', 'mm', 'a4');

  const logoImg = new Image();
  logoImg.src = "/c.png";
  const imageWidth = 10;
  const imageHeight = 10;
  const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
  const imageY = 10;
  pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);

  const title = "Invoice Report";
  const fontSize = 14;
  const textWidth =
    (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
  const textX = (pdf.internal.pageSize.width - textWidth) / 2;
  const textY = imageY + imageHeight + 10;
  pdf.setFontSize(fontSize);
  pdf.text(title, textX, textY);
  pdf.setFontSize(fontSize);

  const rows = data.map((data, index) => [
    index + 1,
    // data.id,
    data.invoiceNumber,
    moment(data.createDate).format("DD/MM/YYYY"),
    data.distributor.distributorProfile.agencyName,
    data.distributor.distributorProfile.gstNo,
    `INR ${parseFloat(data.discountPrice).toFixed(2)}`,
    `INR ${parseFloat(data.totalAmount).toFixed(2)}`,
    `INR ${parseFloat(data.igst).toFixed(2)}`,
    `INR ${parseFloat(data.cgst).toFixed(2)}`,
    `INR ${parseFloat(data.sgst).toFixed(2)}`,
    `INR ${parseFloat(data.amount).toFixed(2)}`,
    salesPersons.find((salesPerson) => salesPerson.id === data.salespersonId)?.name || "NOT ASSIGNED",
    `${data.distributor.distributorProfile.city},${data.distributor.distributorProfile.region},${data.distributor.distributorProfile.zone}`,
    
    data.eway === null ? "Pending..." : data.eway,
    data.irn === null ? "Pending..." : data.irn,
    // data.ackNo === null ? "Pending..." : data.ackNo,
    // data.dispatchedThrough === null ? "Pending..." : data.dispatchedThrough,
    // moment(data.createDate).format("DD/MM/YYYY"),
    // moment(data.updateDate).format("DD/MM/YYYY")
    
  ]);

  const textHeight = fontSize / pdf.internal.scaleFactor;

  const tableStartY = textY + textHeight + 10;

  pdf.autoTable({
    styles: {
      cellPadding: 0.5,
      fontSize: 10,
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
        "Serial No.",
        // "ID",
        "Invoice No.",
        "Invoice Date",
        "Distributor Name",
        "Distributor GSTIN",
        "Discount Amount",
        "Total Net Amount",
        "IGST",
        "CGST",
        "SGST",
        "Total Amount",
        "Sales Person Name",
        "City,Region/State,Zone",
        // "",
        // "",
        "Ewaybill No.",
        "IRN",
        // "Ack No.",
        // "Dispatched Through",
        // "Create Date",
        // "Update Date",
      ],
    ],
    body: rows,
    startY: tableStartY,
  });

  pdf.save("Invoices_report.pdf");
};

const getIndicatorColor = (invoiceDate) => {
  const daysDifference = moment().diff(moment(invoiceDate), 'days');
  if (daysDifference < 30) {
    return 'bg-green-500';
  } else if (daysDifference < 45) {
    return 'bg-yellow-500';
  } else if (daysDifference < 60) {
    return 'bg-orange-500';
  } else if (daysDifference < 90) {
    return 'bg-red-600';
  } else {
    return 'bg-red-900';
  }
};

  return (
    <>
      <TitleCard
        title="Invoices Table"
        topMargin="mt-2"
        TopSideButtons1={
          <>
            <input
              type="text"
              className="input input-sm input-bordered"
              // oninput={() => setPattern(this)}
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            
          </>
        }
        TopSideButtons2={
          <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="">
            <MenuIcon className="btn btn-sm btn-circle"/>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box">
            <li>
            <button className="btn btn-primary btn-sm mx-auto my-2 min-w-max" onClick={downloadPDF}>
          Download PDF
        </button>
            </li>
            <li>
              <button
            className={`btn btn-sm  mx-auto my-2 w-full ${
              selectedInvoices.length === 0 ? "btn-disabled" : "btn-primary "
            } mr-2`}
            onClick={handleUpdate}
          >
            Update
          </button>
            </li>
            <li>
              <button
              className={`btn btn-sm mx-auto my-2 w-full ${
                selectedInvoices.length === 0 ? "btn-disabled" : "btn-error "
              } mr-2`}
              onClick={handleDelete}
            >
              Delete
            </button>
            </li>
            <li>
              <button className={`btn btn-sm w-full mx-auto my-2 ${selectedInvoices.length === 0 ? "btn-disabled" : "btn-success"}`} onClick={handleProduct}>
            View Products
          </button>
            </li>
            <li>
              <button className={`btn btn-sm w-full mx-auto my-2 ${selectedInvoices.length === 0 ? "btn-disabled" : "btn-success"}`} onClick={handleEway}>
            View Eway Bill
          </button>
            </li>
            <li>
              <button className={`btn btn-sm w-full mx-auto my-2 ${selectedInvoices.length === 0 ? "btn-disabled" : "btn-info"}`} onClick={handleIsReceivedToggle}>
                Paid / Unpaid
                </button>
            </li>
            <li>
            <select
              className="select select-sm mx-auto my-2 max-w-xs"
              onChange={handleIsReceivedChange}
              value={isReceived}
            >
              <option value="">All Invoices</option>
              <option value="true">Paid Invoices</option>
              <option value="false">Unpaid Invoices</option>
            </select>
            </li>

            </ul>
            </div>
          
        }
        
      >
        <div
          className="overflow-x-auto w-full"
          style={{ overflowY: "auto", maxHeight: "450px" }}
        >
          <table className="table table-sm table-zebra-zebra">
            <thead>
              <tr className="table-row text-center">
                <th className="table-cell">Select</th>
                <th className="table-cell">Indicator</th>
                <th className="table-cell">ID</th>
                <th className="table-cell">Invoice No.</th>
                <th className="table-cell">Invoice Date</th>
                <th className="table-cell">Distributor Name</th>
                <th className="table-cell">Distributor GSTIN</th>
                <th className="table-cell">Payment Received</th>
                {/* <th className="table-cell">{`Discount(%)`}</th> */}
                <th className="table-cell">Discount Amount</th>
                <th className="table-cell">Total Net Amount</th>
                <th className="table-cell">IGST</th>
                <th className="table-cell">CGST</th>
                <th className="table-cell">SGST</th>
                <th className="table-cell">Total Amount</th>
                <th className="table-cell">Sales Person Name</th>
                <th className="table-cell">City</th>
                <th className="table-cell">Region/State</th>
                <th className="table-cell">Zone</th>
                <th className="table-cell">Ewaybill No.</th>
                <th className="table-cell">IRN</th>
                <th className="table-cell">Ack No.</th>
                <th className="table-cell">Dispatched Through</th>
                {/* <th className="table-cell">Create Date</th> */}
                <th className="table-cell">Update Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((invoice) => (
                <tr key={invoice.id} className="table-row">
                  <td className="table-cell">
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={(e) => handleCheckboxChange(e, invoice.id)}
                        checked={selectedInvoices.includes(invoice.id)}
                      />
                    </label>
                  </td>
                   <td className="table-cell">
                     <div
                     className={`w-3 h-3 rounded-full m-3 animate-pulse border-gray-300 grid border ${
                     getIndicatorColor(invoice.invoiceDate)
                      }`}
                     ></div>
                    </td>
                  <td className="table-cell">{invoice.id}</td>
                  <td className="table-cell">{invoice.invoiceNumber}</td>
                  <td className="table-cell">
                    {moment(invoice.invoiceDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="table-cell">
                    {invoice.distributor.distributorProfile.agencyName}
                  </td>
                  <td className="table-cell">
                    {invoice.distributor.distributorProfile.gstNo}
                  </td>
                  <td className="table-cell">
                    {invoice.isReceived === true ? "Yes" : "No"}
                  </td>
                  {/* <td className="table-cell">{invoice.discountPercentage}%</td> */}
                  <td className="table-cell">
                    INR {parseFloat(invoice.discountPrice).toFixed(2)}{" "}
                  </td>
                  <td className="table-cell">
                    INR {parseFloat(invoice.totalAmount).toFixed(2)}{" "}
                  </td>
                  <td className="table-cell">
                    INR {parseFloat(invoice.igst).toFixed(2)}{" "}
                  </td>
                  <td className="table-cell">
                    INR {parseFloat(invoice.cgst).toFixed(2)}{" "}
                  </td>
                  <td className="table-cell">
                    INR {parseFloat(invoice.sgst).toFixed(2)}{" "}
                  </td>
                  <td className="table-cell">
                    INR {parseFloat(invoice.amount).toFixed(2)}{" "}
                  </td>
                  <td className="table-cell">
                    {salesPersons.find(
                      (salesPerson) => salesPerson.id === invoice.salespersonId
                    )?.name || "NOT ASSIGNED"}
                  </td>
                  <td className="table-cell">
                    {invoice.distributor.distributorProfile.city}
                  </td>
                  <td className="table-cell">
                    {invoice.distributor.distributorProfile.region}
                  </td>
                  <td className="table-cell">
                    {invoice.distributor.distributorProfile.zone}
                  </td>
                  <td className="table-cell">
                    {invoice.eway === null ? "Pending..." : invoice.eway}
                  </td>
                  <td className="table-cell">
                    {invoice.irn === null ? "Pending..." : invoice.irn}
                  </td>
                  <td className="table-cell">
                    {invoice.ackNo === null ? "Pending..." : invoice.ackNo}
                  </td>
                  <td className="table-cell">
                    {invoice.dispatchedThrough === null
                      ? "Pending..."
                      : invoice.dispatchedThrough}
                  </td>
                  {/* <td className="table-cell">
                    {moment(invoice.createDate).format("DD/MM/YYYY")}
                  </td> */}
                  <td className="table-cell">
                    {moment(invoice.updateDate).format("DD/MM/YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        <Pagination
          nPages={Pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          // loading={loading}
        />
        </div>
      </TitleCard>

      {/* Modal for update */}
      {selectedInvoice && (
        <>
          <dialog id="update_modal" className="modal">
            <div className="modal-box w-11/12 max-w-7xl">
              <h3 className="font-bold text-lg">Update Invoice</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="invoiceNumber"
                    className="label label-text text-base"
                  >
                    Invoice Number:
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Invoice Number"
                    className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    id="invoiceNumber"
                    value={selectedInvoice.invoiceNumber}
                    onChange={handleInvoiceNumberChange}
                  />
                   {invoiceExists && <p className="label label-text text-base">This invoice number exists.</p>}
                </div>

                <div>
                  <label htmlFor="irn" className="label label-text text-base">
                    IRN:
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="IRN"
                    className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    id="irn"
                    value={selectedInvoice.irn}
                    onChange={handleIrnChange}
                  />
                   {irnExists && <p className="label label-text text-base">This IRN exists.</p>} 
                </div>

                <div>
                  <label htmlFor="ackNo" className="label label-text text-base">
                    Ack No.:
                  </label>
                  <input
                    type="text"
                    placeholder="Ack No."
                    className="w-full input input-bordered input-primary"
                    id="ackNo"
                    value={selectedInvoice.ackNo}
                    onChange={(e) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        ackNo: e.target.value,
                      });
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="dispatchedThrough"
                    className="label label-text text-base"
                  >
                    Dispatched Through:
                  </label>
                  <input
                    type="text"
                    placeholder="Dispatched Through"
                    className="w-full input input-bordered input-primary"
                    id="dispatchedThrough"
                    value={selectedInvoice.dispatchedThrough}
                    onChange={(e) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        dispatchedThrough: e.target.value,
                      });
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="termsOfDelivery"
                    className="label label-text text-base"
                  >
                    Terms of Delivery:
                  </label>
                  <input
                    type="text"
                    placeholder="Terms of Delivery"
                    className="w-full input input-bordered input-primary"
                    id="termsOfDelivery"
                    value={selectedInvoice.termsOfDelivery}
                    onChange={(e) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        termsOfDelivery: e.target.value,
                      });
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="salespersonId"
                    className="label label-text text-base"
                  >
                    Salesperson Name:
                  </label>
                  <select
                    className="w-full select select-bordered select-primary"
                    id="salespersonId"
                    value={selectedInvoice.salespersonId}
                    onChange={(e) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        salespersonId: parseInt(e.target.value),
                      });
                    }}
                  >
                    <option value="">Select Salesperson Name</option>
                    {salesPersons.map((salesperson) => (
                      <option key={salesperson.id} value={salesperson.id}>
                        {salesperson.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="destination"
                    className="label label-text text-base"
                  >
                    Destination:
                  </label>
                  <input
                    type="text"
                    placeholder="Destination"
                    className="w-full input input-bordered input-primary"
                    id="destination"
                    value={selectedInvoice.destination}
                    onChange={(e) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        destination: e.target.value,
                      });
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="deliveryDate"
                    className="label label-text text-base"
                  >
                    Delivery Date:
                  </label>
                  <DatePicker
                    inputClassName="w-full input input-bordered input-primary"
                    useRange={false}
                    asSingle={true}
                    displayFormat={"DD/MM/YYYY"}
                    value={{
                      startDate: selectedInvoice.deliveryDate,
                      endDate: selectedInvoice.deliveryDate,
                    }}
                    onChange={(date) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        deliveryDate: date.startDate,
                      });
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="invoiceDate"
                    className="label label-text text-base"
                  >
                    Invoice Date:
                  </label>
                  <DatePicker
                    inputClassName="w-full input input-bordered input-primary"
                    useRange={false}
                    asSingle={true}
                    displayFormat={"DD/MM/YYYY"}
                    value={{
                      startDate: selectedInvoice.invoiceDate,
                      endDate: selectedInvoice.invoiceDate,
                    }}
                    onChange={(date) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        invoiceDate: date.startDate,
                      });
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="purchaseNumber"
                    className="label label-text text-base"
                  >
                    Purchase Number:
                  </label>
                  <input
                    type="text"
                    placeholder="Purchase Number"
                    className="w-full input input-bordered input-primary"
                    id="purchaseNumber"
                    value={selectedInvoice.purchaseNumber}
                    onChange={(e) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        purchaseNumber: e.target.value,
                      });
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="supplierName"
                    className="label label-text text-base"
                  >
                    Supplier Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Supplier Name"
                    className="w-full input input-bordered input-primary"
                    id="supplierName"
                    value={selectedInvoice.supplierName}
                    onChange={(e) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        supplierName: e.target.value,
                      });
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="vehicleNo"
                    className="label label-text text-base"
                  >
                    Vehicle No:
                  </label>
                  <input
                    type="text"
                    pattern="^[A-Za-z]{2}\d{2}[A-Za-z]{1,2}\d{4}$"
                    title="Vehicle No Format: AA11A1111 or AA11AA1111"
                    placeholder="Vehicle No (Eg. AA11A1111 or AA11AA1111)"
                    className="w-full input input-bordered input-primary"
                    id="vehicleNo"
                    value={selectedInvoice.vehicleNo}
                    onChange={(e) => {
                      // Handle changes to input field and update selectedInvoice
                      setSelectedInvoice({
                        ...selectedInvoice,
                        vehicleNo: e.target.value.toUpperCase(),
                      });
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="distributorId"
                  className="label label-text text-base"
                >
                  Distributor:
                </label>
                <select
                  id="distributorId"
                  className="w-full input input-bordered input-primary"
                  value={selectedInvoice.distributor?.id}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      distributorId: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value="">Select Distributor</option>
                  {distributors.map((distributor) => (
                    <option key={distributor.id} value={distributor.id}>
                      {distributor.distributorProfile.agencyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
              <label
                  htmlFor="isReceived"
                  className="label label-text text-base"
                >
                  Payment Received:
                </label>
                <select
                  id="isReceived"
                  className="w-full input input-bordered input-primary"
                  value={selectedInvoice.isReceived}
                  onChange={(e) => {
                    setSelectedInvoice({
                      ...selectedInvoice,
                      isReceived: e.target.value === "true" ? true : false,
                    });
                  }}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              {/* Add other input fields for editing */}
              <div className="modal-action">
                <button className="btn" onClick={handleUpdateInvoice}>
                  Update Invoice
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    document.getElementById("update_modal").close()
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>

          <dialog id="update_modal_2" className="modal">
            <div className="modal-box w-5/6 max-w-5xl">
              <TitleCard
                title="Update Products of the Invoice"
                topMargin="mt-2"
              >
                <div className="w-full p-6 m-auto bg-base-200 rounded-lg shadow-lg">
                  <InvoiceUpdateProducts invoiceId={selectedInvoices} />
                </div>
              </TitleCard>
            </div>
          </dialog>

          <dialog id="product_modal" className="modal">
            <div className="modal-box">
              <TitleCard title="Invoice Product Table">
                <div className="overflow-x-auto w-full">
                  {invoiceProducts.length > 0 ? (
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Price Per Unit</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceProducts.map((product) => (
                          <tr>
                            <td>{product[0].productName}</td>
                            <td>{product[0].price}</td>
                            <td>{product[1]}</td>
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
                  onClick={() =>
                    document.getElementById("product_modal").close()
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
          <dialog id="eway_modal" className="modal">
            <div className="modal-box w-11/12 max-w-7xl">
              <TitleCard title="Invoice Eway Bill" topMargin="mt-2">
                <div className="overflow-x-auto w-full">
                  {ewayTableData.length !== 0 ? (
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Eway DOC No.</th>
                          <th>Eway Bill No.</th>
                          <th>Eway Mode</th>
                          <th>Eway Approx Distance</th>
                          <th>Eway Valid Upto</th>
                          <th>Eway Supply Type</th>
                          <th>Eway Transaction Type</th>
                          <th>Eway Transaction ID</th>
                          <th>Eway GSTIN</th>
                          <th>Eway From</th>
                          <th>Eway To</th>
                          <th>Eway Dispatched From</th>
                          <th>Eway Ship To</th>
                          <th>Eway Tax Amount</th>
                          <th>Eway Tax Rate</th>
                          <th>Eway Transportation ID</th>
                          <th>Eway Vehicle No</th>
                          <th>Eway Vehicle From</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ewayTableData && (
                          <tr>
                            <td>{ewayTableData.ewayDocNumber}</td>
                            <td>{ewayTableData.eWayBillNo}</td>
                            <td>{ewayTableData.eWayMode}</td>
                            <td>{ewayTableData.eWayApproxDistance}</td>
                            <td>{ewayTableData.eWayValidUpto}</td>
                            <td>{ewayTableData.eWaySupplyType}</td>
                            <td>{ewayTableData.eWayTransactionType}</td>
                            <td>{ewayTableData.eWayTransactionId}</td>
                            <td>{ewayTableData.eWayGSTIN}</td>
                            <td>{ewayTableData.eWayfrom}</td>
                            <td>{ewayTableData.eWayTo}</td>
                            <td>{ewayTableData.eWayDistpatchFrom}</td>
                            <td>{ewayTableData.eWayShipTo}</td>
                            <td>{ewayTableData.ewaytaxAmount}</td>
                            <td>{ewayTableData.ewaytaxRate}</td>
                            <td>{ewayTableData.ewayTransportationID}</td>
                            <td>{ewayTableData.ewayVechileNo}</td>
                            <td>{ewayTableData.ewayVehicleFrom}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <h1>No Eway Details Found!</h1>
                  )}
                </div>
              </TitleCard>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => document.getElementById("eway_modal").close()}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};

export default TableComponent;
