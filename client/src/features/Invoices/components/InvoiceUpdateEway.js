import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";

const InvoiceUpdateEway = ({ invoiceID }) => {

  console.log(invoiceID[0])

    const [ewayBill, setEwayBill] = useState(null);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
      invoiceId: `${invoiceID[0]}`,
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


    useEffect(() => {
        const fetchEwayBills = async () => {
            try {
                const response = await axios.get("https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/eways/all");
                const ewayBills = response.data;
                console.log(ewayBills.find((eway) => parseInt(eway.invoice.id) === parseInt(invoiceID[0])));
                console.log(ewayBills.map((eway) => eway.invoice.id));
    
                // Find the Eway Bill associated with the invoiceID
                const foundEwayBill = ewayBills.find((eway) => parseInt(eway.invoice.id) === parseInt(invoiceID[0]));
                setEwayBill(foundEwayBill);
    
                // If Eway Bill data is found, set the form data
                if (foundEwayBill) {
                    setFormData({
                        invoiceId: `${invoiceID[0]}`,
                        ewayDocNumber: foundEwayBill.ewayDocNumber || "",
                        eWayBillNo: foundEwayBill.eWayBillNo || "",
                        eWayMode: foundEwayBill.eWayMode || "",
                        eWayApproxDistance: foundEwayBill.eWayApproxDistance || "",
                        eWayValidUpto: foundEwayBill.eWayValidUpto || "",
                        eWaySupplyType: foundEwayBill.eWaySupplyType || "",
                        eWayTransactionType: foundEwayBill.eWayTransactionType || "",
                        eWayTransactionId: foundEwayBill.eWayTransactionId || "",
                        eWayGSTIN: foundEwayBill.eWayGSTIN || "",
                        eWayfrom: foundEwayBill.eWayfrom || "",
                        eWayTo: foundEwayBill.eWayTo || "",
                        eWayDistpatchFrom: foundEwayBill.eWayDistpatchFrom || "",
                        eWayShipTo: foundEwayBill.eWayShipTo || "",
                        ewaytaxAmount: foundEwayBill.ewaytaxAmount || "",
                        ewaytaxRate: foundEwayBill.ewaytaxRate || "",
                        ewayTransportationID: foundEwayBill.ewayTransportationID || "",
                        ewayVechileNo: foundEwayBill.ewayVechileNo || "",
                        ewayVehicleFrom: foundEwayBill.ewayVehicleFrom || "",
                    });
                } else {
                    console.log("Eway Bill not found for invoiceID:", invoiceID);
                }
            } catch (error) {
                console.error("Error fetching Eway Bills:", error);
            }
        };
    
        fetchEwayBills();
    }, [invoiceID]);
    

console.log(formData)



  
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   try {
    //       const params = new URLSearchParams();
    //       for (const key in formData) {
    //           params.append(key, formData[key]);
    //       }
    //     const response = await axios.put(
    //       "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/eways/update-eway/",
    //       params.toString(),
    //       {
    //           headers: {
    //               'Content-Type': 'application/x-www-form-urlencoded'
    //           }
    //       }
    //     );
    //     console.log("Eway added:", response.data);
    //     dispatch(
    //       showNotification({
    //         message: "Eway Bill added to invoice successfully 😁",
    //         status: 1,
    //       })
    //     );
  
    //   } catch (error) {
    //     console.error("Error adding Eway:", error);
    //     dispatch(
    //       showNotification({
    //         message: "Error adding Eway Bill to invoice! 😵",
    //         status: 0,
    //       })
    //     );
    //   }
    // };

    const handleSubmit = async (e, formData) => {
        try {
          if (ewayBill) {
            // Update existing Eway Bill
            const params = new URLSearchParams();
        for (const key in formData) {
            params.append(key, formData[key]);
        }
            await axios.put(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/eways/update-eway/${ewayBill.id}`, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log("Eway Bill updated successfully");
            dispatch(
                showNotification({
                  message: "Eway Bill updated to invoice successfully 😁",
                  status: 1,
                })
              );
          } else {
            // Add new Eway Bill
            const params = new URLSearchParams();
        for (const key in formData) {
            params.append(key, formData[key]);
        }
            await axios.post("https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/eways/add-eway", params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log("Eway Bill added successfully");
            dispatch(
                showNotification({
                  message: "Eway Bill added to invoice successfully 😁",
                  status: 1,
                })
              );
          }
        } catch (error) {
          console.error("Error updating/adding Eway Bill:", error);
          dispatch(
            showNotification({
              message: "Error updating/adding Eway Bill! 😵",
              status: 0,
            })
          );
        }
      };

    
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };


  return (
    <>
      <TitleCard title="Update/Add Eway Bill" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
          <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-4">
          <label onClick={() => document.getElementById("update_modal_3").close()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
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
              Add/Update Eway Form
            </button>
          </form>
        </div>
      </TitleCard>
    </>
  )
}

export default InvoiceUpdateEway