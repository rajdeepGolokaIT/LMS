import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import DatePicker from "react-tailwindcss-datepicker";
import TitleCard from "../../../components/Cards/TitleCard";
import { BASE_URL } from "../../../Endpoint";

function EwayForm({ invoiceID, onSubmitSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    invoiceId: `${invoiceID}`,
    ewayDocNumber: "",
    eWayBillNo: "",
    eWayMode: "",
    eWayApproxDistance: "",
    eWayValidUpto: "",
    eWaySupplyType: "",
    eWayTransactionType: "",
    eWayTransactionId: "",
    eWayGSTIN: "",
    eWayfrom: "",
    eWayTo: "",
    eWayDistpatchFrom: "",
    eWayShipTo: "",
    ewaytaxAmount: "",
    ewaytaxRate: "",
    ewayTransportationID: "",
    ewayVechileNo: "",
    ewayVehicleFrom: "",
  });

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      
        const params = new URLSearchParams();
        for (const key in formData) {
            params.append(key, formData[key]);
        }
      const response = await axios.post(
        `${BASE_URL}/api/v1/eways/add-eway`,
        params.toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
      );
      console.log("Eway added:", response.data);
      dispatch(
        showNotification({
          message: "Eway Bill added to invoice successfully 😁",
          status: 1,
        })
      );
      document.getElementById("confirm3_modal").close();

      setFormData({
        invoiceId: "",
        ewayDocNumber: "",
        eWayBillNo: "",
        eWayMode: "",
        eWayApproxDistance: "",
        eWayValidUpto: "",
        eWaySupplyType: "",
        eWayTransactionType: "",
        eWayTransactionId: "",
        eWayGSTIN: "",
        eWayfrom: "",
        eWayTo: "",
        eWayDistpatchFrom: "",
        eWayShipTo: "",
        ewaytaxAmount: "",
        ewaytaxRate: "",
        ewayTransportationID: "",
        ewayVechileNo: "",
        ewayVehicleFrom: "",
      });
      onSubmitSuccess();
    } catch (error) {
      console.error("Error adding Eway:", error);
      // dispatch(
      //   showNotification({
      //     message: "Error adding Eway Bill to invoice! 😵",
      //     status: 0,
      //   })
      // );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    document.getElementById('confirm3_modal').showModal();
  };

  

  return (
    <>
    
      <TitleCard title="Eway Bill" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
          <form onSubmit={handleConfirm} className="space-y-4">
             
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="eWayDocNumber"
                  className="label label-text text-base"
                >
                  Eway Doc Number:
                </label>
                <input
                  type="text"
                  pattern="^[0-9]+$"
                  placeholder="Eway Doc Number"
                  className="w-full input input-bordered input-primary"
                  id="ewayDocNumber"
                  name="ewayDocNumber"
                  value={formData.ewayDocNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="eWayBillNo"
                  className="label label-text text-base"
                >
                  Eway Bill No:
                </label>
                <input
                  type="text"
                  pattern="^[0-9]+$"
                  placeholder="Eway Bill No"
                  className="w-full input input-bordered input-primary"
                  id="eWayBillNo"
                  name="eWayBillNo"
                  value={formData.eWayBillNo}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div>
                <label
                  htmlFor="eWayMode"
                  className="label label-text text-base"
                >
                  Eway Mode:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z]+$"
                  placeholder="Eway Mode"
                  className="w-full input input-bordered input-primary"
                  id="eWayMode"
                  name="eWayMode"
                  value={formData.eWayMode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="eWayApproxDistance"
                  className="label label-text text-base"
                >
                  Eway Approx Distance:
                </label>
                <input
                  type="text"
                  pattern="^[0-9A-Za-z]+$"
                  placeholder="Eway Approx Distance"
                  className="w-full input input-bordered input-primary"
                  id="eWayApproxDistance"
                  name="eWayApproxDistance"
                  value={formData.eWayApproxDistance}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div>
                <label
                  htmlFor="eWayValidUpto"
                  className="label label-text text-base"
                >
                  Eway Valid Upto:
                </label>
                <DatePicker
              inputClassName="w-full input input-bordered input-primary"
              useRange={false}
              asSingle={true}
              displayFormat={"DD/MM/YYYY"}
              value={{startDate: formData.eWayValidUpto, endDate: formData.eWayValidUpto}}
              onChange={(date) => setFormData({ ...formData, eWayValidUpto: date.startDate })}
              required
            />
              </div>
              <div>
                <label
                  htmlFor="eWaySupplyType"
                  className="label label-text text-base"
                >
                  Eway Supply Type:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z]+$"
                  placeholder="Eway Supply Type"
                  className="w-full input input-bordered input-primary"
                  id="eWaySupplyType"
                  name="eWaySupplyType"
                  value={formData.eWaySupplyType}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div>
                <label
                  htmlFor="eWayTransactionType"
                  className="label label-text text-base"
                >
                  Eway Transaction Type:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z]+$"
                  placeholder="Eway Transaction Type"
                  className="w-full input input-bordered input-primary"
                  id="eWayTransactionType"
                  name="eWayTransactionType"
                  value={formData.eWayTransactionType}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="eWayTransactionId"
                  className="label label-text text-base"
                >
                  Eway Transaction Id:
                </label>
                <input
                  type="text"
                  pattern="^[0-9A-Za-z]+$"
                  placeholder="Eway Transaction Id"
                  className="w-full input input-bordered input-primary"
                  id="eWayTransactionId"
                  name="eWayTransactionId"
                  value={formData.eWayTransactionId}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div>
                <label
                  htmlFor="eWayGSTIN"
                  className="label label-text text-base"
                >
                  Eway GSTIN:
                </label>
                <input
                  type="text"
                  pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}"
                  placeholder="Eway GSTIN"
                  className="w-full input input-bordered input-primary"
                  id="eWayGSTIN"
                  name="eWayGSTIN"
                  value={formData.eWayGSTIN}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="eWayfrom"
                  className="label label-text text-base"
                >
                  Eway from:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z\s]+$"
                  placeholder="Eway from"
                  className="w-full input input-bordered input-primary"
                  id="eWayfrom"
                  name="eWayfrom"
                  value={formData.eWayfrom}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div>
                <label htmlFor="eWayTo" className="label label-text text-base">
                  Eway to:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z\s]+$"
                  placeholder="Eway to"
                  className="w-full input input-bordered input-primary"
                  id="eWayTo"
                  name="eWayTo"
                  value={formData.eWayTo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="eWayDistpatchFrom"
                  className="label label-text text-base"
                >
                  Eway Distpatch From:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z\s]+$"
                  placeholder="Eway Distpatch From"
                  className="w-full input input-bordered input-primary"
                  id="eWayDistpatchFrom"
                  name="eWayDistpatchFrom"
                  value={formData.eWayDistpatchFrom}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div>
                <label
                  htmlFor="eWayShipTo"
                  className="label label-text text-base"
                >
                  Eway Ship To:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z\s]+$"
                  placeholder="Eway Ship To"
                  className="w-full input input-bordered input-primary"
                  id="eWayShipTo"
                  name="eWayShipTo"
                  value={formData.eWayShipTo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="ewaytaxAmount"
                  className="label label-text text-base"
                >
                  Eway Tax Amount:
                </label>
                <input
                  type="text"
                  pattern="^[0-9]+$"
                  placeholder="Eway Tax Amount"
                  className="w-full input input-bordered input-primary"
                  id="ewaytaxAmount"
                  name="ewaytaxAmount"
                  value={formData.ewaytaxAmount}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div>
                <label
                  htmlFor="ewaytaxRate"
                  className="label label-text text-base"
                >
                  Eway Tax Rate:
                </label>
                <input
                  type="text"
                  pattern="^[0-9]+$"
                  placeholder="Eway Tax Rate"
                  className="w-full input input-bordered input-primary"
                  id="ewaytaxRate"
                  name="ewaytaxRate"
                  value={formData.ewaytaxRate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="ewayTransportationID"
                  className="label label-text text-base"
                >
                  Eway Transportation ID:
                </label>
                <input
                  type="text"
                  pattern="^[0-9]+$"
                  placeholder="Eway Transportation ID"
                  className="w-full input input-bordered input-primary"
                  id="ewayTransportationID"
                  name="ewayTransportationID"
                  value={formData.ewayTransportationID}
                  onChange={handleChange}
                  required
                />
              </div>
            
              <div>
                <label
                  htmlFor="ewayVehicleNo"
                  className="label label-text text-base"
                >
                  Eway Vehicle No:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z]{2}\d{2}[A-Za-z]{1,2}\d{4}$"
                  placeholder="Eway Vehicle No"
                  className="w-full input input-bordered input-primary"
                  id="ewayVechileNo"
                  name="ewayVechileNo"
                  value={formData.ewayVechileNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="ewayVehicleFrom"
                  className="label label-text text-base"
                >
                  Eway Vehicle From:
                </label>
                <input
                  type="text"
                  pattern="^[A-Za-z\s]+$"
                  placeholder="Eway Vehicle From"
                  className="w-full input input-bordered input-primary"
                  id="ewayVehicleFrom"
                  name="ewayVehicleFrom"
                  value={formData.ewayVehicleFrom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Eway Form
            </button>
          </form>
        </div>
      </TitleCard>

      <dialog id="confirm3_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-center">Confirmation!!</h3>
          <p className="py-4 text-center">Are you sure you want to add eway bill to invoice?</p>
          <div>
          <table className="table w-full">
            <tr><th>Eway Doc No:</th><td>{formData.ewayDocNumber}</td></tr>
            <tr><th>Eway Bill No:</th><td>{formData.eWayBillNo}</td></tr>
            <tr><th>Eway Mode:</th><td>{formData.eWayMode}</td></tr>
            <tr><th>Eway Approx Distance:</th><td>{formData.eWayApproxDistance}</td></tr>
            <tr><th>Eway Valid Upto:</th><td>{formData.eWayValidUpto}</td></tr>
            <tr><th>Eway Supply Type:</th><td>{formData.eWaySupplyType}</td></tr>
            <tr><th>Eway Transaction Type:</th><td>{formData.eWayTransactionType}</td></tr>
            <tr><th>Eway Transaction ID:</th><td>{formData.eWayTransactionId}</td></tr>
            <tr><th>Eway GSTIN:</th><td>{formData.eWayGSTIN}</td></tr>
            <tr><th>Eway From:</th><td>{formData.eWayfrom}</td></tr>
            <tr><th>Eway To:</th><td>{formData.eWayTo}</td></tr>
            <tr><th>Eway Dispatch From:</th><td>{formData.eWayDistpatchFrom}</td></tr>
            <tr><th>Eway Ship To:</th><td>{formData.eWayShipTo}</td></tr>
            <tr><th>Eway Tax Amount:</th><td>{formData.ewaytaxAmount}</td></tr>
            <tr><th>Eway Tax Rate:</th><td>{formData.ewaytaxRate}</td></tr>
            <tr><th>Eway Transportation ID:</th><td>{formData.ewayTransportationID}</td></tr>
            <tr><th>Eway Vehicle No:</th><td>{formData.ewayVechileNo}</td></tr>
            <tr><th>Eway Vehicle From:</th><td>{formData.ewayVehicleFrom}</td></tr>
            
          </table>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
            <button className="btn" onClick={() => document.getElementById("confirm3_modal").close()}>No</button>
          </div>
        </div>
      </dialog>

    </>
  );
}

export default EwayForm;
