"use client";
import React from 'react';

const phasors = [
  { name: 'Va', magnitude: 0, angle: 0, color: '#f87171' },
  { name: 'Ia', magnitude: 0, angle: 169.3, color: '#22c55e' },
  { name: 'Ib', magnitude: 0, angle: -98, color: '#3b82f6' },
  { name: 'Vc', magnitude: 0, angle: -0.4, color: '#fbbf24' },
  { name: 'Ic', magnitude: 0, angle: 16.7, color: '#a855f7' },
  { name: 'I4', magnitude: 0, angle: -7.4, color: '#f43f5e' },
];

const PhasorDiagram = () => {
  // Responsive SVG size
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 30;

  const getXY = (mag, angle) => {
    const rad = (angle - 0) * Math.PI / 180;
    return {
      x: center + mag * radius * Math.cos(rad),
      y: center - mag * radius * Math.sin(rad),
    };
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col bg-white border-t-3 border-[#265F95] rounded-lg shadow-xl p-4 sm:p-6 relative">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Phasor Diagram</h2>
        <p className="text-xs sm:text-sm text-gray-600">Define and manage alarm priority levels, their visual identity, and acknowledgement rules.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 mt-4 sm:mt-6 items-center justify-center w-full">
        {/* SVG Phasor Chart */}
        <div className="relative w-full max-w-[350px] sm:max-w-[400px] md:max-w-[420px] flex-shrink-0 flex-grow-0" style={{ aspectRatio: '1/1' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
            {/* Circle */}
            <circle cx={center} cy={center} r={radius} fill="#f3faff" stroke="#bcd7f6" strokeWidth="2" />
            {/* Axes */}
            <line x1={center} y1={center} x2={center} y2={center - radius} stroke="#444" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1={center} y1={center} x2={center + radius} y2={center} stroke="#444" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 90 label */}
            <text x={center - 10} y={center - radius - 10} fontSize="14" fill="#444">90</text>
            {/* 0 label */}
            <text x={center + radius + 5} y={center + 5} fontSize="14" fill="#444">0</text>
            {/* Arrow marker */}
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#444" />
              </marker>
            </defs>
            {/* Phasor Arrows */}
            {phasors.map((p, i) => {
              const { x, y } = getXY(p.magnitude, p.angle);
              return (
                <g key={p.name}>
                  <line
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke={p.color}
                    strokeWidth="3"
                    markerEnd="url(#arrow)"
                  />
                  {/* Label at arrow end */}
                  <text x={x + 5} y={y - 5} fontSize="12" fill={p.color}>{p.name}</text>
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
                {phasors.map((p, idx) => (
                  <tr
                    key={p.name}
                    className={
                      `transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`
                    }
                  >
                    <td className="px-2 sm:px-4 py-2 font-medium text-gray-900 rounded-l-lg">{p.name}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-700">{p.magnitude}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-700 rounded-r-lg">{p.angle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhasorDiagram;
