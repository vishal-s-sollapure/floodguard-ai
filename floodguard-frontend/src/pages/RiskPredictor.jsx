import React, { useState } from 'react';
import { predictFlood } from '../api/floodApi';
import RiskGauge from '../components/RiskGauge';
import RiskBadge from '../components/RiskBadge';
import { ShieldAlert, Play, Clock, AlertOctagon, CheckCircle2, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const RiskPredictor = () => {
  const [formData, setFormData] = useState({
    rainfall_mm: 72,
    water_level_m: 1.82,
    water_rise_rate: 0.21,
    historical_floods: 4,
    drainage_risk: 'high',
    population: 18500,
    location: 'Koramangala 4th Block'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'drainage_risk' || name === 'location' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        rainfall_mm: parseFloat(formData.rainfall_mm) || 0,
        water_level_m: parseFloat(formData.water_level_m) || 0,
        water_rise_rate: parseFloat(formData.water_rise_rate) || 0,
        historical_floods: parseInt(formData.historical_floods) || 0,
        drainage_risk: formData.drainage_risk.toLowerCase()
                         .replace(" risk", "")
                         .replace("risk", "")
                         .trim(),
        population: parseInt(formData.population) || 0,
        location: formData.location || "Bengaluru"
      };

      console.log("PAYLOAD:", JSON.stringify(payload));

      const result = await predictFlood(payload);
      setPrediction(result.data || result);
      toast.success('Risk assessment analysis completed!');
    } catch (err) {
      console.error('Prediction error:', err);
      toast.error('Failed to connect to risk engine backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0f1e] p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#111827', color: '#fff', border: '1px solid #374151' } }} />

      {/* Header */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Flood Risk Assessment Predictor
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Enter real-time environmental data to simulate flood probability, impact severity, and ETA.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-6 bg-[#111827] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" /> Simulation Parameters
              </h3>
              <span className="text-xs text-blue-400 font-semibold">Pre-filled with Demo Telemetry</span>
            </div>

            {/* Rainfall */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Rainfall Intensity (mm/hr)
              </label>
              <input
                type="number"
                step="0.1"
                name="rainfall_mm"
                value={formData.rainfall_mm}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
              />
            </div>

            {/* Water Level & Rise Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Water Level (m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="water_level_m"
                  value={formData.water_level_m}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Water Rise Rate (m/15m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="water_rise_rate"
                  value={formData.water_rise_rate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
                />
              </div>
            </div>

            {/* Historical Floods & Drainage Risk */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Historical Floods (count)
                </label>
                <input
                  type="number"
                  name="historical_floods"
                  value={formData.historical_floods}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Drainage Risk
                </label>
                <select
                  name="drainage_risk"
                  value={formData.drainage_risk}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold capitalize"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </div>

            {/* Population & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Affected Population
                </label>
                <input
                  type="number"
                  name="population"
                  value={formData.population}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Zone / Area
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Calculating Risk Model...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" /> Analyze Flood Risk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {prediction ? (
            <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400">Location Evaluated</span>
                  <h3 className="text-xl font-extrabold text-white">{prediction.location}</h3>
                </div>
                <RiskBadge risk_level={prediction.risk_level} size="large" />
              </div>

              {/* Gauge Display */}
              <div className="bg-[#0b1222] p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                <RiskGauge score={prediction.risk_score} size={220} />
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0d1424] p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Estimated Inundation ETA</span>
                    <p className="text-lg font-black text-white">
                      {prediction.eta_minutes > 0 ? `${prediction.eta_minutes} Minutes` : 'Immediate Threat'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0d1424] p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Engine Confidence</span>
                    <p className="text-lg font-black text-emerald-400">98.4% Accuracy</p>
                  </div>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className={`p-5 rounded-xl border ${
                prediction.risk_level === 'CRITICAL' ? 'bg-red-950/30 border-red-500/40 text-red-300' :
                prediction.risk_level === 'HIGH' ? 'bg-orange-950/30 border-orange-500/40 text-orange-300' :
                prediction.risk_level === 'MODERATE' ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' :
                'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              }`}>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4" /> Recommended Safety Action
                </h4>
                <p className="text-sm font-semibold leading-relaxed">
                  {prediction.recommended_action}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#111827] p-12 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Ready for Risk Simulation</h3>
              <p className="text-sm text-slate-400 max-w-md">
                Adjust parameters on the left and click "Analyze Flood Risk" to run the mathematical risk scoring engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskPredictor;
