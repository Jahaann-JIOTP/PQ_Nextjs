"use client";
import React from "react";
import { IoLogOut } from "react-icons/io5";

const TopHeader = ({ handleLogout, iscollapese = false }) => {
  return (
    <header className="h-[60px] flex items-center justify-between px-6 bg-white shadow-sm">
      {/* Left Logo */}
      <div className="flex items-center">
        <img src="/assets/jahaannlogo.png" alt="Logo" className="h-6" />
      </div>

      {/* Right Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 cursor-pointer rounded-md"
        style={{ fontWeight: 600 }}
      >
        <IoLogOut size={20} className="text-[#1A68B2]" />
        {!iscollapese && (
          <span className="text-sm text-black">LogOut</span>
        )}
      </button>
    </header>
  );
};

export default TopHeader;
