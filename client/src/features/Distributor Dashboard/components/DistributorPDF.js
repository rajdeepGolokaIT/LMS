import React, { useState, useEffect } from 'react'
import TitleCard from '../../../components/Cards/TitleCard'
import moment from 'moment'

const DistributorPDF = (data) => {
    console.log(data.data[0])
    const [info, setInfo] = useState(data.data[0])

    useEffect(() => {
        setInfo(data.data[0])
    }, [])

    console.log(info)
  return (
    <div className="bg-base-100 p-4 my-6 rounded-xl shadow-xl">
    <div className='flex justify-between gap-6 container mt-5'>
        <img src={"/logo-3.png"} alt="Logo" className="w-52 my-auto rounded-3xl" />
        <div className="w-2/3">
        <TitleCard title="Distributor Details">
        <table className="table table-sm border">
            <thead>
            <tr><th>Distributor Name : </th><td>{info.agencyname}</td></tr>
            <tr><th>Address : </th><td>{info.address}</td></tr>
            <tr><th>City/Region/Zone : </th><td>{info.city}/{info.region}/{info.zone}</td></tr>
            <tr><th>GSTIN : </th><td>{info.gstNo}</td></tr>
            <tr><th>PAN No : </th><td>{info.panNo}</td></tr>
            {/* <tr><th>Contact Person Name : </th><td>{info.contactperson}</td></tr> */}
            {/* <tr><th>Region : </th><td>{info.region}</td></tr>
            <tr><th>Zone : </th><td>{info.zone}</td></tr> */}
            </thead>
        </table>
        </TitleCard>
        </div>
        </div>
        {info.interval === "annually" && (
             <div role="alert" className="alert my-6 shadow-lg">
                <h1 className="font-bold text-lg text-center mx-auto">Annual Distributor's Details Report of {info.year}</h1>
        </div>
        )}
        {info.interval === "monthly" && (
             <div role="alert" className="alert my-6 shadow-lg">
                {/* <h1 className="font-bold text-lg text-center mx-auto">Monthly Distributor's Details Report of {info.month}</h1> */}
        </div>
        )}
        {info.interval === "daily" || info.interval === "weekly" && (
             <div role="alert" className="alert my-6 shadow-lg">

        </div>
        )}
       
        <TitleCard title="Product Details">
        <table className="table table-sm border">
            <thead>
            <tr>
                <th>Date</th>
                <th>Product Name</th>
                <th>Quantity</th>
            </tr>
            </thead>
            <tbody>
            {info.products.map((item, index) => (
                <tr key={index}>
                    <td>{item.date.slice(3, 20)}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </TitleCard>
        <TitleCard title="Category Details">
        <table className="table table-sm border">
            <thead>
            <tr>
                <th>Date</th>
                <th>Category Name</th>
                <th>Quantity</th>
            </tr>
            </thead>
            <tbody>
            {info.categories.map((item, index) => (
                <tr key={index}>
                    <td>{item.date.slice(3, 20)}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                </tr>
            ))}
            </tbody>
        </table>
        
        </TitleCard>
        <TitleCard title="Invoice Details">
        <table className="table table-sm border">
            <thead>
            <tr>
                <th>Date</th>
                <th>Invoice No</th>
                <th>Total Amount</th>
            </tr>
            </thead>
            <tbody>
            {info.invoices.map((item, index) => (
                <tr key={index}>
                    <td>{item.date.slice(3, 20)}</td>
                    <td>{item.number}</td>
                    <td>{item.amount}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <h1 className="text-end label-text font-bold">Total : {info.invoices.reduce((total, i) => total + i.amount, 0)} INR</h1>
        </TitleCard>


    
    </div>
  )
}

export default DistributorPDF