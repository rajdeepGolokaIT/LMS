import React, { useEffect, useState } from 'react';
import TitleCard from '../../../components/Cards/TitleCard';
import moment from 'moment';

const SalesPersonExpenseTable = () => {

    const [tableData, setTableData] = useState([]);
    const [interval, setInterval] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM').toLowerCase());


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


  return (
    <TitleCard title={"Total Sales Graph vs. Total Expenses (Sales Person)"} 
    TopSideButtons1={
        <div>
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
    >
         <div className="overflow-x-auto w-full">
          <table className="table table-lg w-full">
            <thead>
              <tr className="table-row">
                <th className="table-cell">Serial No.</th>
                <th className="table-cell">Sales Person Name</th>
                <th className="table-cell">Total Sales</th>
                <th className="table-cell">Total Expenses</th>
              </tr>
              </thead>
              <tbody>
              {tableData.map((item, index) => (
                <tr className="table-row" key={index}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{item.salespersonName}</td>
                  <td className="table-cell">{item.TotalAmount}</td>
                  <td className="table-cell">{parseFloat(item.Salary == null ? 0 : item.Salary) + parseFloat(item.incentives == null ? 0 : item.incentives) + parseFloat(item.mis == null ? 0 : item.mis)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
</TitleCard>
  )
}

export default SalesPersonExpenseTable