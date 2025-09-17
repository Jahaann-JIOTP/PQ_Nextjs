// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { HiChevronDown } from "react-icons/hi";

// const TimePeriodSelector = ({ interval, setInterval }) => {
//   const [openDropdown, setOpenDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   const intervalOptions = [
//     { label: "Today", value: "today" },
//     { label: "Yesterday", value: "yesterday" },
//     { label: "This Week", value: "thisweek" },
//     { label: "Last 7 days", value: "last7days" },
//     { label: "This Month", value: "thismonth" },
//     { label: "Last 30 days", value: "last30days" },
//     { label: "This Year", value: "thisyear" },
//     { label: "Custom", value: "custom" },
//   ];

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative flex items-center gap-3" ref={dropdownRef}>
//       <span className="text-md font-medium text-gray-700">Interval</span>
//       <div
//         className="flex items-center gap-12 cursor-pointer border border-gray-300 px-3 py-1 rounded bg-white min-w-[120px] hover:bg-gray-100 transition text-black"
//         onClick={() => setOpenDropdown(!openDropdown)}
//       >
//         {intervalOptions.find((o) => o.value === interval)?.label}
//         <HiChevronDown
//           className={`transition-transform ${openDropdown ? "rotate-180" : ""}`}
//         />
//       </div>

//       {openDropdown && (
//         <div className="absolute top-10 left-16 z-50 w-40 rounded shadow-lg border border-gray-300 bg-white text-black">
//           <div className="py-1">
//             {intervalOptions.map((option) => (
//               <label
//                 key={option.value}
//                 className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
//               >
//                 <input
//                   type="radio"
//                   name="interval"
//                   value={option.value}
//                   checked={interval === option.value}
//                   onChange={() => {
//                     setInterval(option.value);
//                     setOpenDropdown(false);
//                   }}
//                   className="mr-2"
//                 />
//                 {option.label}
//               </label>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimePeriodSelector;


"use client";
import React, { useState, useRef, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";


const TimePeriodSelector = ({ interval, setInterval }) => {
  const [intervalPeriod, setIntervalPeriod] = useState({
    startDate: "",
    endDate: "",
  });
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const intervalOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "thisweek" },
    { label: "Last 7 days", value: "last7days" },
    { label: "This Month", value: "thismonth" },
    { label: "Last 30 days", value: "last30days" },
    { label: "This Year", value: "thisyear" },
    { label: "Custom", value: "custom" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIntervalPeriod((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      {/* Interval dropdown */}
      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        <span className="text-md font-medium text-gray-700">Interval</span>
        <div
          className="flex items-center gap-19 cursor-pointer border border-gray-300 px-3 py-1 rounded bg-white min-w-[120px] hover:bg-gray-100 transition text-black"
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          {intervalOptions.find((o) => o.value === interval)?.label}
          <HiChevronDown
            className={`transition-transform ${openDropdown ? "rotate-180" : ""}`}
          />
        </div>

        {openDropdown && (
          <div className="absolute top-10 left-16 z-50 w-40 rounded shadow-lg border border-gray-300 bg-white text-black">
            <div className="py-1">
              {intervalOptions.map((option) => (
                <label
                  key={option.value}
                  className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name="interval"
                    value={option.value}
                    checked={interval === option.value}
                    onChange={() => {
                      setInterval(option.value);
                      setOpenDropdown(false);
                    }}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start & End date inputs inline with dropdown */}
      {interval === "custom" && (
        <div className="flex items-start md:items-center gap-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor="startDate"
              className="fonte-raleway font-600 text-[13.22px] text-black"
            >
              Start:
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              style={{ width: "9rem" }}
              className="border-1 border-gray-300 rounded px-1 py-[2px] text-gray-600"
              onChange={handleChange}
              value={intervalPeriod.startDate}
            />
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="endDate"
              className="fonte-raleway font-600 text-[13.22px] text-black"
            >
              End:
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              style={{ width: "9rem" }}
              className="border-1 border-gray-300 rounded px-1 py-[2px] text-gray-600"
              min={intervalPeriod.startDate}
              onChange={handleChange}
              value={intervalPeriod.endDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePeriodSelector;
