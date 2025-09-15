"use client";

import React, { useEffect, useState } from 'react';

const phasorColors = {
  Va: '#f87171',
  Vb: '#22c55e',
  Vc: '#3b82f6',
  Ia: '#fbbf24',
  Ib: '#a78bfa',
  Ic: '#0ea5e9',
};


const PhasorDiagram = () => {
  const [phasors, setPhasors] = useState([]);
  const [loading, setLoading] = useState(true);
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 30;

  useEffect(() => {
    const fetchPhasors = async () => {
      try {
        const res = await fetch('http://localhost:5000/meter/phase-angles');
        const data = await res.json();
        // Prepare phasor array for table
        const voltagePhasors = Object.entries(data.voltage).map(([key, val]) => ({
          name: key,
          magnitude: parseFloat(val.magnitude),
          angle: parseFloat(val.angle),
          color: phasorColors[key],
          type: 'voltage',
        }));
        const currentPhasors = Object.entries(data.current).map(([key, val]) => ({
          name: key,
          magnitude: parseFloat(val.magnitude),
          angle: parseFloat(val.angle),
          color: phasorColors[key],
          type: 'current',
        }));
        setPhasors([...voltagePhasors, ...currentPhasors]);
      } catch (err) {
        setPhasors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPhasors();
  }, []);

  const getXY = (mag, angle) => {
    const rad = (angle - 0) * Math.PI / 180;
    return {
      x: center + mag * radius * Math.cos(rad),
      y: center - mag * radius * Math.sin(rad),
    };
  };

  // Show all phasors (voltage + current) in SVG
  const allPhasors = phasors;

  return (
    <div className="w-full min-h-[80vh] flex flex-col bg-white border-t-3 border-[#265F95] rounded-lg shadow-xl p-4 sm:p-6 relative">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Phasor Diagram</h2>
        <p className="text-xs sm:text-sm text-gray-600">Voltage and current phasors from API. Only voltage arrows shown in diagram.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 mt-4 sm:mt-6 items-center justify-center w-full">
        {/* SVG Phasor Chart */}
        <div className="relative w-full max-w-[350px] sm:max-w-[400px] md:max-w-[420px] flex-shrink-0 flex-grow-0" style={{ aspectRatio: '1/1' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
            {/* Circle */}
            <circle cx={center} cy={center} r={radius} fill="#f3faff" stroke="#bcd7f6" strokeWidth="2" />
            {/* Horizontal axis */}
            <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#888" strokeWidth="1" />
            {/* Vertical axis */}
            <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#888" strokeWidth="1" />
            {/* 0 label */}
            <text x={center + radius + 5} y={center + 5} fontSize="14" fill="#444">0</text>
            {/* 90 label */}
            <text x={center - 5} y={center - radius - 5} fontSize="14" fill="#444">90</text>

            {/* Arrow marker */}
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#444" />
              </marker>
            </defs>
            {/* All Phasor Arrows (Voltage + Current) */}
            {allPhasors.map((p) => {
              // Use different scaling for voltage and current
              const scale = p.type === 'voltage' ? 220 : 30;
              const { x, y } = getXY(p.magnitude / scale, p.angle);
              return (
                <g key={p.name + p.type}>
                  <line
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke={p.color}
                    strokeWidth="1"
                    markerEnd="url(#arrow)"
                  />
                  <text x={x + 10} y={y - 10} fontSize="12" fill={p.color}>{p.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
        {/* Table */}
        <div className="flex flex-col items-center justify-center w-full max-w-[350px] sm:max-w-[400px] md:max-w-[420px]">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[260px] bg-white border border-black rounded-xl shadow-lg overflow-hidden text-xs sm:text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-2 sm:px-4 py-2 font-semibold text-left text-gray-700">Phasor</th>
                  <th className="px-2 sm:px-4 py-2 font-semibold text-left text-gray-700">Magnitude</th>
                  <th className="px-2 sm:px-4 py-2 font-semibold text-left text-gray-700">Angle</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
                ) : (
                  phasors.map((p, idx) => (
                    <tr
                      key={p.name + p.type}
                      className={`transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
                    >
                      <td className="px-2 sm:px-4 py-2 font-medium text-gray-900 rounded-l-lg">{p.name}</td>
                      <td className="px-2 sm:px-4 py-2 text-gray-700">{p.magnitude}</td>
                      <td className="px-2 sm:px-4 py-2 text-gray-700 rounded-r-lg">{p.angle}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhasorDiagram;
