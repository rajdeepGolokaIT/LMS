import React, { useState, useEffect } from "react";
import moment from "moment";
import { BASE_URL } from "../../../Endpoint";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Pagination from "../../../components/Input/Pagination";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";
import MenuIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";



const AllProductSalesTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const endDate = moment().format("YYYY-MM-DD");
  const oldYear = (moment().year() - 2).toString();
  const ddMM = moment().format("MM-DD");
  const startDate = `${oldYear}-${ddMM}`;
  const [valueType, setValueType] = useState("true");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/products/top-selling?customFromDate=${startDate}&customToDate=${endDate}&status=${valueType}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [valueType]);

  console.log(data);

  const filteredRecords = data.filter((products) => {
    return String(products.productName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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

  const downloadPDF = () => {
    const pdf = new jsPDF();

    const logoImg = new Image();
    logoImg.src = "/c.png";
    const imageWidth = 10;
    const imageHeight = 10;
    const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
    const imageY = 10;
    pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);

    const title = "Product Sales Report";
    const fontSize = 14;
    const textWidth =
      (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
    const textX = (pdf.internal.pageSize.width - textWidth) / 2;
    const textY = imageY + imageHeight + 10;
    pdf.setFontSize(fontSize);
    pdf.text(title, textX, textY);
    pdf.setFontSize(fontSize);

    const rows = sortedData.map((product, index) => [
      index + 1,
      product.productName,
      `INR ${product.productPrice}`,
      product.productQuantity,
      `INR ${product.totalPrice}`,
    ]);

    const textHeight = fontSize / pdf.internal.scaleFactor;
    const tableStartY = textY + textHeight + 10;

    pdf.autoTable({
      head: [
        [
          "Serial No.",
          "Product Name",
          "Price Per Unit",
          "Total Quantity Sold",
          "Total Amount",
        ],
      ],
      body: rows,
      startY: tableStartY,
    });

    pdf.save("product_sales_report.pdf");
  };

  return (
    <>
      <TitleCard
        title="All Product Sales Table"
        topMargin="mt-2"
        TopSideButtons1={
          <input
            type="text"
            className="input input-sm input-bordered"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        }
        TopSideButtons2={
          <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="">
            <MenuIcon className="btn btn-sm btn-circle inline"/>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box">
          <li>
          <button className="btn btn-primary btn-sm mx-auto my-2 w-full" onClick={downloadPDF}>
            Download PDF
          </button>
          </li>
          <li><select
            onChange={(e) => setValueType(e.target.value)}
            value={valueType}
            className="select select-sm mx-auto my-2 max-w-xs"
          >
            <option value="true">Active Products</option>
            <option value="false">Inactive Products</option>
          </select></li>
          </ul>
        </div>
        }
        
      >
        <div className="overflow-x-auto w-full">
          <table className="table table-sm table-zebra-zebra">
            <thead>
              <tr className="">
                <th className="table-cell">Serial No.</th>
                <th
                  className=" table-cell cursor-pointer"
                  onClick={() => requestSort("productName")}
                >
                  Product Name
                  {sortConfig.key === "productName" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("productPrice")}
                >
                  Price Per Unit
                  {sortConfig.key === "productPrice" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("productQuantity")}
                >
                  Total Quantity Sold
                  {sortConfig.key === "productQuantity" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("totalPrice")}
                >
                  Total Amount
                  {sortConfig.key === "totalPrice" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((product, index) => (
                <tr key={index}>
                  <td>{indexOfFirstRecord + index + 1}</td>
                  <td title={`${product.productName}`}>
                    {product.productName.length > 20
                      ? product.productName.trim().slice(0, 20) + "..."
                      : product.productName}
                  </td>
                  <td>INR {product.productPrice} </td>
                  <td>{product.productQuantity}</td>
                  <td>INR {product.totalPrice} </td>
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

export default AllProductSalesTable;
