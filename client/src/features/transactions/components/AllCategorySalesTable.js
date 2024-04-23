import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from 'axios';
import TitleCard from '../../../components/Cards/TitleCard';
// import SortIcon from '@heroicons/react/24/outline/Bars3CenterLeftIcon'
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




const AllCategorySalesTable = () => {

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [valueType, setValueType] = useState('true');
    
    const endDate = moment().format('YYYY-MM-DD');
    const oldYear = (moment().year() - 2).toString();
    const ddMM = moment().format('MM-DD');
    const startDate = `${oldYear}-${ddMM}`;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/categories/top-selling-categories?fromDate=${startDate}&toDate=${endDate}&status=${valueType}`
                );
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [valueType]);

    

    const filteredRecords = data.filter(categories => {
        return (
          String(categories.categoryName).toLowerCase().includes(searchTerm.toLowerCase())
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
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

    




  return (
    <>
    <TitleCard
        title="All Categories Sales Table"
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
            onChange={(e) => setValueType(e.target.value) }
            value={valueType}
            className="px-2 border border-gray-300 rounded-md mr-2"
            >
              <option value="true">Active Categoriess</option>
              <option value="false">Inactive Categories</option>
            </select>
          }
        >
        <div className="overflow-x-auto w-full">
            <table className="table table-lg w-full">
                <thead>
                    <tr className='table-row'>
                        <th className='table-cell'>Serial No.</th>
                        <th className=' table-cell cursor-pointer' onClick={() => requestSort('categoryName')}>Category Name {sortConfig.key === 'categoryName' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                        <th className='table-cell  cursor-pointer' onClick={() => requestSort('totalQuantitySold')}>Total Quantity Sold {sortConfig.key === 'totalQuantitySold' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                        <th className='table-cell  cursor-pointer' onClick={() => requestSort('totalPrice')}>Total Sales {sortConfig.key === 'totalPrice' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((category, index) => (
                        <tr key={index}>
                            <td>{indexOfFirstRecord + index + 1}</td>
                            <td>{category.categoryName}</td>
                            <td>{category.totalQuantitySold}</td>
                            <td>INR {category.totalPrice} </td>
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

export default AllCategorySalesTable