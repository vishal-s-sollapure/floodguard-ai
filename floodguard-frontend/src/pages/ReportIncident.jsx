import React, { useState } from 'react';
import { submitReport, analyzeReportImage } from '../api/floodApi';
import { MapPin, Navigation, Zap, Trees, AlertTriangle, Building2, LifeBuoy, Send, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const categories = [
  { id: 'Flooded Road', label: 'Flooded Road', icon: Navigation, desc: 'Road impassable or waterlogged' },
  { id: 'Blocked Drain', label: 'Blocked Drain', icon: AlertTriangle, desc: 'Overflowing storm drain or culvert' },
  { id: 'Fallen Tree', label: 'Fallen Tree', icon: Trees, desc: 'Tree blocking water flow or path' },
  { id: 'Electrical Danger', label: 'Electrical Danger', icon: Zap, desc: 'Exposed wire or submerged transformer' },
  { id: 'Infrastructure Damage', label: 'Infrastructure Damage', icon: Building2, desc: 'Bridge or wall structural risk' },
  { id: 'Person Needs Help', label: 'Person Needs Help', icon: LifeBuoy, desc: 'Stranded resident needing assistance' }
];

const ReportIncident = () => {
  const [category, setCategory] = useState('Flooded Road');
  const [description, setDescription] = useState('');
  const [locationLat, setLocationLat] = useState(12.9352);
  const [locationLng, setLocationLng] = useState(77.6245);
  const [severity, setSeverity] = useState('high');
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGeoDetect = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLat(parseFloat(pos.coords.latitude.toFixed(6)));
        setLocationLng(parseFloat(pos.coords.longitude.toFixed(6)));
        setDetectingLoc(false);
        toast.success(`Location detected: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        console.error('Geo error:', err);
        setDetectingLoc(false);
        toast.error('Failed to detect location automatically. Standard coordinates loaded.');
      },
      { timeout: 8000 }
    );
  };

  const [imageBase64, setImageBase64] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result;
      setImageBase64(base64Str);
      
      // Auto analyze image with Gemini AI Vision
      setAnalyzingImage(true);
      try {
        const res = await analyzeReportImage({ image_base64: base64Str, category });
        setAiAnalysis(res.data || res);
        toast.success("Gemini AI Vision analysis complete!");
      } catch (err) {
        console.error("AI image analysis error:", err);
      } finally {
        setAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please enter a brief description of the incident.');
      return;
    }

    setSubmitting(true);
    try {
      await submitReport({
        category,
        description,
        location_lat: locationLat,
        location_lng: locationLng,
        severity,
        image_base64: imageBase64,
        location_name: "Koramangala 4th Block"
      });

      toast.success('Incident report submitted successfully to emergency command!');
      setDescription('');
      setImageBase64(null);
      setAiAnalysis(null);
    } catch (err) {
      console.error('Report submission error:', err);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0f1e] p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#111827', color: '#fff', border: '1px solid #374151' } }} />

      {/* Header */}
      <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-amber-500" /> Community Incident Reporting
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Report hazards in your area to alert fellow citizens and prioritize emergency response teams.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111827] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        {/* Category Grid */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
            Select Hazard Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = category === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-[#0b1222] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{cat.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Selector */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
            Severity Level
          </label>
          <div className="grid grid-cols-4 gap-3">
            {['low', 'medium', 'high', 'critical'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSeverity(lvl)}
                className={`py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                  severity === lvl
                    ? lvl === 'critical' ? 'bg-red-600 text-white border-red-500' :
                      lvl === 'high' ? 'bg-orange-600 text-white border-orange-500' :
                      lvl === 'medium' ? 'bg-amber-600 text-white border-amber-500' :
                      'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-[#0b1222] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
            Incident Description & Landmarks
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the depth of water, specific cross-streets, or stranded vehicles..."
            required
            className="w-full px-4 py-3 rounded-xl bg-[#0b1222] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
          />
        </div>

        {/* Photo Upload & Gemini AI Vision Analysis */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Flood Photo & AI Hazard Analysis (Optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
          />

          {analyzingImage && (
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 animate-pulse">
              <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
              Gemini Vision AI is analyzing flood depth and hazards from photo...
            </div>
          )}

          {aiAnalysis && (
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between text-blue-400 font-bold border-b border-blue-900/50 pb-2">
                <span>Gemini AI Hazard Evaluation</span>
                <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-extrabold">{aiAnalysis.hazard_severity} RISK</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{aiAnalysis.ai_summary}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span>Depth: <strong className="text-white">{aiAnalysis.detected_depth}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="bg-[#0b1222] p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Location Coordinates
            </span>

            <button
              type="button"
              onClick={handleGeoDetect}
              disabled={detectingLoc}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-bold transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 ${detectingLoc ? 'animate-spin' : ''}`} />
              {detectingLoc ? 'Detecting...' : 'Auto-Detect GPS'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Latitude</span>
              <input
                type="number"
                step="0.000001"
                value={locationLat}
                onChange={(e) => setLocationLat(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#070c18] border border-slate-800 text-slate-200 text-xs font-mono"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Longitude</span>
              <input
                type="number"
                step="0.000001"
                value={locationLng}
                onChange={(e) => setLocationLng(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#070c18] border border-slate-800 text-slate-200 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-base shadow-xl shadow-red-600/20 hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            'Submitting Incident Report...'
          ) : (
            <>
              <Send className="w-5 h-5" /> Dispatch Community Report
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportIncident;
