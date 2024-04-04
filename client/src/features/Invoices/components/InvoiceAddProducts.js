import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import axios from 'axios';
import TitleCard from "../../../components/Cards/TitleCard";

function AddProductsForm({ invoiceId }) {
    const [products, setProducts] = useState([]);
    const [productForms, setProductForms] = useState([{ productId: '', quantity: '' }]);
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
        const updatedForms = [...productForms];
        updatedForms[index].productId = value;
        setProductForms(updatedForms);
    };

    const handleQuantityChange = (index, value) => {
        const updatedForms = [...productForms];
        updatedForms[index].quantity = value;
        setProductForms(updatedForms);
    };

    const addProductForm = () => {
        setProductForms([...productForms, { productId: '', quantity: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productsData = {};
            productForms.forEach((form) => {
                if (form.productId && form.quantity) {
                    productsData[form.productId] = parseInt(form.quantity);
                }
            });

            const response = await axios.post(
                `https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/invoices/${invoiceId}/add-products`,
                productsData
            );

            console.log('Products added to invoice:', response.data);
            dispatch(showNotification({ message: 'Products added to invoice successfully 😁', status: 1 }));

            setProductForms([{ productId: '', quantity: '' }]);
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
