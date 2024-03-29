import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CurrentVsPrevDistributor() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const currentYear = moment().year();
      const currentMonth = moment().format("MMMM").toLowerCase(); // Moment.js months are zero-based
      console.log(currentMonth);
      const previousYear = currentYear - 1;

      // Fetch data for the current month of the current year
      const responseCurrentYear = await fetch(
        `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoice/top-distributors?interval=monthly&year=${currentYear}&month=${currentMonth}&type=top`
      );
      const dataCurrentYear = await responseCurrentYear.json();
      console.log(dataCurrentYear);

      // Fetch data for the same month of the previous year
      const responsePreviousYear = await fetch(
        `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoice/top-distributors?interval=monthly&year=${previousYear}&month=${currentMonth}&type=top`
      );
      const dataPreviousYear = await responsePreviousYear.json();
      console.log(dataPreviousYear);

      const labels = dataCurrentYear.map((product) => product.agencyName);
      console.log(labels);
      const currentMonthData = dataCurrentYear.map(
        (totalSold) => totalSold.totalPrice
      );
      console.log(currentMonthData);
      const previousYearMonthData =
        dataPreviousYear.length > 0
          ? dataPreviousYear.map((totalSold) => totalSold.totalPrice)
          : new Array(labels.length).fill(0);
      console.log(previousYearMonthData);

      setChartData({
        labels,
        datasets: [
          {
            label: `${moment().format("MMMM-YYYY")}`,
            data: currentMonthData,
            backgroundColor: "rgba(255, 99, 132, 1)",
          },
          {
            label: `${moment().subtract(1, "year").format("MMMM-YYYY")}`,
            data: previousYearMonthData,
            backgroundColor: "rgba(53, 162, 235, 1)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <TitleCard
      title={
        "Top 5 Distributor's sales in current month of this year vs current month of last year"
      }
      topMargin="mt-2"
    >
      {chartData && <Bar options={options} data={chartData} />}
    </TitleCard>
  );
}

export default CurrentVsPrevDistributor;
