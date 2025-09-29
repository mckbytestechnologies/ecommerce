import React from "react";
import DashboardBox from "../../Components/DashboardBox";
import { FaPlusSquare } from "react-icons/fa";
import Button from "@mui/material/Button";

const Dashboard = () => {
  return (
    <>
      {/* Top Greeting Section */}
      <div className="w-full p-6 border border-gray-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 bg-white shadow mb-6">
        {/* Text Section */}
        <div className="info text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug text-gray-800">
            Good Morning <br /> MCKBytes
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Here’s what’s happening on your store today.  
            See the statistics at once.
          </p>

          <div className="mt-4">
            <Button
              className="!text-base md:!text-lg !font-semibold !normal-case !bg-blue-600 !text-white hover:!bg-blue-700 flex items-center gap-2 px-5 py-2 rounded-md shadow"
              variant="contained"
            >
              <FaPlusSquare /> Add Button
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex justify-center">
          <img
            src="https://i.pinimg.com/736x/cb/a9/08/cba908556c918cbec1f2dd375b26a2e6.jpg"
            alt="Dashboard Illustration"
            className="w-full max-w-[280px] md:max-w-[380px] lg:max-w-[420px] h-auto rounded-lg object-cover shadow"
          />
        </div>
      </div>

      {/* Dashboard Boxes */}
      <DashboardBox />

      {/* Recent Orders Section */}
      <div className="card my-5 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Recent Orders
          </h2>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm md:text-base text-left text-gray-600">
            <thead className="text-xs md:text-sm text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">Product name</th>
                <th scope="col" className="px-6 py-3">Color</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">Silver</td>
                <td className="px-6 py-4">Laptop</td>
                <td className="px-6 py-4">$2999</td>
                <td className="px-6 py-4 text-right">
                  <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">White</td>
                <td className="px-6 py-4">Laptop PC</td>
                <td className="px-6 py-4">$1999</td>
                <td className="px-6 py-4 text-right">
                  <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Magic Mouse 2
                </th>
                <td className="px-6 py-4">Black</td>
                <td className="px-6 py-4">Accessories</td>
                <td className="px-6 py-4">$99</td>
                <td className="px-6 py-4 text-right">
                  <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Google Pixel Phone
                </th>
                <td className="px-6 py-4">Gray</td>
                <td className="px-6 py-4">Phone</td>
                <td className="px-6 py-4">$799</td>
                <td className="px-6 py-4 text-right">
                  <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Apple Watch 5
                </th>
                <td className="px-6 py-4">Red</td>
                <td className="px-6 py-4">Wearables</td>
                <td className="px-6 py-4">$999</td>
                <td className="px-6 py-4 text-right">
                  <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      
    </>
  );
};

export default Dashboard;
