import React, { useState, useEffect } from 'react';
import { startSimulation, nextSimulationStep, getSimulationStep } from '../api/floodApi';
import { Play, Pause, RotateCcw, FastForward, CloudRain, Waves, ShieldAlert, Sparkles, Activity, AlertOctagon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageSelector';

const DisasterScenarioSimulator = ({ onStepUpdated }) => {
  const { t } = useLanguage();
  const [simState, setSimState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSimState = async () => {
    try {
      const res = await getSimulationStep();
      const data = res.data?.data || res.data || res;
      setSimState(data);
      if (onStepUpdated && data?.calculated_risk) {
        onStepUpdated(data);
      }
    } catch (err) {
      console.error("Simulation step error:", err);
    }
  };

  useEffect(() => {
    fetchSimState();
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(async () => {
        try {
          const res = await nextSimulationStep();
          const data = res.data?.data || res.data || res;
          setSimState(data);
          if (onStepUpdated && data?.calculated_risk) {
            onStepUpdated(data);
          }
          if (data.step_index >= data.total_steps - 1) {
            setIsPlaying(false);
            toast.success("Disaster Scenario Simulation Complete!");
          }
        } catch (err) {
          console.error("Auto play error:", err);
          setIsPlaying(false);
        }
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startSimulation({ scenario: 'MONSOON_CLOUDBURST' });
      const data = res.data?.data || res.data || res;
      setSimState(data);
      if (onStepUpdated && data?.calculated_risk) {
        onStepUpdated(data);
      }
      toast.success("Disaster Scenario Simulation Started!");
    } catch (err) {
      toast.error("Failed to start simulation scenario.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const res = await nextSimulationStep();
      const data = res.data?.data || res.data || res;
      setSimState(data);
      if (onStepUpdated && data?.calculated_risk) {
        onStepUpdated(data);
      }
    } catch (err) {
      toast.error("Failed to advance simulation step.");
    } finally {
      setLoading(false);
    }
  };

  if (!simState) return null;

  const stepInfo = simState.step_info || {};
  const calcRisk = simState.calculated_risk || {};
  const stepIdx = simState.step_index || 0;
  const totalSteps = simState.total_steps || 5;
  const progressPct = Math.round(((stepIdx + 1) / totalSteps) * 100);

  return (
    <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl border-2 border-amber-500/40 shadow-2xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white">🎮 Disaster Scenario Time-Lapse Simulator</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                🎮 Simulation Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Simulate a monsoonal cloudburst developing in real time (00m → 15m → 30m → 45m → 60m).</p>
            <p className="text-[10px] text-amber-500/80 font-semibold mt-1 flex items-center gap-1">
              ⚠️ Synthetic scenario data — not a real weather forecast. For demonstration purposes only.
            </p>
          </div>
        </div>

        {/* Playback Button Group */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" /> Reset Scenario
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Pause Auto Play
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Auto Play (3.5s)
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={loading || isPlaying || stepIdx >= totalSteps - 1}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FastForward className="w-4 h-4" /> Step +15m
          </button>
        </div>
      </div>

      {/* Progress Timeline Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="text-amber-400 font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Step {stepIdx + 1} of {totalSteps}: {stepInfo.label}
          </span>
          <span className="text-slate-400">{progressPct}% Complete</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 transition-all duration-500"
          />
        </div>
      </div>

      {/* Live Simulation Step Dashboard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b1222] p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-cyan-400" /> Simulated Rainfall
          </span>
          <p className="text-2xl font-black text-cyan-400">{stepInfo.rainfall_mm_hr} mm/hr</p>
        </div>

        <div className="bg-[#0b1222] p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-blue-400" /> Water Sensor Level
          </span>
          <p className="text-2xl font-black text-blue-400">{stepInfo.water_level_m} m</p>
        </div>

        <div className="bg-[#0b1222] p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-400" /> Dynamic Risk Score
          </span>
          <p className="text-2xl font-black text-red-400">{calcRisk.risk_score || 0}% ({calcRisk.risk_level})</p>
        </div>

        <div className="bg-[#0b1222] p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-amber-400" /> System Threat State
          </span>
          <p className="text-lg font-black text-amber-400">{stepInfo.status_badge}</p>
        </div>
      </div>

      {/* Auto Alert & Incident Generation Log */}
      <div className="bg-[#0b1222] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
        <span className="font-extrabold text-white uppercase tracking-wider block">Automated System Response Log:</span>
        <div className="space-y-1 font-mono text-slate-300">
          {stepInfo.active_alerts?.map((alert, i) => (
            <p key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {alert}
            </p>
          ))}
          <p className="text-slate-400 pt-1">⚡ Simulated active emergency reports: <strong className="text-white">{stepInfo.simulated_incidents} incidents created</strong></p>
        </div>
      </div>
    </div>
  );
};

export default DisasterScenarioSimulator;
