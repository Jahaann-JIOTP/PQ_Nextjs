"use client";
import React from "react";
import { Raleway } from "next/font/google";
import Loader from "@/components/Loader"; 

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import { useEffect, useState } from "react";

const InstantaneousReadings = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const res = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/meter/basic-readings`, { cache: "no-store" });
      const data = await res.json();
      setApiData(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const getLoadCurrentRows = (data) => {
    if (!data || !data.current) return [];
    const min = data.current.min || {};
    const max = data.current.max || {};
    const present = data.current.present || {};
    return [
      {
        parameter: "I a (A)",
        minimum: min["I a (A)"] !== undefined ? min["I a (A)"] + "A" : "N/A",
        present:
          present["I a (A)"] !== undefined ? present["I a (A)"] + "A" : "N/A",
        maximum: max["I a (A)"] !== undefined ? max["I a (A)"] + "A" : "N/A",
      },
      {
        parameter: "I b (A)",
        minimum: min["I b (A)"] !== undefined ? min["I b (A)"] + "A" : "N/A",
        present:
          present["I b (A)"] !== undefined ? present["I b (A)"] + "A" : "N/A",
        maximum: max["I b (A)"] !== undefined ? max["I b (A)"] + "A" : "N/A",
      },
      {
        parameter: "I c (A)",
        minimum: min["I c (A)"] !== undefined ? min["I c (A)"] + "A" : "N/A",
        present:
          present["I c (A)"] !== undefined ? present["I c (A)"] + "A" : "N/A",
        maximum: max["I c (A)"] !== undefined ? max["I c (A)"] + "A" : "N/A",
      },
      {
        parameter: "I Average (A)",
        minimum:
          data.current["Min I Average"] !== undefined
            ? data.current["Min I Average"] + "A"
            : "N/A",
        present:
          data.current["I Average (A)"] !== undefined
            ? parseFloat(data.current["I Average (A)"]).toFixed(3) + "A"
            : "N/A",
        maximum:
          data.current["Max I Average"] !== undefined
            ? parseFloat(data.current["Max I Average"]).toFixed(3) + "A"
            : "N/A",
      },
      {
        parameter: "Current Unbalance (%)",
        minimum: "",
        present:
          data.current["Current Unbalance (%)"] !== undefined
            ? (parseFloat(data.current["Current Unbalance (%)"]) * 100).toFixed(
                2
              ) + "%"
            : "N/A",
        maximum: "",
      },
    ];
  };

  const getPowerRows = (data) => {
    if (!data || !data.power) return [];
    const active = data.power["Active (kW)"] || {};
    const reactive = data.power["Reactive (kVAR)"] || {};
    const apparent = data.power["Apparent (kVA)"] || {};
    return [
      {
        parameter: "Active (kW)",
        minimum: active.min !== undefined ? active.min + " kW" : "N/A",
        present: active.present !== undefined ? active.present + " kW" : "N/A",
        maximum: active.max !== undefined ? active.max + " kW" : "N/A",
      },
      {
        parameter: "Reactive (kVAR)",
        minimum: reactive.min !== undefined ? reactive.min + " kVAR" : "N/A",
        present:
          reactive.present !== undefined ? reactive.present + " kVAR" : "N/A",
        maximum: reactive.max !== undefined ? reactive.max + " kVAR" : "N/A",
      },
      {
        parameter: "Apparent (kVA)",
        minimum: apparent.min !== undefined ? apparent.min + " kVA" : "N/A",
        present:
          apparent.present !== undefined ? apparent.present + " kVA" : "N/A",
        maximum: apparent.max !== undefined ? apparent.max + " kVA" : "N/A",
      },
    ];
  };

  const getPowerFactorRows = (data) => {
    let pf =
      data && data["Power Factor Total"] ? data["Power Factor Total"] : "N/A";
    return [
      {
        parameter: "Power Factor Total",
        minimum: "N/A",
        present: pf,
        maximum: "N/A",
      },
    ];
  };

  const getVoltageLLRows = (data) => {
    if (!data || !data.voltageLL || !data.voltageLL.averages) return [];
    const avg = data.voltageLL.averages;
    return [
      {
        parameter: "Voltage L-L Average (V)",
        minimum: avg.min !== undefined ? avg.min + " V" : "N/A",
        present: avg.present !== undefined ? parseFloat(avg.present).toFixed(3) + " V" : "N/A",
        maximum: avg.max !== undefined ? avg.max + " V" : "N/A",
      },
    ];
  };

  const getVoltageLNRows = (data) => {
    if (!data || !data.voltageLN || !data.voltageLN.averages) return [];
    const avg = data.voltageLN.averages;
    return [
      {
        parameter: "Voltage L-N Average (V)",
        minimum: avg.min !== undefined ? avg.min + " V" : "N/A",
        present: avg.present !== undefined ? parseFloat(avg.present).toFixed(2) + " V" : "N/A",
        maximum: avg.max !== undefined ? parseFloat(avg.max).toFixed(3) + " V" : "N/A",
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
      <div
        className={`w-full p-1 sm:p-2 md:p-4 lg:p-6 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-134px)] overflow-y-auto custom-scrollbar transition-all duration-300 ${raleway.className}`}
      >
        {/* Header Card */}
        <div className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 bg-gray-50 rounded-md shadow-sm">
          <h2
            className={`text-base xs:text-lg sm:text-xl font-semibold text-gray-800 ${raleway.className}`}
          >
            Instantaneous Readings -{" "}
            <span className="text-[#025697]">Basic Readings</span>
          </h2>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-1">
            Define and manage alarm priority levels, their visual identity, and
            acknowledgment rules.
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
                    <th
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 border-b border-gray-300 ${raleway.className}`}
                      style={{ width: "40%" }}
                    >
                      Parameters
                    </th>
                    <th
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 border-b border-gray-300 ${raleway.className}`}
                      style={{ width: "20%" }}
                    >
                      Minimum
                    </th>
                    <th
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 border-b border-gray-300 ${raleway.className}`}
                      style={{ width: "20%" }}
                    >
                      Present
                    </th>
                    <th
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700 border-b border-gray-300 ${raleway.className}`}
                      style={{ width: "20%" }}
                    >
                      Maximum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6">
                        <Loader message="Loading Basic Reading Data..." />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {renderSection(
                        "LOAD CURRENT",
                        getLoadCurrentRows(apiData)
                      )}
                      {renderSection("POWER", getPowerRows(apiData))}
                      {renderSection(
                        "POWER FACTOR TOTAL",
                        getPowerFactorRows(apiData)
                      )}
                      {renderSection(
                        "VOLTAGE L-L AVERAGE (V)",
                        getVoltageLLRows(apiData)
                      )}
                      {renderSection(
                        "VOLTAGE L-N AVERAGE (V)",
                        getVoltageLNRows(apiData)
                      )}
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

export default InstantaneousReadings;
