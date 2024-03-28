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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';

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
    const [selectedRange, setSelectedRange] = useState('financial-year');
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [rangeData, setRangeData] = useState({});
  
    const handleRangeChange = async (event) => {
      const selectedRange = event.target.value;
      setSelectedRange(selectedRange);
      try {
        const response = await axios.get(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/total-sum-by-${selectedRange}`);
        setRangeData(response.data);
        // console.log(response.data);

        

      } catch (error) {
        console.error('Error fetching range data:', error);
      }
    };
  
    const handleMonthRangeChange = (event) => {
      setSelectedMonths(Array.from(event.target.selectedOptions, (option) => option.value));
    };
  
    useEffect(() => {
      // Fetch data for default selected range
      handleRangeChange({ target: { value: 'month' } });
    }, []); // Fetch data only once when component mounts
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };


    function getFinancialYear(yearsBefore = 0) {
        // Get current date
        const currentDate = moment();
        // console.log(currentDate.format('YYYY-MM-DD'));
    
        // Calculate the start date of the financial year
        const startFinancialYear = moment().subtract(currentDate.month() < 3 ? 1 : 0, 'year').startOf('year').month(3);
        // console.log(startFinancialYear.format('YYYY-MM-DD'));
    
        // Adjust the start date for the previous financial year
        const startPreviousFinancialYear = moment(startFinancialYear).subtract(yearsBefore + 1, 'year');
        // console.log(startPreviousFinancialYear.format('YYYY-MM-DD'));
    
        // Calculate the end date of the previous financial year
        const endPreviousFinancialYear = moment(startFinancialYear).subtract(yearsBefore, 'year').subtract(1, 'day');
    
        // Format dates as "YYYY-MM-DD"
        const startDatePreviousYear = startPreviousFinancialYear.format('YYYY-MM-DD');
        const endDatePreviousYear = endPreviousFinancialYear.format('YYYY-MM-DD');
    
        return {
            startDate: startDatePreviousYear,
            endDate: endDatePreviousYear
        };
    }
    
    // Get current financial year
    const currentFinancialYear = getFinancialYear(-1);
    // console.log("Current Financial Year Start Date:", currentFinancialYear.startDate);
    // console.log("Current Financial Year End Date:", currentFinancialYear.endDate);


    // Get previous financial year
    const previousFinancialYear = getFinancialYear(0);
    // console.log("Previous Financial Year Start Date:", previousFinancialYear.startDate);
    // console.log("Previous Financial Year End Date:", previousFinancialYear.endDate);
    
    // Get year before previous financial year
    const yearBeforePreviousFinancialYear = getFinancialYear(1);
    // console.log("Year Before Previous Financial Year Start Date:", yearBeforePreviousFinancialYear.startDate);
    // console.log("Year Before Previous Financial Year End Date:", yearBeforePreviousFinancialYear.endDate);






    
  
    const tags = Object.keys(rangeData).sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });

    const labels = tags.map(label => {
        if (selectedRange === 'month') {
          return moment(label).format('MMMM-YYYY');
        } else {
          return label;
        }
      });

    // console.log(labels.map(label => moment(label).format('MMMM-YYYY')));
    // console.log(labels);


    const data = {
      labels,
      datasets: [
        {
          fill: true,
          label: 'Sales',
          data: Object.values(rangeData).sort((a, b) => {
            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          }),
          borderColor: selectedRange === 'month' ? 'rgb(53, 162, 235)' : 'rgb(255, 99, 132)',
          backgroundColor: selectedRange === 'month' ? 'rgba(53, 162, 235, 0.5)' : 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };

    // {selectedRange === 'month' && (
    //     <select value={selectedMonths} onChange={handleMonthRangeChange} multiple>
    //       {/* Populate options for selecting range of months */}
    //       {Object.keys(rangeData).map((month) => (
    //         <option key={month} value={month}>
    //           {month}
    //         </option>
    //       ))}
    //     </select>
    //   )}



  
    return (
      <TitleCard title={"Sales Data"} 
      TopSideButtons1={
        <div>
        <select value={selectedRange} onChange={handleRangeChange}>
          <option value="month">Monthly</option>
          <option value="financial-year">Yearly</option>
        </select>
      </div>
      }
      >
       
        <Line data={data} options={options} />
      </TitleCard>
    );
  }
  
  export default LineChart;