import React, { useState, useEffect } from 'react'
// import moment from 'moment';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import TitleCard from '../../../components/Cards/TitleCard';
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




const SalesPersonsTable = () => {

    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [selectedId, setSelectedId] = useState(null);
    // const [selectedProfile, setSelectedProfile] = useState([]);
    const [formData, setFormData] = useState([{
        name: '',
        contactNumber: '',
        email: ''
      }]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all`
                );
                setData(response.data);
                // console.log(response.data);

                // const foundSalespersons = data.find((salesperson) => parseInt(salesperson.id) === parseInt(selectedId));
                // setSelectedProfile(foundSalespersons);
                // console.log(foundSalespersons);

                // if (foundSalespersons){
                //     setFormData(foundSalespersons);

                // }



            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // console.log(selectedProfile)
    // console.log(formData)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    

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

    const handleCheckboxChange = (e, id) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedId(id);
            const foundSalespersons = data.find((salesperson) => parseInt(salesperson.id) === parseInt(id));
                // setSelectedProfile(foundSalespersons);
                // console.log(foundSalespersons);

                if (foundSalespersons){
                    setFormData(foundSalespersons);

                }
        } else {
            setFormData([]);
            setSelectedId(null);
        }
    }

// console.log(selectedId)

const handleSubmit = async (e, formData) => {
    try {
        e.preventDefault();
        const params = new URLSearchParams();
    for (const key in formData) {
        params.append(key, formData[key]);
    }
        await axios.put(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/update-salesperson/${selectedId}`, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log("Eway Bill updated successfully");
        const response = await axios.get(
            "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all"
          );
          setData(response.data);
        dispatch(
            showNotification({
              message: "Eway Bill updated to invoice successfully 😁",
              status: 1,
            })
          );
        } catch (error) {
            console.error("Error updating/adding Eway Bill:", error);
            dispatch(
              showNotification({
                message: "Error updating/adding Eway Bill! 😵",
                status: 0,
              })
            );
          }
        };

        const handleUpdate = async (e) => {
            document.getElementById("update_modal").showModal();
        }

  return (
    <>
    <TitleCard
        title="All Sales Persons Table"
        topMargin="mt-2"
        TopSideButtons1={
            <button className="btn btn-success" onClick={handleUpdate} >
              Update
            </button>
          }
        >
        <div className="overflow-x-auto w-full">
            <table className="table table-lg w-full">
                <thead>
                    <tr className='table-row'>
                        <th className='table-cell'> Select </th>
                        <th className='table-cell'>Serial No.</th>
                        <th className=' table-cell cursor-pointer' onClick={() => requestSort('name')}>Sales Person Name {sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                        <th className='table-cell  cursor-pointer' onClick={() => requestSort('contactNumber')}>Contact Number {sortConfig.key === 'contactNumber' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                        <th className='table-cell  cursor-pointer' onClick={() => requestSort('email')}>Email {sortConfig.key === 'email' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((salespersons, index) => (
                        <tr key={index}>
                             <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={(e) => handleCheckboxChange(e, salespersons.id)}
                        checked={salespersons.id === selectedId}
                      />
                    </label>
                  </td>
                            <td>{indexOfFirstRecord + index + 1}</td>
                            <td>{salespersons.name}</td>
                            <td>{salespersons.contactNumber}</td>
                            <td>{salespersons.email}</td>
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

    {/*modal for update*/}
    {selectedId && (
        <dialog id='update_modal' className='modal'>
             <div className="modal-box w-11/12 max-w-7xl">
                <TitleCard title="Update Sales Person">
                    <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-4">
                    <button onClick={() => document.getElementById("update_modal").close()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <div className="grid grid-cols-3 gap-4">
                    <div>
                <label
                  htmlFor="name"
                  className="label label-text text-base"
                >
                  Sales Person Name:
                </label>
                <input
                  type="text"
                  placeholder="Sales Person Name"
                  className="w-full input input-bordered input-primary"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactNumber"
                  className="label label-text text-base"
                >
                  Contact Number:
                </label>
                <input
                  type="text"
                  placeholder="Contact Number"
                  className="w-full input input-bordered input-primary"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="label label-text text-base"
                >
                  Email:
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  className="w-full input input-bordered input-primary"
                  id="email"
                  name="email"
                  value={formData.email}
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

export default SalesPersonsTable