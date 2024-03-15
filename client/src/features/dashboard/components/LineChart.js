import React, { useState, useEffect } from 'react';
import TitleCard from '../../../components/Cards/TitleCard';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Datepicker from "react-tailwindcss-datepicker"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart() {
  const [chartData, setChartData] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Monthly'); // Default to Monthly
  const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null });
  const [dateValue, setDateValue] = useState(null);

  const getMonthlySales = (data) => {
    const monthlySales = {};
    const filteredData = data.filter(invoice => {
      const invoiceDate = new Date(invoice.createDate);
      return (
        (!selectedDateRange.startDate || invoiceDate >= selectedDateRange.startDate) &&
        (!selectedDateRange.endDate || invoiceDate <= selectedDateRange.endDate)
      );
    });

    // Find the earliest and latest dates from the filtered data
    const dates = filteredData.map((invoice) => new Date(invoice.createDate));
    const earliestDate = new Date(Math.min.apply(null, dates));
    const latestDate = new Date(Math.max.apply(null, dates));

    // console.log(earliestDate, latestDate);
  
    // Create an array of months between the earliest and latest dates
    const allMonths = [];
    let currentDate = new Date(earliestDate);
    let lastDate = new Date(latestDate);

    // console.log(currentDate, lastDate);

    // console.log(lastDate.toString().trim().slice(4, 7));
  
    while (currentDate <= lastDate) {
      const year = currentDate.getYear();
      const month = currentDate.toLocaleString('en-US', { month: 'short' });
      const key = `${month.toString().padStart(2, '0')}-${year.toString().slice(-2)}`;
  
      allMonths.push(key);
      currentDate.setMonth(currentDate.getMonth() + 1);
      // console.log(currentDate.getMonth() - 1);
      
    }
    
  
    // Initialize all months with sales of 0
    allMonths.forEach((month) => {
      monthlySales[month] = 0;
    });
  
    // Accumulate sales for each month
    filteredData.forEach((invoice) => {
      const date = new Date(invoice.createDate);
      // console.log(date)
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month.toString().padStart(2, '0')}-${year.toString().slice(-2)}`;
  
      if (isNaN(monthlySales[key])) {
        monthlySales[key] = 0;
    }

    // Increment monthlySales[key] by invoice.totalAmount
    if (!isNaN(invoice.totalAmount)) {
        monthlySales[key] += invoice.totalAmount;
    } else {
        console.log('Invalid total amount for invoice:', invoice);
    }
      // console.log(monthlySales[key]);
      // console.log(invoice.totalAmount);
    });
  
    return monthlySales;
  };

  const getYearlySales = (data) => {
    const yearlySales = {};
  
    data.forEach((invoice) => {
      const date = new Date(invoice.createDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      let financialYear = '';
  
      // Determine the financial year
      if (month >= 4) {
        // If the month is April or later, it's part of the current financial year
        financialYear = `${year}-${(year + 1).toString().slice(-2)}`;
      } else {
        // If the month is before April, it's part of the previous financial year
        financialYear = `${year - 1}-${year.toString().slice(-2)}`;
      }
  
      const totalAmount = invoice.totalAmount;
  
      if (yearlySales[financialYear]) {
        yearlySales[financialYear] += totalAmount;
      } else {
        yearlySales[financialYear] = totalAmount;
      }
    });
  
    // Create an array of entries and reverse it
    const reversedEntries = Object.entries(yearlySales).reverse();
  
    // Create a new object from the reversed entries
    const reversedYearlySales = reversedEntries.reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  
    return reversedYearlySales;
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/all');
        setInvoices(response.data);
        setLoading(false);
        console.log('API Response:', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const monthlySales = getMonthlySales(invoices);
    const yearlySales = getYearlySales(invoices);

    console.log('Monthly Sales:', monthlySales);
    console.log('Yearly Sales:', yearlySales);

    const chartData = {
      labels: selectedOption === 'Monthly' ? Object.keys(monthlySales) : Object.keys(yearlySales),
      datasets: [
        {
          label: selectedOption === 'Monthly' ? 'Monthly Sales' : 'Yearly Sales',
          data: selectedOption === 'Monthly' ? Object.values(monthlySales) : Object.values(yearlySales),
          fill: false,
          borderColor: selectedOption === 'Monthly' ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    };

    setChartData(chartData);
  }, [invoices, selectedOption, selectedDateRange]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales Analysis',
      },
      legend: {
        position: 'top',
      },
    },
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDateRangeChange = (range) => {
    const formattedStartDate = range.startDate ? new Date(range.startDate).toString() : null;
    const formattedEndDate = range.endDate ? new Date(range.endDate).toString() : null;
  
    setSelectedDateRange({
      startDate: range.startDate ? new Date(range.startDate) : null,
      endDate: range.endDate ? new Date(range.endDate) : null
    });
  
    // Update the Datepicker value without changing the selected date range
    if (formattedStartDate.toString() && formattedEndDate.toString()) {
      // If both start and end dates are selected, set the formatted range string
      setDateValue(`${formattedStartDate.toString()} to ${formattedEndDate.toString()}`);
    } else if (formattedStartDate.toString() && !formattedEndDate.toString()) {
      // If only start date is selected, set it as the Datepicker value
      setDateValue(formattedStartDate.toString());

    } else if (!formattedStartDate.toLocaleDateString() && formattedEndDate.toLocaleDateString()) {
      // If only end date is selected, set it as the Datepicker value
      setDateValue(formattedEndDate.toLocaleDateString());
    } else {
      // If no dates are selected, clear the Datepicker value
      setSelectedDateRange({ startDate: null, endDate: null });
      setDateValue(false);
    }
  };
  
  const handleReset = () => {
    // Reset the chart to default state
    setSelectedOption('Monthly');
    setSelectedDateRange({ startDate: null, endDate: null });
    setDateValue(null);
  };
  

  return (
    <TitleCard
      title="Sales Analysis"
      TopSideButtons1={
        <select
          className="px-2 border border-gray-300 rounded-md h-12"
          onChange={handleSelectChange}
          value={selectedOption}
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      }
      TopSideButtons2={<Datepicker 
        key={Date.now()}
        dateValue={dateValue}
        containerClassName="w-72 " 
        value={dateValue} // Use the new state variable for Datepicker value
        theme={"light"}
        inputClassName="input input-bordered w-72"
        popoverDirection={"down"}
        toggleClassName="invisible"
        onChange={handleDateRangeChange} 
        showShortcuts={false} 
        primaryColor={"white"} 
    /> }
    TopSideButtons3={<button onClick={handleReset} className="btn btn-ghost btn-xs h-12">Reset</button>}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </TitleCard>
  );
}

export default LineChart;