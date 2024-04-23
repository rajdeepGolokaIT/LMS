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




const AllDistributorsTable = () => {

    const dispatch = useDispatch()
    const [data, setData] = useState([]);
    const [selectedList, setSelectedList] = useState('active_distributors')
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [selectedId, setSelectedId] = useState(null);
    const [thisId, setThisId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        address: "",
        zone: "",
        city: "",
        region: "",
        state: "",
        agencyName: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        gstNo: "",
        panNo: ""
    });
                    

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Distributors List" }))
      }, [])


      useEffect(() => {
        const fetchData = async () => {
          try {
            if(selectedList === 'active_distributors') {
            const response = await axios.get(
              "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/all"
            );
            setData(response.data);
        } else if(selectedList === 'inactive_distributors') {
            const response = await axios.get(
              "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/all-inactive"
            );
            setData(response.data);
        }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [selectedList]);

      const filteredRecords = data.filter((distributors) => {
        return (
            String(distributors.distributorProfile.agencyName).toLowerCase().includes(searchTerm.toLowerCase()) ||
            // String(distributors.distributorProfile.contactPerson).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(distributors.distributorProfile.gstNo).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(distributors.distributorProfile.panNo).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(distributors.distributorProfile.city).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(distributors.distributorProfile.region).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(distributors.distributorProfile.zone).toLowerCase().includes(searchTerm.toLowerCase())
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
    const nPages = Math.ceil(filteredRecords.length / recordsPerPage);

    
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
            await axios.put(
              `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/distributor-status?id=${thisId}`
            );
          }
          console.log("selected distributor deleted")
          setSelectedId(null);
          // Reload data after deletion
          const response = await axios.get(
            "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/all"
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
            
            await axios.put(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributorProfiles/update-distributorProfile/${parseInt(selectedId)}`, formData,
            // {
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //     },
            // }
            );
            console.log("Expense updated successfully");
            const response = await axios.get(
                "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/all"
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

            const handleCheckboxChange = (e, id, id2) => {
                const isChecked = e.target.checked;
                if (isChecked) {
                    setSelectedId(id);
                    setThisId(id2);
                    const foundDistributorProfile = data.find((distributors) => parseInt(distributors.distributorProfile.id) === parseInt(id));
        
                        if (foundDistributorProfile) {
                            setFormData(foundDistributorProfile.distributorProfile);
        
                        }
                } else {
                    setFormData({});
                    setSelectedId(null);
                    setThisId(null);
                }
            }

            console.log(selectedId, thisId)

  return (
    <>
    <TitleCard title="All Distributors List" topMargin="mt-2"
    TopSideButtons2={
        <button className={`btn ${selectedId === null ? "btn-disabled" : "btn-primary"}`} onClick={handleUpdate}>
          Update
        </button>
      }
    TopSideButtons3={
        <>
        <button
          className={`btn ${
            selectedId === null ? "btn-disabled" : (selectedList === 'active_distributors' ? 'btn-error' : 'btn-success')
          }`}
          onClick={handleDeleteModal}
        >
          {selectedList === 'active_distributors' ? 'Deactivate' : 'Activate'}
        </button>
        <select
        className="px-2 border border-gray-300 rounded-md mr-2"
        onChange={(e) => setSelectedList(e.target.value)}
        value={selectedList}
        >
            <option value="active_distributors">Active Distributers</option>
            <option value="inactive_distributors">Inactive Distributers</option>
        </select>
        </>
      }
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
   <div className="overflow-x-auto w-full" style={{ overflowY: 'auto', maxHeight: '450px' }}>
        <table className="table table-zebra table-lg w-full">
        <thead>
            <tr>
                <th>Select</th>
                <th>Serial No.</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('distributorProfile.agencyName')}>Distributer Name {sortConfig.key === 'distributorProfile.agencyName' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>} </th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('distributorProfile.gstNo')}>GSTIN {sortConfig.key === 'distributorProfile.gstNo' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('distributorProfile.panNo')}>PAN {sortConfig.key === 'distributorProfile.panNo' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('distributorProfile.contactPerson')}>Contact Person {sortConfig.key === 'distributorProfile.contactPerson' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('distributorProfile.contactNumber')}>Contact Number {sortConfig.key === 'distributorProfile.contactNumber' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('distributorProfile.email')}>Email {sortConfig.key === 'distributorProfile.email' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('distributorProfile.address')}>Address {sortConfig.key === 'distributorProfile.address' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className=' table-cell cursor-pointer' onClick={() => requestSort('distributorProfile.city')}>City {sortConfig.key === 'distributorProfile.city' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className=' table-cell cursor-pointer' onClick={() => requestSort('distributorProfile.region')}>Region {sortConfig.key === 'distributorProfile.region' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>
                <th className="table-cell cursor-pointer" onClick={() => requestSort('distributorProfile.zone')}>Zone {sortConfig.key === 'distributorProfile.zone' && sortConfig.direction === 'ascending' ? <SortIcon1 className='h-5 w-5 inline'/> : <SortIcon2 className='h-5 w-5 inline'/>}</th>

            </tr>
        </thead>
        <tbody>
            {currentRecords.map((record, index) => (
                <tr key={record.distributorProfile.id}>
                    
                    <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={(e) => handleCheckboxChange(e, record.distributorProfile.id, record.id)}
                        checked={record.distributorProfile.id === selectedId && record.id === thisId}
                      />
                    </label>
                  </td>
                    <td>{ indexOfFirstRecord + index + 1}</td>
                  <td>{record.distributorProfile.agencyName}</td>
                  <td>{record.distributorProfile.gstNo}</td>
                  <td>{record.distributorProfile.panNo}</td>
                  <td>{record.distributorProfile.contactPerson}</td>
                  <td>{record.distributorProfile.contactNumber}</td>
                  <td>{record.distributorProfile.email}</td>
                  <td>{record.distributorProfile.address}</td>
                  <td>{record.distributorProfile.city}</td>
                  <td>{record.distributorProfile.region}</td>
                  <td>{record.distributorProfile.zone}</td>

                    
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
                  htmlFor="agencyName"
                  className="label label-text text-base"
                >
                  Distributor Name:
                </label>
                <input
                  type="text"
                  pattern="^[a-zA-Z\s]*$"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Distributor Name"
                  id="agencyName"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                //   required
                />
              </div>

              <div>
                <label
                  htmlFor="gstNo"
                  className="label label-text text-base"
                >
                  GST No:
                </label>
                <input
                  type="text"
                  pattern=""
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="GST No"
                  id="gstNo"
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                //   required
                />
              </div>
              <div>
                <label
                  htmlFor="panNo"
                  className="label label-text text-base"
                >
                  PAN No:
                </label>
                <input
                  type="text"
                  pattern="^[a-zA-Z0-9\s]*$"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="PAN No"
                  id="panNo"
                  name="panNo"
                  value={formData.panNo}
                  onChange={(e) => setFormData({ ...formData, panNo: e.target.value })}
                //   required
                />
              </div>
              <div>
                <label
                  htmlFor="contactPerson"
                  className="label label-text text-base"
                >
                  Contact Person:
                </label>
                <input
                  type="text"
                  pattern="^[a-zA-Z\s]*$"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Contact Person"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                //   required
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
                  type="phone"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  placeholder="Please enter a 10-digit phone number"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                //   required
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
                  type="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                //   required
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="label label-text text-base"
                >
                  Address:
                </label>
                <input
                  type="text"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Address"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                //   required
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="label label-text text-base"
                >
                  City:
                </label>
                <input
                  type="text"
                  pattern="^[a-zA-Z\s]*$"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="City"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                //   required
                />
                    </div>
                    <div>
                <label
                  htmlFor="state"
                  className="label label-text text-base"
                >
                  State:
                </label>
                <input
                  type="text"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="State"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                //   required
                />
                    </div>
                    <div>
                        <label
                          htmlFor="zone" 
                          className="label label-text text-base"
                        >
                          Zone:
                        </label>
                        <input
                          type="text"
                          className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Zone"
                          id="zone"
                          name="zone"
                          value={formData.zone}
                          onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                        //   required
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
              <p className="py-4 text-center">Are you sure you want to {selectedList === 'active_distributors' ? 'Deactivate' : 'Activate'} this Distributor Profile?</p>
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

export default AllDistributorsTable