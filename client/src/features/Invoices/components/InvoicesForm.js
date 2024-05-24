import TitleCard from "../../../components/Cards/TitleCard";
import React, { useState, useEffect } from "react";
import moment from "moment";
import DatePicker from "react-tailwindcss-datepicker";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import AddProductsForm from "./InvoiceAddProducts";
import EwayForm from "./EwayForm";
import { BASE_URL } from "../../../Endpoint";

function InvoicesForm() {
  const [formData, setFormData] = useState({
    // id: 0,
    vehicleNo: "NA",
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalAmount: 0,
    purchaseNumber: "NA",
    deliveryDate: moment().format("YYYY-MM-DD"),
    supplierName: "Celltone",
    discountPercentage: 0,
    discountPrice: 0,
    distributorId: 0,
    totalQuantityNos: 0,
    totalQuantityDoz: 0,
    destination: "NA",
    invoiceNumber: "",
    irn: "NA",
    // hsnsac: 0,
    ackNo: 0,
    amount: 0,
    dispatchedThrough: "NA",
    termsOfDelivery: "NA",
    salespersonId: 0,
    invoiceDate: "",
    isReceived: "",
  });

  const [submitInvoiceData, setSubmitInvoiceData] = useState({});
  const [discountValue, setDiscountValue] = useState(0);
  const [selectedDiscountType, setSelectedDiscountType] = useState("");
  const [distributors, setDistributors] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [invoiceId, setInvoiceId] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [price, setPrice] = useState(0);
  const [allowEditing, setAllowEditing] = useState(false); // State to manage whether editing is allowed
  const [productsAdded, setProductsAdded] = useState(false);
  const [fetchInvoiceNo, setFetchInvoiceNo] = useState([]);
  const [fetchIrnNo, setFetchIrnNo] = useState([]);
  const [invoiceExists, setInvoiceExists] = useState(false);
  const [irnExists, setIrnExists] = useState(false);
  const [formSalesPerson, setFormSalesPerson] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSalesPersons();
    fetchInvoiceNumber();
    fetchIrn();
  }, []);

  const fetchSalesPersons = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/salespersons/all`
      );
      setSalesPersons(response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  const fetchDistributors = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/distributors/salesperson/${formSalesPerson}`
      );
      setDistributors(response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, [formSalesPerson]);

  const handleSubmit = async () => {
    // e.preventDefault();

    try {
      const params = new URLSearchParams();
      for (const key in formData) {
        params.append(key, formData[key]);
      }
      params.append("isActive", true);
      console.log(params.toString().split(" ")[0]);
      const response = await axios.post(
        `${BASE_URL}/api/v1/invoices/createInvoice`,
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Invoice added:", response.data);
      document.getElementById("confirm_modal").close();
      setSubmitInvoiceData(response.data);
      setInvoiceId(response.data.id);
      setPercentage(response.data.discountPercentage);
      setPrice(response.data.discountPrice);
      document.getElementById("a2").checked = true;
      dispatch(
        showNotification({
          message: "Step 1 : Add Invoice Completed. 😁",
          status: 1,
        })
      );

      setFormData({
        vehicleNo: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalAmount: 0,
        purchaseNumber: "",
        deliveryDate: "",
        supplierName: "",
        discountPercentage: 0,
        discountPrice: 0,
        distributorId: "",
        totalQuantityNos: 0,
        totalQuantityDoz: 0,
        destination: "",
        invoiceNumber: "",
        irn: "",
        ackNo: 0,
        amount: 0,
        dispatchedThrough: "",
        termsOfDelivery: "",
        salespersonId: 0,
        invoiceDate: "",
        isReceived: "",
      });
    } catch (error) {
      console.error("Error adding invoice:", error);
      dispatch(
        showNotification({ message: "Error adding invoice! 😵", status: 0 })
      );
    }
  };

  const handleCheckboxChange = ( ) => {
   
    setAllowEditing(!allowEditing);
    // setProductsAdded(!productsAdded);
  };

  // console.log(discountValue);
  // console.log(formData);

  const handleDateChange = (date) => {
    // const formattedDate = moment(date.startDate).format("DD-MM-YYYY");
    setFormData({ ...formData, deliveryDate: date.startDate});
  };
  
//  console.log.apply(formData.deliveryDate)
  
  const fetchInvoiceNumber = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/invoices/invoiceNumbers`);
      
      setFetchInvoiceNo(response.data)
    } catch (error) {
      console.error('Error fetching invoice number:', error);
    }
  };

  const fetchIrn = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/invoices/irns`);
      setFetchIrnNo(response.data)
    } catch (error) {
      console.error('Error fetching IRN:', error);
    }
  };

//  console.log(fetchIrnNo)

  const handleInvoiceNumberChange = (e) => {
    setFormData({
      ...formData,
      invoiceNumber: e.target.value
    });
    const check = fetchInvoiceNo.includes(e.target.value)
    setInvoiceExists(check)
  };
  
  const handleIrnChange = (e) => {
    setFormData({
      ...formData,
      irn: e.target.value
    });
    const check = fetchIrnNo.includes(e.target.value)
    setIrnExists(check)
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    document.getElementById('confirm_modal').showModal();
  };

  console.log(formData)

// console.log(submitInvoiceData.distributor.distributorProfile.id)
  return (
    <>
<div className="grid grid-cols-1 gap-4">
<div className="collapse collapse-arrow bg-base-100">
  <input type="checkbox" name="my-accordion-2" id="a1" defaultChecked /> 
  <div className="collapse-title text-xl font-medium">
    Step 1 : Add An Invoice
  </div>
  <div className="collapse-content"> 
  {Object.keys(submitInvoiceData).length === 0 && invoiceId === null ? (
    <>
   
  <TitleCard title="Add An Invoice" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg ">
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="invoiceNumber"
                  className="label label-text text-base"
                >
                  Invoice Number:
                </label>
                <input
                  type="text"
                  pattern="^[0-9]+$"
                  placeholder="Invoice Number"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInvoiceNumberChange}
                  required
                />
                {invoiceExists && <p className="label label-text text-base">This invoice number exists.</p>}
              </div>
              {/* <div>
                <label htmlFor="irn" className="label label-text text-base">
                  IRN:
                </label>
                <input
                  type="text"
                  pattern="^[0-9]+$"
                  placeholder="IRN"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  id="irn"
                  value={formData.irn}
                  onChange={handleIrnChange}
                  required
                />
                {irnExists && <p className="label label-text text-base">This IRN exists.</p>}  
              </div> */}
              <div>
                <label
                  htmlFor="salespersonId"
                  className="label label-text text-base"
                >
                  Select Salesperson Name:
                </label>
                <select
                  className="w-full select select-bordered select-primary"
                  id="salespersonId"
                  value={formData.salespersonId}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      salespersonId: parseInt(e.target.value),
                    });
                    setFormSalesPerson(parseInt(e.target.value));
                  }
                  }
                  required
                >
                  <option value="">Select Salesperson Name</option>
                  {salesPersons.map((salesperson) => (
                    <option key={salesperson.id} value={salesperson.id}>
                      {salesperson.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="invoiceDate"
                  className="label label-text text-base"
                >
                  Invoice Date:
                </label>
                
                 <DatePicker
              inputClassName="w-full input input-bordered input-primary"
              useRange={false}
              asSingle={true}
              displayFormat={"DD/MM/YYYY"}
              value={{startDate: formData.invoiceDate, endDate: formData.invoiceDate}}
              onChange={(date) => setFormData({ ...formData, invoiceDate: date.startDate })}
              required
            />
              </div>

              {/* <div>
                <label
                  htmlFor="termsOfDelivery"
                  className="label label-text text-base"
                >
                  Terms Of Delivery:
                </label>
                <input
                  type="text"
                  placeholder="Terms Of Delivery"
                  className="w-full input input-bordered input-primary"
                  id="termsOfDelivery"
                  value={formData.termsOfDelivery}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termsOfDelivery: e.target.value,
                    })
                  }
                  
                />
              </div> */}
            
            
              {/* <div>
                <label
                  htmlFor="purchaseNumber"
                  className="label label-text text-base"
                >
                  Purchase Number:
                </label>
                <input
                  type="text"
                  pattern="[A-Za-z0-9]+"
                  placeholder="Purchase Number"
                  className="w-full input input-bordered input-primary"
                  id="purchaseNumber"
                  value={formData.purchaseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseNumber: e.target.value })
                  }
                  required
                />
              </div> */}
              {/* <div>
                <label
                  htmlFor="deliveryDate"
                  className="label label-text text-base"
                >
                  Delivery Date:
                </label>
                 <DatePicker
              inputClassName="w-full input input-bordered input-primary"
              useRange={false}
              asSingle={true}
              displayFormat={"DD/MM/YYYY"}
              value={{startDate: formData.deliveryDate, endDate: formData.deliveryDate}}
              onChange={handleDateChange}
              required
            />
              </div> */}
            
              {/* <div>
                <label
                  htmlFor="supplierName"
                  className="label label-text text-base"
                >
                  Supplier Name:
                </label>
                <input
                  type="text"
                  pattern="[A-Za-z0-9\s]+"
                  placeholder="Supplier Name"
                  className="w-full input input-bordered input-primary"
                  id="supplierName"
                  value={formData.supplierName}
                  onChange={(e) =>
                    setFormData({ ...formData, supplierName: e.target.value })
                  }
                  required
                />
              </div> */}
              <div>
                <label
                  htmlFor="discountType"
                  className="label label-text text-base"
                >
                  Discount Type:
                </label>
                <select
                  id="discountType"
                  className="w-full select select-bordered select-primary"
                  onChange={(e) => {
                    setSelectedDiscountType(e.target.value);
                  }}
                >
                  <option value="">Select Discount Type</option>
                  <option value="percentage">Discount in Percentage</option>
                  <option value="cashback">Cashback</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="discount"
                  className="label label-text text-base"
                >
                  Discount:
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={ selectedDiscountType === "" ? true : false }
                  placeholder="Discount Value"
                  className={`w-full input  input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  id="discount"
                  value={discountValue}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value);
                    if (selectedDiscountType === "percentage" && newValue > 0) {
                      setFormData({
                        ...formData,
                        discountPercentage: newValue,
                        discountPrice: 0,
                      });
                    } else if (
                      selectedDiscountType === "cashback" &&
                      newValue > 0
                    ) {
                      setFormData({
                        ...formData,
                        discountPrice: newValue,
                        discountPercentage: 0,
                      });
                    } 
                    setDiscountValue(newValue);
                  }}
                />
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
                  className={`w-full select ${formSalesPerson ? "select-primary" : "select-disabled"} `}
                  value={formData.distributorId}
                  disabled={formSalesPerson ? null : true}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      distributorId: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value="">Select Distributor</option>
                  {distributors.map((distributor) => (
                    <option key={distributor.id} value={distributor.id}>
                      {distributor.distributorProfile.agencyName}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div>
                <label
                  htmlFor="vehicleNo"
                  className="label label-text text-base"
                >
                  Vehicle No:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z]{2}\d{2}[A-Za-z]{1,2}\d{4}$"
                  title="Vehicle No Format: AA11A1111 or AA11AA1111"
                  placeholder="Vehicle No (Eg. AA11A1111 or AA11AA1111)"
                  className="w-full input input-bordered input-primary"
                  id="vechicleNo"
                  value={formData.vehicleNo}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div> */}
              {/* <div>
                <label htmlFor="ackNo" className="label label-text text-base">
                  Ack No:
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ack No"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  id="ackNo"
                  value={formData.ackNo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ackNo: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div> */}
              {/* <div>
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
                  value={formData.dispatchedThrough}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dispatchedThrough: e.target.value,
                    })
                  }
                  required
                />
              </div> */}
            
              {/* <div>
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
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  required
                />
              </div> */}
              <div>
              <label
                  htmlFor="isReceived"
                  className="label label-text text-base"
                >
                  Payment Received:
                </label>
                <select
                  id="isReceived"
                  className="w-full input input-bordered input-primary"
                  value={formData.isReceived}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isReceived: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4"></div>
            <button type="submit" className="btn btn-primary">
              Add Invoice
            </button>
          </form>
        </div>
      </TitleCard>
   
      
      <dialog id="confirm_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-center">Confirmation!!</h3>
          <p className="py-4 text-center">Are you sure you want to add invoice?</p>
          <div>
          <table>
            <thead>
            <tr><th>Invoice No:</th><td>{formData.invoiceNumber}</td></tr>
            <tr><th>IRN:</th><td>{formData.irn}</td></tr>
            <tr><th>Sales Person Name:</th><td>{salesPersons.find((sp) => sp.id === formData.salespersonId)?.name}</td></tr>
            <tr><th>Invoice Date:</th><td>{formData.invoiceDate}</td></tr>
            <tr><th>Terms Of Delivery:</th><td>{formData.termsOfDelivery}</td></tr>
            <tr><th>Purchase Number:</th><td>{formData.purchaseNumber}</td></tr>
            <tr><th>Delivery Date:</th><td>{formData.deliveryDate}</td></tr>
            <tr><th>Supplier Name:</th><td>{formData.supplierName}</td></tr>
            <tr><th>Discount Percentage:</th><td>{formData.discountPercentage}</td></tr>
            <tr><th>Discount Amount:</th><td>{formData.discountPrice}</td></tr>
            <tr><th>Distributer Name:</th><td>{distributors.find((d) => d.id === formData.distributorId)?.distributorProfile.agencyName}</td></tr>
            <tr><th>Vehicle No:</th><td>{formData.vehicleNo}</td></tr>
            <tr><th>Ack No:</th><td>{formData.ackNo}</td></tr>
            <tr><th>Dispatched Through:</th><td>{formData.dispatchedThrough}</td></tr>
            <tr><th>Destination:</th><td>{formData.destination}</td></tr>
            <tr><th>Payment Received:</th><td>{formData.isReceived === false ? "No" : "Yes"}</td></tr>
            </thead>
          </table>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
            <button className="btn" onClick={() => document.getElementById("confirm_modal").close()}>No</button>
          </div>
        </div>
      </dialog>
    </>
  ) : (
    <>
    {invoiceId !== null && (
    <div className="overflow-auto grid grid-cols-1 gap-6">
    <table className="table table-zebra bg-base-100">
            <tr><th>Invoice No:</th><td>{submitInvoiceData.invoiceNumber}</td></tr>
            <tr><th>IRN:</th><td>{submitInvoiceData.irn}</td></tr>
            <tr><th>Sales Person Name:</th><td>{salesPersons.find((sp) => sp.id === submitInvoiceData.salespersonId)?.name}</td></tr>
            <tr><th>Invoice Date:</th><td>{submitInvoiceData.invoiceDate}</td></tr>
            <tr><th>Terms Of Delivery:</th><td>{submitInvoiceData.termsOfDelivery}</td></tr>
            <tr><th>Purchase Number:</th><td>{submitInvoiceData.purchaseNumber}</td></tr>
            <tr><th>Delivery Date:</th><td>{submitInvoiceData.deliveryDate}</td></tr>
            <tr><th>Supplier Name:</th><td>{submitInvoiceData.supplierName}</td></tr>
            <tr><th>Discount Percentage:</th><td>{submitInvoiceData.discountPercentage}</td></tr>
            <tr><th>Discount Amount:</th><td>{submitInvoiceData.discountPrice}</td></tr>
            <tr><th>Distributer Name:</th><td>{distributors.find((d) => d.distributorProfile.id === submitInvoiceData.distributor.distributorProfile.id)?.distributorProfile.agencyName}</td></tr>
            <tr><th>Vehicle No:</th><td>{submitInvoiceData.vechicleNo}</td></tr>
            <tr><th>Ack No:</th><td>{submitInvoiceData.ackNo}</td></tr>
            <tr><th>Dispatched Through:</th><td>{submitInvoiceData.dispatchedThrough}</td></tr>
            <tr><th>Destination:</th><td>{submitInvoiceData.destination}</td></tr>
            <tr><th>Payment Received:</th><td>{submitInvoiceData.isReceived === false ? "No" : "Yes"}</td></tr>
          </table>
          </div>
    )}
    </>
  )}
  </div>
</div>
<div className="collapse collapse-arrow bg-base-100">
  <input type="checkbox" name="my-accordion-2" id="a2" /> 
  <div className="collapse-title text-xl font-medium">
    Step 2: Add Products to Invoice
  </div>
  <div className="collapse-content"> 
  {invoiceId != null ? (
          <>
          <AddProductsForm
            invoiceId={invoiceId}
            discountPercentage={percentage}
            discountAmount={price}
            onSubmitSuccess={() => {setProductsAdded(true); document.getElementById("a3").checked = true;}}
          />
          </>
        ) : (
          <>
          <h1 className="text-center font-bold text-2xl text-gray-600">Please Create Invoice First</h1>
          </>
        )}
  </div>
</div>
<div className="collapse collapse-arrow bg-base-100">
  <input type="checkbox" name="my-accordion-2" id="a3" /> 
  <div className="collapse-title text-xl font-medium">
    {`Step 3: Add Eway Bill Details (Optional)`}
  </div>
  <div className="collapse-content"> 
  {invoiceId != null ? (
          <>
          {/* Checkbox to allow editing */}
          <div className="flex justify-between items-center w-full mt-5">
          <div className="flex justify-center items-center gap-2">
            <label
              htmlFor="allowEditingCheckbox"
              className="label text-base"
            >
              Need Eway Bill :
            </label>
            <input
              type="checkbox"
              id="allowEditingCheckbox"
              className="toggle toggle-primary"
              checked={allowEditing}
              onChange={handleCheckboxChange}
            />
          </div>
          
          </div>
          {allowEditing == true ? <EwayForm invoiceID={invoiceId} onSubmitSuccess={() => setInvoiceId(null) && setDiscountValue(0) && setSelectedDiscountType("")} /> : null}
          
          
          {/* confirmation without eway modal */}

          <dialog id="done_modal" className="modal">
          <div className="modal-box ">
            <TitleCard title="CAUSION !!!">
              <p className="py-4 text-center text-xl">Are you sure you want to proceed without Eway Bill?</p>
                <br/>
              <div className="flex justify-between w-1/2 m-auto mt-10">
                <label
                  className="btn btn-error px-8"
                  onClick={() => {
                    setInvoiceId(null); 
                    setDiscountValue(0);
                    setSelectedDiscountType("");
                    setSubmitInvoiceData({});
                    document.getElementById("done_modal").close();
                    setFormData({});
                    setProductsAdded(false);
                    document.getElementById("a1").checked = true;
                    dispatch(showNotification({message : "Invoice Created Successfully! 👍", status : 1}))
                  } }
                >
                  Yes
                </label>
                <label
                  className="btn btn-ghost px-8"
                  onClick={() =>
                    document.getElementById("done_modal").close()
                  }
                >
                  No
                </label>
              </div>
            </TitleCard>
          </div>
        </dialog>

        </>
      ) : (
        <h1 className="text-center font-bold text-2xl text-gray-600">Please Create Invoice First</h1>
      )}
  </div>
</div>
  {allowEditing == false && productsAdded == true &&
          <div>
          <button className="btn btn-primary items-center float-right btn-sm" onClick={() => document.getElementById("done_modal").showModal()}>Done</button> 
          </div>}

            </div>
     


      
    </>
  );
}

export default InvoicesForm;
