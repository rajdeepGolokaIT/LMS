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
import { BASE_URL } from "../../../Endpoint";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CurrentVsPrevProduct() {
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
        `${BASE_URL}/api/v1/invoices/top-selling-products?interval=monthly&year=${currentYear}&month=${currentMonth}`
      );
      const dataCurrentYear = await responseCurrentYear.json();
      console.log(dataCurrentYear);

      // Fetch data for the same month of the previous year
      const responsePreviousYear = await fetch(
        `${BASE_URL}/api/v1/invoices/top-selling-products?interval=monthly&year=${previousYear}&month=${currentMonth}`
      );
      const dataPreviousYear = await responsePreviousYear.json();
      console.log(dataPreviousYear);

      const labels = dataCurrentYear.map(([product]) => {
        const { productName } = product;
        const maxLength = 20; // Maximum length before splitting
        if (productName.length > maxLength) {
          const splitIndex = productName.lastIndexOf(" ", maxLength);
          if (splitIndex !== -1) {
            return [
              productName.slice(0, splitIndex),
              productName.slice(splitIndex),
            ];
          }
        }
        return productName;
      });
      const currentMonthData = dataCurrentYear.map(
        ([, totalSold]) => totalSold
      );
      console.log(labels);
      const previousYearMonthData =
        dataPreviousYear.length > 0
          ? dataPreviousYear.map(([, totalSold]) => totalSold)
          : new Array(labels.length).fill(0);
      console.log(previousYearMonthData);

      setChartData({
        labels,
        datasets: [
          {
            label: `${moment().format("MMMM-YYYY")}`,
            data: currentMonthData,
            backgroundColor: "rgba(3, 201, 169, 1)",
          },
          {
            label: `${moment().subtract(1, "year").format("MMMM-YYYY")}`,
            data: previousYearMonthData,
            backgroundColor: "rgba(178, 222, 39, 1)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },

      tooltip: {
        callbacks: {
          title: (context) => {
            console.log(context[0].label);
            return context[0].label.replaceAll(","," ");
          },
        },
      },
    },
  };

  return (
    <TitleCard
      title={
        "Top 5 products sold in current month of this year vs current month of last year"
      }
      topMargin="mt-2"
    >
      {chartData && (
        <div className="relative h-[50vh] w-[100%]">
          <Bar options={options} data={chartData} />
        </div>
      )}
    </TitleCard>
  );
}

export default CurrentVsPrevProduct;
