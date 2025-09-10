import React from 'react';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  subsets: ['latin'], 
  weight: ['400','500','600','700'],
});

const InstantaneousEnergy = () => {
  // POWER section data
  const powerData = [
    { parameter: "Active(kW)", present: "1.250 kW" },
    { parameter: "Reactive(kVAR)", present: "0.568 kVAR" },
    { parameter: "Apparent(kVA)", present: "0.169 kVA" }
  ];

  // INPUT METERING CHANNELS section data
  const inputMeteringChannels = [
    { parameter: "Input Metering Channel 1", present: "0" },
    { parameter: "Input Metering Channel 2", present: "0" },
    { parameter: "Input Metering Channel 3", present: "0" },
    { parameter: "Input Metering Channel 4", present: "0" },
    { parameter: "Input Metering Channel 5", present: "0" }
  ];

  // Render section helper for 2 columns
  const renderSection = (title, data, bgColor = "bg-[#CAE8FD]") => (
    <>
      <tr className={`${bgColor} border-b border-gray-200`}>
        <td colSpan="2" className="px-4 py-2 text-sm text-center font-semibold text-[#025697] bg-[#E5F3FDB0]">
          {title}
        </td>
      </tr>
      {data.map((row, index) => (
        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="px-4 py-3 text-sm text-gray-700 font-medium">{row.parameter}</td>
          <td className="px-4 py-3 text-sm text-gray-600">{row.present}</td>
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
