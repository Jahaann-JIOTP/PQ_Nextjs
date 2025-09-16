import {
  faDashboard,
  faGear,
  faProjectDiagram,
  faArrowTrendUp,
  faBell,
  faBookOpen,
  faRotate,
  faBoltLightning,
  faPersonDotsFromLine,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AiOutlineClockCircle } from "react-icons/ai";
import PowerIcon from "../../public/sidebarIcons/PowerIcon";
import ReadingIcon from "../../public/sidebarIcons/ReadingIcon";
import { MdOutlineMonitorHeart, MdOutlineManageSearch } from "react-icons/md";

export const privilegeConfig = {
  Monitoring: {
    href: "/dashboard",
    icon: () => <FontAwesomeIcon icon={faDashboard} size="lg" />,
    label: "Monitoring",
    matchPaths: [
      "/dashboard",
      "/energy-readings",
      "/demand-readings",
      "/voltage-readings",
      "/power-quality",
      "/trending/load",
      "/trending/custom",
      "/power-quality-summary",
      "/waveforms",
    ],
    tab: "Monitoring",
  },
  Diagnostics: {
    href: "/diagnostics",
    icon: () => <FontAwesomeIcon icon={faPersonDotsFromLine} size="lg" />,
    label: "Diagnostics",
    matchPaths: ["/phasor-diagram", "/diagnostics/logs", "/diagnostics/memory", "/diagnostics/cpu"],
    tab: "Diagnostics",
  },
  "User Management": {
    href: "/usermanagement",
    icon: () => <FontAwesomeIcon icon={faUsersGear} size="lg" />,
    label: "User Management",
    matchPaths: ["/add_roles"],
    tab: "User Management",
  },
};

export const privilegeOrder = ["Monitoring", "Diagnostics", "User Management"];

export const sidebarLinksMap = {
  Monitoring: [
    {
      id: 0,
      title: "Instantaneous Readings",
      icon: PowerIcon,
      submenu: [
        { id: 0, title: "Basic Reading", icon: ReadingIcon, href: "/dashboard" },
        { id: 1, title: "Energy Readings", icon: ReadingIcon, href: "/energy-readings" },
        { id: 2, title: "Demand Readings", icon: ReadingIcon, href: "/demand-readings" },
        { id: 3, title: "Voltage Readings", icon: ReadingIcon, href: "/voltage-readings" },
        { id: 4, title: "Power Quality",icon: () => <FontAwesomeIcon icon={faBoltLightning} size="md" />,  href: "/power-quality" },
      ],
    },
    {
      id: 1,
      title: "Trending",
      icon: PowerIcon,
      submenu: [
        { id: 0, title: "Load Trends",icon: ReadingIcon, href: "/load-trends" },
        // { id: 1, title: "Custom Trends", href: "/trending/custom" },
      ],
    },
    {
      id: 2,
      title: "Power Quality Summary",
      icon: PowerIcon,
      href: "/power-quality-summary",
    },
    {
      id: 3,
      title: "Waveforms",
      icon: PowerIcon,
      href: "/waveforms",
    },
  ],

  Diagnostics: [
    {
      id: 0,
      title: "Diagnostics",
      icon: () => <FontAwesomeIcon icon={faPersonDotsFromLine} size="lg" />,
      submenu: [
        { id: 0, title: "Phasor Diagram", icon: PowerIcon, href: "/phasor-diagram" },
      ],
    },
  ],

  "User Management": [
    {
      id: 0,
      title: "User Management",
      icon: () => <FontAwesomeIcon icon={faUsersGear} size="lg" />,
      submenu: [
        { id: 0, title: "User List", icon: AiOutlineClockCircle, href: "/add_roles" },
      ],
    },
  ],
};
