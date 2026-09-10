import React, { useEffect, useState } from 'react';
import RiskGauge from '../components/RiskGauge';
import RiskBadge from '../components/RiskBadge';
import MapView from '../components/MapView';
import AlertTicker from '../components/AlertTicker';
import GeminiAssistantWidget from '../components/GeminiAssistantWidget';
import FloodSimulationControl from '../components/FloodSimulationControl';
import ExplainableRiskWidget from '../components/ExplainableRiskWidget';
import { useLanguage } from '../components/LanguageSelector';
import { getCurrentFlood, getWeather, getAlerts } from '../api/floodApi';
import { CloudRain, Waves, RefreshCw, MapPin, Clock } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();
  const [floodData, setFloodData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [floodRes, weatherRes, alertsRes] = await Promise.all([
        getCurrentFlood().catch(() => null),
        getWeather().catch(() => null),
        getAlerts().catch(() => [])
      ]);

      if (floodRes) setFloodData(floodRes);
      if (weatherRes) setWeatherData(weatherRes);
      if (alertsRes) setAlerts(alertsRes);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } fontally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const riskScore = floodData?.risk_score ?? 45.0;
  const riskLevel = floodData?.risk_level ?? 'MODERATE';
  const rainfall = weatherData?.rainfall_mm ?? floodData?.rainfall_mm ?? 18.5;
  const waterLevel = floodData?.water_level_m ?? 2.1;
  const waterRiseRate = floodData?.water_rise_rate ?? 0.4;
  const locationName = floodData?.location ?? 'Bengaluru Urban';

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0f1e] p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('dashHeader')}
            </h1>
            <RiskBadge risk_level={riskLevel} size="small" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-400" /> Location: {locationName} • 
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Updated: {lastUpdated}
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-sm font-semibold transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('refreshData')}
        </button>
      </div>

      {/* Live Simulation Mode for Demo */}
      <FloodSimulationControl
        onSimulate={async (preset) => {
          try {
            const { predictFlood } = await import('../api/floodApi');
            const res = await predictFlood(preset);
            setFloodData(res.data || res);
            setLastUpdated(new Date().toLocaleTimeString());
          } catch (e) {
            console.error("Simulation error:", e);
          }
        }}
      />

      {/* Top Row: 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Risk Gauge */}
        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-between hover:border-slate-700 transition-colors">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('currentScore')}</h3>
            <RiskBadge risk_level={riskLevel} size="small" />
          </div>
          
          <div className="my-2">
            <RiskGauge score={riskScore} size={200} />
          </div>

          <div className="w-full text-center bg-[#0d1322] p-3 rounded-xl border border-slate-800/80 mt-2">
            <span className="text-xs text-slate-400 font-medium">{t('recommendation')}:</span>
            <p className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-2">
              {floodData?.recommended_action || 'Monitor localized low-lying drainage channels.'}
            </p>
          </div>
        </div>

        {/* Card 2: Rainfall */}
        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('rainfall')}</h3>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white">{rainfall}</span>
              <span className="text-lg font-bold text-blue-400">mm/hr</span>
            </div>
            <p className="text-sm font-semibold text-slate-300 mt-2">
              {t('condition')}: <span className="text-cyan-400">{weatherData?.description || 'Moderate Rain'}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#0d1322] p-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-500 block">{t('temp')}</span>
              <span className="font-bold text-slate-200">{weatherData?.temperature_c ?? 24.2}°C</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t('humidity')}</span>
              <span className="font-bold text-slate-200">{weatherData?.humidity_pct ?? 82}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Water Level */}
        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('waterLevel')}</h3>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Waves className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white">{waterLevel}</span>
              <span className="text-lg font-bold text-cyan-400">meters</span>
            </div>
            <p className="text-sm font-semibold text-slate-300 mt-2">
              {t('riseRate')}: <span className="text-amber-400 font-bold">+{waterRiseRate} m/hr</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#0d1322] p-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-500 block">{t('drainageCap')}</span>
              <span className="font-bold text-amber-400 uppercase">{floodData?.drainage_risk || 'High Risk'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t('impactEta')}</span>
              <span className="font-bold text-slate-200">{floodData?.eta_minutes ? `${floodData.eta_minutes} mins` : 'Immediate'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Leaflet Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" /> {t('bengaluruMapTitle')}
          </h2>
          <span className="text-xs text-slate-400 font-medium">Click markers for localized risk telemetry</span>
        </div>
        <MapView />
      </div>

      {/* Gemini AI Emergency Assistant Widget */}
      <div className="pt-2">
        <GeminiAssistantWidget riskScore={riskScore} riskLevel={riskLevel} location={locationName} />
      </div>

      {/* Bottom Row: Alert Ticker */}
      <div className="pt-2">
        <AlertTicker alerts={alerts} />
      </div>
    </div>
  );
};

export default Dashboard;
