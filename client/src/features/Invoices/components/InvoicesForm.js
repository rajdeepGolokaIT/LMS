import TitleCard from "../../../components/Cards/TitleCard";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import AddProductsForm from "./InvoiceAddProducts";
import EwayForm from "./EwayForm";

function InvoicesForm() {
  const [formData, setFormData] = useState({
    // id: 0,
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
    distributorId: 0,
    totalQuantityNos: 0,
    totalQuantityDoz: 0,
    destination: "",
    invoiceNumber: 0,
    irn: 0,
    // hsnsac: 0,
    ackNo: 0,
    amount: 0,
    dispatchedThrough: "",
    termsOfDelivery: "",
    salespersonId: 0,
  });

  const [discountValue, setDiscountValue] = useState(0);
  const [selectedDiscountType, setSelectedDiscountType] = useState("");
  const [distributors, setDistributors] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [invoiceId, setInvoiceId] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [price, setPrice] = useState(0);
  const [allowEditing, setAllowEditing] = useState(false); // State to manage whether editing is allowed
  const [productsAdded, setProductsAdded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDistributors();
    fetchSalesPersons();
  }, []);

  const fetchSalesPersons = async () => {
    try {
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all"
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
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/distributors/all"
      );
      setDistributors(response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      for (const key in formData) {
        params.append(key, formData[key]);
      }
      params.append("isActive", true);
      console.log(params.toString());
      const response = await axios.post(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/createInvoice",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Invoice added:", response.data);
      setInvoiceId(response.data.id);
      setPercentage(response.data.discountPercentage);
      setPrice(response.data.discountPrice);
      dispatch(
        showNotification({
          message: "Invoice added successfully 😁",
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
        invoiceNumber: 0,
        irn: 0,
        // hsnsac: 0,
        ackNo: 0,
        amount: 0,
        dispatchedThrough: "",
        termsOfDelivery: "",
        salespersonId: 0,
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
    setProductsAdded(!productsAdded);
  };

  console.log(discountValue);
  console.log(formData);

  return (
    <>
      <TitleCard title="Add An Invoice" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg ">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  min="0"
                  placeholder="Invoice Number"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invoiceNumber: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="irn" className="label label-text text-base">
                  IRN:
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="IRN"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  id="irn"
                  value={formData.irn}
                  onChange={(e) =>
                    setFormData({ ...formData, irn: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salespersonId: parseInt(e.target.value),
                    })
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
              </div>
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
                  value={formData.deliveryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryDate: e.target.value })
                  }
                  required
                />
              </div>
            
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
                  value={formData.supplierName}
                  onChange={(e) =>
                    setFormData({ ...formData, supplierName: e.target.value })
                  }
                  required
                />
              </div>
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
                  placeholder="Discount Value"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            
            {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="totalQuantity_Nos" className="label label-text text-base">Total Quantity Nos:</label>
                        <input
                            type="number"
                            placeholder="Total Quantity Nos"
                            className="w-full input input-bordered input-primary"
                            id="totalQuantity_Nos"
                            value={formData.totalQuantityNos}
                            onChange={(e) => setFormData({...formData, totalQuantityNos: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="totalQuantity_Doz" className="label label-text text-base">Total Quantity Nos:</label>
                        <input
                            type="number"
                            placeholder="Total Quantity Doz"
                            className="w-full input input-bordered input-primary"
                            id="totalQuantity_Doz"
                            value={formData.totalQuantityDoz}
                            onChange={(e) => setFormData({...formData, totalQuantityDoz: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    </div> */}

            
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
                  value={formData.distributorId}
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
              <div>
                <label
                  htmlFor="vehicleNo"
                  className="label label-text text-base"
                >
                  Vehicle No:
                </label>
                <input
                  type="text"
                  pattern="[A-Za-z0-9]+"
                  placeholder="Vehicle No"
                  className="w-full input input-bordered input-primary"
                  id="vechicleNo"
                  value={formData.vehicleNo}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleNo: e.target.value })
                  }
                  required
                />
              </div>
              <div>
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
                  value={formData.dispatchedThrough}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dispatchedThrough: e.target.value,
                    })
                  }
                  required
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
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  required
                />
              </div>
              {/* <div>
                <label htmlFor="hsnsac" className="label label-text text-base">
                  HSN/SAC:
                </label>
                <input
                  type="number"
                  placeholder="HSN/SAC"
                  className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  id="hsnsac"
                  value={formData.hsnsac}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hsnsac: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div> */}
            </div>
            <div className="grid grid-cols-2 gap-4"></div>
            <button type="submit" className="btn btn-primary">
              Add Invoice
            </button>
          </form>
        </div>
      </TitleCard>
      {invoiceId != null && (
          <>
          <AddProductsForm
            invoiceId={invoiceId}
            discountPercentage={percentage}
            discountAmount={price}
            onSubmitSuccess={() => setProductsAdded(true)}
          />
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
              className="checkbox checkbox-primary"
              checked={allowEditing && productsAdded}
              onChange={handleCheckboxChange}
            />
          </div>
          {productsAdded === true &&
          <button className="btn btn-primary items-center btn-sm" onClick={() => setInvoiceId(null) && setDiscountValue(0) && setSelectedDiscountType("")}>Done</button> }
          </div>
          {allowEditing == true ? <EwayForm invoiceID={invoiceId} onSubmitSuccess={() => setInvoiceId(null) && setDiscountValue(0) && setSelectedDiscountType("")} /> : null}
        </>
      )}
    </>
  );
}

export default InvoicesForm;
