import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import axios from 'axios';
import TitleCard from "../../../components/Cards/TitleCard";

function AddProductsForm({ invoiceId }) {
    const [products, setProducts] = useState([]);
    const [productForms, setProductForms] = useState([{ productId: '', quantity: '', taxType: '', taxValue: 0 }]);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchProducts();
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

    const addProductForm = () => {
        setProductForms([...productForms, { productId: '', quantity: '', taxType: '', taxValue: 0 }]);
    };

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

            const response = await axios.post(
                `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/${invoiceId}/add-products`,
                productsData
            );

            console.log('Products added to invoice:', response.data);
            dispatch(showNotification({ message: 'Products added to invoice successfully 😁', status: 1 }));

            setProductForms([{ productId: '', quantity: '', taxType: '', taxValue: 0 }]);
        } catch (error) {
            console.error('Error adding products to invoice:', error);
            dispatch(showNotification({ message: 'Error adding products to invoice! 😵', status: 0 }));
        }
    };

    

    return (
        <>
        <TitleCard title="Add Products to Invoice" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                            <p>Single Unit Price: {products.find(product => product.id.toString() === form.productId)?.price || ''}</p>
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
                <button type="button" onClick={addProductForm} className="btn btn-outline btn-sm">Add More Products</button>
                <br/>
                <br/>
                <button type="submit" className="btn btn-primary">Submit Products</button>
            </form>
        </div>
        </TitleCard>
        </>
    );
}

export default AddProductsForm;
