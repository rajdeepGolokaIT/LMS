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
    const [rangeData, setRangeData] = useState({});
    const [selectedStartMonth, setSelectedStartMonth] = useState('04-01');
    const [selectedEndMonth, setSelectedEndMonth] = useState('03-31');



    function getFinancialYear(yearsBefore = 0) {
        // Get current date
        const currentDate = moment();
    
        // Calculate the start date of the financial year
        const startFinancialYear = moment().subtract(currentDate.month() < 3 ? 1 : 0, 'year').startOf('year').month(3);
        
    
        // Adjust the start date for the previous financial year
        const startPreviousFinancialYear = moment(startFinancialYear).subtract(yearsBefore + 1, 'year');
        
    
        // Calculate the end date of the previous financial year
        const endPreviousFinancialYear = moment(startFinancialYear).subtract(yearsBefore, 'year').subtract(1, 'day');
    
        // Format dates as "YYYY-MM-DD"
        const startPreviousYear = startPreviousFinancialYear.format('YYYY');
        const startPreviousMonth = startPreviousFinancialYear.format('MM-DD');
        const endPreviousYear = endPreviousFinancialYear.format('YYYY');
        const endPreviousMonth = endPreviousFinancialYear.format('MM-DD');
        
    
        return {
            startYear: startPreviousYear,
            startMonth: startPreviousMonth,
            endYear: endPreviousYear,
            endMonth: endPreviousMonth
        };
    }

    // Get current financial year dates
    const currentFinancialYear = getFinancialYear(-1);
    const currentEnd = currentFinancialYear.endYear
    const currentStart = currentFinancialYear.startYear

    const previousFinancialYear = getFinancialYear(0);
    const previousStart = previousFinancialYear.startYear
    
    const yearBeforePreviousFinancialYear = getFinancialYear(1);
    const yearBeforePreviousStart = yearBeforePreviousFinancialYear.startYear
    
    console.log(currentEnd, currentStart, previousStart, yearBeforePreviousStart);



    const [selectedStartYear, setSelectedStartYear ] = useState(`${currentStart}`);
    const [selectedEndYear, setSelectedEndYear] = useState(`${currentEnd}`);
    

    
  
    const handleRangeChange = async (event) => {
        const value = event.target.value;
        setSelectedRange(value);
    };

    const fetchData = async (range) => {
        try {
            let response;
            if (range === 'month' || range === 'financial-year') {
                response = await axios.get(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/total-sum-by-${range}`);
            } else if (range === 'custom') {
                response = await axios.get(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/total-sum-by-month-custom-date?fromDate=${selectedStartYear}-${selectedStartMonth}&toDate=${selectedEndYear}-${selectedEndMonth}`);
            }
            setRangeData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(selectedRange);
    }, [selectedRange, selectedStartMonth, selectedEndMonth, selectedStartYear, selectedEndYear]);
  
    
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };


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
        if (selectedRange === 'month' || selectedRange === 'custom') {
          return moment(label).format('MMMM-YYYY');
        } else {
          return label;
        }
      });

    


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
          borderColor: selectedRange === 'month' ? 'rgb(53, 162, 235)' : selectedRange === 'custom' ? 'rgb(148,0,211)' : 'rgb(255, 99, 132)',
          backgroundColor: selectedRange === 'month'  ? 'rgba(53, 162, 235, 0.5)' : selectedRange === 'custom' ? 'rgba(148,0,211, 0.5)' : 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };

    



  
    return (
      <TitleCard title={"Total Sales Graph"} 
      TopSideButtons1={
        <div>
        <select value={selectedRange} onChange={handleRangeChange}>
          <option value="month">Monthly</option>
          <option value="financial-year">Yearly</option>
          <option value="custom">Custom</option>
        </select>
        {selectedRange === 'custom' && (
            <div>
            <div className="grid grid-cols-3 gap-4">
            <labels className="label">Start Range:</labels>
            <select className='select select-ghost select-sm' value={selectedStartYear} onChange={(e) => setSelectedStartYear(e.target.value)}>
            {/* Starting Year */}
            <option value={currentEnd}>{currentEnd}</option>
            <option value={currentStart}>{currentStart}</option>
            <option value={previousStart}>{previousStart}</option>
            <option value={yearBeforePreviousStart}>{yearBeforePreviousStart}</option>
            </select>
            <select className='select select-ghost select-sm' value={selectedStartMonth} onChange={(e) => setSelectedStartMonth(e.target.value)}>
            {/* Starting Month */}
            <option value="04-01">April</option>
            <option value="05-01">May</option>
            <option value="06-01">June</option>
            <option value="07-01">July</option>
            <option value="08-01">August</option>
            <option value="09-01">September</option>
            <option value="10-01">October</option>
            <option value="11-01">November</option>
            <option value="12-01">December</option>
            <option value="01-01">January</option>
            <option value="02-01">February</option>
            <option value="03-01">March</option>
            </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <labels className="label">End Range:</labels>
            <select className='select select-ghost select-sm' value={selectedEndYear} onChange={(e) => setSelectedEndYear(e.target.value)}>
            {/* Ending Year */}
            <option value={currentEnd}>{currentEnd}</option>
            <option value={currentStart}>{currentStart}</option>
            <option value={previousStart}>{previousStart}</option>
            <option value={yearBeforePreviousStart}>{yearBeforePreviousStart}</option>
            </select>
            <select className='select select-ghost select-sm' value={selectedEndMonth} onChange={(e) => setSelectedEndMonth(e.target.value)}>
            {/* Ending Month */}
            <option value="03-31">March</option>
            <option value="04-30">April</option>
            <option value="05-31">May</option>
            <option value="06-30">June</option>
            <option value="07-31">July</option>
            <option value="08-31">August</option>
            <option value="09-30">September</option>
            <option value="10-31">October</option>
            <option value="11-30">November</option>
            <option value="12-31">December</option>
            <option value="01-31">January</option>
            <option value="02-29">February</option>
            </select>
            </div>
            </div>
        )}
      </div>
      }
>
       <div className='relative w-[100%] h-[50vh] container'>
        <Line data={data} options={options} />
        </div>
      </TitleCard>
    );
  }
  
  export default LineChart;