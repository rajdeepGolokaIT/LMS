import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import { BASE_URL } from "../../../Endpoint";

const AddSalesPerson = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState([{
        name: '',
        contactNumber: '',
        email: ''
      }]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            for (const key in formData) {
                params.append(key, formData[key]);
            }
          const response = await axios.post(
            `${BASE_URL}/api/v1/salespersons/add-salesperson`,
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
          );
          console.log("Sales Person added:", response.data);
          setFormData({
            name: '',
            contactNumber: '',
            email: ''
          });
          dispatch(
            showNotification({
              message: "Sales Person added successfully 😁",
              status: 1,
            })
          );


        } catch (error) {
          console.error("Error adding Sales Person:", error);
          dispatch(
            showNotification({
              message: "Error adding Sales Person! 😵",
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
    <TitleCard title="Add Sales Person" topMargin="mt-2">
    <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <div>
        <label
                  htmlFor="name"
                  className="label label-text text-base"
                >
                  Sales Person Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
        </div>

        <div>
        <label
                  htmlFor="contactNumber"
                  className="label label-text text-base"
                >
                  Contact Number:
                </label>
                <input
                  type="text"
                  pattern="[0-9]{10}"
                  
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
        </div>
            <div>
                <div>
                <label
                  htmlFor="email"
                  className="label label-text text-base"
                >
                  Email:
                </label>
                <input
                  type="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  
                />
                </div>
            </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
        </form>
        </div>
        </TitleCard>
        </>
  )
}

export default AddSalesPerson