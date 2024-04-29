import React, { useEffect, useState } from 'react';
import TitleCard from '../../../components/Cards/TitleCard';
import moment from 'moment';
import jsPDF from "jspdf";
import "jspdf-autotable";
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";
import axios from 'axios';


const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (pageNumber) => {
  //   if (pageNumber >= 1 && pageNumber <= nPages)
    setCurrentPage(pageNumber);
  };

  return (
    <nav className="flex justify-start my-4">
      <ul className="flex ">
        <li className="page-item">
          <button
            className="btn btn-ghost"
            onClick={goToPrevPage}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((pgNumber, index) => {
          if (
            index <= 2 ||
            index >= nPages - 2 ||
            (index >= currentPage - 1 && index <= currentPage + 1)
          ) {
            return (
              <li key={pgNumber} className={`page-item ${currentPage === pgNumber ? 'active' : ''}`}>
                <button
                  className={`btn btn-ghost ${currentPage === pgNumber ? 'btn-active' : ''}`}
                  onClick={() => setCurrentPage(pgNumber)}
                >
                  {pgNumber}
                </button>
              </li>
            );
          } else if (
            (index === 3 && currentPage > 5) ||
            (index === nPages - 3 && currentPage < nPages - 4)
          ) {
            return (
              <li key={pgNumber} className="page-item disabled">
                <span className="btn btn-ghost">...</span>
              </li>
            );
          } else {
            return null;
          }
        })}
        <li className="page-item">
          <button
            className="btn btn-ghost"
            onClick={goToNextPage}
          >
            Next
          </button>
        </li>
        <li className="page-item">
          <input
            type="number"
            className="input input-bordered w-20 mx-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value))}
          />
        </li>
      </ul>
    </nav>
  );
};


const SalesPersonExpenseTable = () => {

    const [tableData, setTableData] = useState([]);
    const [interval, setInterval] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM').toLowerCase());
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
      key: null,
      direction: "ascending",
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectTerm, setSelectTerm] = useState('');
    const [salespersonNames, setSalespersonNames] = useState([]);


    useEffect(() => {
        fetchData();
    }, [interval, selectedYear, selectedMonth]);

    const fetchData = async () => {
        try {
            let url = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/totalInvoiceAmountAndExpenses?interval=${interval}&year=${selectedYear}&status=true`;
    
            if (interval === 'monthly') {
                url += `&monthName=${selectedMonth}`;
            }
    
            const response = await fetch(url);
            const data = await response.json();

            setTableData(data);

          //   const response2 = await fetch(
          //     "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all"
          // );
          //   const data2 = await response2.json();
          //   setSalespersonNames(data2);
          //   console.log(data2);
          //   console.log(salespersonNames);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get(
                  "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all"
              );
              
              setSalespersonNames(response.data);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
  }, []);

    console.log(tableData);
    console.log(salespersonNames)

    const filteredRecords = tableData.filter(expenses => {
        return (
          String(expenses.salespersonName).toLowerCase().includes(searchTerm.toLowerCase()) &&
          String(expenses.salespersonName).toLowerCase().includes(selectTerm.toLowerCase())
        )
      });

      const handleSearchChange = event => {
        setSearchTerm(event.target.value);
      };

      const sortedData = filteredRecords.slice().sort((a, b) => {
        if (sortConfig.key !== null) {
          if (sortConfig.key === 'salespersonName') {
            const aName = salespersonNames.find((person) => person.id === a.salespersonName)?.name || '';
            const bName = salespersonNames.find((person) => person.id === b.salespersonName)?.name || '';
            return sortConfig.direction === 'ascending' ? aName.localeCompare(bName) : bName.localeCompare(aName);
        } else {
          const keys = sortConfig.key.split(".");
          let aValue = a;
          let bValue = b;
      
          for (let key of keys) {
            aValue = aValue[key];
            bValue = bValue[key];
          }
      
          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
      }
        return 0;
      });

    
      const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
          direction = "descending";
        }
        setSortConfig({ key, direction });
      };
    
      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = sortedData.slice(
        indexOfFirstRecord,
        indexOfLastRecord
      );

      const downloadPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
      
        const logoImg = new Image();
        logoImg.src = "/c.png";
        const imageWidth = 10;
        const imageHeight = 10;
        const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
        const imageY = 10;
        pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);
      
        const title = "Sales Person Expenses Report";
        const fontSize = 14;
        const textWidth =
          (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
        const textX = (pdf.internal.pageSize.width - textWidth) / 2;
        const textY = imageY + imageHeight + 10;
        pdf.setFontSize(fontSize);
        pdf.text(title, textX, textY);
      
        const rows = tableData.map((data, index) => [
          index + 1,
          data.salespersonName,
          `INR ${parseFloat(data.TotalAmount).toFixed(2)}`,
          `INR ${parseFloat(data.Salary == null ? 0 : data.Salary) + parseFloat(data.incentives == null ? 0 : data.incentives) + parseFloat(data.mis == null ? 0 : data.mis)}`,
           
          
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
              "Serial No.",
              "Salesperson Name",
              "Total Sales",
              "Total Expense",
            ],
          ],
          body: rows,
          startY: tableStartY,
        });
      
        pdf.save("Invoices_report.pdf");
      };


  return (
    <>
    <TitleCard title={"Sales Person Expense Table"} 
    TopSideButtons2={
        <div className="flex gap-4">
            <select 
            className="select select-bordered select-sm h-7 max-w-xs"
            value={interval} onChange={(e) => setInterval(e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
            </select>

            {interval === 'monthly' && (
                
                    <select 
                    className="select select-bordered select-sm h-7 max-w-xs"
                    value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        <option value="january">January</option>
                        <option value="february">February</option>
                        <option value="march">March</option>
                        <option value="april">April</option>
                        <option value="may">May</option>
                        <option value="june">June</option>
                        <option value="july">July</option>
                        <option value="august">August</option>
                        <option value="september">September</option>
                        <option value="october">October</option>
                        <option value="november">November</option>
                        <option value="december">December</option>
                    </select>
                
            )}

            <select 
            className="select select-bordered select-sm h-7 max-w-xs"
            value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {/* Options for current year and previous two financial years */}
                <option value={moment().year()}>{moment().year()}</option>
                <option value={moment().year() - 1}>{moment().year() - 1}</option>
                <option value={moment().year() - 2}>{moment().year() - 2}</option>
            </select>
        </div>
    }
    topMargin="mt-2"
    TopSideButtons1={
      <>
       <button className="btn btn-primary mb-4 btn-sm" onClick={downloadPDF}>
          Download PDF
        </button>
        <input
        type="text"
        className="input input-bordered input-sm h-7 max-w-xs"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
         />
         <select className="select select-bordered select-sm h-7 max-w-xs" onChange={(e) => setSelectTerm(e.target.value)} value={selectTerm}>
            <option value="">Select Salesperson</option>
            {salespersonNames.map((salesperson) => (
              <option key={salesperson.name} value={salesperson.name}> {salesperson.name} </option>
            ))}
          </select>
      </>
    }
    >
         <div className="overflow-x-auto w-full">
          <table className="table table-lg w-full">
            <thead>
              <tr className="table-row">
                <th className="table-cell">Serial No.</th>
                <th className=" table-cell cursor-pointer"
                onClick={() => requestSort("salespersonName")}>Sales Person Name {sortConfig.key === "salespersonName" &&
                sortConfig.direction === "ascending" ? (
                  <SortIcon1 className="h-5 w-5 inline" />
                ) : (
                  <SortIcon2 className="h-5 w-5 inline" />
                )} </th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort("TotalAmount")}>Total Sales {sortConfig.key === "TotalAmount" && sortConfig.direction === "ascending" ? <SortIcon1 className="h-5 w-5 inline" /> : <SortIcon2 className="h-5 w-5 inline" /> }</th>
                <th className="table-cell cursor-pointer" >Total Expenses </th>
              </tr>
              </thead>
              <tbody>
              {currentRecords.map((item, index) => (
                <tr className="table-row" key={index}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{item.salespersonName}</td>
                  <td className="table-cell">INR {parseFloat(item.TotalAmount).toFixed(2)} </td>
                  <td className="table-cell">INR {parseFloat(item.Salary == null ? 0 : item.Salary) + parseFloat(item.incentives == null ? 0 : item.incentives) + parseFloat(item.mis == null ? 0 : item.mis)} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
</TitleCard>
<Pagination
        nPages={Math.ceil(filteredRecords.length / recordsPerPage)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
</>
  )
}

export default SalesPersonExpenseTable