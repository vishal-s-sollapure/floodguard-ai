import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { triggerSOS } from '../api/floodApi';
import { ShieldAlert, HeartPulse, LifeBuoy, Phone, MapPin, X, Send, AlertTriangle, User, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageSelector';

const SOSRescueWidget = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [vulnerability, setVulnerability] = useState('Senior Citizen (65+)');
  const [requiredMode, setRequiredMode] = useState('NDRF Rescue Boat');
  const [strandedCount, setStrandedCount] = useState(2);
  const [medicalEmergency, setMedicalEmergency] = useState(true);
  const [medicalNotes, setMedicalNotes] = useState('Wheelchair bound, ground floor flooded up to 1.2m.');
  const [locationName, setLocationName] = useState('Koramangala 4th Block, 8th Main Road');
  const [submitting, setSubmitting] = useState(false);
  const [dispatchedTicket, setDispatchedTicket] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Please provide a valid emergency phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        citizen_name: citizenName || 'Anonymous Citizen',
        phone,
        vulnerability,
        required_mode: requiredMode,
        stranded_count: parseInt(strandedCount) || 1,
        medical_emergency: medicalEmergency,
        medical_notes: medicalNotes,
        location_name: locationName,
        lat: 12.9352,
        lng: 77.6245
      };

      const res = await triggerSOS(payload);
      const ticket = res.data || res;
      setDispatchedTicket(ticket);
      toast.success(t('sosSuccessToast'));
    } catch (err) {
      console.error("SOS trigger error:", err);
      toast.error("Failed to dispatch SOS request. Please call 1077 or 112 immediately!");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-left">
        <div className="bg-[#111827] border-2 border-red-500 max-w-lg w-full rounded-2xl shadow-2xl animate-fadeIn p-5 sm:p-6 relative my-6 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
          <div className="p-2.5 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40 animate-pulse shrink-0">
            <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">{t('sosTitle')}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white uppercase animate-bounce">
                PRIORITY 1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t('sosSubtitle')}</p>
          </div>
        </div>

        {dispatchedTicket ? (
          <div className="bg-[#0b1222] p-5 rounded-xl border border-red-500/40 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Emergency SOS Ticket Active!</h3>
            <div className="bg-[#070c18] p-3 rounded-lg text-xs space-y-1 text-left text-slate-300 font-mono border border-slate-800">
              <p>Ticket ID: <strong className="text-amber-400">{dispatchedTicket.id}</strong></p>
              <p>Priority Score: <strong className="text-red-400 font-black">{dispatchedTicket.priority_score} Pts</strong></p>
              <p>Status: <strong className="text-emerald-400">{dispatchedTicket.status}</strong></p>
              <p>Requested Mode: <strong className="text-white">{dispatchedTicket.required_mode}</strong></p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Disaster Response Command has received your request. State Helpline Helpline: <strong className="text-red-400">1077 / 112</strong>
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Close Confirmation Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vulnerability Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('vulnerabilityLabel')}
              </label>
              <select
                value={vulnerability}
                onChange={(e) => setVulnerability(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs font-semibold"
              >
                <option value="Senior Citizen (65+)">👴 Senior Citizen (Age 65+)</option>
                <option value="Hospital / Infirmary">🏥 Hospital / Infirmary ICU Patient</option>
                <option value="Mobility Impaired">♿ Mobility Impaired / Disabled</option>
                <option value="Pregnant / Infant Household">👶 Pregnant Woman / Infant Household</option>
                <option value="Stranded Rooftop">🏚️ Stranded Rooftop / Ground Submerged</option>
              </select>
            </div>

            {/* Required Rescue Equipment */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t('requiredModeLabel')}
                </label>
                <select
                  value={requiredMode}
                  onChange={(e) => setRequiredMode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs font-semibold"
                >
                  <option value="NDRF Rescue Boat">🚤 NDRF Rescue Boat</option>
                  <option value="Helicopter Airlift">🚁 Helicopter Airlift</option>
                  <option value="Medical Ambulance">🚑 Medical Ambulance</option>
                  <option value="Emergency Rations">🍞 Food & Clean Water Rations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t('strandedCountLabel')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={strandedCount}
                  onChange={(e) => setStrandedCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-red-500 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Medical Urgency Checkbox */}
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between">
              <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                {t('medicalUrgencyLabel')}
              </span>
              <input
                type="checkbox"
                checked={medicalEmergency}
                onChange={(e) => setMedicalEmergency(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">{t('citizenNameLabel')}</label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Dr. Ramesh / Savitri Amma"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b1222] border border-slate-700 text-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">{t('phoneLabel')}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 11223"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b1222] border border-slate-700 text-white text-xs font-semibold"
                />
              </div>
            </div>

            {/* Location & Landmark */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">{t('locationNotesLabel')}</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Flat 302, Green View Apts, Koramangala"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white text-xs font-semibold"
              />
            </div>

            {/* Submit SOS Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-black text-sm shadow-xl shadow-red-600/40 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                'DISPATCHING CRITICAL SOS...'
              ) : (
                <>
                  <Send className="w-4 h-4" /> {t('dispatchSosBtn')}
                </>
              )}
            </button>
          </form>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SOSRescueWidget;
