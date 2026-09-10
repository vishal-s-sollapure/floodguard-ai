import React from 'react';

const RiskGauge = ({ score = 0, size = 180 }) => {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));
  
  // SVG Semicircle parameters
  const radius = 70;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle arc length
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Determine color based on score
  const getColor = (val) => {
    if (val <= 30) return '#10b981'; // Emerald/Green
    if (val <= 60) return '#f59e0b'; // Amber/Yellow
    if (val <= 80) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getLabel = (val) => {
    if (val <= 30) return 'LOW';
    if (val <= 60) return 'MODERATE';
    if (val <= 80) return 'HIGH';
    return 'CRITICAL';
  };

  const strokeColor = getColor(safeScore);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size * 0.65}
        viewBox="0 0 180 110"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Background Track Arc */}
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Dynamic Colored Progress Arc */}
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Label & Score */}
      <div className="absolute bottom-2 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
          {safeScore.toFixed(0)}<span className="text-lg font-bold text-slate-400">%</span>
        </span>
        <span
          className="text-[11px] font-black tracking-wider uppercase px-2 py-0.5 rounded mt-0.5"
          style={{ color: strokeColor }}
        >
          {getLabel(safeScore)} RISK
        </span>
      </div>
    </div>
  );
};

export default RiskGauge;
