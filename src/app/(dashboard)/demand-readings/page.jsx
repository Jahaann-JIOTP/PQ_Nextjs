import React from "react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const InstantaneousDemand = () => {
  const loadCurrentData = [
    {
      parameter: "I a (A)",
      lastInterval: "0.000 A",
      peak: "0.000 A",
      timeOfPeak: "July 11 2025,13:00:00",
    },
    {
      parameter: "I b (A)",
      lastInterval: "0.000 A",
      peak: "0.000 A",
      timeOfPeak: "July 11 2025,13:00:00",
    },
    {
      parameter: "I c (A)",
      lastInterval: "0.000 A",
      peak: "0.000 A",
      timeOfPeak: "July 11 2025,13:00:00",
    },
    {
      parameter: "I 4 (A)",
      lastInterval: "0.000 A",
      peak: "0.000 A",
      timeOfPeak: "July 11 2025,13:00:00",
    },
  ];

  const powerData = [
    {
      parameter: "Demand Power Active (kW)",
      lastInterval: "0.000 Kw",
      peak: "0.000 Kw",
      timeOfPeak: "July 11 2025,13:00:00",
    },
    {
      parameter: "Demand Power Reactive (kVAR)",
      lastInterval: "0.000 kVAR",
      peak: "0.000 kVAR",
      timeOfPeak: "July 11 2025,13:00:00",
    },
    {
      parameter: "Demand Power Apparent (kVA)",
      lastInterval: "0.000 kVA",
      peak: "0.000 kVA",
      timeOfPeak: "July 11 2025,13:00:00",
    },
  ];

  const renderSection = (title, data, bgColor = "bg-[#E5F3FDB0]") => (
    <>
      <tr className={`${bgColor} border-b border-gray-200`}>
        <td
          colSpan="4"
          className="px-4 py-2 text-sm text-center font-semibold text-[#025697]"
        >
          {title}
        </td>
      </tr>
      {data.map((row, index) => (
        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="px-4 py-3 text-sm text-gray-700 font-medium">
            {row.parameter}
          </td>
          <td className="px-4 py-3 text-sm text-gray-600">
            {row.lastInterval}
          </td>
          <td className="px-4 py-3 text-sm text-gray-600">{row.peak}</td>
          <td className="px-4 py-3 text-sm text-gray-600">{row.timeOfPeak}</td>
        </tr>
      ))}
    </>
  );

  return (
    <div className={raleway.className}>
      <div className="w-full p-1 sm:p-2 md:p-4 lg:p-6 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar transition-all duration-300">
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
                  {renderSection("DEMAND CURRENT", loadCurrentData)}
                  {renderSection("DEMAND POWER", powerData)}
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
