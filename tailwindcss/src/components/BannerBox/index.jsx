import React from "react";
import { Link } from "react-router-dom";

const Bannerbox = ({ img }) => {
  return (
    <div className=" containers box bannerBox overflow-hidden rounded-xl shadow-md hover:shadow-lg transition">
      <Link to="/" className="group block">
        <img
          src={img}
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500 "
          alt="banner"
        />
      </Link>
    </div>
  );
};

export default Bannerbox;
