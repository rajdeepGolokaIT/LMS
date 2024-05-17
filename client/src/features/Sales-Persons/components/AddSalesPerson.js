import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";
import { BASE_URL } from "../../../Endpoint";

const AddSalesPerson = () => {
  const dispatch = useDispatch();
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributors, setSelectedDistributors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
  });
  const [selectedDistributorId, setSelectedDistributorId] = useState("");

  const fetchDistributors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/distributors/no-salesperson`);
      setDistributors(response.data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, []);

  const handleAddDistributor = () => {
    if (selectedDistributorId) {
      setSelectedDistributors([...selectedDistributors, selectedDistributorId]);
      setSelectedDistributorId("");
    }
  };

  const handleRemoveDistributor = (id) => {
    const updatedDistributors = selectedDistributors.filter((distributorId) => distributorId !== id);
    setSelectedDistributors(updatedDistributors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
  
      // Add formData fields to URLSearchParams
      for (const key in formData) {
        params.append(key, formData[key]);
      }
  
      // Convert array of distributor IDs to comma-separated string
      const distributorIdsString = selectedDistributors.join(',');
      // Add distributorIds to URLSearchParams
      params.append('distributorIds', distributorIdsString);
  
      const response = await axios.post(
        `${BASE_URL}/api/v1/salespersons/add-salesperson`,
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      console.log("Sales Person added:", response.data);
      setFormData({
        name: "",
        contactNumber: "",
        email: "",
      });
      setSelectedDistributors([]);
      setSelectedDistributorId("");
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

  console.log(selectedDistributors)

  return (
    <>
      <TitleCard title="Add Sales Person" topMargin="mt-2">
        <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="label label-text text-base">
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
                <label htmlFor="email" className="label label-text text-base">
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

              <div>
                <label htmlFor="distributorId" className="label label-text text-base">
                  Select Distributor Name:
                </label>
                <select
                  id="distributorId"
                  name="distributorId"
                  value={selectedDistributorId}
                  onChange={(e) => setSelectedDistributorId(e.target.value)}
                  className="select select-bordered w-full"
                  // required
                >
                  <option value="">Select Distributor</option>
                  {distributors.map((distributor) => (
                    <option key={distributor.id} value={distributor.id}>
                      {distributor.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddDistributor}
                  className="btn btn-primary mt-2"
                >
                  Add More
                </button>
              </div>

              {selectedDistributors.length > 0 && (
                <div>
                  <label className="label label-text text-base">
                    Selected Distributors:
                  </label>
                  <ul>
                    {selectedDistributors.map((id) => (
                      <li key={id} className="flex gap-2">
                        {distributors.find((distributor) => parseInt(distributor.id) === parseInt(id))?.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveDistributor(id)}
                          className="btn btn-xs btn-error btn-circle ml-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
</svg>

                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </TitleCard>
    </>
  );
};

export default AddSalesPerson;
