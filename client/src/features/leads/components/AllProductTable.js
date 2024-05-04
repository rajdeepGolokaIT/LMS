import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../Endpoint";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPageTitle, showNotification } from "../../common/headerSlice";
import TitleCard from "../../../components/Cards/TitleCard";
import SortIcon1 from "@heroicons/react/24/outline/BarsArrowDownIcon";
import SortIcon2 from "@heroicons/react/24/outline/BarsArrowUpIcon";
import Pagination from "../../../components/Input/Pagination"
import jsPDF from "jspdf";
import "jspdf-autotable";



const AllProductTable = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Products List" }));
  }, []);

  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    price: 0,
    category: {
      id: 0,
    },
    isActive: true,
    hsnsac: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState("active_products");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedList === "active_products") {
          const response = await axios.get(
            `${BASE_URL}/api/v1/products/all`
          );

          console.log(response.data);
          setData(response.data);
        } else if (selectedList === "inactive_products") {
          const response = await axios.get(
            `${BASE_URL}/api/v1/products/inactive-all`
          );

          console.log(response.data);
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedList]);

  //   console.log(data)

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/categories/all`
      );
      setCategories(response.data);
      // console.log(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredRecords = data.filter((products) => {
    return String(products.productName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteModal = async (e) => {
    document.getElementById("delete_modal").showModal();
  };

  const handleDelete = async () => {
    try {
      {
        await axios.put(
          `${BASE_URL}/api/v1/products/product-status?id=${selectedId}`
        );
      }
      setSelectedId([]);
      document.getElementById("delete_modal").close();
      // Reload data after deletion
      const response = await axios.get(
        `${BASE_URL}/api/v1/products/all`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error deleting Category:", error);
    }
  };

  const handleUpdate = async (e) => {
    document.getElementById("update_modal").showModal();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/api/v1/products/update-product/${selectedId}`,
        formData
        // {
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded",
        //     },
        // }
      );
      console.log("Product updated successfully");
      const response = await axios.get(
        `${BASE_URL}/api/v1/products/all`
      );
      setData(response.data);
      dispatch(
        showNotification({
          message: "Product updated to invoice successfully 😁",
          status: 1,
        })
      );
      document.getElementById("update_modal").close();
    } catch (error) {
      console.error("Error updating Product:", error);
      dispatch(
        showNotification({
          message: "Error updating Product! 😵",
          status: 0,
        })
      );
    }
  };

  const handleCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedId(id);
      const foundProducts = data.find(
        (product) => parseInt(product.id) === parseInt(id)
      );

      if (foundProducts) {
        setFormData(foundProducts);
      }
    } else {
      setFormData([]);
      setSelectedId(null);
    }
  };
  const downloadPDF = () => {
    // Initialize jsPDF
    const pdf = new jsPDF();
    const logoImg = new Image();
    logoImg.src = "/c.png";
    const imageWidth = 10;
    const imageHeight = 10;
    const imageX = (pdf.internal.pageSize.width - imageWidth) / 2;
    const imageY = 10;
    pdf.addImage(logoImg, "PNG", imageX, imageY, imageWidth, imageHeight);

    const title = "All Product List";
    const fontSize = 14;
    const textWidth =
      (pdf.getStringUnitWidth(title) * fontSize) / pdf.internal.scaleFactor;
    const textX = (pdf.internal.pageSize.width - textWidth) / 2;
    const textY = imageY + imageHeight + 10;
    pdf.setFontSize(fontSize);
    pdf.text(title, textX, textY);
    pdf.setFontSize(fontSize);

    // Extract rows data from currentRecords
    const rows = currentRecords.map((product, index) => [
      index + 1,
      product.productName,
      `INR ${product.price}`,
      product.category.categoryName,
    ]);

    const textHeight = fontSize / pdf.internal.scaleFactor;
    const tableStartY = textY + textHeight + 10;
    pdf.autoTable({
      head: [
        ["Serial No.", "Product Name", "Price Per Unit", "Category Name "],
      ],
      body: rows,
      startY: tableStartY,
    });

    pdf.save("products.pdf");
  };

  console.log(selectedId);
  //   console.log(categories)
  console.log(selectedList);

  return (
    <>
      <TitleCard
        title="All Products List"
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
                : selectedList === "active_products"
                ? "btn-error"
                : "btn-success"
            }`}
            onClick={handleDeleteModal}
          >
            {selectedList === "active_products" ? "Deactivate" : "Activate"}
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
              <option value="active_products">Active Products</option>
              <option value="inactive_products">Inactive Products</option>
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
                  className=" table-cell cursor-pointer"
                  onClick={() => requestSort("productName")}
                >
                  Product Name
                  {sortConfig.key === "productName" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("price")}
                >
                  Price Per Unit
                  {sortConfig.key === "price" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
                <th
                  className="table-cell  cursor-pointer"
                  onClick={() => requestSort("category.categoryName")}
                >
                  Category
                  {sortConfig.key === "category.categoryName" &&
                  sortConfig.direction === "ascending" ? (
                    <SortIcon1 className="h-5 w-5 inline" />
                  ) : (
                    <SortIcon2 className="h-5 w-5 inline" />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((product, index) => (
                <tr key={index}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={(e) => handleCheckboxChange(e, product.id)}
                        checked={product.id === selectedId}
                      />
                    </label>
                  </td>
                  <td>{indexOfFirstRecord + index + 1}</td>
                  <td title={`${product.productName}`}>
                    {product.productName.length > 20
                      ? product.productName.trim().slice(0, 20) + "..."
                      : product.productName}
                  </td>
                  <td> INR {product.price}</td>
                  <td>{product.category.categoryName}</td>
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
                {selectedList === "active_products" ? "Deactivate" : "Activate"}{" "}
                this Product?
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="productName"
                      className="label label-text text-base"
                    >
                      Product Name:
                    </label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      className="w-full input input-bordered input-primary"
                      id="productName"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="label label-text text-base"
                    >
                      Price Per Unit:
                    </label>
                    <input
                      type="number"
                      placeholder="Price Per Unit"
                      className="w-full input input-bordered input-primary"
                      id="price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="categoryId">Category:</label>
                    <select
                      id="categoryId"
                      className="w-full input input-bordered input-primary"
                      value={formData.category.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: { id: parseInt(e.target.value) },
                        })
                      }
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="hsnSac">HSN/SAC:</label>
                    <input
                      type="number"
                      min="0"
                      pattern="[0-9]*"
                      placeholder="HSN/SAC"
                      className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      id="hsnSac"
                      value={formData.hsnsac}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hsnsac: parseInt(e.target.value),
                        })
                      }
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

export default AllProductTable;
