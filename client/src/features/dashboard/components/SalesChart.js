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
import { BASE_URL } from "../../../Endpoint";

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
    
  //   useEffect(() => {
  //     fetchData(selectedRange);
  // }, [selectedRange, selectedStartMonth, selectedEndMonth, selectedStartYear, selectedEndYear]);
    
  
    const handleRangeChange = async (event) => {
        const value = event.target.value;
        setSelectedRange(value);
    };

    const handleCustomRangeChange = (field, value) => {
      if (field === 'startYear' || field === 'endYear') {
          // Validate that end year is after start year
          if (field === 'startYear' && value >= selectedEndYear) {
              alert('Start year must be before end year');
              return;
          }
          if (field === 'endYear' && value <= selectedStartYear) {
              alert('End year must be after start year');
              return;
          }
      } else if (field === 'startMonth' || field === 'endMonth') {
          // Validate that end month is after start month
          const start = moment(`${selectedStartYear}-${selectedStartMonth}`);
          const end = moment(`${selectedEndYear}-${selectedEndMonth}`);
          if (start >= end) {
              alert('End month must be after start month');
              return;
          }
      }
      // If validation passes, update the state
      if (field === 'startYear') {
          setSelectedStartYear(value);
      } else if (field === 'startMonth') {
          setSelectedStartMonth(value);
      } else if (field === 'endYear') {
          setSelectedEndYear(value);
      } else if (field === 'endMonth') {
          setSelectedEndMonth(value);
      }
  };

    const fetchData = async (range) => {
        try {
            let response;
            if (range === 'month' || range === 'financial-year') {
                response = await axios.get(`${BASE_URL}/api/v1/invoices/total-sum-by-${range}`);
            } else if (range === 'custom') {
                response = await axios.get(`${BASE_URL}/api/v1/invoices/total-sum-by-month-custom-date?fromDate=${selectedStartYear}-${selectedStartMonth}&toDate=${selectedEndYear}-${selectedEndMonth}`);
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
        legend: false,
        tooltip: {
          callbacks: {
            title: (context) => {
              console.log(context[0].label);
              return context[0].label.replaceAll(","," ");
            },
          },
        },
      },
      scales: {
        x: {
            ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 0
            }
        }
    }
    };


    const tags = Object.keys(rangeData).sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
    });

    const sortedValues = tags.map(tag => rangeData[tag]);

    const labels = tags.map(label => {
      if (selectedRange === 'month' || selectedRange === 'custom') {
        return moment(label).format('MMMM-YYYY');
      } else {
        return label;
      }
    });

    const newLabels = labels.map(label => {
      return [`${label.split('-')[0]}`, `${label.split('-')[1]}`];
    })

    console.log(newLabels)
    


    const data = {
      labels: newLabels,
      datasets: [
        {
          fill: true,
          label: 'Sales',
          data: sortedValues,
          borderColor: selectedRange === 'month' ? 'rgb(178, 222, 39)' : selectedRange === 'custom' ? 'rgb(148,0,211)' : 'rgb(3, 201, 169)',
          backgroundColor: selectedRange === 'month'  ? 'rgba(178, 222, 39, 0.5)' : selectedRange === 'custom' ? 'rgba(148,0,211, 0.5)' : 'rgba(3, 201, 169, 0.5)',
        },
      ],
    };

    



  
    return (
      <TitleCard title={"Total Sales Graph"} 
      TopSideButtons2={
        <div>
        <select value={selectedRange} onChange={handleRangeChange} className="select select-bordered select-sm float-right">
          <option value="month">Monthly</option>
          <option value="financial-year">Yearly</option>
          <option value="custom">Custom</option>
        </select>
        </div>
      }
      TopSideButtons1={
        <>
        {selectedRange === 'custom' && (
            <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-3 gap-4">
            <labels className="label">Start Range:</labels>
            <select className='select select-bordered select-sm' value={selectedStartYear} onChange={(e) => handleCustomRangeChange('startYear', e.target.value)}>
            {/* Starting Year */}
            <option value={currentEnd}>{currentEnd}</option>
            <option value={currentStart}>{currentStart}</option>
            <option value={previousStart}>{previousStart}</option>
            <option value={yearBeforePreviousStart}>{yearBeforePreviousStart}</option>
            </select>
            <select className='select select-bordered select-sm' value={selectedStartMonth} onChange={(e) => handleCustomRangeChange('startMonth', e.target.value)}>
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
            <select className='select select-bordered select-sm' value={selectedEndYear} onChange={(e) => handleCustomRangeChange('endYear', e.target.value)}>
            {/* Ending Year */}
            <option value={currentEnd}>{currentEnd}</option>
            <option value={currentStart}>{currentStart}</option>
            <option value={previousStart}>{previousStart}</option>
            <option value={yearBeforePreviousStart}>{yearBeforePreviousStart}</option>
            </select>
            <select className='select select-bordered select-sm' value={selectedEndMonth} onChange={(e) => handleCustomRangeChange('endMonth', e.target.value)}>
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
        </>
      }
      
>
       <div className='relative w-[100%] h-[50vh]'>
        <Line data={data} options={options} />
        </div>
      </TitleCard>
    );
  }
  
  export default LineChart;