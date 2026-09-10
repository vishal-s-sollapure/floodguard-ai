import React from 'react';
import { HelpCircle, Info, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLanguage } from './LanguageSelector';

const ExplainableRiskWidget = ({ breakdown, riskScore, riskLevel, explanation, projectedScore, trendDirection }) => {
  const { t } = useLanguage();

  if (!breakdown) {
    // Default fallback breakdown if not provided
    breakdown = {
      rainfall: { points: 21.6, max: 30, percentage: 72, label: 'Rainfall Intensity (72 mm/hr)' },
      water_level: { points: 15.2, max: 25, percentage: 60.8, label: 'Water Level (1.82 m)' },
      water_rise_rate: { points: 8.4, max: 20, percentage: 42, label: 'Water Rise Rate (+0.21 m/hr)' },
      historical_floods: { points: 4.0, max: 10, percentage: 40, label: 'Historical Floods (4 events)' },
      drainage_risk: { points: 10.0, max: 10, percentage: 100, label: 'Drainage Risk (High)' },
      population: { points: 1.8, max: 5, percentage: 37, label: 'Population Exposure (18,500)' }
    };
  }

  return (
    <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> {t('xaiTitle')}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
              Transparent ML
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('xaiSubtitle')} (<strong className="text-white">{riskScore || 61}%</strong>)
          </p>
        </div>

        {projectedScore && (
          <div className="px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-2 self-start sm:self-center">
            <TrendingUp className="w-4 h-4 text-amber-400 animate-pulse" />
            {t('projected30m')}: <span className="text-white font-black text-sm">{projectedScore}%</span>
          </div>
        )}
      </div>

      {/* XAI Progress Bars */}
      <div className="space-y-3.5">
        {Object.entries(breakdown).map(([key, item]) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                {item.label}
              </span>
              <span className="text-slate-400 font-mono">
                <strong className="text-white">{item.points}</strong> / {item.max} pts
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-[#0b1222] border border-slate-800 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.percentage >= 80 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                  item.percentage >= 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                  'bg-gradient-to-r from-blue-600 to-cyan-400'
                }`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Natural Language Explanation Box */}
      {explanation && (
        <div className="p-4 rounded-xl bg-[#0b1222] border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <strong className="text-white block mb-0.5">Model Reasoning:</strong> {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExplainableRiskWidget;
