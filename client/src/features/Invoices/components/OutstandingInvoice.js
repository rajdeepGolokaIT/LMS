import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../../../Endpoint";
import TitleCard from "../../../components/Cards/TitleCard";
import Pagination from "../../../components/Input/PaginationInvoice";
import MenuIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";

const OutstandingInvoice = () => {

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [Pages, setPages] = useState(null);
    const [isReceived, setIsReceived] = useState("true");
    const [days, setDays] = useState("30");
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceData, setInvoiceData] = useState([]);
    const [pdfData, setPdfData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");




    const fetchData = async () => {
        try {
          const url = `${BASE_URL}/api/v1/invoices/days-wise-invoices?page=${currentPage}&days=${days}&status=${isReceived}&search=${searchTerm}`
          const response = await axios.get(url);
          console.log(url)
          setData(response.data.invoices);
          setPages(response.data.totalPages);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      console.log(data)
    
      useEffect(() => {
        fetchData();
        allData();
      }, [currentPage, days, isReceived, searchTerm]);

      const handleIsReceivedToggle = async () => {
        try {
          const response = await axios.put(
            `${BASE_URL}/api/v1/invoices/invoice-received-status?id=${selectedInvoice}`
          );
          // console.log(response);
          fetchData();
          setSelectedInvoice(null);
        } catch (error) {
          console.error(error);
        }
      };

      const allData = async () => {
          try {
              const response = await axios.get(`${BASE_URL}/api/v1/invoices/days-wise-invoices?size=100000&days=${days}&status=${isReceived}&search=${searchTerm}`);
              setPdfData(response.data.invoices);
          } catch (error) {
              console.error(error);
          }
      }

      console.log(pdfData)

      const handleCheckboxChange = (e, id) => {
        const isChecked = e.target.checked;
        if (isChecked) {
          setSelectedInvoice(id);
        //   setInvoiceData([...invoiceData, data.find(invoice => invoice.someInteger === id)]);
        } else {
          setSelectedInvoice(null);
        //   setInvoiceData(invoiceData.filter(invoice => invoice.someInteger !== id));
        }
      };

      const handleIsReceivedChange = (event) => {
        setIsReceived(event.target.value);
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

      const handleDaysChange = (event) => {
          setDays(event.target.value);
        //   fetchData();
      };

      const downloadPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        allData();
        const logoImg = new Image();
        logoImg.src = "/c.png";
        const imageWidth = 10;
        const imageHeight = 10;
        const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
        const imageY = 10;
        pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);
      
        const title = "Invoice Outstanding Report";
        const fontSize = 12;
        const textWidth =
          (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
        const textX = (pdf.internal.pageSize.width - textWidth) / 2;
        const textY = imageY + imageHeight + 10;
        pdf.setFontSize(fontSize);
        pdf.text(title, textX, textY);
        pdf.setFontSize(fontSize);
      
        
      
      
        const newData = pdfData;
      
        console.log(newData);
      
        const rows = newData.map((data, index) => [
          index + 1,
          data.someInteger,
          data.id,
          moment(data.timestamp).format('DD-MM-YYYY'),
          isReceived === 'true' ? 'Yes' : 'No',
          data.distributorName,
          data.salespersonName,
          data.amount,
          data.city,
          data.state,
          data.region
          
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
             "Invoice ID",
             "Invoice Number",
             "Invoice Date",
             "Payment Received",
             "Distributor Name",
             "Sales Person Name",
             "Amount",
             "City",
             "Region",
             "Zone"
            ],
          ],
          body: rows,
          startY: tableStartY,
        });
      
        pdf.save("Invoice_outstanding.pdf");
      };

      console.log(pdfData)
      console.log(invoiceData)

  return (
    <>
    <TitleCard
        title="Invoice Outstanding Table"
        topMargin="mt-2"
        TopSideButtons2={
            <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="">
            <MenuIcon className="btn btn-sm btn-circle"/>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box">
          <li>
            <button className={`btn btn-primary btn-sm mx-auto my-2 w-full`} onClick={downloadPDF}>
          Download PDF
        </button>
            </li>
            <li>
            <button className={`btn btn-sm w-full mx-auto my-2 ${selectedInvoice === null ? "btn-disabled" : "btn-info"}`} onClick={handleIsReceivedToggle}>
                Paid / Unpaid
                </button>
            </li>
            <li>
                <select
                className="select select-sm mx-auto my-2"
                onChange={handleDaysChange}
                value={days}
                >
                <option value="30">Below 30 Days</option>
                <option value="45">Above 30 and below 45 Days</option>
                <option value="60">Above 45 and below 60 Days</option>
                <option value="90">Above 60 and below 90 Days</option>
                <option value="100">More Than 90 Days</option>
                </select>
            </li>
            <li>
            <select
              className="select select-sm mx-auto my-2 w-full"
              onChange={handleIsReceivedChange}
              value={isReceived}
            >
              <option value="true">Paid Invoices</option>
              <option value="false">Unpaid Invoices</option>
            </select>
            </li>
            
            </ul>
        </div>
        }
        TopSideButtons1={
            <>
              <input
                type="text"
                className="input input-sm input-bordered"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}/>
          </>
          } 
        >  
             <div
          className="overflow-x-auto w-full"
          style={{ overflowY: "auto", maxHeight: "450px" }}
        >
          {isReceived === 'true' ? (
          <table className="table table-xs table-zebra-zebra">
          <thead>
              <tr className="table-row text-center">
                <th className="table-cell">Select</th>
                <th className="table-cell">Indicator</th>
                <th className="table-cell">Invoice ID</th>
                <th className="table-cell">Invoice Number</th>
                <th className="table-cell">Invoice Date</th>
                <th className="table-cell">Payment Received</th>
                <th className="table-cell">Distributor Name</th>
                <th className="table-cell">Sales Person Name</th>
                <th className="table-cell">Amount</th>
                <th className="table-cell">City</th>
                <th className="table-cell">Region</th>
                <th className="table-cell">Zone</th>
                </tr>
            </thead>
            <tbody>
            {data.map((invoice) => (
                <tr key={invoice.someInteger} className="table-row">
                  <td className="table-cell">
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={(e) => handleCheckboxChange(e, invoice.someInteger)}
                        // checked={invoiceData.some(item => item.someInteger === invoice.someInteger)}
                        checked={selectedInvoice === invoice.someInteger}
                      />
                    </label>
                  </td>
                   <td className="table-cell">
                     <div
                     className={`w-3 h-3 rounded-full m-3 animate-pulse border-gray-300 grid border ${
                     getIndicatorColor(invoice.timestamp)
                      }`}
                     ></div>
                    </td>
                    <td className="table-cell">{invoice.someInteger}</td>
                    <td className="table-cell">{invoice.id}</td>
                    <td className="table-cell">{moment(invoice.timestamp).format('DD-MM-YYYY')}</td>
                    <td className="table-cell">{isReceived === 'true' ? 'Yes' : 'No'}</td>
                    <td className="table-cell">{invoice.distributorName}</td>
                    <td className="table-cell">{invoice.salespersonName}</td>
                    <td className="table-cell">{`INR ${parseFloat(invoice.amount).toFixed(2)}`}</td>
                    <td className="table-cell">{invoice.city}</td>
                    <td className="table-cell">{invoice.state}</td>
                    <td className="table-cell">{invoice.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
            
          ) : (
            <table className="table table-xs table-zebra-zebra">
            <thead>
                <tr className="table-row text-center">
                  <th className="table-cell">Select</th>
                  <th className="table-cell">Indicator</th>
                  <th className="table-cell">Invoice ID</th>
                  <th className="table-cell">Invoice Number</th>
                  <th className="table-cell">Invoice Date</th>
                  <th className="table-cell">Payment Received</th>
                  <th className="table-cell">Distributor Name</th>
                  <th className="table-cell">Sales Person Name</th>
                  <th className="table-cell">Amount</th>
                  <th className="table-cell">City</th>
                  <th className="table-cell">Region</th>
                  <th className="table-cell">Zone</th>
                  <th className="table-cell">No of Days</th>
                  </tr>
              </thead>
              <tbody>
              {data.map((invoice) => (
                  <tr key={invoice.someInteger} className="table-row">
                    <td className="table-cell">
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          onChange={(e) => handleCheckboxChange(e, invoice.someInteger)}
                          // checked={invoiceData.some(item => item.someInteger === invoice.someInteger)}
                          checked={selectedInvoice === invoice.someInteger}
                        />
                      </label>
                    </td>
                     <td className="table-cell">
                       <div
                       className={`w-3 h-3 rounded-full m-3 animate-pulse border-gray-300 grid border ${
                       getIndicatorColor(invoice.timestamp)
                        }`}
                       ></div>
                      </td>
                      <td className="table-cell">{invoice.someInteger}</td>
                      <td className="table-cell">{invoice.id}</td>
                      <td className="table-cell">{moment(invoice.timestamp).format('DD-MM-YYYY')}</td>
                      <td className="table-cell">{isReceived === 'true' ? 'Yes' : 'No'}</td>
                      <td className="table-cell">{invoice.distributorName}</td>
                      <td className="table-cell">{invoice.salespersonName}</td>
                      <td className="table-cell">{`INR ${parseFloat(invoice.amount).toFixed(2)}`}</td>
                      <td className="table-cell">{invoice.city}</td>
                      <td className="table-cell">{invoice.state}</td>
                      <td className="table-cell">{invoice.region}</td>
                      <td className="table-cell">{moment().diff(invoice.timestamp, 'days')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          )}
          </div>
          <Pagination
          nPages={Pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        </TitleCard>
    </>
  )
}

export default OutstandingInvoice