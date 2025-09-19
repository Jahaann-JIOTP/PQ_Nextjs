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
  const [interval, setInterval] = useState("today");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let param = target.charAt(0).toUpperCase() + target.slice(1);
      let url = "";
      if (interval === "custom" && startDate && endDate) {
        // Format dates for API
        const start = `${startDate}T00:00:00`;
        const end = `${endDate}T23:59:59`;
        url = `http://localhost:5000/graph/trend/custom?parameter=${param}&startDate=${start}&endDate=${end}`;
      } else {
        url = `http://localhost:5000/graph/trend/${interval}?parameter=${param}`;
      }
      try {
        const res = await fetch(url);
        const data = await res.json();
        // Transform API data to chart format
        const transformed = data.map((item) => {
          let time = '';
          if (item.interval) {
            const date = new Date(item.interval);
            if (interval === "custom") {
              // Show date for custom interval
              time = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'Asia/Karachi',
              });
            } else if (interval === "today" || interval === "yesterday") {
              // Hourly label
              time = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Karachi',
              });
            } else if (
              interval === "thisweek" || interval === "last7days" || interval === "lastweek"
            ) {
              // Date label
              time = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                timeZone: 'Asia/Karachi',
              });
            } else if (
              interval === "thismonth" || interval === "last30days" || interval === "thisyear"
            ) {
              // Month label
              time = date.toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
                timeZone: 'Asia/Karachi',
              });
            }
          }
          return {
            time,
            maximum: item.max,
            minimum: item.min,
            average: item.avg,
          };
        });
        setChartData(transformed);
      } catch (err) {
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    // Only fetch for custom if both dates selected
    if (interval !== "custom" || (interval === "custom" && startDate && endDate)) {
      fetchData();
    }
  }, [target, interval, startDate, endDate]);

  // Chart rendering effect (initialize only when not loading)
  const chartRoot = useRef(null);
  const xAxisRef = useRef(null);
  const maxSeriesRef = useRef(null);
  const minSeriesRef = useRef(null);
  const avgSeriesRef = useRef(null);

  useEffect(() => {
    if (loading) {
      // Dispose chart if loading starts
      if (chartRoot.current) {
        chartRoot.current.dispose();
        chartRoot.current = null;
      }
      return;
    }
    let root;
    if (chartRef.current) {
      root = am5.Root.new(chartRef.current);
      chartRoot.current = root;
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
      xAxisRef.current = xAxis;

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
      maxSeriesRef.current = maxSeries;

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
      minSeriesRef.current = minSeries;

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
      avgSeriesRef.current = avgSeries;

      chart.appear(1000, 100);
    }
    return () => {
      if (chartRoot.current) chartRoot.current.dispose();
    };
  }, [loading]);

  // Update chart data when chartData changes
  useEffect(() => {
    if (xAxisRef.current && maxSeriesRef.current && minSeriesRef.current && avgSeriesRef.current) {
      xAxisRef.current.data.setAll(chartData);
      maxSeriesRef.current.data.setAll(chartData);
      minSeriesRef.current.data.setAll(chartData);
      avgSeriesRef.current.data.setAll(chartData);
    }
  }, [chartData]);

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
          <TimePeriodSelector
            interval={interval}
            setInterval={setInterval}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      {/* Chart or Loader */}
      <div className="relative w-full min-h-[20rem]">
        {loading ? (
          <div className="flex items-center justify-center w-full min-h-[20rem]">
            {require("@/components/Loader").default ? (
              require("@/components/Loader").default({ message: "Loading..." })
            ) : (
              <div>Loading...</div>
            )}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingChart;