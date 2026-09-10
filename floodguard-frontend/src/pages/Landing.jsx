import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, FileText, ArrowRight, Zap, CloudRain, Cpu } from 'lucide-react';
import { useLanguage } from '../components/LanguageSelector';

const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#0a0f1e] via-[#0d1733] to-[#0a0f1e] flex flex-col justify-center items-center px-4 sm:px-6 overflow-hidden">
      {/* Animated Rain Background */}
      <div className="rain-container">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="drop animate-raindrop"
            style={{
              left: `${(i * 4) % 100}%`,
              animationDelay: `${(i * 0.15) % 2}s`,
              animationDuration: `${1.2 + (i % 5) * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl text-center space-y-8 py-12">
        {/* Subtitle pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm">
          <Zap className="w-4 h-4 text-blue-400" /> {t('heroBadge')}
        </div>

        {/* Hero Heading */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
          FloodGuard <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 bg-clip-text text-transparent">AI</span>
        </h1>

        {/* Slogan */}
        <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent tracking-wide">
          {t('heroTagline')}
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          {t('heroSubtitle')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Activity className="w-5 h-5" />
            {t('viewDashboardBtn')}
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/report"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111c38] hover:bg-[#162447] border border-slate-700 text-slate-200 hover:text-white font-bold text-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <FileText className="w-5 h-5 text-red-400" />
            {t('reportIncidentBtn')}
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('feat1Title')}</h3>
            <p className="text-sm text-slate-400">
              {t('feat1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('feat2Title')}</h3>
            <p className="text-sm text-slate-400">
              {t('feat2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827]/70 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('feat3Title')}</h3>
            <p className="text-sm text-slate-400">
              {t('feat3Desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
