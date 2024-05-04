import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification, setPageTitle } from "../../common/headerSlice";
import axios from "axios";
import DatePicker from 'react-tailwindcss-datepicker';
import moment from "moment";
import TitleCard from "../../../components/Cards/TitleCard";
import { BASE_URL } from "../../../Endpoint";

const ExpensesForm = () => {


  


  const dispatch = useDispatch();
  const [salespersons, setSalespersons] = useState([]);
  const [formData, setFormData] = useState(
    {
      salespersonId: null,
      salary: null,
      incentive: null,
      miscellaneous: null,
      date: "",
    }
  );

  useEffect(() => {
    dispatch(setPageTitle({ title : "Expenses Entry Operations"}))
  }, [])

  const fetchSalespersons = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/salespersons/all`
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
        `${BASE_URL}/api/v1/expenses/add`,formData,
        // {
        //   salespersonId: formData.salespersonId,
        //   salary: formData.salary,
        //   incentive: formData.incentive,
        //   miscellaneous: formData.miscellaneous,
        //   expenseDate: formData.expenseDate.startDate,
        // },
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
        date: "",
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

  const handleDateChange = (date) => {
    // const formattedDate = moment(date.startDate).format("DD-MM-YYYY");
    setFormData({ ...formData, date: date.startDate});
  };

  return (
    <TitleCard title="Add Expenses" topMargin="mt-2">
      <div className="w-full p-6 m-auto bg-base-100 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          
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
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    <div>
                    <label htmlFor="salary" className="label label-text text-base">Salary:</label>
                    <input
                        type="number"
                        min="0"
                        className="w-full input input-bordered input-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        id="salary"
                        name="salary"
                        placeholder="Enter salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                    />
                    </div>
                    <div>
                    <label htmlFor="incentive" className="label label-text text-base">Incentive:</label>
                    <input
                        type="number"
                        min="0"
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
                        min="0"
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
                    <label htmlFor="expenseDate" className="label label-text text-base">Expense Date:</label>
                    <DatePicker
              inputClassName="w-full input input-bordered input-primary"
              useRange={false}
              asSingle={true}
              displayFormat={"DD/MM/YYYY"}
              value={{startDate: formData.date, endDate: formData.date}}
              onChange={handleDateChange}
              required
            />
                    </div>
          </div>
                    <div>
                    <button type="submit" className="btn btn-primary ">Submit</button>
                    </div>
        </form>
      </div>
    </TitleCard>
  );
};

export default ExpensesForm;
