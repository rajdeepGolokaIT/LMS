import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import { useDispatch } from "react-redux";
import Pagination from "../../../components/Input/Pagination";
import { showNotification, setPageTitle } from "../../common/headerSlice";
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";
import { BASE_URL } from "../../../Endpoint";
import MenuIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import jsPDF from "jspdf";
import "jspdf-autotable";



const AllDistributorsTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [selectedList, setSelectedList] = useState("active_distributors");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState(null);
  const [thisId, setThisId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
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
    panNo: "",
  });
  const [salespersonDistributor, setSalespersonDistributor] = useState([]);
  const [salesPersonList, setSalespersonList] = useState([]);
  const [updatedSalesPersonId, setUpdatedSalesPersonId] = useState(null);


  useEffect(() => {
    fetchSalespersons();
    fetchAllSalesperson();
  }, []);
  

  const fetchSalespersons = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/distributors/distributor-salesperson-details`);
      setSalespersonDistributor(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const fetchAllSalesperson = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/salespersons/salespersonlist-names-ids`);
      const newData = response.data.map(([id, name]) => ({ id, name }));
      setSalespersonList(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

// console.log(salespersonDistributor.find((salesperson) => parseInt(salesperson.distributorId) === parseInt(data[0].id))?.salespersonName)
// console.log(salespersonDistributor)

const fetchData = async () => {
  try {
    // Wait for fetchSalespersons to complete
    // await fetchSalespersons();

    if (selectedList === "active_distributors") {
      const response = await axios.get(
        `${BASE_URL}/api/v1/distributors/all`
      );
      const newData = response.data.map((distributor) => ({
        ...distributor,
        salespersonId:  salespersonDistributor.find((salesperson) => parseInt(salesperson.distributorId) === parseInt(distributor.id))?.salespersonId,
        salespersonName:  salespersonDistributor.find((salesperson) => parseInt(salesperson.distributorId) === parseInt(distributor.id))?.salespersonName
      }));
      console.log(newData);
      setData(newData);
    } else if (selectedList === "inactive_distributors") {
      const response = await axios.get(
        `${BASE_URL}/api/v1/distributors/all-inactive`
      );
      const newData = response.data.map((distributor) => ({
        ...distributor,
        salespersonId:  salespersonDistributor.find((salesperson) => parseInt(salesperson.distributorId) === parseInt(distributor.id))?.salespersonId,
        salespersonName:  salespersonDistributor.find((salesperson) => parseInt(salesperson.distributorId) === parseInt(distributor.id))?.salespersonName
      }));
      setData(newData);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

useEffect(() => {

  fetchData();
}, [selectedList, salespersonDistributor]);


  console.log(data);

  const filteredRecords = data.filter((distributors) => {
    return (
      String(distributors.distributorProfile.agencyName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      // String(distributors.distributorProfile.contactPerson).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(distributors.distributorProfile.gstNo)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(distributors.distributorProfile.panNo)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(distributors.distributorProfile.city)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(distributors.distributorProfile.region)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(distributors.distributorProfile.zone)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
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
  const nPages = Math.ceil(filteredRecords.length / recordsPerPage);

  

  const handleDeleteModal = async (e) => {
    document.getElementById("delete_modal").showModal();
  };

  const handleDelete = async () => {
    try {
      {
        await axios.put(
          `${BASE_URL}/api/v1/distributors/distributor-status?id=${thisId}`
        );
      }
      console.log("selected distributor deleted");
      setSelectedId(null);
      // Reload data after deletion
      const response = await axios.get(
        `${BASE_URL}/api/v1/distributors/all`
      );
      setData(response.data);

      document.getElementById("delete_modal").close();
    } catch (error) {
      console.error("Error deleting salesperson:", error);
    }
  };

  const handleUpdate = async (e) => {
    document.getElementById("update_modal").showModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updatedSalesPersonId === null) {
    setUpdatedSalesPersonId(formData.salespersonId);
    }

    try {
      await Promise.all([
        axios.put(
          `${BASE_URL}/api/v1/distributorProfiles/update-distributorProfile/${parseInt(selectedId)}`,
          formData
        ),
        axios.put(
          `${BASE_URL}/api/v1/distributors/${thisId}/salesperson/${updatedSalesPersonId}`
          
        )
      ]);
  
      console.log("Both API calls executed successfully");
      console.log("Expense updated successfully");
      fetchData();
      fetchSalespersons();
      dispatch(
        showNotification({
          message: "Expense updated to invoice successfully 😁",
          status: 1,
        })
      );
      document.getElementById("update_modal").close();
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

  console.log(updatedSalesPersonId, thisId);

  const handleCheckboxChange = (e, id, id2) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedId(id);
      setThisId(id2);
      const foundDistributorProfile = data.find(
        (distributors) =>
          parseInt(distributors.distributorProfile.id) === parseInt(id)
      );

      if (foundDistributorProfile) {
        setFormData(foundDistributorProfile.distributorProfile);
        setUpdatedSalesPersonId(foundDistributorProfile.salespersonId);
      }
    } else {
      setFormData({});
      setSelectedId(null);
      setThisId(null);
    }
  };

  console.log(selectedId, thisId);

  const downloadPDF = () => {
    const pdf = new jsPDF();

    // Add Logo
    const logoImg = new Image();
    logoImg.src = "/c.png";
    const imageWidth = 10;
    const imageHeight = 10;
    const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
    const imageY = 10;
    pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);

    // Add Title
    const title = "All Distributor List";
    const fontSize = 14;
    const textWidth =
      (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
    const textX = (pdf.internal.pageSize.width - textWidth) / 2;
    const textY = imageY + imageHeight + 10;
    pdf.setFontSize(fontSize);
    pdf.text(title, textX, textY);
    pdf.setFontSize(fontSize);

    // Add Table
    const columns = [
      "Serial No.",
      "Distributor Name",
      "GSTIN",
      "Contact Person",
      "Contact Number",
      "Address",
    ];

    const rows = data.map((record, index) => [
      index + 1,
      record.distributorProfile.agencyName,
      record.distributorProfile.gstNo,
      record.distributorProfile.contactPerson,
      record.distributorProfile.contactNumber,
      record.distributorProfile.address +
        ", " +
        record.distributorProfile.city +
        ", " +
        record.distributorProfile.region +
        ", " +
        record.distributorProfile.zone,
    ]);

    const textHeight = fontSize / pdf.internal.scaleFactor;
    const tableStartY = textY + textHeight + 10;

    const minColumnWidths = columns.map(() => 20);
    const maxColumnWidths = columns.map(() => "auto");

    pdf.autoTable({
      head: [columns],
      body: rows,
      startY: tableStartY,
      columnWidth: "wrap",
      minCellWidth: minColumnWidths,
      maxCellWidth: maxColumnWidths,
    });

    pdf.save("all_distributor_report.pdf");
  };

  console.log(formData)

  return (
    <>
      <TitleCard
        title="All Distributors List"
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
            <MenuIcon className="btn btn-sm btn-circle"/>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box">
            <li>
            <button className="btn btn-primary btn-sm w-full mx-auto my-2" onClick={downloadPDF}>
            Download PDF
          </button>
            </li>
            <li>
          <button
            className={`btn btn-sm w-full mx-auto my-2 ${
              selectedId === null ? "btn-disabled" : "btn-primary"
            }`}
            onClick={handleUpdate}
          >
            Update
          </button></li>
          <li>
          <button
              className={`btn btn-sm w-full mx-auto my-2 ${
                selectedId === null
                  ? "btn-disabled"
                  : selectedList === "active_distributors"
                  ? "btn-error"
                  : "btn-success"
              }`}
              onClick={handleDeleteModal}
            >
              {selectedList === "active_distributors"
                ? "Deactivate"
                : "Activate"}
            </button>
          </li>
          <li>
          <select
              className="select select-sm mx-auto my-2 max-w-xs"
              onChange={(e) => setSelectedList(e.target.value)}
              value={selectedList}
            >
              <option value="active_distributors">Active Distributers</option>
              <option value="inactive_distributors">
                Inactive Distributers
              </option>
            </select>
          </li>
          </ul>
        </div>
        }
      >
        <div
          className="overflow-x-auto w-full"
          // style={{ overflowY: "auto", maxHeight: "450px" }}
        >
          <table className="table table-zebra-zebra table-xs">
            <thead>
              <tr>
                <th>Select</th>
                <th>Serial No.</th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() => requestSort("distributorProfile.agencyName")}
                >
                  Distributer Name{" "}
                  {sortConfig.key === "distributorProfile.agencyName" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}{" "}
                </th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() => requestSort("distributorProfile.gstNo")}
                >
                  GSTIN{" "}
                  {sortConfig.key === "distributorProfile.gstNo" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() => requestSort("distributorProfile.panNo")}
                >
                  PAN{" "}
                  {sortConfig.key === "distributorProfile.panNo" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() =>
                    requestSort("distributorProfile.contactPerson")
                  }
                >
                  Contact Person{" "}
                  {sortConfig.key === "distributorProfile.contactPerson" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() =>
                    requestSort("distributorProfile.contactNumber")
                  }
                >
                  Contact Number{" "}
                  {sortConfig.key === "distributorProfile.contactNumber" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() => requestSort("distributorProfile.email")}
                >
                  Email{" "}
                  {sortConfig.key === "distributorProfile.email" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() => requestSort("distributorProfile.address")}
                >
                  Address{" "}
                  {sortConfig.key === "distributorProfile.address" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className=" table-cell cursor-pointer"
                  onClick={() => requestSort("distributorProfile.city")}
                >
                  City{" "}
                  {sortConfig.key === "distributorProfile.city" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className=" table-cell cursor-pointer"
                  onClick={() => requestSort("distributorProfile.region")}
                >
                  Region{" "}
                  {sortConfig.key === "distributorProfile.region" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() => requestSort("distributorProfile.zone")}
                >
                  Zone{" "}
                  {sortConfig.key === "distributorProfile.zone" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th className="table-cell">Sales Person Name</th>
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
                        onChange={(e) =>
                          handleCheckboxChange(
                            e,
                            record.distributorProfile.id,
                            record.id
                          )
                        }
                        checked={
                          record.distributorProfile.id === selectedId &&
                          record.id === thisId
                        }
                      />
                    </label>
                  </td>
                  <td>{indexOfFirstRecord + index + 1}</td>
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
                  <td>{record.salespersonName}</td>
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
      {/*modal for update*/}
      {selectedId && (
        <dialog id="update_modal" className="modal">
          <div className="modal-box w-11/12 max-w-7xl">
            <TitleCard title="Update Expense">
              <form onSubmit={handleSubmit} className="space-y-4">
                <label
                  onClick={() =>
                    document.getElementById("update_modal").close()
                  }
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </label>
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
                      onChange={(e) =>
                        setFormData({ ...formData, agencyName: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, gstNo: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, panNo: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPerson: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, zone: e.target.value })
                      }
                      //   required
                    />
                  </div>
                  <div>
                    <label
                      className="label label-text text-base">
                        Sales Person Name
                      </label>
                    <select
                      className="w-full select select-bordered select-primary"
                      value={updatedSalesPersonId}
                      onChange={(e) =>
                        setUpdatedSalesPersonId(e.target.value)
                      }
                    >
                      {salesPersonList.map((salesPerson) => (
                        <option
                          key={salesPerson.id}
                          value={salesPerson.id}
                        >
                          {salesPerson.name}
                        </option>
                      ))}
                    </select>
                      

                  </div>
                </div>

                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
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
              <p className="py-4 text-center">
                Are you sure you want to{" "}
                {selectedList === "active_distributors"
                  ? "Deactivate"
                  : "Activate"}{" "}
                this Distributor Profile?
              </p>
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
  );
};

export default AllDistributorsTable;
