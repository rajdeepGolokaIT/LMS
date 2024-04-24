import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import { useDispatch } from 'react-redux'
import { showNotification, setPageTitle } from "../../common/headerSlice";
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







const ExpanseTable = () => {

    const dispatch = useDispatch()
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [selectedId, setSelectedId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [salespersonNames, setSalespersonNames] = useState([]);
    const [formData, setFormData] = useState(
        {
            salary: 0,
            incentive: 0,
            miscellaneous: 0,
        }
    );

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Expenses" }))
      }, [])


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/expenses/all"
            );
            const response2 = await axios.get(
                "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all"
            );

            setData(response.data);

            setSalespersonNames(response2.data)


          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, []);

      console.log(salespersonNames)

      const handleCheckboxChange = (e, id) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedId(id);
            const foundSalespersons = data.find((expense) => parseInt(expense.id) === parseInt(id));

                if (foundSalespersons){
                    setFormData(foundSalespersons);

                }
        } else {
            // setFormData([]);
            setSelectedId(null);
        }
    }

    const filteredRecords = data.filter(expenses => {
        return (
          String(salespersonNames.find((salesperson) => parseInt(salesperson.id) === parseInt(expenses.salesperson))?.name).toLowerCase().includes(searchTerm.toLowerCase())
        )
      });

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
      };

    const sortedData = filteredRecords.slice().sort((a, b) => {
        if (sortConfig.key !== null) {
          if (sortConfig.key === 'salesperson') {
            const aName = salespersonNames.find((person) => person.id === a.salesperson)?.name || '';
            const bName = salespersonNames.find((person) => person.id === b.salesperson)?.name || '';
            return sortConfig.direction === 'ascending' ? aName.localeCompare(bName) : bName.localeCompare(aName);
        } else {
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
    // const nPages = Math.ceil(filteredRecords.length / recordsPerPage);

    
    console.log(data.slice().sort((a,b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    }))

    const handleDeleteModal = async (e) => {
        document.getElementById("delete_modal").showModal();
      };

    const handleDelete = async () => {
        try {
           {
            await axios.delete(
              `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/expenses/delete/${selectedId}`
            );
          }
          setSelectedId([]);
          // Reload data after deletion
          const response = await axios.get(
            "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/expenses/all"
          );
          setData(response.data);

          document.getElementById("delete_modal").close();

        } catch (error) {
          console.error("Error deleting salesperson:", error);
        }
      };

      const handleUpdate = async (e) => {
        document.getElementById("update_modal").showModal();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            await axios.put(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/expenses/update/${parseInt(selectedId)}`, formData,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
            );
            console.log("Expense updated successfully");
            const response = await axios.get(
                "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/expenses/all"
              );
              setData(response.data);
            dispatch(
                showNotification({
                  message: "Expense updated to invoice successfully 😁",
                  status: 1,
                })
              );
              document.getElementById("update_modal").close()

            } catch (error) {
                console.error("Error updating Expense:", error);
                dispatch(
                  showNotification({
                    message: "Error updating Expense! 😵",
                    status: 0,
                  })
                );
              }
            };

            console.log(formData)

            

  return (
    <>
    <TitleCard title="Expenses" topMargin="mt-2"
    TopSideButtons2={
        <button className={`btn ${selectedId === null ? "btn-disabled" : "btn-success"}`} onClick={handleUpdate}>
          Update
        </button>
      }
    TopSideButtons3={
        <button className={`btn ${selectedId === null ? "btn-disabled" : "btn-error"}`} onClick={handleDeleteModal}>
          Delete
        </button>
      }
      TopSideButtons1={
        <>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
           />
           <select className="input input-bordered w-full max-w-xs" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}>
            <option value="">Select Salesperson</option>
            {salespersonNames.map((salesperson) => (
              <option key={salesperson.name} value={salesperson.name}> {salesperson.name} </option>
            ))}
          </select>
            
           </>
      }
    >
   <div className="overflow-x-auto w-full">
        <table className="table table-lg w-full">
        <thead>
            <tr>
                <th>Select</th>
                {/* <th className=' table-cell cursor-pointer' onClick={() => requestSort('name')}>Sales Person Name {sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th> */}
                <th className="table-cell cursor-pointer" onClick={() => requestSort('salesperson')}>Salesperson Name {sortConfig.key === 'salesperson' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>} </th>
                <th className=' table-cell cursor-pointer' onClick={() => requestSort('createDate')}>Date {sortConfig.key === 'createDate' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className=' table-cell cursor-pointer' onClick={() => requestSort('salary')}>Salary {sortConfig.key === 'salary' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('incentive')}>Incentive {sortConfig.key === 'incentive' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('miscellaneous')}>Miscellaneous {sortConfig.key === 'miscellaneous' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
            </tr>
        </thead>
        <tbody>
            {currentRecords.map((record) => (
                <tr key={record.id}>
                    
                    <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={(e) => handleCheckboxChange(e, record.id)}
                        checked={record.id === selectedId}
                      />
                    </label>
                  </td>
                    <td>{salespersonNames.find((salesperson) => salesperson.id === record.salesperson).name}</td>
                    <td>{record.createDate.trim().slice(0, 10)}</td>
                    <td>INR {record.salary} </td>
                    <td>INR {record.incentive} </td>
                    <td>INR {record.miscellaneous} </td>
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
{/*modal for update*/}
{selectedId && (
        <dialog id='update_modal' className='modal'>
             <div className="modal-box w-11/12 max-w-7xl">
                <TitleCard title="Update Expense">
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <label onClick={() => document.getElementById("update_modal").close()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    <div className="grid grid-cols-3 gap-4">
                    <div>
                <label
                  htmlFor="name"
                  className="label label-text text-base"
                >
                  Salery:
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Salery"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactNumber"
                  className="label label-text text-base"
                >
                  Incentive:
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Incentive"
                  id="incentive"
                  name="incentive"
                  value={formData.incentive}
                  onChange={(e) => setFormData({ ...formData, incentive: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="miscellaneous"
                  className="label label-text text-base"
                >
                  Miscellaneous:
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Miscellaneous"
                  id="miscellaneous"
                  name="miscellaneous"
                  value={formData.miscellaneous}
                  onChange={(e) => setFormData({ ...formData, miscellaneous: parseInt(e.target.value) })}
                  required
                />
              </div>
                    </div>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                    </form>
                </TitleCard>
             </div>
        </dialog>
    )}

{selectedId !== null && (
        <dialog id="delete_modal" className="modal">
          <div className="modal-box ">
            <TitleCard title="CAUSION !!!">
              <p className="py-4 text-center">Are you sure you want to delete this Expense Entry?</p>
              <div className="flex justify-between w-1/2 m-auto mt-10">
                <label
                  htmlFor="delete_modal"
                  className="btn btn-error px-8"
                  onClick={handleDelete}
                >
                  Yes
                </label>
                <label
                  htmlFor="delete_modal"
                  className="btn btn-ghost px-8"
                  onClick={() =>
                    document.getElementById("delete_modal").close()
                  }
                >
                  No
                </label>
              </div>
            </TitleCard>
          </div>
        </dialog>
      )}
    
    </>
  )
}

export default ExpanseTable