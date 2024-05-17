import React, { useState, useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import moment from "moment";

const DistributorPDF = (data) => {
  console.log(data.data[0]);
  const [info, setInfo] = useState(data.data[0]);

  useEffect(() => {
    setInfo(data.data[0]);
  }, [data.data[0]]);

  console.log(info);
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 my-6 rounded-xl shadow-xl">
      <div className="py-4 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-gray-700 my-6 shadow-lg">
        <h1 className="font-bold text-4xl text-center mx-auto">
          Distributor Details Preview
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-6 container mt-5">
        <img
          src={"/logo-3.png"}
          alt="Logo"
          className="w-52 my-auto rounded-3xl"
        />
        <div className="md:w-2/3 w-full">
          <div className="w-full bg-gray-50 dark:bg-gray-900 border rounded-xl shadow-lg my-6">
            <h1 className="text-center py-4 text-xl font-bold dark:text-gray-400 text-gray-700">
              Product Details
            </h1>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border mb-4">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th className="px-6 py-3">Distributor Name : </th>
                    <td className="px-6 py-3">{info.agencyname}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th className="px-6 py-3">Address : </th>
                    <td className="px-6 py-3">{info.address}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th className="px-6 py-3">City/Region/Zone : </th>
                    <td className="px-6 py-3">
                      {info.city}/{info.region}/{info.zone}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th className="px-6 py-3">GSTIN : </th>
                    <td className="px-6 py-3">{info.gstNo}</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th className="px-6 py-3">PAN No : </th>
                    <td className="px-6 py-3">{info.panNo}</td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
      {info.interval === "annually" && (
        <div className="py-4 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-gray-700 my-6 shadow-lg">
          <h1 className="font-bold text-xl text-center mx-auto">
            Annual Distributor's Details Report of {info.year}
          </h1>
        </div>
      )}
      {info.interval === "monthly" && (
        <div className="py-4 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-gray-700 my-6 shadow-lg">
          <h1 className="font-bold text-xl text-center mx-auto">
            Monthly Distributor's Details Report of {info.month}
          </h1>
        </div>
      )}
      {info.interval === "daily" ||
        (info.interval === "weekly" && (
          <div className="py-4 rounded-xl bg-gray-50 dark:bg-gray-900 dark:text-gray-400 text-gray-700 my-6 shadow-lg">
            <h1 className="font-bold text-xl text-center mx-auto">
              Distributor's Details Report from{" "}
              {moment(info.date.startDate).format("DD/MM/YYYY")} to{" "}
              {moment(info.date.endDate).format("DD/MM/YYYY")}
            </h1>
          </div>
        ))}

      <div className="w-full bg-gray-50 dark:bg-gray-900 border rounded-xl shadow-lg my-6">
        <h1 className="text-center py-4 text-xl font-bold dark:text-gray-400 text-gray-700">
          Products Details
        </h1>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border mb-4">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 w-60 border">Date</th>
              <th className="px-6 py-3border">Product Name</th>
              <th className="px-6 py-3 w-60 border">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {info.products.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-3 w-60 border">{item.date.slice(3, 20)}</td>
                <td className="px-6 py-3 border">{item.name}</td>
                <td className="px-6 py-3 w-60 border">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full bg-gray-50 dark:bg-gray-900 border rounded-xl shadow-lg my-6">
        <h1 className="text-center py-4 text-xl font-bold dark:text-gray-400 text-gray-700">
          Categories Details
        </h1>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border mb-4">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 w-60 border">Date</th>
              <th className="px-6 py-3 border">Category Name</th>
              <th className="px-6 py-3 w-60 border">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {info.categories.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-3 w-60 border">{item.date.slice(3, 20)}</td>
                <td className="px-6 py-3 border">{item.name}</td>
                <td className="px-6 py-3 w-60 border">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full bg-gray-50 dark:bg-gray-900 border rounded-xl shadow-lg my-6">
        <h1 className="text-center py-4 text-xl font-bold dark:text-gray-400 text-gray-700">
          Invoices Details
        </h1>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 w-60 border">Date</th>
              <th className="px-6 py-3 border">Invoice No</th>
              <th className="px-6 py-3 w-60 border">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {info.invoices.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-3 border w-60">{item.date.slice(3, 20)}</td>
                <td className="px-6 py-3 border">{item.number}</td>
                <td className="px-6 py-3 border w-60">{item.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr class="font-semibold text-gray-900 dark:text-white">
              <th scope="row" class="px-6 py-3 text-base">
                Total
              </th>
              <td class="px-6 py-3"></td>
              <td class="px-6 py-3">
                INR {info.invoices.reduce((total, i) => total + parseFloat(i.amount), 0)}
              </td>
            </tr>
          </tfoot>
        </table>
        {/* <h1 className="text-end label-text font-bold p-4">Total : {info.invoices.reduce((total, i) => total + i.amount, 0)} INR</h1> */}
      </div>
    </div>
  );
};

export default DistributorPDF;
