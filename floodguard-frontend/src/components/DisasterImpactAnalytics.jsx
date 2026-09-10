import React, { useState, useEffect } from 'react';
import { getCityImpactSummary } from '../api/floodApi';
import { Building2, Home, Zap, HeartPulse, DollarSign, Download, AlertOctagon, ShieldAlert, ArrowUpRight, CheckCircle, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageSelector';

const DisasterImpactAnalytics = ({ currentRiskScore = 68.5, waterLevel = 1.65, rainRate = 34.0 }) => {
  const { t } = useLanguage();
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await getCityImpactSummary({ location: 'Bengaluru Urban', risk_score: currentRiskScore });
        const data = res.data?.data || res.data || res;
        setImpactData(data);
      } catch (err) {
        console.error("Failed to load disaster impact analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, [currentRiskScore]);

  if (loading) {
    return (
      <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 animate-pulse text-center py-12 text-slate-400">
        Calculating real-time disaster impact & economic loss model...
      </div>
    );
  }

  if (!impactData) return null;

  const { affected_households, affected_population, financial_loss, shelter_demand, infrastructure_assets } = impactData;

  const totalLoss = financial_loss?.total_crores || 4.25;
  const resLoss = financial_loss?.residential_damage_lakhs || 185;
  const commLoss = financial_loss?.commercial_damage_lakhs || 140;
  const infraLoss = financial_loss?.infrastructure_damage_lakhs || 100;
  const totalLakhs = financial_loss?.total_lakhs || 425;

  const resPct = Math.round((resLoss / totalLakhs) * 100);
  const commPct = Math.round((commLoss / totalLakhs) * 100);
  const infraPct = Math.round((infraLoss / totalLakhs) * 100);

  return (
    <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{t('impactTitle') || 'Disaster Impact & Economic Loss Analytics'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                MUNICIPAL MODEL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t('impactSubtitle') || 'Real-time estimation of affected households, submerged infrastructure, and economic financial losses.'}</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-2 print:hidden cursor-pointer"
        >
          <Download className="w-4 h-4 text-indigo-400" /> {t('downloadReport') || 'Download Impact Summary Report'}
        </button>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Affected Households */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">{t('affectedHouseholds') || 'Affected Households'}</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{affected_households?.toLocaleString() || '2,192'}</p>
          <span className="text-[11px] text-slate-400 font-medium">~{affected_population?.toLocaleString() || '9,206'} total citizens impacted</span>
        </div>

        {/* Financial Damage (₹ Crores) */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">{t('estLossCr') || 'Est. Economic Loss'}</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">₹ {totalLoss} Crores</p>
          <span className="text-[11px] text-slate-400 font-medium">₹ {totalLakhs} Lakhs total damage estimate</span>
        </div>

        {/* Critical Infra At Risk */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">{t('submergedInfra') || 'Critical Infra At-Risk'}</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-400">{infrastructure_assets?.length || 4} Facilities</p>
          <span className="text-[11px] text-red-300/80 font-medium flex items-center gap-1"><AlertOctagon className="w-3 h-3" /> Substation & Rajakaluve critical</span>
        </div>

        {/* Shelter Capacity Demand */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">{t('shelterDemand') || 'Relief Shelter Demand'}</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-400">{shelter_demand?.camps_needed || 7} Relief Camps</p>
          <span className="text-[11px] text-slate-400 font-medium">{shelter_demand?.food_packets_day?.toLocaleString() || '27,618'} food meals / day</span>
        </div>
      </div>

      {/* Economic Loss Breakdown Section */}
      <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Economic Loss Sectoral Breakdown (₹ {totalLakhs} Lakhs)
        </h3>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
          <div style={{ width: `${resPct}%` }} className="bg-amber-500 h-full" title={`Residential: ${resPct}%`} />
          <div style={{ width: `${commPct}%` }} className="bg-blue-500 h-full" title={`Commercial: ${commPct}%`} />
          <div style={{ width: `${infraPct}%` }} className="bg-purple-500 h-full" title={`Infrastructure: ${infraPct}%`} />
        </div>

        {/* Category Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#070c18] border border-amber-500/20 flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {t('resLoss') || 'Residential Damage'}
            </span>
            <strong className="text-amber-400">₹ {resLoss} Lakhs ({resPct}%)</strong>
          </div>

          <div className="p-3 rounded-lg bg-[#070c18] border border-blue-500/20 flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> {t('commLoss') || 'Commercial Loss'}
            </span>
            <strong className="text-blue-400">₹ {commLoss} Lakhs ({commPct}%)</strong>
          </div>

          <div className="p-3 rounded-lg bg-[#070c18] border border-purple-500/20 flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> {t('infraLoss') || 'Infrastructure Repair'}
            </span>
            <strong className="text-purple-400">₹ {infraLoss} Lakhs ({infraPct}%)</strong>
          </div>
        </div>
      </div>

      {/* Submerged Critical Infrastructure Risk Matrix */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-400" /> Submerged Critical Infrastructure Risk Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="uppercase font-extrabold bg-[#0b1222] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Infrastructure Facility</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Inundation Threat Level</th>
                <th className="px-4 py-3">Recommended Response Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#0a0f1e]/40">
              {infrastructure_assets.map((asset, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition">
                  <td className="px-4 py-3.5 font-bold text-white">{asset.asset_name}</td>
                  <td className="px-4 py-3.5 text-slate-400">{asset.category}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                      asset.risk_level === 'CRITICAL' || asset.risk_level === 'IMPASSABLE' || asset.risk_level?.includes('OVERFLOWING')
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                        : asset.risk_level === 'HIGH' || asset.risk_level === 'WATERLOGGED' || asset.risk_level?.includes('CAPACITY')
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {asset.risk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 font-mono text-[11px]">{asset.action_required}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisasterImpactAnalytics;
