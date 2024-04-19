import TitleCard from "../../../components/Cards/TitleCard"
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import axios from 'axios';

function Billing(){

    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isActive, setIsActive] = useState(true); // Assuming default is active
    const [categories, setCategories] = useState([]);
    const [hsnsac, setHsnsac] = useState('');

    const dispatch = useDispatch();
  
    useEffect(() => {
        // Fetch categories when component mounts
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/categories/all');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error, show error message to the user, etc.
        }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post(
          'https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/products/add-product',
          {
            productName,
            price: parseInt(price), // Ensure price is an integer
            category: {
                id: parseInt(categoryId),
            }, // Ensure categoryId is an integer
            isActive,
            hsnsac: parseInt(hsnsac),
          }
        );
        console.log('Product added:', response.data);
        // Optionally, you can reset the form fields after successful submission
        dispatch(showNotification({ message: 'Product added successfully 😁', status: 1 }));
        setProductName('');
        setPrice('');
        setCategoryId('');
        setIsActive(true);
        setHsnsac('');
      } catch (error) {
        console.error('Error adding product:', error);
        dispatch(showNotification({message : "Error adding product! 😵", status : 0}));
        // Handle error, show error message to the user, etc.
      }
    };

    console.log(categoryId);

    return(
        <>
            <TitleCard title="Add A Product" topMargin="mt-2">
            <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg ">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="productName" className="label label-text text-base">Product Name:</label>
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="w-full input input-bordered input-primary"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="price">Price:</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="Price"
                            className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="categoryId">Category:</label>
                        <select
                            id="categoryId"
                            className="w-full input input-bordered input-primary"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.categoryName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="hsnsac">HSN/SAC:</label>
                        <input
                            type="text"
                            placeholder="HSN/SAC"
                            className="w-full input input-bordered input-primary"
                            id="hsnsac"
                            value={hsnsac}
                            onChange={(e) => setHsnsac(e.target.value)}
                            required
                        />
                    </div>
                    {/* <div>
                        <label htmlFor="isActive" className="cursor-pointer label label-text">Active:</label>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </div> */}
                    <button type="submit" className="btn btn-primary">Add Product</button>
                </form>
            </div>
            </TitleCard>
        </>
    )
}

export default Billing;
