import React, { useState, useEffect } from 'react';
import { getEvacuationRoute, getShelters } from '../api/floodApi';
import { Navigation, MapPin, ShieldCheck, Compass, AlertOctagon, Footprints, Car, Phone, CheckCircle2, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageSelector';

const EvacuationRouteWidget = ({ onRouteCalculated }) => {
  const { t } = useLanguage();
  const [lat, setLat] = useState(12.9352);
  const [lng, setLng] = useState(77.6245);
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [shelters, setShelters] = useState([]);

  const fetchShelters = async () => {
    try {
      const res = await getShelters();
      setShelters(res.data || res);
    } catch (err) {
      console.error("Failed to load shelters:", err);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleCalculateRoute = async (customLat, customLng) => {
    const targetLat = customLat || lat;
    const targetLng = customLng || lng;
    setLoading(true);
    try {
      const res = await getEvacuationRoute({ lat: targetLat, lng: targetLng });
      const data = res.data || res;
      setRouteData(data);
      if (onRouteCalculated) {
        onRouteCalculated(data);
      }
      toast.success(`Evacuation Route Calculated to ${data.target_shelter.name}`);
    } catch (err) {
      console.error("Evacuation route error:", err);
      toast.error("Failed to calculate safe evacuation route.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeoDetect = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detectedLat = parseFloat(pos.coords.latitude.toFixed(4));
        const detectedLng = parseFloat(pos.coords.longitude.toFixed(4));
        setLat(detectedLat);
        setLng(detectedLng);
        handleCalculateRoute(detectedLat, detectedLng);
      },
      (err) => {
        toast.error("Could not detect GPS location. Running simulation for Koramangala.");
        handleCalculateRoute(12.9352, 77.6245);
      }
    );
  };

  return (
    <div className="bg-[#111827] border border-emerald-500/30 p-6 rounded-2xl shadow-xl space-y-6">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">{t('evacTitle')}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE NAV
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t('evacSubtitle')}</p>
          </div>
        </div>

        <button
          onClick={handleGeoDetect}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 shrink-0"
        >
          <Navigation className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Calculating Route..." : t('findRouteBtn')}
        </button>
      </div>

      {/* Primary Evaluated Safe Route Box */}
      {routeData && (
        <div className="bg-[#0b1222] p-5 rounded-2xl border border-slate-800 space-y-5 animate-fadeIn">
          {/* Target Shelter Card Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-[#0c1a2e] p-4 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Safe Destination
              </span>
              <h4 className="text-lg font-extrabold text-white">{routeData.target_shelter.name}</h4>
              <p className="text-xs text-slate-300">{routeData.target_shelter.location_name} • Helpline: <strong className="text-emerald-400">{routeData.target_shelter.contact}</strong></p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                {routeData.target_shelter.occupancy}/{routeData.target_shelter.capacity} Beds Occupied
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#111827] p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('distance')}</span>
              <p className="text-base font-black text-white">{routeData.distance_km} km</p>
            </div>

            <div className="bg-[#111827] p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center justify-center gap-1">
                <Footprints className="w-3 h-3 text-blue-400" /> {t('walkTime')}
              </span>
              <p className="text-base font-black text-blue-400">{routeData.walk_time_mins} mins</p>
            </div>

            <div className="bg-[#111827] p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center justify-center gap-1">
                <Car className="w-3 h-3 text-emerald-400" /> {t('driveTime')}
              </span>
              <p className="text-base font-black text-emerald-400">{routeData.drive_time_mins} mins</p>
            </div>

            <div className="bg-[#111827] p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('safetyScore')}</span>
              <p className="text-base font-black text-emerald-400">{routeData.safety_score}% SAFE</p>
            </div>
          </div>

          {/* Hazard Avoided Warning Box */}
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">{t('hazardAvoided')}:</strong>
              {routeData.hazard_avoided}
            </div>
          </div>

          {/* Turn-by-Turn Steps */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-400" /> {t('turnByTurn')}
            </h5>
            <div className="space-y-1.5 bg-[#111827] p-4 rounded-xl border border-slate-800 text-xs">
              {routeData.navigation_steps.map((step, idx) => (
                <p key={idx} className="text-slate-300 leading-relaxed font-medium">
                  {step}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Emergency Shelters Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
          <Home className="w-4 h-4 text-emerald-400" /> {t('liveShelterStatus')}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(shelters.length > 0 ? shelters : routeData?.all_shelters || []).map((shelter) => (
            <div
              key={shelter.id}
              className="bg-[#0b1222] p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-extrabold text-white text-sm">{shelter.name}</h5>
                  <p className="text-xs text-slate-400">{shelter.location_name}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  shelter.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  shelter.status === 'NEAR_CAPACITY' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {shelter.status === 'OPEN' ? t('shelterOpen') : shelter.status === 'NEAR_CAPACITY' ? t('shelterNearCap') : t('shelterFull')}
                </span>
              </div>

              {/* Facilities Pill Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {shelter.facilities?.map((fac, i) => (
                  <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                    {fac}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Occupancy: <strong className="text-white">{shelter.occupancy}/{shelter.capacity}</strong></span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><Phone className="w-3 h-3" /> {shelter.contact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvacuationRouteWidget;
