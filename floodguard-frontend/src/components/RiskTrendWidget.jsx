import React from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from './LanguageSelector';

const RiskTrendWidget = ({ trendSeries, currentScore = 61.0, projectedScore = 74.5, trendDirection = 'RISING' }) => {
  const { t } = useLanguage();

  if (!trendSeries || trendSeries.length === 0) {
    trendSeries = [
      { time: '-60m', score: 32.0 },
      { time: '-45m', score: 41.5 },
      { time: '-30m', score: 48.0 },
      { time: '-15m', score: 55.2 },
      { time: 'NOW', score: currentScore },
      { time: '+30m (proj)', score: projectedScore }
    ];
  }

  return (
    <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> {t('trendTitle')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time score trajectory with predictive AI projection (+30 minutes).
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1.5 ${
          trendDirection === 'RISING_RAPIDLY' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
          trendDirection === 'RISING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          <TrendingUp className="w-3.5 h-3.5" /> {trendDirection.includes('RISING') ? t('trendRising') : t('trendFalling')}
        </span>
      </div>

      {/* Visual Chart Bars */}
      <div className="pt-4 pb-2">
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-44 px-2 bg-[#0b1222] p-4 rounded-xl border border-slate-800">
          {trendSeries.map((item, idx) => {
            const isProjection = item.time.includes('proj');
            const isNow = item.time === 'NOW';
            const barHeight = Math.max(Math.min(item.score, 100), 10);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className={`text-[11px] font-bold ${
                  isProjection ? 'text-amber-400 font-black' : isNow ? 'text-white font-black' : 'text-slate-400'
                }`}>
                  {item.score}%
                </span>

                <div className="w-full max-w-[40px] bg-slate-800/80 rounded-t-lg overflow-hidden flex items-end h-full p-0.5">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isProjection
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400 border-2 border-dashed border-amber-300'
                        : isNow
                        ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/30'
                        : 'bg-gradient-to-t from-slate-700 to-slate-500'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>

                <span className={`text-[10px] font-semibold ${
                  isProjection ? 'text-amber-400 font-extrabold' : isNow ? 'text-blue-400 font-extrabold' : 'text-slate-500'
                }`}>
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 bg-[#0d1424] p-3 rounded-xl border border-slate-800">
        <span>Current Score: <strong className="text-white">{currentScore}%</strong></span>
        <span>Estimated 30m Score: <strong className="text-amber-400 font-black">{projectedScore}%</strong></span>
      </div>
    </div>
  );
};

export default RiskTrendWidget;
