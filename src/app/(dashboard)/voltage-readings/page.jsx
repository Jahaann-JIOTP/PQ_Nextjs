"use client";
import React, { useEffect, useState } from 'react';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  subsets: ['latin'], 
  weight: ['400','500','600','700'],
});


const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/meter/voltage-readings`;

const InstantaneousVoltage = () => {
  const [voltageData, setVoltageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setVoltageData(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
    intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // Helper to format voltage data for table
  const getVoltageLLRows = () => {
    if (!voltageData) return [];
    const { voltageLL } = voltageData;
    return [
      {
        parameter: "Vll ab (V)",
        minimum: voltageLL?.min?.["Vll ab (V)"] + " V",
        present: voltageLL?.present?.["Vll ab (V)"] + " V",
        maximum: voltageLL?.max?.["Vll ab (V)"] + " V",
      },
      {
        parameter: "Vll bc (V)",
        minimum: voltageLL?.min?.["Vll bc (V)"] + " V",
        present: voltageLL?.present?.["Vll bc (V)"] + " V",
        maximum: voltageLL?.max?.["Vll bc (V)"] + " V",
      },
      {
        parameter: "Vll ca (V)",
        minimum: voltageLL?.min?.["Vll ca (V)"] + " V",
        present: voltageLL?.present?.["Vll ca (V)"] + " V",
        maximum: voltageLL?.max?.["Vll ca (V)"] + " V",
      },
      {
        parameter: "V L-L Average (V)",
        minimum: voltageLL?.minVoltageLL + " V",
        present: voltageLL?.["Voltage L-L Average (V)"]?.toFixed(2) + " V",
        maximum: voltageLL?.maxVoltageLL + " V",
      },
    ];
  };

  const getVoltageLNRows = () => {
    if (!voltageData) return [];
    const { voltageLN } = voltageData;
    return [
      {
        parameter: "Vln a (V)",
        minimum: voltageLN?.min?.["Vln a (V)"] + " V",
        present: voltageLN?.present?.["Vln a (V)"] + " V",
        maximum: voltageLN?.max?.["Vln a (V)"] + " V",
      },
      {
        parameter: "Vln b (V)",
        minimum: voltageLN?.min?.["Vln b (V)"] + " V",
        present: voltageLN?.present?.["Vln b (V)"] + " V",
        maximum: voltageLN?.max?.["Vln b (V)"] + " V",
      },
      {
        parameter: "Vln c (V)",
        minimum: voltageLN?.min?.["Vln c (V)"] + " V",
        present: voltageLN?.present?.["Vln c (V)"] + " V",
        maximum: voltageLN?.max?.["Vln c (V)"] + " V",
      },
      {
        parameter: "V L-N Average (V)",
        minimum: voltageLN?.minVoltageLN + " V",
        present: voltageLN?.["Voltage L-N Average (V)"]?.toFixed(2) + " V",
        maximum: voltageLN?.maxVoltageLN?.toFixed(2) + " V",
      },
    ];
  };

  const getUnbalancedRows = () => {
    if (!voltageData) return [];
    return [
      {
        parameter: "Unbalanced %",
        minimum: "0.000 %",
        present: (voltageData["Voltage Unbalance (%)"] || "0.000") + " %",
        maximum: "100.000 %",
      },
    ];
  };

  const renderSection = (title, data, bgColor = "bg-[#E5F3FDB0]") => (
    <>
      <tr className={`${bgColor} border-b border-gray-200`}>
        <td
          colSpan="4"
          className={`px-4 py-2 text-sm text-center font-semibold text-[#025697] bg-[#E5F3FDB0] ${raleway.className}`}
        >
          {title}
        </td>
      </tr>
      {data.map((row, index) => (
        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
          <td
            className="px-4 py-3 text-sm text-gray-700 font-medium"
            style={{ fontFamily: "Arial, sans-serif", width: "40%" }}
          >
            {row.parameter}
          </td>
          <td
            className="px-4 py-3 text-sm text-gray-600"
            style={{ fontFamily: "Arial, sans-serif", width: "20%" }}
          >
            {row.minimum}
          </td>
          <td
            className="px-4 py-3 text-sm text-gray-600"
            style={{ fontFamily: "Arial, sans-serif", width: "20%" }}
          >
            {row.present}
          </td>
          <td
            className="px-4 py-3 text-sm text-gray-600"
            style={{ fontFamily: "Arial, sans-serif", width: "20%" }}
          >
            {row.maximum}
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div>
      <div className={`w-full p-1 sm:p-2 md:p-4 lg:p-6 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar transition-all duration-300 ${raleway.className}`}>
        {/* Header Card */}
        <div className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 bg-gray-50 rounded-md shadow-sm">
          <h2 className={`text-base xs:text-lg sm:text-xl font-semibold text-gray-800 ${raleway.className}`}>
            Instantaneous Readings - <span className="text-[#025697]">Voltage Readings</span>
          </h2>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-1">
            Voltage readings and unbalance percentage for all phases.
          </p>
        </div>

        {/* Table Container */}
        <div className="mt-4 sm:mt-6">
          <div className="w-full overflow-x-auto">
            <div className="rounded-md border border-gray-200 shadow-sm min-w-[320px]">
              <table className="w-full min-w-[320px] sm:min-w-[600px] border-collapse text-xs xs:text-sm sm:text-base">
                {/* Table Headers */}
                <thead className="sticky top-0 bg-[#CAE8FD] z-10">
                  <tr>
                    <th className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 border-b border-gray-300 ${raleway.className}`} style={{ width: "40%" }}>
                      Parameters
                    </th>
                    <th className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 border-b border-gray-300 ${raleway.className}`} style={{ width: "20%" }}>
                      Minimum
                    </th>
                    <th className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 border-b border-gray-300 ${raleway.className}`} style={{ width: "20%" }}>
                      Present
                    </th>
                    <th className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 border-b border-gray-300 ${raleway.className}`} style={{ width: "20%" }}>
                      Maximum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-6 text-black">Loading...</td></tr>
                  ) : (
                    <>
                      {renderSection("VOLTAGE L-L", getVoltageLLRows())}
                      {renderSection("VOLTAGE L-N", getVoltageLNRows())}
                      {renderSection("VOLTAGE UNBALANCED %", getUnbalancedRows())}
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

export default InstantaneousVoltage;
