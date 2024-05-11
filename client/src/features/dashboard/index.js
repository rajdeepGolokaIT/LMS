import DashboardStats from './components/DashboardStats'

import UserGroupIcon  from '@heroicons/react/24/outline/UserGroupIcon'
import UsersIcon  from '@heroicons/react/24/outline/UsersIcon'
import CircleStackIcon  from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon  from '@heroicons/react/24/outline/CreditCardIcon'
// import LineChart from './components/LineChart'
import { useDispatch } from 'react-redux'
import { BASE_URL } from "../../Endpoint";
// import {showNotification} from '../common/headerSlice'
import { useState, useEffect } from 'react'
// import axios from 'axios'

import SalesChart from './components/SalesChart'





function Dashboard(){

    

    const dispatch = useDispatch()
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [sales, setSales] = useState([]);
    // const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${BASE_URL}/api/v1/products/count-active`);
            const data = await response.json();
            setProducts(data);
            console.log(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${BASE_URL}/api/v1/categories/count-active`);
            const data2 = await response.json();
            setCategories(data2);
            console.log(data2);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${BASE_URL}/api/v1/distributorProfiles/count`);
            const data3 = await response.json();
            setDistributors(data3);
            console.log(data3);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${BASE_URL}/api/v1/sales/getTotalAmount`);
            const data4 = await response.json();
            setSales(data4);
            console.log(data4);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

    
  


const statsData = [
    {title : "Total Distributors Count", value : `${distributors}`, icon : <UserGroupIcon className='w-8 h-8'/>, description : ""},
    {title : "Total Sales", value : `INR ${parseFloat(sales).toFixed(2)}`, icon : <CreditCardIcon className='w-8 h-8'/>, description : ""},
    {title : "Total Products Count", value : `${products}`, icon : <CircleStackIcon className='w-8 h-8'/>, description : ""},
    {title : "Total Categories Count", value : `${categories}`, icon : <UsersIcon className='w-8 h-8'/>, description : ""},
]
 

   

    return(
        <>
            <div className="grid lg:grid-cols-2 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k}/>
                        )
                    })
                }
            </div>
            <div className="grid mt-2 grid-cols-1 gap-6">
                {/* <LineChart/> */}
                <SalesChart/>
            </div>
        </>
    )
}

export default Dashboard