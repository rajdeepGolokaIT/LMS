import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPageTitle, showNotification } from "../../common/headerSlice";
import Pagination from "../../../components/Input/Pagination";
import TitleCard from "../../../components/Cards/TitleCard";
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";
import { BASE_URL } from "../../../Endpoint";
import jsPDF from "jspdf";
import "jspdf-autotable";


const AllCategoryTable = () => {
  const [selectedId, setSelectedId] = useState(null);
  //   const [products,setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    isActive: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState("active_categories");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Categories List" }));
  }, []);

  useEffect(() => {
    fetchCategoryData();
  }, [selectedList]);

  const fetchCategoryData = async () => {
    let products;

    try {
      if (selectedList === "active_categories") {
        const response = await axios.get(
          `${BASE_URL}/api/v1/products/all`
        );
        products = response.data;
      } else if (selectedList === "inactive_categories") {
        const response = await axios.get(
          `${BASE_URL}/api/v1/products/inactive-all`
        );
        const inactiveCategories = response.data.filter(
          (categories) => !categories.category.isActive
        );

        products = inactiveCategories;
      }
      //   const products = response.data;

      console.log(products);
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

  //   console.log(products)

  const handleDeleteModal = async (e) => {
    document.getElementById("delete_modal").showModal();
  };

  const handleDelete = async () => {
    try {
      {
        await axios.put(
          `${BASE_URL}/api/v1/categories/category-status?id=${selectedId}`
        );
      }
      setSelectedId([]);
      document.getElementById("delete_modal").close();
      // Reload data after deletion
      fetchCategoryData();
    } catch (error) {
      console.error("Error deleting Category:", error);
    }
  };

  const handleUpdate = async (e) => {
    document.getElementById("update_modal").showModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/api/v1/categories/update-category/${selectedId}`,
        formData
        // {
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded",
        //     },
        // }
      );
      console.log("Category updated successfully");
      fetchCategoryData();
      dispatch(
        showNotification({
          message: "Category updated to invoice successfully 😁",
          status: 1,
        })
      );
      document.getElementById("update_modal").close();
    } catch (error) {
      console.error("Error updating Category:", error);
      dispatch(
        showNotification({
          message: "Error updating Category! 😵",
          status: 0,
        })
      );
    }
  };

  const filteredRecords = categoryData.filter((categories) => {
    return String(categories.categoryName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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

  const handleCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedId(id);
      const foundCategories = categoryData.find(
        (category) => parseInt(category.categoryId) === parseInt(id)
      );

      if (foundCategories) {
        setFormData(foundCategories);
      }
    } else {
      setFormData([]);
      setSelectedId(null);
    }
  };

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
    const title = "All Categories List";
    const fontSize = 14;
    const textWidth =
      (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
    const textX = (pdf.internal.pageSize.width - textWidth) / 2;
    const textY = imageY + imageHeight + 10;
    pdf.setFontSize(fontSize);
    pdf.text(title, textX, textY);
    pdf.setFontSize(fontSize);

    // Add Table
    const columns = ["Serial No.", "Category Name", "Total Products Count"];

    const rows = sortedData.map((category, index) => [
      index + 1,
      category.categoryName,
      category.totalCount,
    ]);

    const textHeight = fontSize / pdf.internal.scaleFactor;
    const tableStartY = textY + textHeight + 10;

    pdf.autoTable({
      head: [columns],
      body: rows,
      startY: tableStartY,
    });

    pdf.save("all_categories_list.pdf");
  };

  //   console.log(selectedId);

  return (
    <>
      <TitleCard
        title="All Categories List"
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
          <button
            className={`btn ${
              selectedId === null
                ? "btn-disabled"
                : selectedList === "active_categories"
                ? "btn-error"
                : "btn-success"
            }`}
            onClick={handleDeleteModal}
          >
            {selectedList === "active_categories" ? "Deactivate" : "Activate"}
          </button>
        }
        TopSideButtons3={
          <>
            <button
              className={`btn ${
                selectedId === null ? "btn-disabled" : "btn-primary"
              }`}
              onClick={handleUpdate}
            >
              Update
            </button>
            <select
              className="px-2 border border-gray-300 rounded-md mr-2"
              onChange={(e) => setSelectedList(e.target.value)}
              value={selectedList}
            >
              <option value="active_categories">Active Categories</option>
              <option value="inactive_categories">Inactive Categories</option>
            </select>
          </>
        }
        TopSideButtons4={
          <button className="btn btn-primary " onClick={downloadPDF}>
            Download PDF
          </button>
        }
      >
        <div className="overflow-x-auto w-full">
          <table className="table table-lg w-full">
            <thead>
              <tr className="">
                <th className="table-cell">Select</th>
                <th className="table-cell">Serial No.</th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() => requestSort("categoryName")}
                >
                  Category Name{" "}
                  {sortConfig.key === "categoryName" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell cursor-pointer"
                  onClick={() => requestSort("totalCount")}
                >
                  Total Products Count{" "}
                  {sortConfig.key === "totalCount" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
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
                        onChange={(e) =>
                          handleCheckboxChange(e, category.categoryId)
                        }
                        checked={category.categoryId === selectedId}
                      />
                    </label>
                  </td>
                  <td className="table-cell">
                    {indexOfFirstRecord + index + 1}
                  </td>
                  <td className="table-cell">{category.categoryName}</td>
                  <td className="table-cell">{category.totalCount}</td>
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
      {selectedId !== null && (
        <dialog id="delete_modal" className="modal">
          <div className="modal-box ">
            <TitleCard title="CAUSION !!!">
              <p className="py-4 text-center text-xl">
                Are you sure you want to{" "}
                {selectedList === "active_categories"
                  ? "Deactivate"
                  : "Activate"}{" "}
                this Category?
              </p>
              <br />
              <p className="text-center font-bold text-sm">
                Note : All Products under this Category will be{" "}
                {selectedList === "active_categories"
                  ? "Deactivated"
                  : "Activated"}
                !
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
      {/*modal for update*/}
      {selectedId && (
        <dialog id="update_modal" className="modal">
          <div className="modal-box">
            <TitleCard title="Update Category">
              <form onSubmit={handleSubmit} className="space-y-4">
                <label
                  onClick={() =>
                    document.getElementById("update_modal").close()
                  }
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </label>

                <div>
                  <label
                    htmlFor="categoryName"
                    className="label label-text text-base"
                  >
                    Category Name:
                  </label>
                  <input
                    type="text"
                    pattern="[A-Za-z0-9\s]+"
                    placeholder="Category Name (letters and numbers only)"
                    className="w-full input input-bordered input-primary"
                    id="productName"
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    required
                  />
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

export default AllCategoryTable;
