import React, { useState, useEffect } from 'react';
import { getHistoricalAnalytics, getNeighborhoodFrequency } from '../api/floodApi';
import { Calendar, TrendingUp, CloudRain, Waves, ShieldAlert, BarChart3, MapPin, Award, AlertTriangle, Layers } from 'lucide-react';
import { useLanguage } from './LanguageSelector';

const HistoricalAnalyticsWidget = () => {
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState('Koramangala 4th Block');
  const [timeframe, setTimeframe] = useState(30);
  const [historyData, setHistoryData] = useState(null);
  const [frequencyData, setFrequencyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRecord, setHoveredRecord] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [histRes, freqRes] = await Promise.all([
          getHistoricalAnalytics({ zone: selectedZone, days: timeframe }),
          getNeighborhoodFrequency()
        ]);
        const hData = histRes.data?.data || histRes.data || histRes;
        const fData = freqRes.data?.data || freqRes.data || freqRes;
        setHistoryData(hData);
        setFrequencyData(fData);
      } catch (err) {
        console.error("Failed to load historical analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedZone, timeframe]);

  if (loading && !historyData) {
    return (
      <div className="bg-[#111827] p-8 rounded-2xl border border-slate-800 animate-pulse text-center text-slate-400 py-12">
        Loading 30-day historical flood risk telemetry and frequency heatmap...
      </div>
    );
  }

  const dailyRecords = historyData?.daily_records || [];
  const maxRain = historyData?.peak_rainfall_mm || 72.5;
  const maxWater = historyData?.peak_water_level_m || 2.4;
  const floodDays = historyData?.total_flood_days || 6;
  const peakRisk = historyData?.peak_risk_score || 94.5;

  return (
    <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{t('historyTitle') || '30-Day Historical Risk Analytics & Frequency Heatmap'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                HYDRO-TIMELINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t('historySubtitle') || 'Analyze past precipitation trends, peak inundation water levels, and neighborhood flood risk cycles.'}</p>
          </div>
        </div>

        {/* Zone & Timeframe Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#0b1222] border border-slate-700 text-white text-xs font-semibold focus:border-cyan-500 focus:outline-none"
          >
            <option value="Koramangala 4th Block">📍 Koramangala 4th Block</option>
            <option value="Silk Board Junction">📍 Silk Board Junction</option>
            <option value="Bellandur ORR Tech Corridor">📍 Bellandur ORR Tech Corridor</option>
            <option value="HSR Layout 6th Sector">📍 HSR Layout 6th Sector</option>
            <option value="Indiranagar 100ft Road">📍 Indiranagar 100ft Road</option>
            <option value="City-Wide All Zones">🌐 City-Wide All Bengaluru</option>
          </select>

          <div className="flex items-center bg-[#0b1222] p-1 rounded-xl border border-slate-800">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setTimeframe(d)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  timeframe === d ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Historical Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Peak Rainfall Record */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">{t('peakRainfallRecord') || 'Peak Rainfall Record'}</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-cyan-400">{maxRain} mm/day</p>
          <span className="text-[11px] text-slate-400 font-medium">Monsoonal cloudburst peak</span>
        </div>

        {/* Max Water Level */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">{t('maxWaterLevel') || 'Max Water Sensor Level'}</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Waves className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-400">{maxWater} m</p>
          <span className="text-[11px] text-slate-400 font-medium">Recorded at Rajakaluve drain</span>
        </div>

        {/* Total Flood Days */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">{t('floodDaysCount') || 'Flood Days Count'}</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400">{floodDays} Days</p>
          <span className="text-[11px] text-amber-300/80 font-medium">Out of {timeframe} days evaluated</span>
        </div>

        {/* Peak Risk Score */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">{t('historicalRiskTier') || 'Peak Risk Score'}</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-400">{peakRisk} Pts</p>
          <span className="text-[11px] text-red-300/80 font-medium font-bold uppercase">CRITICAL FLOOD RISK</span>
        </div>
      </div>

      {/* Dual Bar/Line Historical Graph */}
      <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Daily Precipitation vs Water Level Trend ({timeframe} Days)
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <span className="w-3 h-3 rounded bg-cyan-500 inline-block"></span> Rainfall (mm)
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <span className="w-3 h-1 bg-amber-400 inline-block"></span> Water Level (m)
            </span>
          </div>
        </div>

        {/* Visual Chart Bars */}
        <div className="h-56 w-full flex items-end justify-between gap-1 pt-6 pb-2 px-2 relative border-b border-slate-800">
          {dailyRecords.map((record, index) => {
            const rainHeightPct = Math.min(100, Math.max(10, (record.rainfall_mm / (maxRain || 100)) * 100));
            const waterHeightPct = Math.min(100, Math.max(15, (record.water_level_m / (maxWater || 3)) * 100));

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredRecord(record)}
                onMouseLeave={() => setHoveredRecord(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
              >
                {/* Tooltip Hover Box */}
                {hoveredRecord?.date === record.date && (
                  <div className="absolute -top-14 z-20 bg-[#1e293b] border border-cyan-500 text-white text-[11px] p-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none font-mono">
                    <p className="font-extrabold text-cyan-400">{record.date} ({record.status})</p>
                    <p>Rain: <strong className="text-cyan-300">{record.rainfall_mm} mm</strong> • Water: <strong className="text-amber-400">{record.water_level_m} m</strong></p>
                  </div>
                )}

                {/* Water Level Line Marker Dot */}
                <div
                  style={{ bottom: `${waterHeightPct}%` }}
                  className={`absolute w-2 h-2 rounded-full border border-white z-10 transition-transform group-hover:scale-150 ${
                    record.is_flooded ? 'bg-red-500 border-red-300' : 'bg-amber-400'
                  }`}
                />

                {/* Rainfall Bar */}
                <div
                  style={{ height: `${rainHeightPct}%` }}
                  className={`w-full rounded-t transition-all group-hover:brightness-125 ${
                    record.is_flooded
                      ? 'bg-gradient-to-t from-red-600 to-amber-500'
                      : 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Date Labels Axis */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono px-2">
          <span>{dailyRecords[0]?.date || '30 days ago'}</span>
          <span>{dailyRecords[Math.floor(dailyRecords.length / 2)]?.date || '15 days ago'}</span>
          <span className="text-cyan-400 font-bold">TODAY</span>
        </div>
      </div>

      {/* Neighborhood Inundation Frequency Heatmap Ranking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heatmap Ranking Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" /> {t('neighborhoodFrequencyTitle') || 'Neighborhood Inundation Frequency Heatmap Ranking'}
          </h3>

          <div className="space-y-2.5 bg-[#0b1222] p-4 rounded-xl border border-slate-800">
            {frequencyData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="text-slate-500 font-mono">#{idx + 1}</span> {item.neighborhood}
                  </span>
                  <span className="font-mono text-amber-400 font-extrabold">{item.flood_days_count} / 30 Days ({item.frequency_percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${item.frequency_percentage * 3}%` }}
                    className={`h-full rounded-full transition-all ${
                      item.frequency_percentage > 25 ? 'bg-red-500' : (item.frequency_percentage > 18 ? 'bg-amber-500' : 'bg-cyan-500')
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Historical Flood Events Log */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> {t('majorFloodEvents') || 'Major Historical Flood Events Log'}
          </h3>

          <div className="space-y-3">
            {historyData?.notable_events?.map((evt, idx) => (
              <div key={idx} className="bg-[#0b1222] p-3.5 rounded-xl border border-slate-800 space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs">{evt.event_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                    {evt.date}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{evt.summary}</p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300 pt-1">
                  <span>Rain: <strong className="text-cyan-400">{evt.rainfall_mm} mm</strong></span>
                  <span>Water: <strong className="text-amber-400">{evt.water_level_m} m</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalAnalyticsWidget;
