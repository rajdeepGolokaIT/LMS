import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from 'axios';
import TitleCard from '../../../components/Cards/TitleCard';
import SortIcon from '@heroicons/react/24/outline/Bars3CenterLeftIcon'


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



const AllDistributorSalesTable = () => {


    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    
    const endDate = moment().format('YYYY-MM-DD');
    const oldYear = (moment().year() - 2).toString();
    const ddMM = moment().format('MM-DD');
    const startDate = `${oldYear}-${ddMM}`;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/total-sales-by-distributors?fromDate=${startDate}&toDate=${endDate}`
                );
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    

    const sortedData = data.slice().sort((a, b) => {
        if (sortConfig.key !== null) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
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
                title="All Product Sales Table"
                topMargin="mt-2">
                <div className="overflow-x-auto w-full">
                    <table className="table table-lg w-full">
                        <thead>
                            <tr className='table-row'>
                                <th className='table-cell'>Serial No.</th>
                                <th className=' table-cell cursor-pointer' onClick={() => requestSort('agencyName')}>Distributor Agency Name<SortIcon className='h-5 w-5 inline'/></th>
                                <th className='table-cell  cursor-pointer' onClick={() => requestSort('contactPerson')}>Contact Person<SortIcon className='h-5 w-5 inline'/></th>
                                <th className='table-cell  cursor-pointer' onClick={() => requestSort('totalQuantitySold')}>Total Quantity Sold<SortIcon className='h-5 w-5 inline'/></th>
                                <th className='table-cell  cursor-pointer' onClick={() => requestSort('totalSales')}>Total Sales<SortIcon className='h-5 w-5 inline'/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((distributor, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstRecord + index + 1}</td>
                                    <td>{distributor.agencyName}</td>
                                    <td>{distributor.contactPerson}</td>
                                    <td>{distributor.totalQuantitySold}</td>
                                    <td>{distributor.totalSales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            <Pagination
                nPages={Math.ceil(data.length / recordsPerPage)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            </TitleCard>
        </>
  )
}

export default AllDistributorSalesTable