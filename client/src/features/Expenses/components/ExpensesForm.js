import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification, setPageTitle } from "../../common/headerSlice";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";

const ExpensesForm = () => {


  


  const dispatch = useDispatch();
  const [salespersons, setSalespersons] = useState([]);
  const [formData, setFormData] = useState([
    {
      salespersonId: 0,
      salary: 0,
      incentive: 0,
      miscellaneous: 0,
    }
  ]);

  useEffect(() => {
    dispatch(setPageTitle({ title : "Expenses Entry Operations"}))
  }, [])

  const fetchSalespersons = async () => {
    try {
      const response = await axios.get(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/salespersons/all"
      );
      console.log("Salespersons fetched:", response.data);
      setSalespersons(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching salespersons:", error);
    }
  };

  useEffect(() => {
    fetchSalespersons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://www.celltone.iskconbmv.org:8444/SalesAnalysisSystem-0.0.1-SNAPSHOT/api/v1/expenses/add",
        {
          salespersonId: formData.salespersonId,
          salary: formData.salary,
          incentive: formData.incentive,
          miscellaneous: formData.miscellaneous,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            
          },
        }
      );
  
      console.log("Expenses added:", response.data);
      setFormData({
        salespersonId: 0,
        salary: 0,
        incentive: 0,
        miscellaneous: 0,
      });
      dispatch(
        showNotification({
          message: "Expenses added successfully 😁",
          status: 1,
        })
      );
    } catch (error) {
      console.error("Error adding Expenses:", error);
      dispatch(
        showNotification({
          message: "Error adding Expenses! 😵",
          status: 0,
        })
      );
    }
  };
  


  console.log(formData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert the value to a number using parseFloat or parseInt
    const numericValue = parseFloat(value); // or parseInt(value, 10) for integers
    setFormData({ ...formData, [name]: numericValue });
  };

  return (
    <TitleCard title="Add Expenses" topMargin="mt-2">
      <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
          <div>
                    <label htmlFor="salespersonId" className="label label-text text-base">Select Salesperson Name:</label>
                    <select
                        className="w-full select select-bordered select-primary"
                        id="salespersonId"
                        value={formData.salespersonId}
                        onChange={(e) => setFormData({...formData, salespersonId: parseInt(e.target.value)})}
                        required
                    >
                        <option value="">Select Salesperson Name</option>
                        {salespersons.map((salesperson) => (
                            <option key={salesperson.id} value={salesperson.id}>{salesperson.name}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                    <label htmlFor="salary" className="label label-text text-base">Salary:</label>
                    <input
                        type="number"
                        id="salary"
                        name="salary"
                        placeholder="Enter salary"
                        className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                    />
                    </div>
                    <div>
                    <label htmlFor="incentive" className="label label-text text-base">Incentive:</label>
                    <input
                        type="number"
                        id="incentive"
                        name="incentive"
                        placeholder="Enter incentive"
                        className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={formData.incentive}
                        onChange={handleChange}
                        required
                    />
                    </div>
                    <div>
                    <label htmlFor="miscellaneous" className="label label-text text-base">Miscellaneous:</label>
                    <input
                        type="number"
                        id="miscellaneous"
                        name="miscellaneous"
                        placeholder="Enter miscellaneous"
                        className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={formData.miscellaneous}
                        onChange={handleChange}
                        required
                    />
                    </div>
                    <div>
                    <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                    </div>
          </div>
        </form>
      </div>
    </TitleCard>
  );
};

export default ExpensesForm;
