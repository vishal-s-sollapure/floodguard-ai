import React, { useState } from 'react';
import { Play, RotateCcw, CloudRain, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const FloodSimulationControl = ({ onSimulate }) => {
  const [activePreset, setActivePreset] = useState('NORMAL');

  const presets = [
    {
      id: 'NORMAL',
      label: 'Normal Weather',
      rainfall_mm: 12.0,
      water_level_m: 0.6,
      water_rise_rate: 0.05,
      historical_floods: 2,
      drainage_risk: 'low',
      population: 12000,
      desc: 'Standard dry/moderate precipitation'
    },
    {
      id: 'MONSOON',
      label: 'Heavy Monsoon Rain',
      rainfall_mm: 58.5,
      water_level_m: 1.82,
      water_rise_rate: 0.25,
      historical_floods: 4,
      drainage_risk: 'medium',
      population: 18500,
      desc: 'Sustained monsoon rain across East Zone'
    },
    {
      id: 'CLOUDBURST',
      label: '🚨 Extreme Cloudburst Simulation',
      rainfall_mm: 94.0,
      water_level_m: 2.85,
      water_rise_rate: 0.48,
      historical_floods: 8,
      drainage_risk: 'high',
      population: 32000,
      desc: 'Critical Flash Flood Emergency Threat'
    }
  ];

  const handleApply = (preset) => {
    setActivePreset(preset.id);
    if (onSimulate) {
      onSimulate(preset);
    }
    toast.success(`Simulation Preset Loaded: ${preset.label}`);
  };

  return (
    <div className="bg-[#111827] border border-blue-500/30 p-5 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Live Flood Simulation Mode</h3>
            <p className="text-xs text-slate-400">Simulate real-time weather & sensor escalation for live demos</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
          Interactive Demo
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => handleApply(p)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activePreset === p.id 
                ? p.id === 'CLOUDBURST'
                  ? 'bg-red-950/40 border-red-500 text-white shadow-lg shadow-red-500/20'
                  : 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-[#0b1222] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="font-extrabold text-xs text-white mb-1 flex items-center justify-between">
              <span>{p.label}</span>
              {activePreset === p.id && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">{p.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloodSimulationControl;
