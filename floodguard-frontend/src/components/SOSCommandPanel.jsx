import React, { useState, useEffect } from 'react';
import { getActiveSOS, dispatchSOS } from '../api/floodApi';
import { HeartPulse, ShieldAlert, Truck, CheckCircle2, Phone, MapPin, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const SOSCommandPanel = () => {
  const [sosTickets, setSosTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveSOS = async () => {
    try {
      const res = await getActiveSOS();
      setSosTickets(res.data || res);
    } catch (err) {
      console.error("Failed to load SOS tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSOS();
    const interval = setInterval(fetchActiveSOS, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = async (ticketId, unitName) => {
    try {
      await dispatchSOS(ticketId, {
        status: 'RESCUE_TEAM_DISPATCHED',
        assigned_unit: unitName
      });
      toast.success(`Rescue Unit Assigned: ${unitName}`);
      fetchActiveSOS();
    } catch (err) {
      console.error("Dispatch error:", err);
      toast.error("Failed to update dispatch status.");
    }
  };

  const handleMarkSafe = async (ticketId) => {
    try {
      await dispatchSOS(ticketId, {
        status: 'SAFE_AT_SHELTER',
        assigned_unit: 'Evacuated & Safe'
      });
      toast.success("SOS Ticket marked as Rescued & Safe!");
      fetchActiveSOS();
    } catch (err) {
      console.error("Mark safe error:", err);
    }
  };

  const criticalCount = sosTickets.filter(t => t.status === 'CRITICAL_SOS').length;

  return (
    <div className="bg-[#17090d] border-2 border-red-500/40 p-6 rounded-2xl shadow-2xl space-y-5">
      {/* Alert Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-900/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40 animate-pulse">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">Vulnerable SOS Rescue Command Panel</h3>
              {criticalCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white animate-bounce">
                  {criticalCount} UNHANDLED SOS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Priority evacuation requests for senior citizens, hospitals, and stranded rooftop families.
            </p>
          </div>
        </div>

        <button
          onClick={fetchActiveSOS}
          className="px-3.5 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-900/50 transition self-start sm:self-center"
        >
          Refresh SOS Queue
        </button>
      </div>

      {/* SOS Ticket Grid */}
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
          Loading active SOS rescue tickets...
        </div>
      ) : sosTickets.length === 0 ? (
        <div className="py-8 text-center text-slate-400 font-semibold text-xs">
          No pending SOS emergency requests at this moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sosTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                ticket.status === 'CRITICAL_SOS'
                  ? 'bg-[#1a0c10] border-red-500/60 shadow-lg shadow-red-950/40'
                  : ticket.status === 'SAFE_AT_SHELTER'
                  ? 'bg-[#0a1813] border-emerald-500/40'
                  : 'bg-[#0f1526] border-blue-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    {ticket.vulnerability}
                  </span>
                  <h4 className="font-extrabold text-white text-base leading-tight">{ticket.citizen_name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" /> {ticket.location_name}
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-red-600/30 border border-red-500 text-red-300 font-black text-xs block">
                    {ticket.priority_score} PTS
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {ticket.stranded_count} Stranded
                  </span>
                </div>
              </div>

              {/* Medical Urgency Alert */}
              {ticket.medical_emergency && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-[11px] leading-tight">{ticket.medical_notes}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Requested: <strong className="text-white">{ticket.required_mode}</strong></span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><Phone className="w-3 h-3" /> {ticket.phone}</span>
              </div>

              {/* Status & Officer Action Triggers */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  ticket.status === 'CRITICAL_SOS' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  ticket.status === 'SAFE_AT_SHELTER' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {ticket.status.replace(/_/g, ' ')}
                </span>

                {ticket.status === 'CRITICAL_SOS' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDispatch(ticket.id, 'NDRF Rescue Boat Unit-4')}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" /> Dispatch Boat
                    </button>
                  </div>
                )}

                {ticket.status === 'RESCUE_TEAM_DISPATCHED' && (
                  <button
                    onClick={() => handleMarkSafe(ticket.id)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Safe
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SOSCommandPanel;
