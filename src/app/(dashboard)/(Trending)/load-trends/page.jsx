"use client";
import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { HiChevronDown } from "react-icons/hi";
import TimePeriodSelector from "@/components/timePeriodSelector/TimePeriodSelector";

const TrendingChart = () => {
  const chartRef = useRef(null);
  const [target, setTarget] = useState("voltage");
  const [interval, setInterval] = useState("yesterday");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const targetOptions = [
    { label: "Voltage", value: "voltage" },
    { label: "Current", value: "current" },
    { label: "Power", value: "power" },
  ];
  
const sampleData = [
  { time: "00:00", maximum: 85, minimum: 75, average: 80 },
  { time: "01:00", maximum: 92, minimum: 82, average: 87 },
  { time: "02:00", maximum: 98, minimum: 88, average: 93 },
  { time: "03:00", maximum: 95, minimum: 85, average: 90 },
  { time: "04:00", maximum: 92, minimum: 80, average: 86 },
  { time: "05:00", maximum: 88, minimum: 78, average: 83 },
  { time: "06:00", maximum: 85, minimum: 72, average: 78 },
  { time: "07:00", maximum: 82, minimum: 70, average: 76 },
  { time: "08:00", maximum: 85, minimum: 68, average: 77 },
  { time: "09:00", maximum: 90, minimum: 75, average: 82 },
  { time: "10:00", maximum: 95, minimum: 78, average: 87 },
  { time: "11:00", maximum: 98, minimum: 85, average: 92 },
  { time: "12:00", maximum: 100, minimum: 88, average: 94 },
  { time: "13:00", maximum: 98, minimum: 85, average: 91 },
  { time: "14:00", maximum: 95, minimum: 82, average: 88 },
  { time: "15:00", maximum: 92, minimum: 80, average: 86 },
  { time: "16:00", maximum: 90, minimum: 78, average: 84 },
  { time: "17:00", maximum: 88, minimum: 75, average: 82 },
  { time: "18:00", maximum: 90, minimum: 70, average: 82 },
  { time: "19:00", maximum: 88, minimum: 80, average: 84 },
  { time: "20:00", maximum: 78, minimum: 72, average: 75 },
  { time: "21:00", maximum: 92, minimum: 75, average: 83 },
  { time: "22:00", maximum: 95, minimum: 78, average: 87 },
  { time: "23:00", maximum: 98, minimum: 88, average: 93 },
];


  useEffect(() => {
    let root;

    if (chartRef.current) {
      root = am5.Root.new(chartRef.current);
      root.setThemes([am5themes_Animated.new(root)]);
      root._logo?.dispose();

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
          paddingLeft: 0,
          paddingRight: 1,
        })
      );

      const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      const xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true,
      });

      xRenderer.labels.template.setAll({
        rotation: 0,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingRight: 15,
        fontSize: "11px",
      });

      xRenderer.grid.template.setAll({ location: 1 });

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxZoomCount: 30,
          categoryField: "time",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {}),
        })
      );
      xAxis.data.setAll(sampleData);

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxZoomCount: 30,
          renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
        })
      );

      const maxSeries = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Maximum",
          xAxis,
          yAxis,
          valueYField: "maximum",
          categoryXField: "time",
          stroke: am5.color("#10B981"),
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" }),
        })
      );
      maxSeries.strokes.template.setAll({ strokeWidth: 2 });
      maxSeries.data.setAll(sampleData);

      const minSeries = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Minimum",
          xAxis,
          yAxis,
          valueYField: "minimum",
          categoryXField: "time",
          stroke: am5.color("#F59E0B"),
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" }),
        })
      );
      minSeries.strokes.template.setAll({ strokeWidth: 2 });
      minSeries.data.setAll(sampleData);

      const avgSeries = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Average",
          xAxis,
          yAxis,
          valueYField: "average",
          categoryXField: "time",
          stroke: am5.color("#3B82F6"),
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" }),
        })
      );
      avgSeries.strokes.template.setAll({ strokeWidth: 2 });
      avgSeries.data.setAll(sampleData);

      chart.appear(1000, 100);
    }
    return () => {
      if (root) root.dispose();
    };
  }, [interval, target]);

  return (
    <div className="w-full p-5 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-134px)] overflow-y-auto custom-scrollbar bg-white">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Trending</h2>
        <p className="text-base text-gray-600 mb-4">
          Define storage alarm priority levels, their identity, and acknowledgement rules.
        </p>

        {/* Controls */}
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8"
          ref={dropdownRef}
        >
          {/* Target Dropdown */}
          <div className="relative flex items-center gap-3 w-full sm:w-auto">
            <span className="text-md font-medium text-gray-700">Target</span>
            <div
              className="flex items-center justify-between gap-6 cursor-pointer border border-gray-300 px-3 py-1 rounded bg-white w-full max-w-[160px] sm:w-[160px] hover:bg-gray-100 transition text-black"
              onClick={() =>
                setOpenDropdown(openDropdown === "target" ? null : "target")
              }
            >
              {targetOptions.find((o) => o.value === target)?.label}
              <HiChevronDown
                className={`transition-transform ${
                  openDropdown === "target" ? "rotate-180" : ""
                }`}
              />
            </div>

            {openDropdown === "target" && (
              <div className="absolute top-full mt-2 left-14 z-50 w-full sm:w-40 max-w-40 rounded shadow-lg border border-gray-300 bg-white text-black">
                <div className="py-1">
                  {targetOptions.map((option) => (
                    <label
                      key={option.value}
                      className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="radio"
                        name="target"
                        value={option.value}
                        checked={target === option.value}
                        onChange={() => {
                          setTarget(option.value);
                          setOpenDropdown(null);
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

          {/* Time Period Selector */}
          <TimePeriodSelector interval={interval} setInterval={setInterval} />
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full min-h-[20rem]">
        <div
          ref={chartRef}
          className="w-full min-h-[20rem] bg-gray-50 rounded-lg border"
        ></div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm sm:text-base text-gray-700 font-medium">
              Maximum
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm sm:text-base text-gray-700 font-medium">
              Minimum
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm sm:text-base text-gray-700 font-medium">
              Average
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingChart;



// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import { HiChevronDown } from "react-icons/hi";
// import TimePeriodSelector from "@/components/timePeriodSelector/TimePeriodSelector";

// const TrendingChart = () => {
//   const chartRef = useRef(null);
//   const [target, setTarget] = useState("voltage");
//   const [interval, setInterval] = useState("today");
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [chartData, setChartData] = useState([]);
//   const dropdownRef = useRef(null);

//   // close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Fetch data from API whenever interval or target changes
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/pq-meter/trend/?interval=${interval}`
//         );
//         const data = await res.json();

//         // Transform API data based on selected target
//         const transformed = data.map((item) => {
//           const date = new Date(item._id);
//           const timeLabel = date.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           });

//           return {
//             time: timeLabel,
//             maximum:
//               target === "voltage"
//                 ? item.maxVoltage
//                 : target === "current"
//                 ? item.maxCurrent
//                 : item.maxPower,
//             minimum:
//               target === "voltage"
//                 ? item.minVoltage
//                 : target === "current"
//                 ? item.minCurrent
//                 : item.minPower,
//             average:
//               target === "voltage"
//                 ? item.avgVoltage
//                 : target === "current"
//                 ? item.avgCurrent
//                 : item.avgPower,
//           };
//         });

//         setChartData(transformed);
//       } catch (error) {
//         console.error("Error fetching trend data:", error);
//       }
//     };

//     fetchData();
//   }, [interval, target]);

//   // Render chart whenever chartData updates
//   useEffect(() => {
//     let root;
//     if (chartRef.current && chartData.length > 0) {
//       root = am5.Root.new(chartRef.current);
//       root.setThemes([am5themes_Animated.new(root)]);
//       root._logo?.dispose();

//       const chart = root.container.children.push(
//         am5xy.XYChart.new(root, {
//           panX: true,
//           panY: true,
//           wheelX: "panX",
//           wheelY: "zoomX",
//           pinchZoomX: true,
//           paddingLeft: 0,
//           paddingRight: 1,
//         })
//       );

//       const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
//       cursor.lineY.set("visible", false);

//       const xRenderer = am5xy.AxisRendererX.new(root, {
//         minGridDistance: 30,
//         minorGridEnabled: true,
//       });

//       xRenderer.labels.template.setAll({
//         rotation: 0,
//         centerY: am5.p50,
//         centerX: am5.p50,
//         paddingRight: 15,
//         fontSize: "11px",
//       });

//       const xAxis = chart.xAxes.push(
//         am5xy.CategoryAxis.new(root, {
//           maxZoomCount: 30,
//           categoryField: "time",
//           renderer: xRenderer,
//           tooltip: am5.Tooltip.new(root, {}),
//         })
//       );
//       xAxis.data.setAll(chartData);

//       const yAxis = chart.yAxes.push(
//         am5xy.ValueAxis.new(root, {
//           maxZoomCount: 30,
//           renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
//         })
//       );

//       const addSeries = (name, valueYField, color) => {
//         const series = chart.series.push(
//           am5xy.LineSeries.new(root, {
//             name,
//             xAxis,
//             yAxis,
//             valueYField,
//             categoryXField: "time",
//             stroke: am5.color(color),
//             tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" }),
//           })
//         );
//         series.strokes.template.setAll({ strokeWidth: 2 });
//         series.data.setAll(chartData);
//         return series;
//       };

//       addSeries("Maximum", "maximum", "#10B981");
//       addSeries("Minimum", "minimum", "#F59E0B");
//       addSeries("Average", "average", "#3B82F6");

//       chart.appear(1000, 100);
//     }

//     return () => {
//       if (root) root.dispose();
//     };
//   }, [chartData]);

//   const targetOptions = [
//     { label: "Voltage", value: "voltage" },
//     { label: "Current", value: "current" },
//     { label: "Power", value: "power" },
//   ];

//   return (
//     <div className="w-full p-5 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar bg-white">
//       {/* Header */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Trending</h2>
//         <p className="text-base text-gray-600 mb-4">
//           Define storage alarm priority levels, their identity, and acknowledgement rules.
//         </p>

//         {/* Controls */}
//         <div
//           className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8"
//           ref={dropdownRef}
//         >
//           {/* Target Dropdown */}
//           <div className="relative flex items-center gap-3 w-full sm:w-auto">
//             <span className="text-md font-medium text-gray-700">Target</span>
//             <div
//               className="flex items-center justify-between gap-6 cursor-pointer border border-gray-300 px-3 py-1 rounded bg-white w-full max-w-[160px] sm:w-[160px] hover:bg-gray-100 transition text-black"
//               onClick={() =>
//                 setOpenDropdown(openDropdown === "target" ? null : "target")
//               }
//             >
//               {targetOptions.find((o) => o.value === target)?.label}
//               <HiChevronDown
//                 className={`transition-transform ${
//                   openDropdown === "target" ? "rotate-180" : ""
//                 }`}
//               />
//             </div>

//             {openDropdown === "target" && (
//               <div className="absolute top-full mt-2 left-14 z-50 w-full sm:w-40 max-w-40 rounded shadow-lg border border-gray-300 bg-white text-black">
//                 <div className="py-1">
//                   {targetOptions.map((option) => (
//                     <label
//                       key={option.value}
//                       className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     >
//                       <input
//                         type="radio"
//                         name="target"
//                         value={option.value}
//                         checked={target === option.value}
//                         onChange={() => {
//                           setTarget(option.value);
//                           setOpenDropdown(null);
//                         }}
//                         className="mr-2"
//                       />
//                       {option.label}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Time Period Selector */}
//           <TimePeriodSelector interval={interval} setInterval={setInterval} />
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="relative w-full min-h-[20rem]">
//         <div
//           ref={chartRef}
//           className="w-full min-h-[20rem] bg-gray-50 rounded-lg border"
//         ></div>

//         {/* Legend */}
//         <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 px-2">
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-green-500 rounded"></div>
//             <span className="text-sm sm:text-base text-gray-700 font-medium">
//               Maximum
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-yellow-500 rounded"></div>
//             <span className="text-sm sm:text-base text-gray-700 font-medium">
//               Minimum
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-blue-500 rounded"></div>
//             <span className="text-sm sm:text-base text-gray-700 font-medium">
//               Average
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrendingChart;
