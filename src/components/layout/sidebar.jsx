
"use client";
import React, { useState, useEffect } from "react";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import SidebarMenu from "../sidebarcomponents/SidebarMenu";
import { useRouter, usePathname } from "next/navigation";
import { privilegeConfig, sidebarLinksMap } from "../../constants/navigation";

const Sidebar = ({ activeTab: propActiveTab, isOpen = true, onClose }) => {
  const [isCollapse, setIsCollapse] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = propActiveTab || Object.keys(privilegeConfig).find(
    (key) => privilegeConfig[key].matchPaths.some((path) => pathname.startsWith(path))
  ) || "dashboard"; 

  const currentPrivilege = privilegeConfig[activeTab];

  const sidebarMenus = sidebarLinksMap[activeTab] || [];


  useEffect(() => {
    if (currentPrivilege && pathname === currentPrivilege.href) {
      let firstChild = null;
      for (let menu of sidebarMenus) {
        if (menu.submenu && menu.submenu.length > 0) {
          firstChild = menu.submenu[0].href;
          break;
        } else if (menu.href) {
          firstChild = menu.href;
          break;
        }
      }
      if (firstChild && firstChild !== pathname) {
        router.push(firstChild);
      }
    }
  }, [pathname, currentPrivilege, router, sidebarMenus, activeTab]);

  return (
    <aside
  className={`fixed left-0 top-[110px] h-[calc(100vh-50px)] border-t-3 border-[#1F5897] rounded-lg shadow-2xl bg-white text-black py-3 z-[100] flex flex-col transition-transform duration-300
      ${isCollapse ? "w-[60px]" : "w-[70vw] sm:w-[40vw] md:w-[20vw] 2xl:w-[15vw]"}
      ${isOpen ? "w-48 mx-1.5 my-3 translate-x-0" : "-translate-x-full"}
      2xl:static 2xl:top-auto 2xl:h-auto 2xl:translate-x-0 2xl:mx-3 2xl:my-3 2xl:flex`}
      style={{ minWidth: isCollapse ? 60 : undefined }}
    >
      {/* Top Section */}
      <div
        className={`w-full border-b border-gray-300 flex px-4 ${
          isCollapse ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapse && (
          <div className="flex gap-2 items-center text-[13.216px] justify-start w-full pb-1 font-bold">
            <span>{currentPrivilege?.label}</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapse(!isCollapse)}
          className="cursor-pointer py-1"
        >
          {isCollapse ? <CgMenuLeft size={23} /> : <CgMenuRight size={23} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto w-full">
        <SidebarMenu isCollapse={isCollapse} items={sidebarMenus} />
      </div>
    </aside>
  );
};

export default Sidebar;


