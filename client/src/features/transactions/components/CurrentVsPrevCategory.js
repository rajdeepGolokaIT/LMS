import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import moment from 'moment';
import { BASE_URL } from "../../../Endpoint";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CurrentVsPrevCategory(){

    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const currentYear = moment().year();
            const currentMonth = moment().format('MMMM').toLowerCase(); // Moment.js months are zero-based
            console.log(currentMonth);
            const previousYear = currentYear - 1;
            console.log(previousYear);

            // Fetch data for the current month of the current year
            const responseCurrentYear = await fetch(`${BASE_URL}/api/v1/invoices/top-selling-products-by-category?interval=monthly&year=${currentYear}&month=${currentMonth}`);
            const dataCurrentYear = await responseCurrentYear.json();
            console.log(dataCurrentYear);

            // Fetch data for the same month of the previous year
            const responsePreviousYear = await fetch(`${BASE_URL}/api/v1/invoices/top-selling-products-by-category?interval=monthly&year=${previousYear}&month=${currentMonth}`);
            const dataPreviousYear = await responsePreviousYear.json();
            console.log(dataPreviousYear);

            const labels = dataCurrentYear.map(([product]) => product);
            const currentMonthData = dataCurrentYear.map(([, totalSold]) => totalSold);
            console.log(currentMonthData)
            const previousYearMonthData = dataPreviousYear.length > 0
    ? dataPreviousYear.map(([, totalSold]) => totalSold)
    : new Array(labels.length).fill(0);
            console.log(previousYearMonthData)

            setChartData({
                labels,
                datasets: [
                    {
                        label: `${moment().format('MMMM-YYYY')}`,
                        data: currentMonthData,
                        backgroundColor: 'rgba(3, 201, 169, 1)',
                    },
                    {
                        label: `${moment().subtract(1, 'year').format('MMMM-YYYY')}`,
                        data: previousYearMonthData,
                        backgroundColor: 'rgba(178, 222, 39, 1)',
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
            }
        },
    };

    return (
        <TitleCard title={"Top 5 Categories sold in current month of this year vs current month of last year"} topMargin="mt-2">
            {chartData &&
            <div className="relative w-[100%] h-[50vh]">
            <Bar options={options} data={chartData} />
            </div>
            }
        </TitleCard>
    );
}

export default CurrentVsPrevCategory;
