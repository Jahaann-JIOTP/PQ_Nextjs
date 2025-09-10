"use client";
import React, { useState, useEffect } from "react";
import SidebarDropdown from "./SidebarDropdown";
import { usePathname } from "next/navigation";

export default function SidebarMenu({ isCollapse, items }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(null);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const findActiveItem = (items) => {
      for (const item of items) {
        if (item.href && item.href === pathname) {
          return item.title;
        }
        if (item.submenu) {
          for (const subItem of item.submenu) {
            if (subItem.href === pathname) {
              return subItem.title;
            }
          }
        }
      }
      return null;
    };

    const activeItem = findActiveItem(items);
    setActiveTab(activeItem);

    const initialOpen = {};
    items.forEach((item) => {
      if (item.submenu && item.submenu.some((subItem) => subItem.href === pathname)) {
        initialOpen[item.title] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...initialOpen }));
  }, [pathname, items]);

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="space-y-2 py-2 px-2 w-full">
      {items.map((item, index) =>
        item.submenu ? (
          <SidebarDropdown
            key={index}
            item={item}
            isOpen={openMenus[item.title] || false}
            isCollapse={isCollapse}
            onClick={() => toggleMenu(item.title)}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        ) : (
          <a
            key={item.title}
            href={item.href}
            className={`group flex w-full p-2 rounded-md text-[13.216px] hover:bg-gray-200 transition-all duration-300 ${
              isCollapse
                ? "items-center justify-center"
                : "items-center justify-start"
            } ${activeTab === item.title ? "bg-gray-200 font-semibold" : ""}`}
            onClick={() => setActiveTab(item.title)}
            style={{ fontWeight: 500 }}
          >
            {isCollapse ? (
              <span>
                <item.icon
                  className={`w-4 h-4 text-black group-hover:text-[#1A68B2] transition-all duration-300 ${
                    activeTab === item.title ? "text-[#1A68B2]" : ""
                  }`}
                />
              </span>
            ) : (
              <span
                className={`flex items-center justify-center gap-2 ${
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
          </a>
        )
      )}
    </div>
  );
}