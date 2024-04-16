import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import axios from 'axios';
import TitleCard from "../../../components/Cards/TitleCard";
import InvoiceUpdateEway from './InvoiceUpdateEway';

const InvoiceUpdateProducts = ({ invoiceId }) => {


    const [products, setProducts] = useState([]);
    const [productForms, setProductForms] = useState([]);
    const dispatch = useDispatch();

    console.log(invoiceId);

    useEffect(() => {
        fetchProducts();
        fetchInvoiceProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/products/all');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Handle error, show error message to the user, etc.
        }
    };

    const fetchInvoiceProducts = async () => {
        try {
            const response = await axios.get(`https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/get-invoice-products-by-id/${invoiceId[0]}`);
            const fetchedProducts = response.data;
    
            // Preprocess fetchedProducts to match the structure of productForms
            const preprocessedProducts = fetchedProducts.map(item => {
                const productInfo = item[0];
                const invoiceInfo = item[2];
    
                console.log(productInfo.price)

                return {
                    productId: productInfo.id,
                    quantity: invoiceInfo.quantity.toString(), // Convert quantity to string since it seems to be stored as a string in productForms
                    taxType: invoiceInfo.cgstSgst > 0 ? 'cgst_sgst' : 'igst', // Assuming tax type can be deduced from cgstSgst and igst
                    taxValue: invoiceInfo.cgstSgst > 0 ? invoiceInfo.cgstSgst : invoiceInfo.igst, // Assuming tax value can be deduced from cgstSgst and igst
                    price: productInfo.price, // Price directly obtained from productInfo
                };
            });
    
            setProductForms(preprocessedProducts);
        } catch (error) {
            console.error('Error fetching invoice products:', error);
        }
    };
    

    const handleProductChange = (index, value) => {
        // Find the price of the selected product
        const selectedProduct = products.find(product => product.id.toString() === value);
        console.log(selectedProduct);
        const updatedForms = [...productForms];
        updatedForms[index].productId = value;
        updatedForms[index].price = selectedProduct.price
        setProductForms(updatedForms);
        console.log(updatedForms);
    };

    const handleQuantityChange = (index, value) => {
        const updatedForms = [...productForms];
        updatedForms[index].quantity = value;
        setProductForms(updatedForms);
    };

    const handleTaxTypeChange = (index, value) => {
        const updatedForms = [...productForms];
        updatedForms[index].taxType = value;
        // Set the tax value to 0 for the other tax type
        updatedForms[index].taxValue = value === 'cgst_sgst' ? 0 : updatedForms[index].taxValue;
        setProductForms(updatedForms);
    };

    const handleTaxValueChange = (index, value) => {
        const updatedForms = [...productForms];
        updatedForms[index].taxValue = value;
        setProductForms(updatedForms);
    };

    const calculateTotalAmount = (price, quantity, taxValue) => {
        const subtotal = price * quantity;
        const tax = taxValue ? (subtotal * taxValue) / 100 : 0;
        return subtotal + tax;
    };

    // const addProductForm = () => {
    //     setProductForms([...productForms, { productId: '', quantity: '', taxType: '', taxValue: 0 }]);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productsData = {};
            productForms.forEach((form) => {
                if (form.productId && form.quantity) {
                    const totalAmountWithTax = calculateTotalAmount(form.price, form.quantity, form.taxValue);
                    productsData[form.productId] = {
                        quantity: parseInt(form.quantity),
                        cgstSgst: form.taxType === 'cgst_sgst' ? form.taxValue : 0,
                        igst: form.taxType === 'igst' ? form.taxValue : 0,
                        totalAmountWithoutTax: form.price * form.quantity,
                        totalAmountWithTax: totalAmountWithTax
                    };
                }
            });

            console.log(productsData);

            

            const response = await axios.put(
                `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/${invoiceId}/update-products`,
                productsData
                
            );

            dispatch(showNotification({ message: 'Products updated to invoice successfully 😁', status: 1 }));
            console.log('Products updated to invoice:', response.data);
            document.getElementById("update_modal_2").close();
            document.getElementById("update_modal_3").showModal();


            // setProductForms([{ productId: '', quantity: '', taxType: '', taxValue: 0 }]);
        } catch (error) {
            console.error('Error adding products to invoice:', error);
            dispatch(showNotification({ message: 'Error updating products to invoice! 😵', status: 0 }));
        }
    };



  return (
    <>
        <form onSubmit={handleSubmit} id='invoice-form' className="space-y-4">
        <button onClick={() => document.getElementById("update_modal_2").close()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            {productForms.map((form, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`product-${index}`} className="label label-text text-base">Product:</label>
                        <select
                            id={`product-${index}`}
                            className="w-full input input-bordered input-primary"
                            value={form.productId}
                            onChange={(e) => handleProductChange(index, e.target.value)}
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>{product.productName}</option>
                            ))}
                        </select>
                        <p>Single Unit Price: {form.price}</p>
                    </div>
                    <div>
                        <label htmlFor={`quantity-${index}`} className="label label-text text-base">Quantity:</label>
                        <input
                            type="number"
                            placeholder="Quantity"
                            className="w-full input input-bordered input-primary"
                            id={`quantity-${index}`}
                            value={form.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor={`tax-type-${index}`} className="label label-text text-base">Tax Type:</label>
                        <select
                            id={`tax-type-${index}`}
                            className="w-full input input-bordered input-primary"
                            value={form.taxType}
                            onChange={(e) => handleTaxTypeChange(index, e.target.value)}
                            required
                        >
                            <option value="">Select Tax Type</option>
                            <option value="cgst_sgst">CGST + SGST</option>
                            <option value="igst">IGST</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor={`tax-value-${index}`} className="label label-text text-base">Tax Value:</label>
                        <input
                            type="number"
                            placeholder="Tax Value"
                            className="w-full input input-bordered input-primary"
                            id={`tax-value-${index}`}
                            value={form.taxValue}
                            onChange={(e) => handleTaxValueChange(index, parseFloat(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <label className="label label-text text-base">Total Amount Without Tax:</label>
                        <p>{isNaN(form.price * form.quantity) ? 0 : (form.price * form.quantity)}</p>
                    </div>
                    <div>
                        <label className="label label-text text-base">Total Amount With Tax:</label>
                        <p>{isNaN(calculateTotalAmount(form.price, form.quantity, form.taxValue)) ? 0 : calculateTotalAmount(form.price, form.quantity, form.taxValue)}</p>
                    </div>
                </div>
            ))}
            {/* <button type="button" onClick={addProductForm} className="btn btn-outline btn-sm">Add More Products</button> */}
            <br/>
            <br/>
            <div className='modal-action'>
            <button type="submit" className="btn btn-primary">Update Products</button>
            {/* <button onClick={() => document.getElementById("product_update_modal").close()} className='btn btn-danger'>Cancel</button> */}
            </div>
        </form>
            
        <dialog id='update_modal_3' className="modal">
            <div className="modal-box">
            <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
            <InvoiceUpdateEway invoiceID={invoiceId}/>
            </div>
               </div>
        </dialog> 
        </>
  )
}

export default InvoiceUpdateProducts