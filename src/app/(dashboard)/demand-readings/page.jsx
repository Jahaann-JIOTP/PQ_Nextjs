"use client"
import React from "react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


import { useEffect, useState } from "react";

function formatTimestamp(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${month} ${day} ${year},${hours}:${minutes}:${seconds}`;
}

const InstantaneousDemand = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meter/demand-readings`);
        if (!res.ok) throw new Error("Server error: Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const loadCurrentRows = data
    ? [
        {
          parameter: "Ia (A)",
          lastInterval: `${data.currentLastInterval["Ia (A)"] ?? "-"} A`,
          peak: `${data.current["Ia (A)"]?.value ?? "-"} A`,
          timeOfPeak: formatTimestamp(data.current["Ia (A)"]?.timestamp),
        },
        {
          parameter: "Ib (A)",
          lastInterval: `${data.currentLastInterval["Ib (A)"] ?? "-"} A`,
          peak: `${data.current["Ib (A)"]?.value ?? "-"} A`,
          timeOfPeak: formatTimestamp(data.current["Ib (A)"]?.timestamp),
        },
        {
          parameter: "Ic (A)",
          lastInterval: `${data.currentLastInterval["Ic (A)"] ?? "-"} A`,
          peak: `${data.current["Ic (A)"]?.value ?? "-"} A`,
          timeOfPeak: formatTimestamp(data.current["Ic (A)"]?.timestamp),
        },
      ]
    : [];

  const powerRows = data
    ? [
        {
          parameter: "Demand Power Active (kW)",
          lastInterval: `${data.powerLastInterval["Demand Power Active (kW)"] ?? "-"} kW`,
          peak: `${data.power["Demand Power Active (kW)"]?.value ?? "-"} kW`,
          timeOfPeak: formatTimestamp(data.power["Demand Power Active (kW)"]?.timestamp),
        },
        {
          parameter: "Demand Power Reactive (kVAR)",
          lastInterval: `${data.powerLastInterval["Demand Power Reactive (kVAR)"] ?? "-"} kVAR`,
          peak: `${data.power["Demand Power Reactive (kVAR)"]?.value ?? "-"} kVAR`,
          timeOfPeak: formatTimestamp(data.power["Demand Power Reactive (kVAR)"]?.timestamp),
        },
        {
          parameter: "Demand Power Apparent (kVA)",
          lastInterval: `${data.powerLastInterval["Demand Power Apparent (kVA)"] ?? "-"} kVA`,
          peak: `${data.power["Demand Apparent (kVA)"]?.value ?? "-"} kVA`,
          timeOfPeak: formatTimestamp(data.power["Demand Apparent (kVA)"]?.timestamp),
        },
      ]
    : [];

  const renderSection = (title, rows, bgColor = "bg-[#E5F3FDB0]") => (
    <>
      <tr className={`${bgColor} border-b border-gray-200`}>
        <td
          colSpan="4"
          className={`px-4 py-2 text-sm text-center font-semibold text-[#025697] bg-[#E5F3FDB0] ${raleway.className}`}
        >
          {title}
        </td>
      </tr>
      {rows.map((row, index) => (
        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="px-4 py-3 text-sm text-gray-700 font-medium"
          style={{ fontFamily: "Arial, sans-serif", width: "40%" }}>
            {row.parameter}
          </td>
          <td className="px-4 py-3 text-sm text-gray-600"
          style={{ fontFamily: "Arial, sans-serif", width: "20%" }}>
            {row.lastInterval}
          </td>
          <td className="px-4 py-3 text-sm text-gray-600"
          style={{ fontFamily: "Arial, sans-serif", width: "20%" }}>{row.peak}</td>
          <td className="px-4 py-3 text-sm text-gray-600"
          style={{ fontFamily: "Arial, sans-serif", width: "20%" }}>{row.timeOfPeak}</td>
        </tr>
      ))}
    </>
  );

  return (
    <div className={raleway.className}>
      <div className="w-full p-1 sm:p-2 md:p-4 lg:p-6 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-134px)] overflow-y-auto custom-scrollbar transition-all duration-300">
        {/* Header Card */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 rounded-md shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Instantaneous Readings -{" "}
            <span className="text-[#025697]">Demand Readings</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Define and manage alarm priority levels, their visual identity, and
            acknowledgment rules.
          </p>
        </div>

        {/* Table Container */}
        <div className="mt-6">
          <div className="overflow-x-auto">
            <div className="rounded-md border border-gray-200 shadow-sm">
              <table className="w-full min-w-[600px] border-collapse">
                {/* Table Headers */}
                <thead className="sticky top-0 bg-[#CAE8FD] z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-300">
                      Parameters
                    </th>
                    <th className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-300">
                      Last Interval
                    </th>
                    <th className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-300">
                      Peak
                    </th>
                    <th className="px-4 py-3 text-left text-sm sm:text-base font-semibold text-gray-700 border-b border-gray-300">
                      Time Of Peak
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  )}
                  {error && (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-red-500">
                        Error: {error}
                      </td>
                    </tr>
                  )}
                  {!loading && !error && (
                    <>
                      {renderSection("DEMAND CURRENT", loadCurrentRows)}
                      {renderSection("DEMAND POWER", powerRows)}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantaneousDemand;
