import React, { useState, useEffect } from 'react';
import TitleCard from '../../../components/Cards/TitleCard';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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

  const getMonthlySales = (data) => {
    const monthlySales = {};
  
    data.forEach((invoice) => {
      const date = new Date(invoice.createDate);
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      const totalAmount = invoice.totalAmount;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
  
      if (monthlySales[key]) {
        monthlySales[key] += totalAmount;
      } else {
        monthlySales[key] = totalAmount;
      }
    });
  
    // Sort the keys in ascending order
    const sortedKeys = Object.keys(monthlySales).sort();
    const sortedMonthlySales = {};
  
    // Reconstruct the monthlySales object with sorted keys
    sortedKeys.forEach((key) => {
      sortedMonthlySales[key] = monthlySales[key];
    });
  
    return sortedMonthlySales;
  };
  

  const getYearlySales = (data) => {
    const yearlySales = {};

    data.forEach((invoice) => {
      const date = new Date(invoice.createDate);
      const year = date.getFullYear();
      const totalAmount = invoice.totalAmount;

      if (yearlySales[year]) {
        yearlySales[year] += totalAmount;
      } else {
        yearlySales[year] = totalAmount;
      }
    });

    return yearlySales;
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
  }, [invoices, selectedOption]);

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

  return (
    <TitleCard
      title="Sales Analysis"
      TopSideButtons={
        <select
          className="px-2 border border-gray-300 rounded"
          onChange={handleSelectChange}
          value={selectedOption}
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      }
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
