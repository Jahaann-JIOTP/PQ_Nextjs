"use client";
import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  privilegeConfig,
  privilegeOrder,
  sidebarLinksMap,
} from "../../constants/navigation";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDashboard } from "@fortawesome/free-solid-svg-icons";
import { CgMenuLeft } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";

const SubHeader = ({
  activeTab: propActiveTab,
  handleTabClick: propHandleTabClick,
  onHamburgerClick,
  isSidebarOpen,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Derive activeTab from pathname
  const activeTab =
    propActiveTab ||
    Object.keys(privilegeConfig).find((key) =>
      privilegeConfig[key].matchPaths.some((path) => pathname.startsWith(path))
    ) ||
    "Monitoring";

  const handleTabClick = (tab) => {
    if (propHandleTabClick) {
      propHandleTabClick(tab);
      return;
    }
    const currentPrivilege = privilegeConfig[tab];
    const sidebarMenus = sidebarLinksMap[tab] || [];
    const firstChild =
      sidebarMenus[0]?.submenu?.[0]?.href ||
      sidebarMenus[0]?.href ||
      currentPrivilege.href;
    router.push(firstChild);
  };

  return (
    <div className="h-[50px] flex items-center justify-between px-4 bg-[linear-gradient(to_top,_rgb(24,58,92),_rgb(31,88,151))]">
      <div className="flex items-center space-x-6">
        {/* Hamburger/Cross for mobile */}
        <button
          className="block mr-2 2xl:hidden text-white focus:outline-none"
          onClick={onHamburgerClick}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <IoMdClose size={26} /> : <CgMenuLeft size={26} />}
        </button>
        {privilegeOrder.map((tabKey) => {
          const tab = privilegeConfig[tabKey];
          const Icon = tab.icon;
          return (
            <button
              key={tabKey}
              onClick={() => handleTabClick(tab.tab)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === tab.tab
                  ? "bg-white text-black shadow-sm"
                  : "text-white hover:text-gray-200"
              }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* <IoNotificationsOutline size={25} className="text-white cursor-pointer" /> */}
      <Image
        src="/basil_notification-solid.png"
        alt="Notifications"
        width={25}
        height={25}
        className="cursor-pointer"
      />
    </div>
  );
};

export default SubHeader;