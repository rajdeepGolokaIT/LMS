import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import InvoiceUpdateProducts from "./InvoiceUpdateProducts";

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
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isActive, setIsActive] = useState(false); // Checkbox state for active/inactive
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const [ewayTableData, setEwayTableData] = useState([]);


  useEffect(() => {
    // Fetch distributors and products when component mounts
    fetchDistributors();
    // fetchProducts(); // Uncomment this line if you need products
}, []);


  const fetchDistributors = async () => {
    try {
        const response = await axios.get('https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/all');
        setDistributors(response.data);
    } catch (error) {
        console.error('Error fetching distributors:', error);
        // Handle error, show error message to the user, etc.
    }
};


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

  const handleDelete = async () => {
    try {
      // Iterate over selectedInvoices array and delete each invoice
      for (const id of selectedInvoices) {
        await axios.delete(
          `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/delete-invoice?id=${id}`
        );
      }
      // Clear selectedInvoices array after successful deletion
      setSelectedInvoices([]);
      // Reload data after deletion
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/all"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  console.log(selectedInvoice);
  console.log(selectedInvoices);
  const handleUpdate = (invoice) => {
    setSelectedInvoice(invoice);
    // setIsActive(invoice.isActive); // Set checkbox state based on invoice's isActive property
    document.getElementById("update_modal").showModal();
  };

  const handleProduct = (invoice) => {
    setSelectedInvoice(invoice);
    document.getElementById("product_modal").showModal();
  };
  const handleEway = (invoice) => {
    setSelectedInvoice(invoice);
    document.getElementById("eway_modal").showModal();
  };

  const handleCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      // Set selectedInvoice to the invoice object when checkbox is checked
      setSelectedInvoice(data.find((invoice) => invoice.id === id));
      // Add the id to the selectedInvoices array
      setSelectedInvoices([...selectedInvoices, id]);
    } else {
      // Remove the id from the selectedInvoices array
      setSelectedInvoices(
        selectedInvoices.filter((invoiceId) => invoiceId !== id)
      );
    }
  };

  const handleUpdateInvoice = async () => {
    try {
      // Make the PUT request to update the invoice
      const params = new URLSearchParams();
      for (const key in selectedInvoice) {
        params.append(key, selectedInvoice[key]);
      }
      await axios.put(
        `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/update-invoice/${selectedInvoices}`,
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // Close the modal after updating
      document.getElementById("update_modal").close();

      // open the product update modal after updating the invoice
      document.getElementById("update_modal_2").showModal();

      // Reload data after updating
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/all"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(data.length / recordsPerPage);
  console.log(data)

  const invoiceProduct = async () => {
    try {
      const response = await axios.get(
        `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/get-invoice-products-by-id/${selectedInvoices}`
      );
      setInvoiceProducts(response.data);
      
    } catch (error) {
      console.error("Error fetching invoice products:", error);
    }
  }

  useEffect(() => {
    invoiceProduct();
  }, [selectedInvoices]);

console.log(invoiceProducts);
console.log(selectedInvoice);
console.log(selectedInvoices);

useEffect(() => {
  const fetchEwayBills = async () => {
      try {
          const response = await axios.get(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/eways/invoice/${selectedInvoices}`);
          // const ewayBills = response.data;
          // console.log(ewayBills);
          // // console.log(ewayBills.find((eway) => parseInt(eway.invoice.id) === parseInt(invoiceID)));
          // // console.log(ewayBills.map((eway) => eway.invoice.id));

          // // Find the Eway Bill associated with the invoiceID
          // const foundEwayBill = ewayBills.find((eway) => parseInt(eway.invoice.id) === parseInt(selectedInvoices));
          // console.log(foundEwayBill);

          // // If Eway Bill data is found, set the form data
          // if (foundEwayBill > 0) {
          //     setEwayTableData({
          //         invoiceId: `${selectedInvoices}`,
          //         ewayDocNumber: foundEwayBill.ewayDocNumber,
          //         eWayBillNo: foundEwayBill.eWayBillNo,
          //         eWayMode: foundEwayBill.eWayMode,
          //         eWayApproxDistance: foundEwayBill.eWayApproxDistance,
          //         eWayValidUpto: foundEwayBill.eWayValidUpto,
          //         eWaySupplyType: foundEwayBill.eWaySupplyType,
          //         eWayTransactionType: foundEwayBill.eWayTransactionType,
          //         eWayTransactionId: foundEwayBill.eWayTransactionId,
          //         eWayGSTIN: foundEwayBill.eWayGSTIN,
          //         eWayfrom: foundEwayBill.eWayfrom,
          //         eWayTo: foundEwayBill.eWayTo,
          //         eWayDistpatchFrom: foundEwayBill.eWayDistpatchFrom,
          //         eWayShipTo: foundEwayBill.eWayShipTo,
          //         ewaytaxAmount: foundEwayBill.ewaytaxAmount,
          //         ewaytaxRate: foundEwayBill.ewaytaxRate,
          //         ewayTransportationID: foundEwayBill.ewayTransportationID,
          //         ewayVechileNo: foundEwayBill.ewayVechileNo,
          //         ewayVehicleFrom: foundEwayBill.ewayVehicleFrom,
          //     });
          // } else {
          //     console.log("Eway Bill not found for invoiceID:", selectedInvoices);
          // }

          if(response.data != []) {
              setEwayTableData(response.data);
          } else {
              console.log("Eway Bill not found for invoiceID:", selectedInvoices);
          }
      } catch (error) {
          console.error("Error fetching Eway Bills:", error);
      }
  };

  fetchEwayBills();
}, [selectedInvoices]);

console.log(ewayTableData);

  return (
    <>
      <TitleCard
        title="Invoices Table"
        topMargin="mt-2"
        TopSideButtons1={
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        }
        TopSideButtons2={
          <button className="btn btn-primary mr-2" onClick={handleUpdate}>
            Update
          </button>
        }
        TopSideButtons3={
          <>
          <button className="btn btn-success" onClick={handleProduct}>
            View Products
          </button>
          <button className="btn btn-success" onClick={handleEway}>
            View Eway Bill
          </button>
          </>
        }
      >
        <div className="overflow-x-auto w-full">
          <table className="table table-lg w-full">
            <thead>
              <tr>
                <th>Select</th>
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
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={(e) => handleCheckboxChange(e, invoice.id)}
                        checked={selectedInvoices.includes(invoice.id)}
                      />
                    </label>
                  </td>
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

      {/* Modal for update */}
      {selectedInvoice && (
        <>
        <dialog id="update_modal" className="modal">
          <div className="modal-box w-11/12 max-w-7xl">
            <h3 className="font-bold text-lg">Update Invoice</h3>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="invoiceNumber"
                className="label label-text text-base"
              >
                Invoice Number:
              </label>
              <input
                type="number"
                placeholder="Invoice Number"
                className="w-full input input-bordered input-primary"
                id="invoiceNumber"
                value={selectedInvoice.invoiceNumber}
                onChange={(e) => {
                  // Handle changes to input field and update selectedInvoice
                  setSelectedInvoice({
                    ...selectedInvoice,
                    invoiceNumber: parseInt(e.target.value),
                  });
                }}
              />
            </div>

            <div>
              <label htmlFor="irn" className="label label-text text-base">
                IRN:
              </label>
              <input
                type="number"
                placeholder="IRN"
                className="w-full input input-bordered input-primary"
                id="irn"
                value={selectedInvoice.irn}
                onChange={(e) => {
                  // Handle changes to input field and update selectedInvoice
                  setSelectedInvoice({
                    ...selectedInvoice,
                    irn: parseInt(e.target.value),
                  });
                }}
              />
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ackNo" className="label label-text text-base">
                Ack No.:
              </label>
              <input
                type="text"
                placeholder="Ack No."
                className="w-full input input-bordered input-primary"
                id="ackNo"
                value={selectedInvoice.ackNo}
                onChange={(e) => {
                  // Handle changes to input field and update selectedInvoice
                  setSelectedInvoice({
                    ...selectedInvoice,
                    ackNo: e.target.value,
                  });
                }}
              />
            </div>

            <div>
              <label
                htmlFor="dispatchedThrough"
                className="label label-text text-base"
              >
                Dispatched Through:
              </label>
              <input
                type="text"
                placeholder="Dispatched Through"
                className="w-full input input-bordered input-primary"
                id="dispatchedThrough"
                value={selectedInvoice.dispatchedThrough}
                onChange={(e) => {
                  // Handle changes to input field and update selectedInvoice
                  setSelectedInvoice({
                    ...selectedInvoice,
                    dispatchedThrough: e.target.value,
                  });
                }}
              />
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="termsOfDelivery"
                className="label label-text text-base"
              >
                Terms of Delivery:
              </label>
              <input
                type="text"
                placeholder="Terms of Delivery"
                className="w-full input input-bordered input-primary"
                id="termsOfDelivery"
                value={selectedInvoice.termsOfDelivery}
                onChange={(e) => {
                  // Handle changes to input field and update selectedInvoice
                  setSelectedInvoice({
                    ...selectedInvoice,
                    termsOfDelivery: e.target.value,
                  });
                }}
              />
            </div>

            <div>
              <label
                htmlFor="destination"
                className="label label-text text-base"
              >
                Destination:
              </label>
              <input
                type="text"
                placeholder="Destination"
                className="w-full input input-bordered input-primary"
                id="destination"
                value={selectedInvoice.destination}
                onChange={(e) => {
                  // Handle changes to input field and update selectedInvoice
                  setSelectedInvoice({
                    ...selectedInvoice,
                    destination: e.target.value,
                  });
                }}
              />
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hsnsac" className="label label-text text-base">
                HSN/SAC:
              </label>
              <input
                type="number"
                placeholder="HSN/SAC"
                className="w-full input input-bordered input-primary"
                id="hsnsac"
                value={selectedInvoice.hsnsac}
                onChange={(e) => {
                  // Handle changes to input field and update selectedInvoice
                  setSelectedInvoice({
                    ...selectedInvoice,
                    hsnsac: parseInt(e.target.value),
                  });
                }}
              />
            </div>

            <div>
              <label htmlFor="amount" className="label label-text text-base">
                Amount:
              </label>
              <input
                type="number"
                placeholder="Amount"
                className="w-full input input-bordered input-primary"
                id="amount"
                value={selectedInvoice.amount}
                onChange={(e) => {
                  // Handle changes to input field and update selectedInvoice
                  setSelectedInvoice({
                    ...selectedInvoice,
                    amount: parseInt(e.target.value),
                  });
                }}
              />
            </div>
            </div>
            {/* <div>
                <label
                  htmlFor="igst"
                  className="label label-text text-base"
                >
                  IGST:
                </label>
                <input
                  type="number"
                  placeholder="IGST"
                  className="w-full input input-bordered input-primary"
                  id="igst"
                  value={selectedInvoice.igst}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      igst: parseInt(e.target.value),
                    });
                  }}
                />
              </div> */}

              {/* <div>
                <label
                  htmlFor="cgst"
                  className="label label-text text-base"
                >
                  CGST:
                </label>
                <input
                  type="number"
                  placeholder="CGST"
                  className="w-full input input-bordered input-primary"
                  id="cgst"
                  value={selectedInvoice.cgst}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      cgst: parseInt(e.target.value),
                    });
                  }}
                />
              </div> */}

              {/* <div>
                <label
                  htmlFor="sgst"
                  className="label label-text text-base"
                >
                  SGST:
                </label>
                <input
                  type="number"
                  placeholder="SGST"
                  className="w-full input input-bordered input-primary"
                  id="sgst"
                  value={selectedInvoice.sgst}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      sgst: parseInt(e.target.value),
                    });
                  }}
                />
              </div> */}
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="discount"
                  className="label label-text text-base"
                >
                  Discount:
                </label>
                <input
                  type="number"
                  placeholder="Discount"
                  className="w-full input input-bordered input-primary"
                  id="discount"
                  value={selectedInvoice.discount}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      discount: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="totalAmount"
                  className="label label-text text-base"
                >
                  Total Amount:
                </label>
                <input
                  type="number"
                  placeholder="Total Amount"
                  className="w-full input input-bordered input-primary"
                  id="totalAmount"
                  value={selectedInvoice.totalAmount}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      totalAmount: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="deliveryDate"
                  className="label label-text text-base"
                >
                  Delivery Date:
                </label>
                <input
                  type="date"
                  placeholder="Delivery Date"
                  className="w-full input input-bordered input-primary"
                  id="deliveryDate"
                  value={selectedInvoice.deliveryDate}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      deliveryDate: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="purchaseNumber"
                  className="label label-text text-base"
                >
                  Purchase Number:
                </label>
                <input
                  type="text"
                  placeholder="Purchase Number"
                  className="w-full input input-bordered input-primary"
                  id="purchaseNumber"
                  value={selectedInvoice.purchaseNumber}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      purchaseNumber: e.target.value,
                    });
                  }}
                />
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="supplierName"
                  className="label label-text text-base"
                >
                  Supplier Name:
                </label>
                <input
                  type="text"
                  placeholder="Supplier Name"
                  className="w-full input input-bordered input-primary"
                  id="supplierName"
                  value={selectedInvoice.supplierName}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      supplierName: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="totalQuantityNos"
                  className="label label-text text-base"
                >
                  Total Quantity Nos:
                </label>
                <input
                  type="number"
                  placeholder="Total Quantity Nos"
                  className="w-full input input-bordered input-primary"
                  id="totalQuantityNos"
                  value={selectedInvoice.totalQuantityNos}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      totalQuantityNos: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="totalQuantityDoz"
                  className="label label-text text-base"
                >
                  Total Quantity Doz:
                </label>
                <input
                  type="number"
                  placeholder="Total Quantity Doz"
                  className="w-full input input-bordered input-primary"
                  id="totalQuantityDoz"
                  value={selectedInvoice.totalQuantityDoz}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      totalQuantityDoz: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="vehicleNo"
                  className="label label-text text-base"
                >
                  Vehicle No:
                </label>
                <input
                  type="text"
                  placeholder="Vehicle No"
                  className="w-full input input-bordered input-primary"
                  id="vehicleNo"
                  value={selectedInvoice.vehicleNo}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      vehicleNo: e.target.value,
                    });
                  }}
                />
              </div>
              </div>
              <div>
                <label
                  htmlFor="distributorId"
                  className="label label-text text-base"
                >
                  Distributor:
                </label>
                <select
                  id="distributorId"
                  className="w-full input input-bordered input-primary"
                  value={selectedInvoice.distributorId}
                  onChange={(e) => {
                    // Handle changes to input field and update selectedInvoice
                    setSelectedInvoice({
                      ...selectedInvoice,
                      distributorId: parseInt(e.target.value),
                    });
                  
                  }}
                >
                   <option value="">Select Distributor</option>
                            {distributors.map(distributor => (
                                <option key={distributor.id} value={distributor.id}>{distributor.distributorProfile.agencyName}</option>
                            ))}
                </select>
              </div>



            {/* Add other input fields for editing */}
            <div className="modal-action">
              <button className="btn" onClick={handleUpdateInvoice}>
                Update Invoice
              </button>
              <button
                className="btn"
                onClick={() => document.getElementById("update_modal").close()}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>

        <dialog id="update_modal_2" className="modal">
            <div className="modal-box">
            <TitleCard title="Update Products of the Invoice" topMargin="mt-2">
    <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
                <InvoiceUpdateProducts invoiceId={selectedInvoices}/>  
            </div>
            </TitleCard>
            </div> 
          </dialog>

        <dialog id="product_modal" className="modal">
            <div className="modal-box">
                <TitleCard title="Invoice Product Table">
                    <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price Per Unit</th>
                                <th>Quantity</th>
                                </tr>
                        </thead>
                        <tbody>
                            {invoiceProducts.map((product) => (
                                <tr>
                                    <td>{product[0].productName}</td>
                                    <td>{product[0].price}</td>
                                    <td>{product[1]}</td>
                                </tr>
                            ))}
                        </tbody>

                        </table>
                    </div>
                </TitleCard>

                <div className="modal-action">
                  <button type="button" className="btn btn-success" onClick={() => document.getElementById("product_modal").close()}>Update</button>
                    <button
                        className="btn"
                        onClick={() => document.getElementById("product_modal").close()}
                    >
                        Close
                    </button>
                </div>
            </div>
        </dialog>
        <dialog id="eway_modal" className="modal">
        <div className="modal-box w-11/12 max-w-7xl">
          <TitleCard title="Invoice Eway Bill" topMargin="mt-2">
          <div className="overflow-x-auto w-full">
            { ewayTableData.length !== 0 ?  (
              
            
                    <table className="table w-full">
                        <thead>
                            <tr>
                              <th>Eway DOC No.</th>
                              <th>Eway Bill No.</th>
                              <th>Eway Mode</th>
                              <th>Eway Approx Distance</th>
                              <th>Eway Valid Upto</th>
                              <th>Eway Supply Type</th>
                              <th>Eway Transaction Type</th>
                              <th>Eway Transaction ID</th>
                              <th>Eway GSTIN</th>
                              <th>Eway From</th>
                              <th>Eway To</th>
                              <th>Eway Dispatched From</th>
                              <th>Eway Ship To</th>
                              <th>Eway Tax Amount</th>
                              <th>Eway Tax Rate</th>
                              <th>Eway Transportation ID</th>
                              <th>Eway Vehicle No</th>
                              <th>Eway Vehicle From</th>
                              </tr>
                              </thead>
                              <tbody>
                              {ewayTableData && (
                                
                              
                              <tr>
                              <td>{ewayTableData.ewayDocNumber}</td>
                              <td>{ewayTableData.eWayBillNo}</td>
                              <td>{ewayTableData.eWayMode}</td>
                              <td>{ewayTableData.eWayApproxDistance}</td>
                              <td>{ewayTableData.eWayValidUpto}</td>
                              <td>{ewayTableData.eWaySupplyType}</td>
                              <td>{ewayTableData.eWayTransactionType}</td>
                              <td>{ewayTableData.eWayTransactionId}</td>
                              <td>{ewayTableData.eWayGSTIN}</td>
                              <td>{ewayTableData.eWayfrom}</td>
                              <td>{ewayTableData.eWayTo}</td>
                              <td>{ewayTableData.eWayDistpatchFrom}</td>
                              <td>{ewayTableData.eWayShipTo}</td>
                              <td>{ewayTableData.ewaytaxAmount}</td>
                              <td>{ewayTableData.ewaytaxRate}</td>
                              <td>{ewayTableData.ewayTransportationID}</td>
                              <td>{ewayTableData.ewayVechileNo}</td>
                              <td>{ewayTableData.ewayVehicleFrom}</td>
                              </tr>
                              )}
                              </tbody>
                              </table>
            ) :
            (
              <h1>No Eway Details Found!</h1>
            ) }
                              </div>
            </TitleCard>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => document.getElementById("eway_modal").close()}
              >
                Close
              </button>

            </div>
          </div>
          </dialog>
        </>
      )}
    </>
  );
};

export default TableComponent;
