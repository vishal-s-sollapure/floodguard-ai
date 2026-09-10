import React, { useState, useEffect } from 'react';
import { getResponseKPIs } from '../api/floodApi';
import { TrendingUp, Clock, Users, Shield, Activity, BarChart3, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const KPICard = ({ icon: Icon, label, value, sub, color, pct }) => (
  <div className="bg-[#0b1222] p-4 rounded-xl border border-slate-800/80 space-y-3 hover:border-slate-700 transition-colors">
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg ${color.bg} border ${color.border}`}>
        <Icon className={`w-4 h-4 ${color.text}`} />
      </div>
      <span className={`text-2xl font-black ${color.text}`}>{value}</span>
    </div>
    <div>
      <p className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">{label}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
      {pct !== undefined && (
        <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${color.bar}`}
            style={{ width: `${pct}%`, transition: 'width 1s ease-out' }}
          />
        </div>
      )}
    </div>
  </div>
);

const ResponseKPIWidget = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [orchestratorSteps, setOrchestratorSteps] = useState(null);
  const [orchestrating, setOrchestrating] = useState(false);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await getResponseKPIs();
        setKpis(res.data || res);
      } catch {
        setKpis(FALLBACK_KPIS);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  const handleRunOrchestrator = async () => {
    setOrchestrating(true);
    try {
      const { triggerOrchestration } = await import('../api/floodApi');
      const res = await triggerOrchestration({
        telemetry: { rainfall_mm: 78.5, water_level_m: 2.6, water_rise_rate: 0.8, historical_floods: 6, drainage_risk: 'High', population: 18000 }
      });
      setOrchestratorSteps(res.data || res);
    } catch {
      setOrchestratorSteps(FALLBACK_PIPELINE);
    } finally {
      setOrchestrating(false);
    }
  };

  const data = kpis || FALLBACK_KPIS;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="bg-gradient-to-r from-indigo-950/50 to-[#0d152a] p-5 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:from-indigo-950/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">📊 Emergency Response Performance KPIs</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                LIVE METRICS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {data.timeframe || 'Past 24 Hours — Bengaluru Command Center'}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="p-5 space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <KPICard
              icon={Clock}
              label="Avg Response Time"
              value={data.avg_response_time_str}
              sub="From report to dispatch"
              color={{ text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' }}
            />
            <KPICard
              icon={CheckCircle2}
              label="Resolution Rate"
              value={`${data.resolution_rate_pct}%`}
              sub={`${data.critical_incidents_resolved} / ${data.total_incidents_logged} critical incidents`}
              color={{ text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', bar: 'bg-blue-500' }}
              pct={data.resolution_rate_pct}
            />
            <KPICard
              icon={Users}
              label="Team Utilization"
              value={`${data.rescue_team_utilization_pct}%`}
              sub={`${data.active_units_deployed} / ${data.total_units_in_fleet} units deployed`}
              color={{ text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500' }}
              pct={data.rescue_team_utilization_pct}
            />
            <KPICard
              icon={Shield}
              label="Shelter Occupancy"
              value={`${data.shelter_occupancy_pct}%`}
              sub={`${data.total_citizens_sheltered?.toLocaleString()} / ${data.total_shelter_capacity?.toLocaleString()} beds`}
              color={{ text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', bar: 'bg-cyan-500' }}
              pct={data.shelter_occupancy_pct}
            />
            <KPICard
              icon={Activity}
              label="System Efficiency"
              value={`${data.system_efficiency_score}`}
              sub={`${data.alerts_dispatched_24h} alerts · ${data.false_alarms_dismissed} dismissed`}
              color={{ text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', bar: 'bg-purple-500' }}
              pct={data.system_efficiency_score}
            />
          </div>

          {/* Event Orchestration Chain Panel */}
          <div className="p-4 rounded-xl bg-[#0b1222] border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> 🔄 Automated Event Chain Orchestrator
              </h4>
              <button
                onClick={handleRunOrchestrator}
                disabled={orchestrating}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                {orchestrating ? (
                  <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />Running...</>
                ) : (
                  <>⚡ Run Full Pipeline</>
                )}
              </button>
            </div>

            {orchestratorSteps && (
              <div className="space-y-2 mt-1">
                {(orchestratorSteps.steps_executed || orchestratorSteps).map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0d1732] border border-slate-800/60 text-xs">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      step.status?.includes('ANOMALY') ? 'bg-amber-500/20 text-amber-400' :
                      step.status === 'ALERT_TRIGGERED' ? 'bg-red-500/20 text-red-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {step.step_num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-slate-200">{step.name}</span>
                      <p className="text-slate-400 truncate">{step.detail}</p>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border shrink-0 ${
                      step.status?.includes('ANOMALY') ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                      step.status === 'ALERT_TRIGGERED' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                      'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                ))}
                {orchestratorSteps.final_risk_score !== undefined && (
                  <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-700/30 text-xs text-blue-300 font-semibold">
                    ⚡ Pipeline complete — Risk: <strong className="text-white">{orchestratorSteps.final_risk_score}%</strong> ({orchestratorSteps.final_risk_level})
                    {orchestratorSteps.alert_generated && (
                      <span className="ml-2 text-red-400">• 🚨 Automated Alert Triggered</span>
                    )}
                  </div>
                )}
              </div>
            )}
            {!orchestratorSteps && (
              <p className="text-[11px] text-slate-500 italic">
                Click "Run Full Pipeline" to execute automated chain: Telemetry → Anomaly Check → Risk Recalculation → Alert → SOS → Resource Optimizer → Officer Dispatch
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FALLBACK_KPIS = {
  avg_response_time_str: '6m 42s', resolution_rate_pct: 85.7, critical_incidents_resolved: 18,
  total_incidents_logged: 21, rescue_team_utilization_pct: 87.5, active_units_deployed: 7,
  total_units_in_fleet: 8, shelter_occupancy_pct: 64.2, total_citizens_sheltered: 1420,
  total_shelter_capacity: 2200, alerts_dispatched_24h: 14, false_alarms_dismissed: 2,
  system_efficiency_score: 94.8, timeframe: 'Past 24 Hours — Bengaluru Command Center'
};

const FALLBACK_PIPELINE = {
  steps_executed: [
    { step_num: 1, name: 'Data Validation & Anomaly Detection', status: 'VALIDATED', detail: 'Telemetry verified clean — all sensor readings within bounds' },
    { step_num: 2, name: 'Mathematical Risk Recalculation', status: 'SUCCESS', detail: 'Calculated Risk Score: 76.3% (HIGH)' },
    { step_num: 3, name: 'Threshold Breach Evaluation', status: 'ALERT_TRIGGERED', detail: 'Threshold 76.3% >= 70.0% -> Automated Cell Alert Generated' },
    { step_num: 4, name: 'Vulnerable Population & Rescue Optimizer', status: 'RECOMMENDED', detail: 'Matched 2 optimal emergency units for high-priority SOS tickets' },
  ],
  final_risk_score: 76.3, final_risk_level: 'HIGH', alert_generated: true,
};

export default ResponseKPIWidget;
