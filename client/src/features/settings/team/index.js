import moment from "moment"

import { useDispatch, useSelector } from "react-redux"
import { showNotification } from '../../common/headerSlice'
import TitleCard from "../../../components/Cards/TitleCard"
import React, { useState } from 'react';
import axios from 'axios';




function Team(){

    const dispatch = useDispatch();
    const [categoryName, setCategoryName] = useState('');
    const [isActive, setIsActive] = useState(true); // Assuming default is active

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 

    try {
      const response = await axios.post(
        'https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/categories/add-category',
        {
          categoryName,
          isActive
        }
      );
      console.log('Category added:', response.data);
      dispatch(showNotification({ message: 'Category added successfully 😁', status: 1 }));
      // Optionally, you can reset the form fields after successful submission
      setCategoryName('');
      setIsActive(true);
    } catch (error) {
      console.error('Error adding category:', error);
      dispatch(showNotification({message : "Error adding category! 😵", status : 0}));
      // Handle error, show error message to the user, etc.
    }
  };


    return(
        <>
            
            <TitleCard title="Add A Category" topMargin="mt-2" >  
            <div className="w-full p-6 m-auto bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="label label-text text-base">Category Name:</label>
            <input
              type="text"
              placeholder="Category Name"
              className="w-full input input-bordered input-primary"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
          <button type="submit" className="btn btn-primary">Add Category</button>
        </form>
      </div>
            </TitleCard>
        </>
    )
}


export default Team