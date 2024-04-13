import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import { useDispatch } from 'react-redux'
import { showNotification } from "../../common/headerSlice";
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
              href="#"
            >
              Previous
            </a>
          </li>
          {pageNumbers.map((pgNumber) => (
            <li key={pgNumber} className={`  `}>
              <a
                onClick={() => setCurrentPage(pgNumber)}
                className={`join-item btn btn-ghost ${
                  currentPage == pgNumber ? "btn-active" : ""
                }`}
                href="#"
              >
                {pgNumber}
              </a>
            </li>
          ))}
          <li className="">
            <a
              className="join-item btn btn-ghost"
              onClick={goToNextPage}
              href="#"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  };







const ExpanseTable = () => {

    const dispatch = useDispatch()
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const [selectedId, setSelectedId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [formData, setFormData] = useState([
        {
          salary: 0,
          incentive: 0,
          miscellaneous: 0,
        }
      ]);



    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/expenses/all"
            );
            setData(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, []);

      const handleCheckboxChange = (e, id) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedId(id);
            const foundSalespersons = data.find((expense) => parseInt(expense.id) === parseInt(id));

                // if (foundSalespersons){
                //     setFormData(foundSalespersons);

                // }
        } else {
            // setFormData([]);
            setSelectedId(null);
        }
    }

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
    const nPages = Math.ceil(data.length / recordsPerPage);

    console.log(currentRecords);
    console.log(selectedId);
    console.log(sortConfig.key)
    console.log(data.slice().sort((a,b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    }))

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
        } catch (error) {
          console.error("Error deleting salesperson:", error);
        }
      };

      const handleUpdate = async (e) => {
        document.getElementById("update_modal").showModal();
    }

    const handleSubmit = async (e, formData) => {
        try {
            e.preventDefault();
            const params = new URLSearchParams();
        for (const key in formData) {
            params.append(key, formData[key]);
        }
            await axios.put(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/expenses/update/${selectedId}`, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
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

            const handleChange = (e) => {
                const { name, value } = e.target;
                // Convert the value to a number using parseFloat or parseInt
                const numericValue = parseFloat(value); // or parseInt(value, 10) for integers
                setFormData({ ...formData, [name]: numericValue });
              };

  return (
    <>
    <TitleCard title="Expenses" topMargin="mt-2"
    TopSideButtons1={
        <button className="btn btn-success" onClick={handleUpdate}>
          Update
        </button>
      }
    TopSideButtons2={
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      }
    >
    <table className="table w-full">
        <thead>
            <tr>
                <th>Select</th>
                {/* <th className=' table-cell cursor-pointer' onClick={() => requestSort('name')}>Sales Person Name {sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th> */}
                <th >Salesperson Name </th>
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
                    <td>{record.salesperson.name}</td>
                    <td>{record.createDate.trim().slice(0, 10)}</td>
                    <td>{record.salary}</td>
                    <td>{record.incentive}</td>
                    <td>{record.miscellaneous}</td>
                </tr>
            ))}
        </tbody>
    </table>
    <Pagination
        nPages={nPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
</TitleCard>
{/*modal for update*/}
{selectedId && (
        <dialog id='update_modal' className='modal'>
             <div className="modal-box w-11/12 max-w-7xl">
                <TitleCard title="Update Expense">
                    <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-4">
                    <button onClick={() => document.getElementById("update_modal").close()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <div className="grid grid-cols-3 gap-4">
                    <div>
                <label
                  htmlFor="name"
                  className="label label-text text-base"
                >
                  Salery:
                </label>
                <input
                  type="text"
                  placeholder="Salery"
                  className="w-full input input-bordered input-primary"
                  id="name"
                  name="name"
                  value={formData.salary}
                  onChange={handleChange}
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
                  type="text"
                  placeholder="Incentive"
                  className="w-full input input-bordered input-primary"
                  id="Incentive"
                  name="Incentive"
                  value={formData.incentive}
                  onChange={handleChange}
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
                  type="text"
                  placeholder="Miscellaneous"
                  className="w-full input input-bordered input-primary"
                  id="miscellaneous"
                  name="miscellaneous"
                  value={formData.miscellaneous}
                  onChange={handleChange}
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
    )

    }
    
    </>
  )
}

export default ExpanseTable