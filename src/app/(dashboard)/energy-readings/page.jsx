"use client";
import React, { useEffect, useState } from 'react';
import { Raleway } from 'next/font/google';
import loader from '@/components/Loader';

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
});

const InstantaneousEnergy = () => {
  const [powerData, setPowerData] = useState([
    { parameter: "Active (kWh)", present: "-" },
    { parameter: "Reactive (kVARh)", present: "-" },
    { parameter: "Apparent (kVAh)", present: "-" }
  ]);

  const inputMeteringChannels = [
    { parameter: "Input Metering Channel 1", present: "0" },
    { parameter: "Input Metering Channel 2", present: "0" },
    { parameter: "Input Metering Channel 3", present: "0" },
    { parameter: "Input Metering Channel 4", present: "0" },
    { parameter: "Input Metering Channel 5", present: "0" }
  ];

  useEffect(() => {
    const fetchData = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/meter/energy-readings`)
        .then(res => res.json())
        .then(data => {
          setPowerData([
            { parameter: "Active (kWh)", present: data["Active (kWh)"] + " kWh" },
            { parameter: "Reactive (kVARh)", present: data["Reactive (kVARh)"] + " kVARh" },
            { parameter: "Apparent (kVAh)", present: data["Apparent (kVAh)"] + " kVAh" }
          ]);
        })
        .catch(() => {
          setPowerData([
            { parameter: "Active (kWh)", present: "-" },
            { parameter: "Reactive (kVARh)", present: "-" },
            { parameter: "Apparent (kVAh)", present: "-" }
          ]);
        });
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderSection = (title, data, bgColor = "bg-[#CAE8FD]") => (
    <>
      <tr className={`${bgColor} border-b border-gray-200`}>
        <td colSpan="2" className="px-4 py-2 text-sm text-center font-semibold text-[#025697] bg-[#E5F3FDB0]">
          {title}
        </td>
      </tr>
      {data.map((row, index) => (
        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="px-4 py-3 text-sm text-gray-700 font-medium" style={{ fontFamily: "Arial, sans-serif"}}>{row.parameter}</td>
          <td className="px-4 py-3 text-sm text-gray-600" style={{ fontFamily: "Arial, sans-serif"}}>{row.present}</td>
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
            Instantaneous Readings - <span className="text-[#025697]">Energy Readings</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Define and manage alarm priority levels, their visual identity, and acknowledgment rules.
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
                      Present
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {renderSection("POWER", powerData)}
                  {renderSection("INPUT METERING CHANNELS", inputMeteringChannels)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstantaneousEnergy;
