"use client"; 
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/TopHeader";
import SubHeader from "@/components/layout/SubHeader";

import { usePathname } from "next/navigation";
import { privilegeConfig } from "@/constants/navigation";

export default function DashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState("Monitoring");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "User Management") {
      router.push("/add_roles");
    } else if (tab === "Monitoring") {
      router.push("/dashboard");
    }
    else if (tab === "Diagnostics") {
      router.push("/phasor-diagram");
    }
  };

  useEffect(() => {
    const foundTab = Object.keys(privilegeConfig).find(
      (key) => privilegeConfig[key].matchPaths.some((path) => pathname.startsWith(path))
    );
    if (foundTab) {
      setActiveTab(foundTab);
    }
  }, [pathname]);

  // Removed auto-close sidebar on route change to prevent sidebar hiding after refresh

  return (
    <div className="flex flex-col min-h-screen bg-white" suppressHydrationWarning={true}>
      <TopHeader />
      <SubHeader
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        onHamburgerClick={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
      />
      <div className="flex flex-1">
        {/* Sidebar: show on 2xl+ always, on mobile only if sidebarOpen */}
        <div className={"fixed 2xl:static z-[100]" + (sidebarOpen ? " block" : " hidden") + " 2xl:block"}>
          <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
        <main className="flex-1 overflow-auto p-3 pl-1.5">{children}</main>
      </div>
    </div>
  );
}
