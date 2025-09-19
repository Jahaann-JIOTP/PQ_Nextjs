"use client";
import React, { useRef, useState, useRef as useReactRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import Loader from "@/components/Loader"; 
import { HiChevronDown } from "react-icons/hi";

const Waveforms = () => {
  const chartRef = useRef(null);
  const [channel, setChannel] = useState('cmt0-00001');
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useReactRef(null);
  const [waveformData, setWaveformData] = useState({ voltage: {}, current: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchTime, setFetchTime] = useState(null);

  React.useEffect(() => {
    let intervalId;
    const fetchData = () => {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/meter/waveforms`)
        .then(res => res.json())
        .then(data => {
          setWaveformData(data);
          setLoading(false);
          setFetchTime(new Date());
          if (initialLoading) setInitialLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch data');
          setLoading(false);
        });
    };
    fetchData();
    intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    let root;
    if (chartRef.current && !loading && !error) {
      root = am5.Root.new(chartRef.current);
      root.setThemes([am5themes_Animated.new(root)]);
      root._logo.dispose();

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
          paddingLeft: 0,
          paddingRight: 20,
          layout: root.verticalLayout
        })
      );

      const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      const colorMap = {
        V1: "#22c55e",
        V2: "#ef4444",
        V3: "#3b82f6",
        I1: "#6ee7b7",
        I2: "#fca5a5",
        I3: "#93c5fd"
      };

      let xAxis, yAxis;
      if (channel === 'cmt0-00001') {
        const allChannels = ['V1', 'V2', 'V3', 'I1', 'I2', 'I3'];
        const allData = allChannels.map(ch => {
          const type = ch.startsWith('V') ? 'voltage' : 'current';
          return waveformData[type][ch] || [];
        });

        const points = Math.max(...allData.map(arr => arr.length));
        xAxis = chart.xAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            min: 0,
            max: points > 0 ? points - 1 : 31,
            strictMinMax: true
          })
        );

        const allValues = allData.flat();
        const minY = allValues.length ? Math.min(...allValues) : -300;
        const maxY = allValues.length ? Math.max(...allValues) : 300;

        yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
            min: minY,
            max: maxY,
            strictMinMax: true
          })
        );

        allChannels.forEach(ch => {
          const type = ch.startsWith('V') ? 'voltage' : 'current';
          const dataArr = waveformData[type][ch] || [];
          const chartData = dataArr.map((val, idx) => ({ x: idx, value: val }));
          const series = chart.series.push(
            am5xy.LineSeries.new(root, {
              name: ch + (ch.startsWith('V') ? ' (V)' : ' (A)'),
              xAxis,
              yAxis,
              valueYField: "value",
              valueXField: "x",
              stroke: am5.color(colorMap[ch] || "#000"),
              tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
            })
          );
          series.data.setAll(chartData);

          series.set("sequencedInterpolation", true);
          series.set("sequencedInterpolationDelay", 50);
          series.set("interpolationEasing", am5.ease.out(am5.ease.cubic));

          series.animate({
            key: "strokeWidth",
            from: 2,
            to: 3,
            duration: 1000,
            loops: Infinity,
            easing: am5.ease.inOut(am5.ease.sine)
          });

          series.appear(1000);
        });

        chart.series.values.forEach(series => {
          series.strokes.template.setAll({ strokeWidth: 2 });
        });
      } else {
        const channelType = channel.startsWith('V') ? 'voltage' : 'current';
        const channelData = waveformData[channelType][channel] || [];

        xAxis = chart.xAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            min: 0,
            max: channelData.length > 0 ? channelData.length - 1 : 31,
            strictMinMax: true
          })
        );

        const minY = channelData.length ? Math.min(...channelData) : -300;
        const maxY = channelData.length ? Math.max(...channelData) : 300;

        yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 }),
            min: minY,
            max: maxY,
            strictMinMax: true
          })
        );

        const chartData = channelData.map((val, idx) => ({ x: idx, value: val }));
        const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            name: channel + (channel.startsWith('V') ? ' (V)' : ' (A)'),
            xAxis,
            yAxis,
            valueYField: "value",
            valueXField: "x",
            stroke: am5.color(colorMap[channel] || "#000"),
            tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
          })
        );
        
        series.data.setAll(chartData);

        series.set("sequencedInterpolation", true);
        series.set("sequencedInterpolationDelay", 50);
        series.set("interpolationEasing", am5.ease.out(am5.ease.cubic));

        series.animate({
          key: "strokeWidth",
          from: 2,
          to: 3,
          duration: 1000,
          loops: Infinity,
          easing: am5.ease.inOut(am5.ease.sine)
        });

        series.appear(1000);

        chart.series.values[0].strokes.template.setAll({ strokeWidth: 2 });
      }

      // Add scrollbar
      const scrollbarX = chart.set(
        "scrollbarX",
        am5xy.XYChartScrollbar.new(root, {
          orientation: "horizontal",
          height: 15
        })
      );

      const customizeGrip = (grip) => {
        grip.set("draw", (display) => {
          display.clear(); 
    
          const rect = am5.Rectangle.new(root, {
            width: 6,
            height: 6,
            fill: am5.color("#999"),
            rotation: 45,
            centerX: am5.p50,
            centerY: am5.p50
          });
          grip.children.push(rect);

          const line = am5.Rectangle.new(root, {
            width: 2,
            height: 15,
            fill: am5.color("#999"),
            centerX: am5.p50,
            centerY: am5.p50
          });
          grip.children.push(line);
        });
      };

      customizeGrip(scrollbarX.startGrip);
      customizeGrip(scrollbarX.endGrip);

      const scrollbarChart = scrollbarX.get("scrollbarChart");
      if (scrollbarChart && scrollbarChart.plotContainer) {
        scrollbarChart.plotContainer.get("filters").clear();
      }

      chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          layout: root.horizontalLayout
        })
      );

      chart.appear(1000, 100);

      chart.events.on("datavalidated", () => {
        chart.series.each(series => {
          series.animate({
            key: "opacity",
            from: 0,
            to: 1,
            duration: 800,
            easing: am5.ease.out(am5.ease.cubic)
          });
        });
      });
    }
    return () => {
      if (root) root.dispose();
    };
  }, [channel, waveformData, loading, error]);

  return (
    <div className="w-full p-1 sm:p-2 md:p-4 lg:p-6 border-t-3 border-[#265F95] rounded-lg shadow-lg h-[calc(100vh-134px)] overflow-y-auto custom-scrollbar transition-all duration-300">
      {/* Start Time Top Right */}
      <div className="absolute right-8 top-37 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded shadow-sm">
        Start Time: {fetchTime ? fetchTime.toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--'}
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

      {/* Channel Selector - Custom Dropdown */}
      <div className="flex items-center gap-8 mb-4" ref={dropdownRef}>
        <div className="relative flex items-center gap-3 w-full sm:w-auto">
          <span className="text-base font-medium text-gray-700">Channel</span>
          <div
            className="flex items-center justify-between gap-6 cursor-pointer border border-gray-300 px-3 py-1 rounded bg-white w-full max-w-[160px] sm:w-[160px] hover:bg-gray-100 transition text-black"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            {channel}
            <HiChevronDown className={`transition-transform ${openDropdown ? "rotate-180" : ""}`} />
          </div>
          {openDropdown && (
            <div className="absolute top-full mt-2 left-18 z-50 w-full sm:w-40 max-w-40 rounded shadow-lg border border-gray-300 bg-white text-black">
              <div className="py-1">
                {["cmt0-00001", "V1", "V2", "V3", "I1", "I2", "I3"].map((option) => (
                  <label
                    key={option}
                    className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="radio"
                      name="channel"
                      value={option}
                      checked={channel === option}
                      onChange={() => {
                        setChannel(option);
                        setOpenDropdown(false);
                      }}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full min-h-[24rem]">
        {initialLoading ? (
          <Loader message="Loading Waveform Data..." />
        ) : error ? (
          <div className="w-full min-h-[24rem] flex items-center justify-center text-lg text-red-500">
            {error}
          </div>
        ) : (
          <div ref={chartRef} className="w-full min-h-[24rem] bg-gray-50 rounded-lg border"></div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-8 mb-2 mt-8">
        {[
          { key: 'V1', label: 'V1 (V)', color: 'bg-green-500', light: 'bg-green-200' },
          { key: 'V2', label: 'V2 (V)', color: 'bg-red-500', light: 'bg-red-200' },
          { key: 'V3', label: 'V3 (V)', color: 'bg-blue-500', light: 'bg-blue-200' },
          { key: 'I1', label: 'I1 (A)', color: 'bg-green-500', light: 'bg-green-200' },
          { key: 'I2', label: 'I2 (A)', color: 'bg-red-500', light: 'bg-red-200' },
          { key: 'I3', label: 'I3 (A)', color: 'bg-blue-500', light: 'bg-blue-200' }
        ].map(({ key, label, color, light }) => (
          <div className="flex items-center gap-2" key={key}>
            <div
              className={`w-6 h-3 rounded ${
                channel === 'cmt0-00001' || channel === key ? color : light
              }`}
              style={{ opacity: channel === 'cmt0-00001' || channel === key ? 1 : 0.5 }}
            ></div>
            <span
              className={`text-base font-medium ${
                channel === 'cmt0-00001' || channel === key ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Waveforms;