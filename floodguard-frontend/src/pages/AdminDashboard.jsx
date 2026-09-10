import React, { useState, useEffect } from 'react';
import { getReports, updateReportStatus } from '../api/floodApi';
import { ShieldCheck, AlertOctagon, CheckCircle2, Clock, FileText, Printer, Eye, Truck, Sparkles, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../components/LanguageSelector';
import SOSCommandPanel from '../components/SOSCommandPanel';
import DisasterImpactAnalytics from '../components/DisasterImpactAnalytics';
import EmergencyBroadcastWidget from '../components/EmergencyBroadcastWidget';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchIncidentReports = async () => {
    try {
      const res = await getReports();
      const data = res.data || res;
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      toast.error("Failed to load live incident queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentReports();
    const interval = setInterval(fetchIncidentReports, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, { status: newStatus });
      toast.success(`Report status updated to ${newStatus}`);
      fetchIncidentReports();
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update status");
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const filteredReports = filterStatus === 'ALL' 
    ? reports 
    : reports.filter(r => (r.status || 'Pending').toUpperCase() === filterStatus.toUpperCase());

  const pendingCount = reports.filter(r => (r.status || 'Pending') === 'Pending').length;
  const verifiedCount = reports.filter(r => r.status === 'Verified').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0f1e] p-4 sm:p-8 max-w-7xl mx-auto space-y-8 print:p-0 print:bg-white print:text-black">
      <Toaster position="top-right" toastOptions={{ style: { background: '#111827', color: '#fff', border: '1px solid #374151' } }} />

      {/* Header Bar */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 print:border-none print:shadow-none">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight print:text-black">
                {t('adminHeader')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {t('officialCommand')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 print:text-gray-600">
              {t('adminSubtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 print:hidden"
        >
          <Printer className="w-4 h-4" /> {t('exportPdf')}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3">
        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">{t('pendingReview')}</span>
            <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">{t('verifiedIncidents')}</span>
            <p className="text-2xl font-black text-blue-400">{verifiedCount}</p>
          </div>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">{t('resolvedHazards')}</span>
            <p className="text-2xl font-black text-emerald-400">{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* SOS Rescue Urgent Priority Queue */}
      <SOSCommandPanel />

      {/* Neighborhood Emergency Broadcast Dispatcher */}
      <EmergencyBroadcastWidget />

      {/* Disaster Impact & Economic Loss Analytics */}
      <DisasterImpactAnalytics />

      {/* Main Table Section */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> {t('queueTitle')}
          </h3>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 bg-[#0b1222] p-1 rounded-xl border border-slate-800 print:hidden">
            {['ALL', 'PENDING', 'VERIFIED', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterStatus === status 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t(`filter${status.charAt(0) + status.slice(1).toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <span className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
            Loading emergency report queue...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-semibold">
            No incident reports found matching filter "{filterStatus}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase font-extrabold bg-[#0b1222] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Category & Location</th>
                  <th className="px-4 py-3.5">Severity</th>
                  <th className="px-4 py-3.5">AI Vision Evaluation</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right print:hidden">Officer Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-4 space-y-1">
                      <span className="font-extrabold text-white block">{report.category}</span>
                      <p className="text-xs text-slate-400">{report.description}</p>
                      <span className="text-[10px] text-blue-400 font-semibold block">{report.location_name || 'Bengaluru'} • {new Date(report.timestamp).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase ${
                        report.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        report.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      {report.ai_hazard_analysis ? (
                        <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300">
                          <span className="font-bold flex items-center gap-1 text-[11px] text-blue-400"><Sparkles className="w-3 h-3" /> Gemini Vision</span>
                          {report.ai_hazard_analysis}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No image submitted</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        (report.status || 'Pending') === 'Verified' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        report.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {report.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2 print:hidden whitespace-nowrap">
                      {(report.status || 'Pending') === 'Pending' && (
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'Verified')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Verify
                        </button>
                      )}

                      {report.status === 'Verified' && (
                        <button
                          onClick={() => handleStatusUpdate(report.id, 'Resolved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                        </button>
                      )}

                      <button
                        onClick={() => toast.success(`Rescue team dispatched to location: ${report.location_name || 'Bengaluru'}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition inline-flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-400" /> Dispatch Team
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
