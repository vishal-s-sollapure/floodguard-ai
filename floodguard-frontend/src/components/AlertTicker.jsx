import React from 'react';
import { AlertOctagon, Megaphone } from 'lucide-react';

const AlertTicker = ({ alerts = [] }) => {
  const defaultAlerts = [
    "⚠️ HIGH RISK WARNING: Koramangala & Bellandur areas experiencing rapid water level rise. Avoid low-lying underpasses.",
    "🚨 EMERGENCY ADVISORY: BBMP deployed response teams near Outer Ring Road. Standby for relocation notices if water level exceeds 3.5m.",
    "🌧️ HEAVY RAINFALL ALERT: East Bengaluru expected to receive 45mm+ rain over next 3 hours. Exercise extreme caution."
  ];

  const alertList = alerts.length > 0 ? alerts.map(a => a.message || a.title) : defaultAlerts;

  return (
    <div className="bg-[#170e17] border border-red-500/30 rounded-xl overflow-hidden shadow-lg shadow-red-950/20 flex items-center">
      {/* Ticker Badge */}
      <div className="bg-red-600 text-white px-4 py-2.5 flex items-center gap-2 font-black text-xs uppercase tracking-wider shrink-0 shadow-md">
        <Megaphone className="w-4 h-4 animate-bounce" />
        LIVE ALERTS
      </div>

      {/* Scrolling Text Container */}
      <div className="relative overflow-hidden w-full py-2.5">
        <div className="whitespace-nowrap inline-flex animate-ticker text-xs font-semibold text-slate-200 gap-12">
          {alertList.concat(alertList).map((text, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400 inline" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertTicker;
