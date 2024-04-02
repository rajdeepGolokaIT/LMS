import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";

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

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/all"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(data.length / recordsPerPage);

  return (
    <>
      <TitleCard title="Invoices Table" topMargin="mt-2">
        <div className="overflow-x-auto w-full">
          <table className="table table-lg w-full">
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>ID</th>
                <th>Create Date</th>
                <th>Update Date</th>
                <th>Vehicle No</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total Amount</th>
                <th>Purchase Number</th>
                <th>Delivery Date</th>
                <th>Supplier Name</th>
                <th>Discount</th>
                <th>Total Quantity Nos</th>
                <th>Total Quantity Doz</th>
                {/* <th>Products</th> */}
                <th>Distributor's Address</th>
                <th>Distributor's Contact No</th>
                <th>Distributor's Email</th>
                <th>Distributor's City</th>
                <th>Distributor's Region</th>
                <th>Distributor's Zone</th>
                <th>Eway Bill</th>
                <th>Destination</th>
                <th>Invoice Number</th>
                <th>IRN</th>
                <th>Ack No.</th>
                <th>Dispatched Through</th>
                <th>HSN/SAC</th>
                <th>Terms of Delivery</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((invoice) => (
                <tr key={invoice.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>{invoice.id}</td>
                  <td>{invoice.createDate}</td>
                  <td>{invoice.updateDate}</td>
                  <td>{invoice.vechicleNo}</td>
                  <td>{invoice.cgst}</td>
                  <td>{invoice.sgst}</td>
                  <td>{invoice.igst}</td>
                  <td>{invoice.totalAmount}</td>
                  <td>{invoice.purchaseNumber}</td>
                  <td>{invoice.deliveryDate}</td>
                  <td>{invoice.supplierName}</td>
                  <td>{invoice.discount}</td>
                  <td>{invoice.totalQuantity_Nos}</td>
                  <td>{invoice.totalQuantity_Doz}</td>
                  {/* <td>
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Product Name</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.distributor.products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.productName}</td>
                            <td>{product.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td> */}
                  <td>{invoice.distributor.distributorProfile.address}</td>
                  <td>
                    {invoice.distributor.distributorProfile.contactNumber}
                  </td>
                  <td>{invoice.distributor.distributorProfile.email}</td>
                  <td>{invoice.distributor.distributorProfile.city}</td>
                  <td>{invoice.distributor.distributorProfile.region}</td>
                  <td>{invoice.distributor.distributorProfile.zone}</td>
                  <td>{invoice.eway === null ? "Pending..." : invoice.eway}</td>
                  <td>
                    {invoice.destination === null
                      ? "Pending..."
                      : invoice.destination}
                  </td>
                  <td>
                    {invoice.invoiceNumber === null
                      ? "Pending..."
                      : invoice.invoiceNumber}
                  </td>
                  <td>{invoice.irn === null ? "Pending..." : invoice.irn}</td>
                  <td>
                    {invoice.ackNo === null ? "Pending..." : invoice.ackNo}
                  </td>
                  <td>
                    {invoice.dispatchedThrough === null
                      ? "Pending..."
                      : invoice.dispatchedThrough}
                  </td>
                  <td>
                    {invoice.hsnsac === null ? "Pending..." : invoice.hsnsac}
                  </td>
                  <td>
                    {invoice.termsOfDelivery === null
                      ? "Pending..."
                      : invoice.termsOfDelivery}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          loading={loading}
        />
      </TitleCard>
    </>
  );
};

export default TableComponent;
