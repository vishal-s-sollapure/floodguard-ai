import React from 'react';
import { NavLink } from 'react-router-dom';
import { Droplets, Activity, ShieldAlert, FileText, Home } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[#0b1329]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
      {/* Brand Logo */}
      <NavLink to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
          <Droplets className="w-6 h-6 text-white fill-blue-100" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            FloodGuard <span className="text-blue-500 font-black">AI</span>
          </span>
          <span className="block text-[10px] uppercase font-bold text-blue-400/80 tracking-wider -mt-1">
            Early Warning System
          </span>
        </div>
      </NavLink>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-1 bg-[#111c38]/70 p-1.5 rounded-xl border border-slate-800/60">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <Home className="w-4 h-4" /> Home
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <Activity className="w-4 h-4" /> Live Dashboard
        </NavLink>

        <NavLink
          to="/predict"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <ShieldAlert className="w-4 h-4" /> Risk Predictor
        </NavLink>

        <NavLink
          to="/report"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <FileText className="w-4 h-4" /> Report Incident
        </NavLink>
      </div>

      {/* Live Pulsing Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-xs font-bold text-red-400 tracking-wider">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          LIVE MONITORING
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
