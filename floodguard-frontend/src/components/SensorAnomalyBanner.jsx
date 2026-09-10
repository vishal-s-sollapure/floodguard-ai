import React, { useState, useEffect } from 'react';
import { evaluateAnomalies } from '../api/floodApi';
import { AlertTriangle, X, RefreshCw, Wifi, WifiOff, Database } from 'lucide-react';

/**
 * SensorAnomalyBanner
 * Continuously monitors incoming telemetry for sensor anomalies.
 * Props:
 *   telemetry: { rainfall_mm, water_level_m, water_rise_rate }
 *   apiError: { type: 'weather' | 'gemini' | 'database' | null, message: string }
 */
const SensorAnomalyBanner = ({ telemetry = null, apiError = null }) => {
  const [anomalyReport, setAnomalyReport] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(false);

  const runAnomalyCheck = async (data) => {
    if (!data) return;
    setChecking(true);
    try {
      const res = await evaluateAnomalies(data);
      const report = res.data || res;
      if (report.has_anomaly) {
        setAnomalyReport(report);
        setDismissed(false);
      } else {
        setAnomalyReport(null);
      }
    } catch {
      // Graceful fallback: run client-side bounds check
      const clientCheck = clientSideBoundsCheck(data);
      if (clientCheck.has_anomaly) {
        setAnomalyReport(clientCheck);
        setDismissed(false);
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (telemetry) {
      runAnomalyCheck(telemetry);
    }
  }, [telemetry?.water_level_m, telemetry?.rainfall_mm]);

  // API Error Banner
  if (apiError && apiError.type && !dismissed) {
    const errorConfig = {
      weather: { icon: WifiOff, color: 'amber', label: 'Live Weather Service Unavailable', hint: 'Showing last validated data. Risk calculations use cached telemetry.' },
      gemini: { icon: AlertTriangle, color: 'purple', label: 'Gemini AI Service Offline', hint: 'AI Vision analysis paused. Incident categorization uses rule-based fallback.' },
      database: { icon: Database, color: 'red', label: 'Database Connection Interrupted', hint: 'Operating in read-only mode from in-memory cache. New reports will queue locally.' },
    };
    const cfg = errorConfig[apiError.type] || { icon: AlertTriangle, color: 'amber', label: 'Service Temporarily Unavailable', hint: apiError.message };
    const IconEl = cfg.icon;

    return (
      <div className={`flex items-start gap-3 p-3.5 rounded-xl bg-${cfg.color}-950/30 border border-${cfg.color}-500/40 text-${cfg.color}-200`}>
        <IconEl className={`w-4 h-4 text-${cfg.color}-400 mt-0.5 shrink-0`} />
        <div className="flex-1 min-w-0 text-xs space-y-0.5">
          <p className="font-extrabold">⚠️ {cfg.label}</p>
          <p className="text-slate-400">{cfg.hint}</p>
        </div>
        <button onClick={() => setDismissed(true)} className={`text-${cfg.color}-400/50 hover:text-${cfg.color}-300 transition shrink-0`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Sensor Anomaly Banner
  if (!anomalyReport || !anomalyReport.has_anomaly || dismissed) return null;

  return (
    <div className="space-y-2 animate-pulse-once">
      {anomalyReport.anomalies?.map((anomaly, idx) => (
        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/50 text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-extrabold text-amber-300">⚠️ Sensor Anomaly Detected — {anomaly.sensor}</p>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {anomaly.flag}
              </span>
            </div>
            <p className="text-slate-300">{anomaly.message}</p>
            <div className="flex items-center gap-4 text-slate-400 text-[10px] pt-0.5">
              <span>Received: <strong className="text-red-300">{anomaly.value}</strong></span>
              <span>Threshold: <strong className="text-emerald-300">{anomaly.threshold}</strong></span>
              <span className="text-emerald-400 font-semibold">✓ Outlier excluded from Risk Engine calculation</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <button
              onClick={() => runAnomalyCheck(telemetry)}
              disabled={checking}
              className="p-1 text-amber-400/60 hover:text-amber-300 transition"
              title="Re-validate sensor"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setDismissed(true)} className="p-1 text-amber-400/40 hover:text-amber-300 transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Client-side bounds check as graceful fallback
function clientSideBoundsCheck(telemetry) {
  const anomalies = [];
  if (telemetry.water_level_m > 8.0 || telemetry.water_level_m < 0) {
    anomalies.push({
      sensor: 'Ultrasonic Hydro-Sensor #BLR-402',
      parameter: 'Water Level',
      flag: 'OUT_OF_BOUNDS',
      value: `${telemetry.water_level_m}m`,
      threshold: '0.0m – 8.0m',
      message: `⚠️ Water level reading (${telemetry.water_level_m}m) outside physical channel limits. Data excluded from risk calculation.`
    });
  }
  if (telemetry.rainfall_mm > 250) {
    anomalies.push({
      sensor: 'OpenWeatherMap Stream',
      parameter: 'Precipitation',
      flag: 'RAINFALL_SPIKE',
      value: `${telemetry.rainfall_mm} mm/hr`,
      threshold: '250 mm/hr max',
      message: `⚠️ Precipitation reading (${telemetry.rainfall_mm} mm/hr) flagged as potential data stream noise.`
    });
  }
  return {
    has_anomaly: anomalies.length > 0,
    anomalies,
    system_action: anomalies.length > 0 ? 'Client-side bounds validation triggered fallback' : 'Verified clean'
  };
}

export default SensorAnomalyBanner;
