import React from "react";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <div className="searchBox w-full max-w-[500px] mx-auto relative">
      {/* Input */}
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full h-[45px] rounded-full border border-gray-300 bg-white pl-4 pr-12 text-[15px] text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Button */}
      <Button
        className="!absolute top-1/2 right-2 -translate-y-1/2 !w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-blue-500 hover:!bg-blue-600 shadow-md"
      >
        <IoSearch className="text-white text-[20px]" />
      </Button>
    </div>
  );
};

export default Search;
