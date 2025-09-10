"use client";
import React, { useLayoutEffect, useRef, useState } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const waveforms = () => {
  const chartRef = useRef(null);
  const [target, setTarget] = useState('Voltage');
  const [interval, setInterval] = useState('Yesterday');
  const [channel, setChannel] = useState('V1');

  // Generate sine wave data for V1, V2, V3
  const points = 100;
  const amplitude = 300;
  const freq = 2 * Math.PI / points;
  const sampleData = Array.from({ length: points }, (_, i) => {
    const x = i;
    return {
      x: x,
      V1: Math.round(amplitude * Math.sin(freq * x)),
      V2: Math.round(amplitude * Math.sin(freq * x + (2 * Math.PI / 3))),
      V3: Math.round(amplitude * Math.sin(freq * x + (4 * Math.PI / 3)))
    };
  });

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

      // X Axis (numeric, not category)
      const xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          min: 0,
          max: points - 1,
          strictMinMax: true
        })
      );

      // Y Axis
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
          min: -300,
          max: 300,
          strictMinMax: true
        })
      );

      // V1 (green)
      const v1Series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "V1 (V)",
          xAxis,
          yAxis,
          valueYField: "V1",
          valueXField: "x",
          stroke: am5.color("#22c55e"),
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
        })
      );
      v1Series.strokes.template.setAll({ strokeWidth: 2 });
      v1Series.data.setAll(sampleData);

      // V2 (red)
      const v2Series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "V2 (V)",
          xAxis,
          yAxis,
          valueYField: "V2",
          valueXField: "x",
          stroke: am5.color("#ef4444"),
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
        })
      );
      v2Series.strokes.template.setAll({ strokeWidth: 2 });
      v2Series.data.setAll(sampleData);

      // V3 (blue)
      const v3Series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "V3 (V)",
          xAxis,
          yAxis,
          valueYField: "V3",
          valueXField: "x",
          stroke: am5.color("#3b82f6"),
          tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
        })
      );
      v3Series.strokes.template.setAll({ strokeWidth: 2 });
      v3Series.data.setAll(sampleData);

      // Add legend
      chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          layout: root.horizontalLayout
        })
      );

      chart.appear(1000, 100);
    }
    return () => {
      if (root) root.dispose();
    };
  }, []);

  return (
  <div className="w-full p-1 sm:p-2 md:p-4 lg:p-6 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar transition-all duration-300">

      {/* Start Time Top Right */}
      <div className="absolute right-8 top-37 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded shadow-sm">
        Start Time: 2020/04/24 , 18:49:20
      </div>

      {/* Header */}
      <div className="mb-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Waveforms</h2>
        </div>
        <p className="text-base text-gray-600 mb-4">
          Define and manage alarm priority levels, their visual identity, and acknowledgement rules.
        </p>
      </div>

      {/* Channel & THD Row */}
      <div className="flex items-center gap-8 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-base font-medium text-gray-700">Record</label>
          <select
            value={channel}
            onChange={e => setChannel(e.target.value)}
            className="border border-gray-300 text-black rounded-md px-2 py-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[60px]"
          >
            <option value="V1">cmt0-00001</option>
            <option value="V2">V2</option>
            <option value="V3">V3</option>
            <option value="I1">I1</option>
            <option value="I2">I2</option>
            <option value="I3">I3</option>
          </select>
        </div>
        
      </div>

      {/* Chart */}
      <div className="relative w-full min-h-[24rem]">
        <div ref={chartRef} className="w-full min-h-[24rem] bg-gray-50 rounded-lg border"></div>
      </div>

      {/* Custom Legend and Info Section */}
      <div className="mt-8 w-full bg-blue-100 rounded-lg py-6 px-4 flex flex-col items-center">
        
      </div>
      <div className="flex flex-wrap justify-center gap-8 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 rounded bg-green-500"></div>
            <span className="text-base text-gray-700 font-medium">V1 (V)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 rounded bg-red-500"></div>
            <span className="text-base text-gray-700 font-medium">V2 (V)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 rounded bg-blue-500"></div>
            <span className="text-base text-gray-700 font-medium">V3 (V)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 rounded bg-green-300"></div>
            <span className="text-base text-gray-700 font-medium">I1 (A)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 rounded bg-red-300"></div>
            <span className="text-base text-gray-700 font-medium">I2 (A)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3 rounded bg-blue-300"></div>
            <span className="text-base text-gray-700 font-medium">I3 (A)</span>
          </div>
        </div>
       
    </div>
  );
};

export default waveforms;
