import React, { useState, useEffect } from "react";
// import moment from "moment";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../common/headerSlice';
import TitleCard from "../../../components/Cards/TitleCard";
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";


const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  
    const goToNextPage = () => {
      if (currentPage !== nPages) setCurrentPage(currentPage + 1);
    };
    
    const goToPrevPage = () => {
      if (currentPage !== 1) setCurrentPage(currentPage - 1);
    };
  
    const goToPage = (pageNumber) => {
    //   if (pageNumber >= 1 && pageNumber <= nPages)
      setCurrentPage(pageNumber);
    };
  
    return (
      <nav className="flex justify-start my-4">
        <ul className="flex ">
          <li className="page-item">
            <button
              className="btn btn-ghost"
              onClick={goToPrevPage}
            >
              Previous
            </button>
          </li>
          {pageNumbers.map((pgNumber, index) => {
            if (
              index <= 2 ||
              index >= nPages - 2 ||
              (index >= currentPage - 1 && index <= currentPage + 1)
            ) {
              return (
                <li key={pgNumber} className={`page-item ${currentPage === pgNumber ? 'active' : ''}`}>
                  <button
                    className={`btn btn-ghost ${currentPage === pgNumber ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(pgNumber)}
                  >
                    {pgNumber}
                  </button>
                </li>
              );
            } else if (
              (index === 3 && currentPage > 5) ||
              (index === nPages - 3 && currentPage < nPages - 4)
            ) {
              return (
                <li key={pgNumber} className="page-item disabled">
                  <span className="btn btn-ghost">...</span>
                </li>
              );
            } else {
              return null;
            }
          })}
          <li className="page-item">
            <button
              className="btn btn-ghost"
              onClick={goToNextPage}
            >
              Next
            </button>
          </li>
          <li className="page-item">
            <input
              type="number"
              className="input input-bordered w-20 mx-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value))}
            />
          </li>
        </ul>
      </nav>
    );
  };


const AllProductTable = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Products Table" }))
      }, [])

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
      key: null,
      direction: "ascending",
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/products/all`
            );
            setData(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, []);

      const filteredRecords = data.filter(products => {
        return (
          String(products.productName).toLowerCase().includes(searchTerm.toLowerCase())
        )
      });

      const handleSearchChange = event => {
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

  return (
    <>
    <TitleCard title="All Products Table" topMargin="mt-2"
    TopSideButtons1={
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
           />
      }
    
    >
      <div className="overflow-x-auto w-full">
        <table className="table table-lg w-full">
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
                onClick={() => requestSort("price")}
              >
                Price Per Unit
                {sortConfig.key === "price" &&
                sortConfig.direction === "ascending" ? (
                  <SortIcon1 className="h-5 w-5 inline" />
                ) : (
                  <SortIcon2 className="h-5 w-5 inline" />
                )}
              </th>
              <th
                className="table-cell  cursor-pointer"
                onClick={() => requestSort("category.categoryName")}
              >
                Category
                {sortConfig.key === "category.categoryName" &&
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
                <td title={`${product.productName}`}>{product.productName.length > 20 ? product.productName.trim().slice(0, 20) + "..." : product.productName}</td>
                <td>{product.price} INR</td>
                <td>{product.category.categoryName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        nPages={Math.ceil(filteredRecords.length / recordsPerPage)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </TitleCard>
  </>
  )
}

export default AllProductTable