import React, { useState, useEffect } from "react";
// import moment from 'moment';
import Pagination from "../../../components/Input/Pagination";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import TitleCard from "../../../components/Cards/TitleCard";
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";


const SalesPersonsTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState([
    {
      name: "",
      contactNumber: "",
      email: "",
    },
  ]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedList, setSelectedList] = useState("active_salespersons");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedList === "active_salespersons") {
          const response = await axios.get(
            `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all`
          );
          setData(response.data);
        } else if (selectedList === "inactive_salespersons") {
          const response = await axios.get(
            `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all-inactive`
          );
          setData(response.data);
        }
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
  }, [selectedList]);

  // console.log(selectedProfile)
  // console.log(formData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sortedData = data.slice().sort((a, b) => {
    if (sortConfig.key !== null) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
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
      const foundSalespersons = data.find(
        (salesperson) => parseInt(salesperson.id) === parseInt(id)
      );
      // setSelectedProfile(foundSalespersons);
      // console.log(foundSalespersons);

      if (foundSalespersons) {
        setFormData(foundSalespersons);
      }
    } else {
      setFormData([]);
      setSelectedId(null);
    }
  };

  // console.log(selectedId)

  const handleSubmit = async (e, formData) => {
    try {
      e.preventDefault();
      const params = new URLSearchParams();
      for (const key in formData) {
        params.append(key, formData[key]);
      }
      await axios.put(
        `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/update-salesperson/${selectedId}`,
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Sales Person updated successfully");
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all"
      );
      setData(response.data);
      document.getElementById("update_modal").close();
      dispatch(
        showNotification({
          message: "Sales Person updated successfully 😁",
          status: 1,
        })
      );
    } catch (error) {
      console.error("Error updating Sales Person:", error);
      dispatch(
        showNotification({
          message: "Error updating Sales Person! 😵",
          status: 0,
        })
      );
    }
  };

  const handleUpdate = async (e) => {
    document.getElementById("update_modal").showModal();
  };

  const handleDelete = async () => {
    try {
      {
        await axios.put(
          `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/salesperson-status?id=${selectedId}`
        );
      }
      setSelectedId([]);
      // Reload data after deletion
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all"
      );
      setData(response.data);
      document.getElementById("delete_modal").close();
      setSelectedId(null);
      dispatch(
        showNotification({
          message: `Sales Person ${
            selectedList === "active_salespersons" ? "deactivated" : "activated"
          }! 😁`,
          status: 1,
        })
      );
    } catch (error) {
      console.error("Error deleting salesperson:", error);
      dispatch(
        showNotification({
          message: `Error ${
            selectedList === "active_salespersons"
              ? "deactivating"
              : "activating"
          } Sales Person! 😵`,
          status: 0,
        })
      );
    }
  };

  const handleDeleteModal = async (e) => {
    document.getElementById("delete_modal").showModal();
  };
  const downloadPDF = () => {
    const pdf = new jsPDF();
    const logoImg = new Image();
    logoImg.src = "/c.png";
    const imageWidth = 10;
    const imageHeight = 10;
    const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
    const imageY = 10;
    pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);

    const title = "Salesperson List";
    const fontSize = 14;
    const textWidth =
      (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
    const textX = (pdf.internal.pageSize.width - textWidth) / 2;
    const textY = imageY + imageHeight + 10;
    pdf.setFontSize(fontSize);
    pdf.text(title, textX, textY);
    pdf.setFontSize(fontSize);

    const columns = ["Sales Person Name", "Contact Number", "Email"];

    const rows = currentRecords.map((salesperson) => [
      salesperson.name,
      salesperson.contactNumber,
      salesperson.email,
    ]);

    const textHeight = fontSize / pdf.internal.scaleFactor;
    const tableStartY = textY + textHeight + 10;

    pdf.autoTable({ startY: tableStartY, head: [columns], body: rows });

    pdf.save("sales_persons.pdf");
  };

  return (
    <>
      <TitleCard
        title="All Sales Persons Table"
        topMargin="mt-2"
        TopSideButtons2={
          <>
            <button
              className={`btn ${
                selectedId === null
                  ? "btn-disabled"
                  : selectedList === "active_salespersons"
                  ? "btn-error"
                  : "btn-success"
              }`}
              onClick={handleDeleteModal}
            >
              {selectedList === "active_salespersons"
                ? "Deactivate"
                : "Activate"}
            </button>
            <select
              className="px-2 border border-gray-300 rounded-md mr-2"
              onChange={(e) => setSelectedList(e.target.value)}
              value={selectedList}
            >
              <option value="active_salespersons">Active Sales Persons</option>
              <option value="inactive_salespersons">
                Inactive Sales Persons
              </option>
            </select>
          </>
        }
        TopSideButtons1={
          <button
            className={`btn ${
              selectedId === null ? "btn-disabled" : "btn-primary"
            }`}
            onClick={handleUpdate}
          >
            Update
          </button>
        }
        TopSideButtons3={
          <button className="btn btn-primary " onClick={downloadPDF}>
            Download PDF
          </button>
        }
      >
        <div className="overflow-x-auto w-full">
          <table className="table table-lg w-full">
            <thead>
              <tr className="table-row">
                <th className="table-cell"> Select </th>
                <th className="table-cell">Serial No.</th>
                <th
                  className=" table-cell cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  Sales Person Name{" "}
                  {sortConfig.key === "name" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("contactNumber")}
                >
                  Contact Number{" "}
                  {sortConfig.key === "contactNumber" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("email")}
                >
                  Email{" "}
                  {sortConfig.key === "email" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
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
                        onChange={(e) =>
                          handleCheckboxChange(e, salespersons.id)
                        }
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
        <Pagination
          nPages={Math.ceil(data.length / recordsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        </div>
      </TitleCard>

      {selectedId !== null && (
        <dialog id="delete_modal" className="modal">
          <div className="modal-box ">
            <TitleCard title="CAUSION !!!">
              <p className="py-4 text-center text-xl">
                Are you sure you want to{" "}
                {selectedList === "active_salespersons"
                  ? "Deactivate"
                  : "Activate"}{" "}
                this Sales Person?
              </p>
              <br />
              {/* <p className="text-center font-bold text-sm">Note : All Products under this Category will be deleted!</p> */}
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

      {/*modal for update*/}
      {selectedId && (
        <dialog id="update_modal" className="modal">
          <div className="modal-box w-11/12 max-w-7xl">
            <TitleCard title="Update Sales Person">
              <form
                onSubmit={(e) => handleSubmit(e, formData)}
                className="space-y-4"
              >
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
                      htmlFor="name"
                      className="label label-text text-base"
                    >
                      Sales Person Name:
                    </label>
                    <input
                      type="text"
                      pattern="^[a-zA-Z ]*$"
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
                      type="phone"
                      pattern="[0-9]{10}"
                      placeholder="Please enter 10 digit number"
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
                      type="email"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </TitleCard>
          </div>
        </dialog>
      )}
    </>
  );
};

export default SalesPersonsTable;
