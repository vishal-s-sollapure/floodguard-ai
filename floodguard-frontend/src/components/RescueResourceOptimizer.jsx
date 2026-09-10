import React, { useState, useEffect } from 'react';
import { getRescueTeams, getDispatchRecommendations, assignRescueTeam } from '../api/floodApi';
import { Truck, MapPin, Clock, Zap, CheckCircle2, Activity, Users, AlertTriangle, Target, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  AVAILABLE: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'AVAILABLE' },
  DISPATCHED: { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'DISPATCHED' },
  EN_ROUTE: { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', label: 'EN ROUTE' },
  ON_SCENE: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'ON SCENE' },
};

const PRIORITY_BADGE = (score) => {
  if (score >= 90) return 'text-red-400 bg-red-500/15 border-red-500/30';
  if (score >= 75) return 'text-orange-400 bg-orange-500/15 border-orange-500/30';
  return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
};

const RescueResourceOptimizer = () => {
  const [teams, setTeams] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [assigning, setAssigning] = useState(null);

  const fetchData = async () => {
    try {
      const [teamsRes, recRes] = await Promise.all([
        getRescueTeams().catch(() => ({ data: null })),
        getDispatchRecommendations().catch(() => ({ data: null })),
      ]);
      if (teamsRes?.data) setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : []);
      if (recRes?.data) setRecommendations(Array.isArray(recRes.data) ? recRes.data : []);
    } catch (err) {
      console.error('Resource optimizer fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (teamId, incidentId, teamName) => {
    setAssigning(teamId);
    try {
      await assignRescueTeam({ team_id: teamId, incident_id: incidentId });
      toast.success(`✅ ${teamName} dispatched to incident #${incidentId}`);
      fetchData();
    } catch (err) {
      toast.error('Dispatch failed — try again');
    } finally {
      setAssigning(null);
    }
  };

  const availableCount = teams.filter(t => t.status === 'AVAILABLE').length;
  const deployedCount = teams.filter(t => t.status !== 'AVAILABLE').length;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="bg-gradient-to-r from-red-950/50 to-[#0d152a] p-5 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:from-red-950/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">🚑 Multi-Incident Rescue Resource Optimizer</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> AUTO-MATCH
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AI-Optimized team assignment by priority score, capability & Haversine GPS distance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-400">{availableCount} Available</span>
            <span className="text-amber-400">{deployedCount} Deployed</span>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-5 space-y-6">
          {loading ? (
            <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-2">
              <span className="w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              Loading rescue team telemetry...
            </div>
          ) : (
            <>
              {/* Rescue Teams Status Board */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-slate-500" /> Live Rescue Unit Status Board
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {(teams.length > 0 ? teams : FALLBACK_TEAMS).map((team) => {
                    const style = STATUS_STYLES[team.status] || STATUS_STYLES.AVAILABLE;
                    return (
                      <div key={team.id} className={`p-3.5 rounded-xl bg-[#0b1222] border ${style.bg.split(' ')[1]} border transition-colors`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-1 w-2 h-2 rounded-full ${style.dot} shrink-0`} />
                            <div>
                              <p className="text-xs font-extrabold text-white leading-tight">{team.name}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{team.capability}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${style.bg} ${style.text}`}>
                            {style.label}
                          </span>
                        </div>
                        <div className="mt-2.5 flex items-center gap-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{team.base_location}</span>
                          <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{team.capacity_people > 0 ? `${team.capacity_people} pax` : 'Pump Van'}</span>
                        </div>
                        {team.active_assignment && (
                          <p className="mt-1.5 text-[9px] text-amber-300 font-semibold">Active: {team.active_assignment}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Optimal Dispatch Recommendations */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> AI-Recommended Optimal Assignments
                </h4>

                {(recommendations.length > 0 ? recommendations : FALLBACK_RECS).map((rec, idx) => (
                  <div key={idx} className="mb-3 p-4 rounded-xl bg-[#0b1222] border border-slate-700/60 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${PRIORITY_BADGE(rec.priority_score)}`}>
                            PRIORITY {rec.priority_score?.toFixed(0)} PTS
                          </span>
                          <span className="text-xs font-bold text-white">{rec.incident_id}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold">{rec.vulnerability_type}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{rec.incident_location}</p>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <p className="text-[10px] font-mono text-emerald-400">ETA: {rec.eta_minutes} min</p>
                        <p className="text-[10px] text-slate-500">{rec.distance_km} km</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-700/30">
                      <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-indigo-300 truncate">{rec.recommended_team_name}</p>
                        <p className="text-[10px] text-slate-400">{rec.team_capability} • Match Score: {rec.match_score}</p>
                      </div>
                      <button
                        onClick={() => handleAssign(rec.recommended_team_id, rec.incident_id, rec.recommended_team_name)}
                        disabled={assigning === rec.recommended_team_id}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white text-xs font-extrabold transition flex items-center gap-1.5 shrink-0"
                      >
                        {assigning === rec.recommended_team_id ? (
                          <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Dispatching...</>
                        ) : (
                          <><Truck className="w-3 h-3" /> Dispatch</>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 italic pl-1">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Fallback static data when backend unavailable
const FALLBACK_TEAMS = [
  { id: 'TEAM-NDRF-01', name: 'NDRF Disaster Unit Alpha', capability: 'NDRF Boat & Flood Rescue', status: 'AVAILABLE', base_location: 'Koramangala Fire Station', capacity_people: 12, active_assignment: null },
  { id: 'TEAM-AIR-01', name: 'Indian Air Force Chopper Unit', capability: 'Helicopter Aerial Airlift', status: 'DISPATCHED', base_location: 'HAL Air Force Station', capacity_people: 6, active_assignment: 'SOS-8041' },
  { id: 'TEAM-MED-01', name: '108 Emergency Medical Ambulance', capability: 'Medical ICU Ambulance', status: 'EN_ROUTE', base_location: "St. John's Hospital Center", capacity_people: 2, active_assignment: 'SOS-8040' },
  { id: 'TEAM-NDRF-02', name: 'NDRF Rapid Boat Squad Bravo', capability: 'NDRF Boat & Flood Rescue', status: 'AVAILABLE', base_location: 'HSR Layout Sector 1', capacity_people: 10, active_assignment: null },
  { id: 'TEAM-PUMP-01', name: 'BBMP Dewatering Van', capability: 'Water Pumping & Drainage Clearing', status: 'AVAILABLE', base_location: 'Silk Board Municipal Depot', capacity_people: 0, active_assignment: null },
];

const FALLBACK_RECS = [
  { incident_id: 'SOS-8042', incident_location: 'Koramangala 4th Block', priority_score: 96, vulnerability_type: 'Senior Citizen Rooftop Stranded', recommended_team_id: 'TEAM-NDRF-01', recommended_team_name: 'NDRF Disaster Unit Alpha', team_capability: 'NDRF Boat & Flood Rescue', distance_km: 1.2, eta_minutes: 4, match_score: 98.5, reasoning: 'Closest active boat unit (1.2 km) matching rooftop stranding rescue requirements.' },
  { incident_id: 'SOS-8043', incident_location: "St. John's Perimeter", priority_score: 92, vulnerability_type: 'Hospital ICU Patient Evacuation', recommended_team_id: 'TEAM-MED-01', recommended_team_name: '108 Emergency Medical Ambulance', team_capability: 'Medical ICU Ambulance', distance_km: 0.8, eta_minutes: 3, match_score: 95.0, reasoning: 'ICU patient evacuation requires specialized medical unit. Nearest ambulance 0.8 km.' },
  { incident_id: 'SOS-8044', incident_location: 'Silk Board Underpass', priority_score: 78, vulnerability_type: 'Basement Waterlogging & Short Circuit', recommended_team_id: 'TEAM-PUMP-01', recommended_team_name: 'BBMP Dewatering Van', team_capability: 'Water Pumping & Drainage Clearing', distance_km: 0.5, eta_minutes: 3, match_score: 88.0, reasoning: 'Waterlogging requires high-capacity dewatering. Unit located at adjacent depot.' },
];

export default RescueResourceOptimizer;
