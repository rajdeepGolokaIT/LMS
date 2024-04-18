import React, { useState, useEffect } from "react";
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

const AllCategoryTable = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
      key: null,
      direction: "ascending",
    });
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Categories List" }))
      }, [])

      useEffect(() => {
        fetchCategoryData();
      }, []);
    
      const fetchCategoryData = async () => {
        try {
          const response = await axios.get(
            "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/products/all"
          );
          const products = response.data;
          const categoryCounts = {};
    
          products.forEach((product) => {
            const categoryName = product.category.categoryName;
            if (categoryCounts[categoryName]) {
              categoryCounts[categoryName]++;
            } else {
              categoryCounts[categoryName] = 1;
            }
          });
    
          const categoryData = Object.entries(categoryCounts).map(
            ([categoryName, count], index) => {
              const categoryId = products.find(
                (product) => product.category.categoryName === categoryName
              ).category.id;
              return {
                index: index + 1,
                categoryId: categoryId,
                categoryName: categoryName,
                totalCount: count,
              };
            }
          );
    
          setCategoryData(categoryData);
        } catch (error) {
          console.error("Error fetching category data:", error);
        }
      };

      const handleDelete = async () => {
        try {
           {
            await axios.delete(
              `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/categories/delete-category?id=${selectedId}`
            );
          }
          setSelectedId([]);
          // Reload data after deletion
          fetchCategoryData();
        } catch (error) {
          console.error("Error deleting Category:", error);
        }
      };

      const filteredRecords = categoryData.filter(categories => {
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

      const handleCheckboxChange = (e, id) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedId(id);
            // const foundSalespersons = data.find((expense) => parseInt(expense.id) === parseInt(id));

                // if (foundSalespersons){
                //     setFormData(foundSalespersons);

                // }
        } else {
            // setFormData([]);
            setSelectedId(null);
        }
    }

    console.log(selectedId)

  return (
    <>
    <TitleCard title="All Categories List" topMargin="mt-2"
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
        <button className={`btn ${selectedId === null ? "btn-disabled" : "btn-error"}`} onClick={handleDelete}>
          Delete
        </button>
      }
    
    >
      <div className="overflow-x-auto w-full">
        <table className="table table-lg w-full">
          <thead>
            <tr className="">
                <th className="table-cell">Select</th>
              <th className="table-cell">Serial No.</th>
              <th className="table-cell cursor-pointer" onClick={() => requestSort("categoryName")}>Category Name {sortConfig.key === "categoryName" && sortConfig.direction === "ascending" ? (<SortIcon1 className="h-5 w-5 inline" />) : (<SortIcon2 className="h-5 w-5 inline" />)}</th>
              <th className="table-cell cursor-pointer" onClick={() => requestSort("totalCount")}>Total Products Count {sortConfig.key === "totalCount" && sortConfig.direction === "ascending" ? (<SortIcon1 className="h-5 w-5 inline" />) : (<SortIcon2 className="h-5 w-5 inline" />)}</th>
            </tr>
            </thead>
            <tbody>
            {currentRecords.map((category, index) => (
              <tr key={category.categoryId}>
                <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={(e) => handleCheckboxChange(e, category.categoryId)}
                        checked={category.categoryId === selectedId}
                      />
                    </label>
                  </td>
                <td className="table-cell">{indexOfFirstRecord + index + 1}</td>
                <td className="table-cell">{category.categoryName}</td>
                <td className="table-cell">{category.totalCount}</td>
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

export default AllCategoryTable