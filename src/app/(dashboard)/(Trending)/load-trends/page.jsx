"use client";
import React, { useLayoutEffect, useRef, useState } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const TrendingChart = () => {
  const chartRef = useRef(null);
  const [target, setTarget] = useState('Voltage');
  const [interval, setInterval] = useState('Yesterday');

  // Sample data
  const sampleData = [
    { time: "17:30", maximum: 85, minimum: 75, average: 80 },
    { time: "18:00", maximum: 90, minimum: 70, average: 82 },
    { time: "18:30", maximum: 95, minimum: 65, average: 85 },
    { time: "19:00", maximum: 88, minimum: 80, average: 84 },
    { time: "19:30", maximum: 82, minimum: 78, average: 80 },
    { time: "20:00", maximum: 78, minimum: 72, average: 75 },
    { time: "20:30", maximum: 85, minimum: 68, average: 77 },
    { time: "21:00", maximum: 92, minimum: 75, average: 83 },
    { time: "21:30", maximum: 88, minimum: 82, average: 85 },
    { time: "22:00", maximum: 95, minimum: 78, average: 87 },
    { time: "22:30", maximum: 100, minimum: 85, average: 92 },
    { time: "23:00", maximum: 98, minimum: 88, average: 93 },
    { time: "23:30", maximum: 90, minimum: 80, average: 85 },
    { time: "00:00", maximum: 85, minimum: 75, average: 80 },
    { time: "00:30", maximum: 88, minimum: 78, average: 83 },
    { time: "01:00", maximum: 92, minimum: 82, average: 87 },
    { time: "01:30", maximum: 95, minimum: 85, average: 90 },
    { time: "02:00", maximum: 98, minimum: 88, average: 93 },
    { time: "02:30", maximum: 100, minimum: 90, average: 95 },
    { time: "03:00", maximum: 95, minimum: 85, average: 90 },
    { time: "03:30", maximum: 88, minimum: 78, average: 83 },
    { time: "04:00", maximum: 92, minimum: 80, average: 86 }
  ];

  React.useEffect(() => {
    let root;
    if (chartRef.current) {
      root = am5.Root.new(chartRef.current);
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
          paddingLeft: 0,
          paddingRight: 1
        })
      );

      const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      const xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true
      });

      xRenderer.labels.template.setAll({
        rotation: 0,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingRight: 15,
        fontSize: "11px"
      });

      xRenderer.grid.template.setAll({ location: 1 });

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxZoomCount: 30,
          categoryField: "time",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {})
        })
      );
      xAxis.data.setAll(sampleData);

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxZoomCount: 30,
          renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 })
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
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
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
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
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
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
        })
      );
      avgSeries.strokes.template.setAll({ strokeWidth: 2 });
      avgSeries.data.setAll(sampleData);

      chart.appear(1000, 100);
    }
    return () => {
      if (root) root.dispose();
    };
  }, []);

  return (
  <div className="w-full p-1 sm:p-2 md:p-4 lg:p-6 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar transition-all duration-300">
      {/* Header */}
      <div className="mb-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Trending</h2>
        </div>
        <p className="text-base text-gray-600 mb-4">
          Define storage alarm priority levels, their identity, and acknowledgement rules.
        </p>

        {/* Controls */}
        <div className="flex gap-8 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-base font-medium text-gray-700">Target</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="border border-gray-300 text-black rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="Voltage">Voltage</option>
              <option value="Current">Current</option>
              <option value="Power">Power</option>
              <option value="Temperature">Temperature</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-base font-medium text-gray-700">Interval</label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="border border-gray-300 text-black rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full min-h-[20rem]">
        <div ref={chartRef} className="w-full min-h-[20rem] bg-gray-50 rounded-lg border"></div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 mt-6 ml-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-green-500 rounded"></div>
            <span className="text-base text-gray-700 font-medium">Maximum</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-yellow-500 rounded"></div>
            <span className="text-base text-gray-700 font-medium">Minimum</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-blue-500 rounded"></div>
            <span className="text-base text-gray-700 font-medium">Average</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingChart;
