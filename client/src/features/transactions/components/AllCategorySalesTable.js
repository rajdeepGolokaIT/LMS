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

    return (
        <nav>
            <ul className="join">
                <li className="">
                    <a
                        className="join-item btn btn-ghost"
                        onClick={goToPrevPage}
                        // href="#"
                    >
                        Previous
                    </a>
                </li>
                {pageNumbers.map((pgNumber, index) => {
                    if (
                        (index <= 2 || index >= nPages - 2) ||
                        (index >= currentPage - 1 && index <= currentPage + 1)
                    ) {
                        return (
                            <li key={pgNumber} className={`  `}>
                                <a
                                    onClick={() => setCurrentPage(pgNumber)}
                                    className={`join-item btn btn-ghost ${
                                        currentPage === pgNumber ? "btn-active" : ""
                                    }`}
                                    // href="#"
                                >
                                    {pgNumber}
                                </a>
                            </li>
                        );
                    } else if (
                        (index === 3 && currentPage > 5) ||
                        (index === nPages - 3 && currentPage < nPages - 4)
                    ) {
                        return (
                            <li key={pgNumber} className={`  `}>
                                <span className={`join-item btn btn-ghost disabled`}>&hellip;</span>
                            </li>
                        );
                    } else {
                        return null;
                    }
                })}
                <li className="">
                    <a
                        className="join-item btn btn-ghost"
                        onClick={goToNextPage}
                        // href="#"
                    >
                        Next
                    </a>
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
    
    const endDate = moment().format('YYYY-MM-DD');
    const oldYear = (moment().year() - 2).toString();
    const ddMM = moment().format('MM-DD');
    const startDate = `${oldYear}-${ddMM}`;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/categories/top-selling-categories?fromDate=${startDate}&toDate=${endDate}`
                );
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    

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
                            <td>₹ {category.totalPrice}</td>
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