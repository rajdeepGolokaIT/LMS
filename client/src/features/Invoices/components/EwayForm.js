import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
        const params = new URLSearchParams();
        for (const key in formData) {
            params.append(key, formData[key]);
        }
      const response = await axios.post(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/eways/add-eway",
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

  

  return (
    <>
    
      <TitleCard title="Eway Bill" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
             
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eWayDocNumber"
                  className="label label-text text-base"
                >
                  Eway Doc Number:
                </label>
                <input
                  type="text"
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
                  placeholder="Eway Bill No"
                  className="w-full input input-bordered input-primary"
                  id="eWayBillNo"
                  name="eWayBillNo"
                  value={formData.eWayBillNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eWayMode"
                  className="label label-text text-base"
                >
                  Eway Mode:
                </label>
                <input
                  type="text"
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
                  placeholder="Eway Approx Distance"
                  className="w-full input input-bordered input-primary"
                  id="eWayApproxDistance"
                  name="eWayApproxDistance"
                  value={formData.eWayApproxDistance}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eWayValidUpto"
                  className="label label-text text-base"
                >
                  Eway Valid Upto:
                </label>
                <input
                  type="text"
                  placeholder="Eway Valid Upto"
                  className="w-full input input-bordered input-primary"
                  id="eWayValidUpto"
                  name="eWayValidUpto"
                  value={formData.eWayValidUpto}
                  onChange={handleChange}
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
                  placeholder="Eway Supply Type"
                  className="w-full input input-bordered input-primary"
                  id="eWaySupplyType"
                  name="eWaySupplyType"
                  value={formData.eWaySupplyType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eWayTransactionType"
                  className="label label-text text-base"
                >
                  Eway Transaction Type:
                </label>
                <input
                  type="text"
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
                  placeholder="Eway Transaction Id"
                  className="w-full input input-bordered input-primary"
                  id="eWayTransactionId"
                  name="eWayTransactionId"
                  value={formData.eWayTransactionId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eWayGSTIN"
                  className="label label-text text-base"
                >
                  Eway GSTIN:
                </label>
                <input
                  type="text"
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
                  placeholder="Eway from"
                  className="w-full input input-bordered input-primary"
                  id="eWayfrom"
                  name="eWayfrom"
                  value={formData.eWayfrom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="eWayTo" className="label label-text text-base">
                  Eway to:
                </label>
                <input
                  type="text"
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
                  placeholder="Eway Distpatch From"
                  className="w-full input input-bordered input-primary"
                  id="eWayDistpatchFrom"
                  name="eWayDistpatchFrom"
                  value={formData.eWayDistpatchFrom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eWayShipTo"
                  className="label label-text text-base"
                >
                  Eway Ship To:
                </label>
                <input
                  type="text"
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
                  placeholder="Eway Tax Amount"
                  className="w-full input input-bordered input-primary"
                  id="ewaytaxAmount"
                  name="ewaytaxAmount"
                  value={formData.ewaytaxAmount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ewaytaxRate"
                  className="label label-text text-base"
                >
                  Eway Tax Rate:
                </label>
                <input
                  type="text"
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
                  placeholder="Eway Transportation ID"
                  className="w-full input input-bordered input-primary"
                  id="ewayTransportationID"
                  name="ewayTransportationID"
                  value={formData.ewayTransportationID}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ewayVehicleNo"
                  className="label label-text text-base"
                >
                  Eway Vehicle No:
                </label>
                <input
                  type="text"
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
    </>
  );
}

export default EwayForm;
