import TitleCard from "../../../components/Cards/TitleCard";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import axios from 'axios';
import AddProductsForm from "./InvoiceAddProducts";
import EwayForm from "./EwayForm";

function InvoicesForm() {
    const [formData, setFormData] = useState({
        // id: 0,
        vehicleNo: '',
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalAmount: 0,
        purchaseNumber: '',
        deliveryDate: '',
        supplierName: '',
        discount: 0,
        distributorId: 0,
        totalQuantityNos: 0,
        totalQuantityDoz: 0,
        destination: '',
        invoiceNumber: 0,
        irn: 0,
        hsnsac: 0,
        ackNo: 0,
        amount: 0,
        dispatchedThrough: '',
        termsOfDelivery: '',
    });

    const [distributors, setDistributors] = useState([]);
    const [invoiceId, setInvoiceId] = useState(null);
    const dispatch = useDispatch();

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

    // Uncomment this function if you need products
    // const fetchProducts = async () => {
    //     try {
    //         const response = await axios.get('https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/products/all');
    //         setProducts(response.data);
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //         // Handle error, show error message to the user, etc.
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const params = new URLSearchParams();
            for (const key in formData) {
                params.append(key, formData[key]);
            }
            params.append('isActive', true);
            const response = await axios.post(
                'https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/createInvoice',
                params.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            console.log('Invoice added:', response.data);
            setInvoiceId(response.data.id);
            dispatch(showNotification({ message: 'Invoice added successfully 😁', status: 1 }));
            
            setFormData({
                vehicleNo: '',
                cgst: 0,
                sgst: 0,
                igst: 0,
                totalAmount: 0,
                purchaseNumber: '',
                deliveryDate: '',
                supplierName: '',
                discount: 0,
                distributorId: '',
                totalQuantityNos: 0,
                totalQuantityDoz: 0,
                destination: '',
                invoiceNumber: 0,
                irn: 0,
                hsnsac: 0,
                ackNo: 0,
                amount: 0,
                dispatchedThrough: '',
                termsOfDelivery: '',
            });
        } catch (error) {
            console.error('Error adding invoice:', error);
            dispatch(showNotification({ message: 'Error adding invoice! 😵', status: 0 }));
        }
    };

    return(
        <>
            <TitleCard title="Add An Invoice" topMargin="mt-2">
            <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg ">
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="invoiceNumber" className="label label-text text-base">Invoice Number:</label>
                        <input
                            type="number"
                            placeholder="Invoice Number"
                            className="w-full input input-bordered input-primary"
                            id="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={(e) => setFormData({...formData, invoiceNumber: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="irn" className="label label-text text-base">IRN:</label>
                        <input
                            type="number"
                            placeholder="IRN"
                            className="w-full input input-bordered input-primary"
                            id="irn"
                            value={formData.irn}
                            onChange={(e) => setFormData({...formData, irn: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="sgst" className="label label-text text-base">SGST:</label>
                        <input
                            type="number"
                            placeholder="SGST"
                            className="w-full input input-bordered input-primary"
                            id="sgst"
                            value={formData.sgst}
                            onChange={(e) => setFormData({...formData, sgst: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="igst" className="label label-text text-base">IGST:</label>
                        <input
                            type="number"
                            placeholder="IGST"
                            className="w-full input input-bordered input-primary"
                            id="igst"
                            value={formData.igst}
                            onChange={(e) => setFormData({...formData, igst: parseInt(e.target.value)})}
                            required
                            />
                        </div>
                </div>
                    
                       
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="cgst" className="label label-text text-base">CGST:</label>
                        <input
                            type="number"
                            placeholder="CGST"
                            className="w-full input input-bordered input-primary"
                            id="cgst"
                            value={formData.cgst}
                            onChange={(e) => setFormData({...formData, cgst: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="totalAmount" className="label label-text text-base">Total Amount:</label>
                        <input
                            type="number"
                            placeholder="Total Amount"
                            className="w-full input input-bordered input-primary"
                            id="totalAmount"
                            value={formData.totalAmount}
                            onChange={(e) => setFormData({...formData, totalAmount: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="purchaseNumber" className="label label-text text-base">Purchase Number:</label>
                        <input
                            type="text"
                            placeholder="Purchase Number"
                            className="w-full input input-bordered input-primary"
                            id="purchaseNumber"
                            value={formData.purchaseNumber}
                            onChange={(e) => setFormData({...formData, purchaseNumber: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="deliveryDate" className="label label-text text-base">Delivery Date:</label>
                        <input
                            type="date"
                            placeholder="Delivery Date"
                            className="w-full input input-bordered input-primary"
                            id="deliveryDate"
                            value={formData.deliveryDate}
                            onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                            required
                        />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="supplierName" className="label label-text text-base">Supplier Name:</label>
                        <input
                            type="text"
                            placeholder="Supplier Name"
                            className="w-full input input-bordered input-primary"
                            id="supplierName"
                            value={formData.supplierName}
                            onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="discount" className="label label-text text-base">Discount:</label>
                        <input
                            type="number"
                            placeholder="Discount"
                            className="w-full input input-bordered input-primary"
                            id="discount"
                            value={formData.discount}
                            onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                   
                    <div className="grid grid-cols-2 gap-4">
                    
                    <div>
                        <label htmlFor="distributorId" className="label label-text text-base">Distributor:</label>
                        <select
                            id="distributorId"
                            className="w-full input input-bordered input-primary"
                            value={formData.distributorId}
                            onChange={(e) => setFormData({...formData, distributorId: parseInt(e.target.value)})}
                            required
                        >
                            <option value="">Select Distributor</option>
                            {distributors.map(distributor => (
                                <option key={distributor.id} value={distributor.id}>{distributor.distributorProfile.agencyName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="vehicleNo" className="label label-text text-base">Vehicle No:</label>
                        <input
                            type="text"
                            placeholder="Vehicle No"
                            className="w-full input input-bordered input-primary"
                            id="vechicleNo"
                            value={formData.vehicleNo}
                            onChange={(e) => setFormData({...formData, vehicleNo: e.target.value})}
                            required
                        />
                    </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ackNo" className="label label-text text-base">Ack No:</label>
                        <input
                            type="number"
                            placeholder="Ack No"
                            className="w-full input input-bordered input-primary"
                            id="ackNo"
                            value={formData.ackNo}
                            onChange={(e) => setFormData({...formData, ackNo: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="dispatchedThrough" className="label label-text text-base">Dispatched Through:</label>
                        <input
                            type="text"
                            placeholder="Dispatched Through"
                            className="w-full input input-bordered input-primary"
                            id="dispatchedThrough"
                            value={formData.dispatchedThrough}
                            onChange={(e) => setFormData({...formData, dispatchedThrough: e.target.value})}
                            required
                        />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="destination" className="label label-text text-base">Destination:</label>
                        <input
                            type="text"
                            placeholder="Destination"
                            className="w-full input input-bordered input-primary"
                            id="destination"
                            value={formData.destination}
                            onChange={(e) => setFormData({...formData, destination: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="hsnsac" className="label label-text text-base">HSN/SAC:</label>
                        <input
                            type="number"
                            placeholder="HSN/SAC"
                            className="w-full input input-bordered input-primary"
                            id="hsnsac"
                            value={formData.hsnsac}
                            onChange={(e) => setFormData({...formData, hsnsac: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="termsOfDelivery" className="label label-text text-base">Terms Of Delivery:</label>
                        <input
                            type="text"
                            placeholder="Terms Of Delivery"
                            className="w-full input input-bordered input-primary"
                            id="termsOfDelivery"
                            value={formData.termsOfDelivery}
                            onChange={(e) => setFormData({...formData, termsOfDelivery: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="label label-text text-base">Amount:</label>
                        <input
                            type="number"
                            placeholder="Amount"
                            className="w-full input input-bordered input-primary"
                            id="amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
                            required
                        />
                    </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Invoice</button>
                </form>
            </div>
            </TitleCard>
            {invoiceId != null && 
            <>
            <AddProductsForm invoiceId={invoiceId} />
            <EwayForm invoiceID={invoiceId}/>
            </>
            }
        </>
    )
}

export default InvoicesForm;
