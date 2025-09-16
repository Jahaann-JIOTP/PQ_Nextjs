"use client";
import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="w-full min-h-[24rem] flex items-center justify-center bg-gray-50 rounded-lg border">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#265F95] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg text-gray-700 font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Loader;
