import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Input/PaginationInvoice";
import TitleCard from "../../../components/Cards/TitleCard";
import { BASE_URL } from "../../../Endpoint";
import axios from "axios";


const DistributorSalesDetails = () => {


    const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [Pages, setPages] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [invoice, setInvoice] = useState([]);

    useEffect(() => {
    
        fetchData();
      }, [currentPage]);
      
      const fetchData = async () => {
        try {
          const url = `${BASE_URL}/api/v1/invoices/distributors/details?page=${currentPage.toString()}`
          console.log(url)
          const response = await axios.get(url);
        //   console.log(response.data)
          const data = response.data.DistributorDetails.map((item) => ({
            ...item,
            productsLength: item.products.length,
            invoices: item.invoices.map((invoice) => {
                const [number, amount] = invoice.split(":");
                return { number: number.trim(), amount: amount.trim() };
             })
            }));
            console.log(data);
          setData(data);
          setPages(response.data.totalPages);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const handleProductModal = (item) => {
        document.getElementById("product_Modal").showModal();
        setProducts(item.products);
      }

      const handleCategoryModal = (item) => {
        document.getElementById("category_Modal").showModal();
        setCategories(item.categories);
      }

      const handleInvoiceModal = (item) => {
        document.getElementById("invoice_Modal").showModal();
        setInvoice(item.invoices);
      }

  return (
    <>
    <TitleCard
      title="Distributor Sales Details"
      >
         <div
          className="overflow-x-auto w-full"
        //   style={{ overflowY: "auto", maxHeight: "450px" }}
        >
        <table className="table table-zebra-zebra table-sm">
            <thead>
            <tr className="table-row text-center">
                <th className="table-cell">Serial Number</th>
                <th className="table-cell">Distributor Name</th>
                <th className="table-cell">Contace Person</th>
                <th className="table-cell">Number of Products</th>
                <th className="table-cell">Products</th>
                <th className="table-cell">Categories</th>
                <th className="table-cell">Invoices</th>
                <th className="table-cell">City</th>
                <th className="table-cell">Region</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr className="table-row text-center" key={index}>
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{item.agencyname}</td>
                    <td className="table-cell">{item.contactperson}</td>
                    <td className="table-cell">{item.productsLength}</td>
                    <td className="table-cell"><button className="btn btn-sm btn-primary" onClick={() => handleProductModal(item)}>View</button></td>
                    <td className="table-cell"><button className="btn btn-sm btn-primary" onClick={() => handleCategoryModal(item)}>View</button></td>
                    <td className="table-cell"><button className="btn btn-sm btn-primary" onClick={() => handleInvoiceModal(item)}>View</button></td>
                    <td className="table-cell">{item.city}</td>
                    <td className="table-cell">{item.region}</td>
                    </tr>
            ))}
            </tbody>
            </table>
            <Pagination
          nPages={Pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        </div>
      </TitleCard>

      <dialog id="product_Modal" className="modal">
        <div className="modal-box">
          <TitleCard title="Products">
            <div className="overflow-x-auto w-full">
              {products.length > 0 ? (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>Product Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{product}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Products Found!!!</p>
              )}
            </div>
          </TitleCard>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("product_Modal").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="category_Modal" className="modal">
        <div className="modal-box">
          <TitleCard title="Categories">
            <div className="overflow-x-auto w-full">
              {categories.length > 0 ? (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>Category Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Categories Found!!!</p>
              )}
            </div>
          </TitleCard>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("category_Modal").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="invoice_Modal" className="modal">
        <div className="modal-box">
          <TitleCard title="Invoices">
            <div className="overflow-x-auto w-full">
              {invoice.length > 0 ? (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>Invoice Number</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.number}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Invoices Found!!!</p>
              )}
            </div>
          </TitleCard>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("invoice_Modal").close()}  
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
      </>
  )
}

export default DistributorSalesDetails