import React from "react";
import Image from "next/image";
import loader from "./spin.svg";

const Spinner = () => {
  return (
    <div className="w-full bg-gray-100 h-screen flex items-center justify-center">
      <Image src={loader} alt="loading.." />
    </div>
  );
};

export default Spinner;