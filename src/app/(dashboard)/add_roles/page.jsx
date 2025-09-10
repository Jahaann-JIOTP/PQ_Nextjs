"use client";

import { useState } from "react";
import ViewUsers from "@/components/userManagementComponents/viewUsers/ViewUsers";
import AddUser from "@/components/userManagementComponents/addUser/AddUser";
import Roles from "@/components/userManagementComponents/manageRoles/ManageRoles";
import { Raleway } from "next/font/google";


const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
});

const UserMangementPage = () => {
  const [activeTab, setActiveTab] = useState("roles");

  return (
    <div className="bg-white p-6 rounded-md shadow-lg border-t-[3px] border-t-[#1d5998] md:h-[81vh] overflow-auto">
      <div
        className={`${raleway.className} text-[#4F5562] text-[22.34px] font-semibold leading-[125%] mb-5`}
      >
        User Configuration
      </div>

      {/* Tabs */}
      <div className="flex mb-5 gap-16 border-b-2 border-[rgba(0,0,0,0.14)] mt-[40px] pb-2">
        <button
          onClick={() => setActiveTab("roles")}
          className={`${raleway.className} relative text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "roles" ? "text-[#1A68B2]" : "text-black"
          }`}
        >
          Roles
          {activeTab === "roles" && (
            <div className="w-[43px] h-[2px] bg-[#1A68B2] left-0 bottom-[-10px] absolute"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab("add")}
          className={`${raleway.className} relative text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "add" ? "text-[#1A68B2]" : "text-black"
          }`}
        >
          Add Users
          {activeTab === "add" && (
            <div className="w-[80px] h-[2px] bg-[#1A68B2] left-0 bottom-[-10px] absolute"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab("view")}
          className={`${raleway.className} relative text-[16.439px] font-semibold leading-normal cursor-pointer ${
            activeTab === "view" ? "text-[#1A68B2]" : "text-black"
          }`}
        >
          View Users
          {activeTab === "view" && (
            <div className="w-[90px] h-[2px] bg-[#1A68B2] left-0 bottom-[-10px] absolute"></div>
          )}
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === "roles" && <Roles />}
      {activeTab === "add" && <AddUser />}
      {activeTab === "view" && <ViewUsers />}
    </div>
  );
};

export default UserMangementPage;
