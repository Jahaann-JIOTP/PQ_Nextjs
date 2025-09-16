"use client";
import React, { useEffect, useState } from "react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const InstantaneousPower = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch function ko separate rakha
  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meter/power-quality`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
    const interval = setInterval(fetchData, 1000); 
    return () => clearInterval(interval); 
  }, []);

  const thdVoltageRows = [
    {
      parameter: "V1 THD (%)",
      minimum:
        data?.minVoltageTHD?.["V1 THD (%)"] !== undefined
          ? `${data.minVoltageTHD["V1 THD (%)"]} %`
          : "-",
      present:
        data?.voltageTHD?.["V1 THD (%)"] !== undefined
          ? `${data.voltageTHD["V1 THD (%)"]} %`
          : "-",
      maximum:
        data?.maxVoltageTHD?.["V1 THD (%)"] !== undefined
          ? `${data.maxVoltageTHD["V1 THD (%)"]} %`
          : "-",
    },
    {
      parameter: "V2 THD (%)",
      minimum:
        data?.minVoltageTHD?.["V2 THD (%)"] !== undefined
          ? `${data.minVoltageTHD["V2 THD (%)"]} %`
          : "-",
      present:
        data?.voltageTHD?.["V2 THD (%)"] !== undefined
          ? `${data.voltageTHD["V2 THD (%)"]} %`
          : "-",
      maximum:
        data?.maxVoltageTHD?.["V2 THD (%)"] !== undefined
          ? `${data.maxVoltageTHD["V2 THD (%)"]} %`
          : "-",
    },
    {
      parameter: "V3 THD (%)",
      minimum:
        data?.minVoltageTHD?.["V3 THD (%)"] !== undefined
          ? `${data.minVoltageTHD["V3 THD (%)"]} %`
          : "-",
      present:
        data?.voltageTHD?.["V3 THD (%)"] !== undefined
          ? `${data.voltageTHD["V3 THD (%)"]} %`
          : "-",
      maximum:
        data?.maxVoltageTHD?.["V3 THD (%)"] !== undefined
          ? `${data.maxVoltageTHD["V3 THD (%)"]} %`
          : "-",
    },
  ];

  const thdCurrentRows = [
    {
      parameter: "I1 THD (%)",
      minimum:
        data?.minCurrentTHD?.["I1 THD (%)"] !== undefined
          ? `${data.minCurrentTHD["I1 THD (%)"]} %`
          : "-",
      present:
        data?.currentTHD?.["I1 THD (%)"] !== undefined
          ? `${data.currentTHD["I1 THD (%)"]} %`
          : "-",
      maximum:
        data?.maxCurrentTHD?.["I1 THD (%)"] !== undefined
          ? `${data.maxCurrentTHD["I1 THD (%)"]} %`
          : "-",
    },
    {
      parameter: "I2 THD (%)",
      minimum:
        data?.minCurrentTHD?.["I2 THD (%)"] !== undefined
          ? `${data.minCurrentTHD["I2 THD (%)"]} %`
          : "-",
      present:
        data?.currentTHD?.["I2 THD (%)"] !== undefined
          ? `${data.currentTHD["I2 THD (%)"]} %`
          : "-",
      maximum:
        data?.maxCurrentTHD?.["I2 THD (%)"] !== undefined
          ? `${data.maxCurrentTHD["I2 THD (%)"]} %`
          : "-",
    },
    {
      parameter: "I3 THD (%)",
      minimum:
        data?.minCurrentTHD?.["I3 THD (%)"] !== undefined
          ? `${data.minCurrentTHD["I3 THD (%)"]} %`
          : "-",
      present:
        data?.currentTHD?.["I3 THD (%)"] !== undefined
          ? `${data.currentTHD["I3 THD (%)"]} %`
          : "-",
      maximum:
        data?.maxCurrentTHD?.["I3 THD (%)"] !== undefined
          ? `${data.maxCurrentTHD["I3 THD (%)"]} %`
          : "-",
    },
    {
      parameter: "I1 K Factor",
      minimum: "-",
      present: data?.kFactor?.["I1 K Factor"] || "-",
      maximum: "-",
    },
    {
      parameter: "I2 K Factor",
      minimum: "-",
      present: data?.kFactor?.["I2 K Factor"] || "-",
      maximum: "-",
    },
    {
      parameter: "I3 K Factor",
      minimum: "-",
      present: data?.kFactor?.["I3 K Factor"] || "-",
      maximum: "-",
    },
    {
      parameter: "I1 Crest Factor",
      minimum: "-",
      present: data?.crestFactor?.["I1 Crest Factor"] || "-",
      maximum: "-",
    },
    {
      parameter: "I2 Crest Factor",
      minimum: "-",
      present: data?.crestFactor?.["I2 Crest Factor"] || "-",
      maximum: "-",
    },
    {
      parameter: "I3 Crest Factor",
      minimum: "-",
      present: data?.crestFactor?.["I3 Crest Factor"] || "-",
      maximum: "-",
    },
  ];

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
        <div className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 bg-gray-50 rounded-md shadow-sm">
          <h2
            className={`text-base xs:text-lg sm:text-xl font-semibold text-gray-800 ${raleway.className}`}
          >
            Instantaneous Readings -{" "}
            <span className="text-[#025697]">Power Quality</span>
          </h2>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-1">
            Define and manage alarm priority levels, their visual identity, and
            acknowledgment rules.
          </p>
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="w-full overflow-x-auto">
            <div className="rounded-md border border-gray-200 shadow-sm min-w-[320px]">
              <table className="w-full min-w-[320px] sm:min-w-[600px] border-collapse text-xs xs:text-sm sm:text-base">
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
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading && !error && (
                    <>
                      {renderSection("THD VOLTAGE", thdVoltageRows, "bg-[#CAE8FD]")}
                      {renderSection("THD CURRENT", thdCurrentRows, "bg-[#CAE8FD]")}
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

export default InstantaneousPower;
