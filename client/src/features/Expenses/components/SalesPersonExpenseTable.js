import React, { useEffect, useState } from 'react';
import TitleCard from '../../../components/Cards/TitleCard';
import moment from 'moment';
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";

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


    useEffect(() => {
        fetchData();
    }, [interval, selectedYear, selectedMonth]);

    const fetchData = async () => {
        try {
            let url = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/totalInvoiceAmountAndExpenses?interval=${interval}&year=${selectedYear}`;
    
            if (interval === 'monthly') {
                url += `&monthName=${selectedMonth}`;
            }
    
            const response = await fetch(url);
            const data = await response.json();

            setTableData(data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    console.log(tableData);

    const filteredRecords = tableData.filter(expenses => {
        return (
          String(expenses.salespersonName).toLowerCase().includes(searchTerm.toLowerCase())
        )
      });

      const handleSearchChange = event => {
        setSearchTerm(event.target.value);
      };

      const sortedData = filteredRecords.slice().sort((a, b) => {
        if (sortConfig.key !== null) {
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


  return (
    <TitleCard title={"Sales Person Expense Table"} 
    TopSideButtons2={
        <div className="flex">
            <select 
            className="px-2 border border-gray-300 rounded-md h-7 ml-2"
            value={interval} onChange={(e) => setInterval(e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
            </select>

            {interval === 'monthly' && (
                
                    <select 
                    className="px-2 border border-gray-300 rounded-md h-7 ml-2"
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
            className="px-2 border border-gray-300 rounded-md h-7 ml-2"
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
        <input
        type="text"
        className="input input-bordered w-full h-7 max-w-xs"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
         />
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
                  <td className="table-cell">{parseFloat(item.TotalAmount).toFixed(2)} INR</td>
                  <td className="table-cell">{parseFloat(item.Salary == null ? 0 : item.Salary) + parseFloat(item.incentives == null ? 0 : item.incentives) + parseFloat(item.mis == null ? 0 : item.mis)} INR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
</TitleCard>
  )
}

export default SalesPersonExpenseTable