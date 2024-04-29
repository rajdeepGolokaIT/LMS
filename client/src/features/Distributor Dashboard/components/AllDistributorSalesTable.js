import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Pagination from "../../../components/Input/Pagination";
import jsPDF from "jspdf";
import "jspdf-autotable";
import TitleCard from "../../../components/Cards/TitleCard";
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";



const AllDistributorSalesTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [valueType, setValueType] = useState("true");

  const endDate = moment().format("YYYY-MM-DD");
  const oldYear = (moment().year() - 2).toString();
  const ddMM = moment().format("MM-DD");
  const startDate = `${oldYear}-${ddMM}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/total-sales-by-distributors?fromDate=${startDate}&toDate=${endDate}&status=${valueType}`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [valueType]);

  const filteredRecords = data.filter((distributors) => {
    return (
      String(distributors.agencyName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(distributors.contactPerson)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortedData = filteredRecords.slice().sort((a, b) => {
    if (sortConfig.key !== null) {
      const keys = sortConfig.key.split(".");
      let aValue = a;
      let bValue = b;

      for (let key of keys) {
        aValue = aValue[key];
        bValue = bValue[key];
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const downloadPDF = () => {
    const pdf = new jsPDF();

    const logoImg = new Image();
    logoImg.src = "/c.png";
    const imageWidth = 10;
    const imageHeight = 10;
    const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
    const imageY = 10;
    pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);

    const title = "Distributor Sales Report";
    const fontSize = 14;
    const textWidth =
      (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
    const textX = (pdf.internal.pageSize.width - textWidth) / 2;
    const textY = imageY + imageHeight + 10;
    pdf.setFontSize(fontSize);
    pdf.text(title, textX, textY);
    pdf.setFontSize(fontSize);

    const rows = sortedData.map((sale, index) => [
      index + 1,
      sale.agencyName,
      sale.totalQuantitySold,
      `INR ${sale.totalSales}`,
    ]);

    const textHeight = fontSize / pdf.internal.scaleFactor;

    const tableStartY = textY + textHeight + 10;

    pdf.autoTable({
      head: [
        [
          "Serial No.",
          "Distributor Agency Name",
          "Total Quantity Sold",
          "Total Sales",
        ],
      ],
      body: rows,
      startY: tableStartY,
    });

    pdf.save("distributor_sales_report.pdf");
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  return (
    <>
      <TitleCard
        title="All Distributors Sales Table"
        topMargin="mt-2"
        TopSideButtons1={
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        }
        TopSideButtons2={
          <select
            onChange={(e) => setValueType(e.target.value)}
            value={valueType}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="true">Active Distributors</option>
            <option value="false">Inactive Distributors</option>
          </select>
        }
        TopSideButtons3={
          <button className="btn btn-primary mb-4" onClick={downloadPDF}>
            Download PDF
          </button>
        }
      >
        <div className="overflow-x-auto w-full">
          <table className="table table-lg w-full">
            <thead>
              <tr className="table-row">
                <th className="table-cell">Serial No.</th>
                <th
                  className=" table-cell cursor-pointer"
                  onClick={() => requestSort("agencyName")}
                >
                  Distributor Agency Name{" "}
                  {sortConfig.key === "agencyName" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}{" "}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("contactPerson")}
                >
                  Contact Person{" "}
                  {sortConfig.key === "contactPerson" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("totalQuantitySold")}
                >
                  Total Quantity Sold{" "}
                  {sortConfig.key === "totalQuantitySold" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("totalSales")}
                >
                  Total Sales{" "}
                  {sortConfig.key === "totalSales" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((distributor, index) => (
                <tr key={index}>
                  <td>{indexOfFirstRecord + index + 1}</td>
                  <td>{distributor.agencyName}</td>
                  <td>{distributor.contactPerson}</td>
                  <td>{distributor.totalQuantitySold}</td>
                  <td>INR {distributor.totalSales} </td>
                </tr>
              ))}
            </tbody>
          </table>
        <Pagination
          nPages={Math.ceil(filteredRecords.length / recordsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        </div>
      </TitleCard>
    </>
  );
};

export default AllDistributorSalesTable;
