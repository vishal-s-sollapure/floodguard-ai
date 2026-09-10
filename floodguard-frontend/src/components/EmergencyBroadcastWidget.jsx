import React, { useState, useEffect } from 'react';
import { sendBroadcast, getBroadcastHistory } from '../api/floodApi';
import { Radio, Megaphone, Send, Smartphone, MessageSquare, Mail, CheckCircle2, AlertTriangle, ShieldAlert, History, Globe, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageSelector';

const EmergencyBroadcastWidget = () => {
  const { t } = useLanguage();
  const [targetZone, setTargetZone] = useState('Koramangala 4th Block & 100ft Ring Road');
  const [severityLevel, setSeverityLevel] = useState('CRITICAL RED ALERT');
  const [selectedChannels, setSelectedChannels] = useState(['Cell Broadcast (CAP)', 'WhatsApp Emergency Bot', 'Mass SMS']);
  const [customMsg, setCustomMsg] = useState('');
  const [activeLangTab, setActiveLangTab] = useState('en');
  const [dispatching, setDispatching] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState([]);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await getBroadcastHistory();
      const data = res.data?.data || res.data || res;
      setBroadcastLog(data);
    } catch (err) {
      console.error("Failed to load broadcast history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChannelToggle = (channelName) => {
    if (selectedChannels.includes(channelName)) {
      if (selectedChannels.length === 1) {
        toast.error("At least one broadcast channel must be selected.");
        return;
      }
      setSelectedChannels(selectedChannels.filter(c => c !== channelName));
    } else {
      setSelectedChannels([...selectedChannels, channelName]);
    }
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    setDispatching(true);

    try {
      const payload = {
        target_zone: targetZone,
        severity_level: severityLevel,
        channels: selectedChannels,
        custom_message: customMsg.trim() || undefined
      };

      const res = await sendBroadcast(payload);
      const record = res.data?.data || res.data || res;
      setActiveReceipt(record);
      toast.success(`Emergency Broadcast Dispatched to ${targetZone}!`);
      fetchHistory();
    } catch (err) {
      console.error("Broadcast dispatch error:", err);
      toast.error("Failed to trigger neighborhood broadcast.");
    } finally {
      setDispatching(false);
    }
  };

  // Live Multilingual Message Previews
  const previewMessages = {
    en: customMsg.trim() || `🚨 ${severityLevel} [${targetZone}]: Water level rising rapidly! Evacuate ground floors to nearest shelter (Koramangala Indoor Stadium). Emergency Helpline: 1077 / 112.`,
    kn: `🚨 ${severityLevel === 'CRITICAL RED ALERT' ? 'ತೀವ್ರ ಪ್ರವಾಹ ತುರ್ತು ಎಚ್ಚರಿಕೆ' : 'ಉನ್ನತ ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ'} [${targetZone}]: ಪ್ರವಾಹ ನೀರು ತೀವ್ರವಾಗಿ ಏರುತ್ತಿದೆ! ತಕ್ಷಣವೇ ಕೋರಮಂಗಲ ಇಂಡೋರ್ ಕ್ರೀಡಾಂಗಣ ಆಶ್ರಯ ಕೇಂದ್ರಕ್ಕೆ ತೆರಳಿ. ಸಹಾಯವಾಣಿ: 1077 / 112.`,
    hi: `🚨 ${severityLevel === 'CRITICAL RED ALERT' ? 'गंभीर बाढ़ आपातकालीन चेतावनी' : 'उच्च बाढ़ चेतावनी'} [${targetZone}]: जल स्तर तेजी से बढ़ रहा है! तुरंत निकटतम आश्रय केंद्र (कोरमंगला इंडोर स्टेडियम) में स्थानांतरित हों। हेल्पलाइन: 1077 / 112।`
  };

  return (
    <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40 animate-pulse shadow-lg shadow-red-500/10">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{t('broadcastTitle') || 'Neighborhood Emergency Broadcast Dispatcher'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white uppercase animate-bounce">
                CAP LIVE BROADCAST
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t('broadcastSubtitle') || 'Dispatch simulated Cell Broadcast (CAP), WhatsApp Emergency Bot, and SMS alerts in 3 languages.'}</p>
          </div>
        </div>
      </div>

      {/* Main Broadcast Control Form */}
      <form onSubmit={handleDispatch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Zone Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('targetZoneLabel') || 'Target Municipal Zone'}
            </label>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white text-xs font-semibold focus:border-red-500 focus:outline-none"
            >
              <option value="Koramangala 4th Block & 100ft Ring Road">📍 Koramangala 4th Block & 100ft Ring Road (~18,450 residents)</option>
              <option value="Silk Board Junction & Agara Underpass">📍 Silk Board Junction & Agara Underpass (~24,100 residents)</option>
              <option value="Indiranagar 100ft Road & Domlur">📍 Indiranagar 100ft Road & Domlur (~15,200 residents)</option>
              <option value="Bellandur Outer Ring Road Tech Parks">📍 Bellandur Outer Ring Road Tech Parks (~32,800 tech workforce)</option>
              <option value="HSR Layout 6th Sector & Agara Lake">📍 HSR Layout 6th Sector & Agara Lake (~19,600 residents)</option>
              <option value="City-Wide All Bengaluru Zones">🌐 City-Wide All Bengaluru Municipal Zones (~1,15,000 residents)</option>
            </select>
          </div>

          {/* Threat Severity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('severityLevelLabel') || 'Emergency Threat Level'}
            </label>
            <select
              value={severityLevel}
              onChange={(e) => setSeverityLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white text-xs font-semibold focus:border-red-500 focus:outline-none"
            >
              <option value="CRITICAL RED ALERT">🔴 CRITICAL RED ALERT (Immediate Evacuation)</option>
              <option value="HIGH WARNING">🟠 HIGH WARNING (Severe Waterlogging Alert)</option>
              <option value="SAFETY ADVISORY">🔵 SAFETY ADVISORY (Weather Watch & Pump Prep)</option>
            </select>
          </div>
        </div>

        {/* Channel Checkboxes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            {t('channelsLabel') || 'Alert Dispatch Channels'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleChannelToggle('Cell Broadcast (CAP)')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                selectedChannels.includes('Cell Broadcast (CAP)')
                  ? 'bg-red-950/40 border-red-500 text-white shadow-lg shadow-red-600/10'
                  : 'bg-[#0b1222] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <span className="text-xs font-extrabold block">Cell Broadcast (CAP)</span>
                <span className="text-[10px] text-slate-400">High-tone loud siren override</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleChannelToggle('WhatsApp Emergency Bot')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                selectedChannels.includes('WhatsApp Emergency Bot')
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-600/10'
                  : 'bg-[#0b1222] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-extrabold block">WhatsApp Emergency Bot</span>
                <span className="text-[10px] text-slate-400">Rich map link & shelter guide</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleChannelToggle('Mass SMS')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                selectedChannels.includes('Mass SMS')
                  ? 'bg-blue-950/40 border-blue-500 text-white shadow-lg shadow-blue-600/10'
                  : 'bg-[#0b1222] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <span className="text-xs font-extrabold block">Mass SMS Dispatch</span>
                <span className="text-[10px] text-slate-400">Offline network resilience</span>
              </div>
            </button>
          </div>
        </div>

        {/* Live Multilingual Message Preview Box */}
        <div className="bg-[#0b1222] p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-extrabold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> {t('previewTab') || 'Multilingual Message Preview'}
            </span>

            {/* Language Selector Tabs */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${activeLangTab === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('kn')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${activeLangTab === 'kn' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                🇮🇳 ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('hi')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition ${activeLangTab === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                🇮🇳 हिंदी
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#070c18] border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed min-h-[60px]">
            {previewMessages[activeLangTab]}
          </div>
        </div>

        {/* Dispatch Action Button */}
        <button
          type="submit"
          disabled={dispatching}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer border border-red-400/40"
        >
          {dispatching ? (
            'BROADCASTING EMERGENCY ALERTS TO CELLULAR TOWERS...'
          ) : (
            <>
              <Megaphone className="w-5 h-5 animate-pulse" /> {t('dispatchBtn') || 'DISPATCH NEIGHBORHOOD EMERGENCY BROADCAST'}
            </>
          )}
        </button>
      </form>

      {/* Confirmation Receipt Banner */}
      {activeReceipt && (
        <div className="bg-red-950/40 p-4 rounded-xl border border-red-500/50 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Emergency Broadcast Live! Ticket: {activeReceipt.id}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-300">
            <p>Target Zone: <strong className="text-white">{activeReceipt.target_zone}</strong></p>
            <p>Residents Reached: <strong className="text-amber-400">{activeReceipt.recipients_notified?.toLocaleString()}</strong></p>
            <p>Delivery Success: <strong className="text-emerald-400">{activeReceipt.delivery_rate}%</strong></p>
          </div>
        </div>
      )}

      {/* Recent Dispatches Log History */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" /> {t('recentDispatches') || 'Recent Emergency Broadcast Dispatches Log'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="uppercase font-extrabold bg-[#0b1222] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp & ID</th>
                <th className="px-4 py-3">Target Zone</th>
                <th className="px-4 py-3">Threat Level</th>
                <th className="px-4 py-3">Channels</th>
                <th className="px-4 py-3 text-right">Reach & Success</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#0a0f1e]/40">
              {broadcastLog.map((bcast) => (
                <tr key={bcast.id} className="hover:bg-slate-800/20 transition">
                  <td className="px-4 py-3.5 space-y-0.5">
                    <span className="font-mono text-amber-400 font-bold block">{bcast.id}</span>
                    <span className="text-[10px] text-slate-500">{new Date(bcast.timestamp).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-white max-w-xs truncate">{bcast.target_zone}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      bcast.severity_level?.includes('RED') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {bcast.severity_level}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    <div className="flex flex-wrap gap-1">
                      {bcast.channels?.map((c, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono">
                    <strong className="text-white block">{bcast.recipients_notified?.toLocaleString()} residents</strong>
                    <span className="text-emerald-400 text-[10px] font-bold">{bcast.delivery_rate}% delivered</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBroadcastWidget;
