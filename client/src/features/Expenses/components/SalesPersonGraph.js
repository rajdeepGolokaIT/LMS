import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import moment from 'moment';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesPersonGraph = () => {

    const [chartData, setChartData] = useState(null);
    const [interval, setInterval] = useState('annually');
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM').toLowerCase());
    const [selectedSalesperson, setSelectedSalesperson] = useState(null);
    const [salespersons, setSalespersons] = useState([]);

    useEffect(() => {
        fetchSalespersons();
    }, []);

    useEffect(() => {
        fetchData();
    }, [interval, selectedYear, selectedMonth, selectedSalesperson]);

    const fetchSalespersons = async () => {
        try {
            const response = await fetch('https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all');
            const data = await response.json();
            setSalespersons(data);
            setSelectedSalesperson(data[0].id);
        } catch (error) {
            console.error('Error fetching salespersons:', error);
        }
    };

    const fetchData = async () => {
        try {
            let url = `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/totalInvoiceAmountAndExpenses?interval=${interval}&year=${selectedYear}&status=true`;
    
            if (interval === 'monthly') {
                url += `&monthName=${selectedMonth}`;
            }
    
            if (selectedSalesperson) {
                url += `&Salesperson=${selectedSalesperson}`;
            } 
    
            const response = await fetch(url);
            const data = await response.json();

            console.log(data);
            // console.log(data[0].TotalAmount);
            // console.log(data[0].Salary + data[0].incentive + data[0].mis)
            console.log(url);
    
            const totalExpenses = data.length === 0 ? 0 : (data[0].Salary + data[0].incentive + data[0].mis);
            const totalSales = data.length === 0 ? 0 : data[0].TotalAmount;
            const labels = data[0].salespersonName
            console.log(labels);
            console.log(selectedSalesperson)
    
            setChartData({
                labels: [labels],
                datasets: [
                    {
                        label: 'Total Sales',
                        data: [totalSales],
                        backgroundColor: 'rgb(255, 99, 132)',
                    },
                    {
                        label: 'Total Expenses',
                        data: [totalExpenses],
                        backgroundColor: 'rgb(54, 162, 235)',
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };


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
            TopSideButtons2={
                
                <select 
                className="px-2 border border-gray-300 rounded-md h-7 ml-2"
                value={selectedSalesperson} onChange={(e) => setSelectedSalesperson(e.target.value)}>
                {/* <option value={null}>All Salespersons</option> */}
                {salespersons.map((salesperson) => (
                    <option key={salesperson.id} value={salesperson.id}>
                        {salesperson.name.toUpperCase()}
                    </option>
                ))}
            </select>
            }
            >
            {/* Render the chart if chartData is available */}
            {chartData && (
                <div className="relative h-[50vh] w-[100%]">
                    <Bar options={options} data={chartData} />
                </div>
            )}
        </TitleCard>
  )
}

export default SalesPersonGraph