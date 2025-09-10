
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function SidebarDropdown({
  item,
  isOpen,
  isCollapse,
  onClick,
  setActiveTab,
  activeTab,
}) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {/* Dropdown Header */}
      <button
        onClick={onClick}
        className={`group flex w-full p-2 rounded-md text-[13.216px] hover:bg-gray-200 transition-all duration-300 cursor-pointer ${
          isCollapse ? "justify-center" : "justify-between"
        } ${activeTab === item.title ? "bg-gray-200 font-semibold" : ""}`}
      >
        {isCollapse ? (
          <item.icon
            className={`w-4 h-4 text-black group-hover:text-[#1A68B2] ${
              activeTab === item.title ? "text-[#1A68B2]" : ""
            }`}
          />
        ) : (
          <span
            className={`flex items-center gap-2 ${
              activeTab === item.title ? "text-[#1A68B2]" : "text-black"
            }`}
          >
            <item.icon
              className={`w-4 h-4 ${
                activeTab === item.title ? "text-[#1A68B2]" : "text-black"
              } group-hover:text-[#1A68B2]`}
            />
            {item.title}
          </span>
        )}
        {!isCollapse && (
          <span className="transition-transform flex items-center">
            {isOpen ? (
              <FontAwesomeIcon icon={faChevronUp} className="w-3 h-3 ml-2 text-black group-hover:text-[#1A68B2]" />
            ) : (
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 ml-2 text-black group-hover:text-[#1A68B2]" />
            )}
          </span>
        )}
      </button>

      {/* Submenu Items */}
      {isOpen && !isCollapse && (
        <div className="ml-4 space-y-1">
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.title}
              href={subItem.href}
              className={`flex items-center gap-2 p-2 rounded-md text-[12px] hover:bg-gray-200 transition-all duration-300 ${
                pathname === subItem.href ? "bg-gray-200 text-[#1A68B2] font-semibold" : "text-black"
              }`}
              onClick={() => setActiveTab(subItem.title)}
            >
              {subItem.icon && (
                <subItem.icon
                  className={`w-4 h-4 ${
                    pathname === subItem.href ? "text-[#1A68B2]" : "text-black"
                  } group-hover:text-[#1A68B2]`}
                />
              )}
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
