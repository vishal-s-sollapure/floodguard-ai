import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      toast.success(`Welcome back, ${res.user.full_name}!`);
      if (res.user.role === 'officer') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(res.error);
    }
  };

  const loginDemo = async (role) => {
    setLoading(true);
    const demoEmail = role === 'officer' ? 'officer@floodguard.ai' : 'citizen@floodguard.ai';
    const demoPassword = 'password123';
    const res = await login(demoEmail, demoPassword);
    setLoading(false);
    if (res.success) {
      toast.success(`Logged in as Demo ${role === 'officer' ? 'Response Officer' : 'Citizen'}`);
      if (role === 'officer') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0f1e] p-4 sm:p-8 flex items-center justify-center">
      <Toaster position="top-right" toastOptions={{ style: { background: '#111827', color: '#fff', border: '1px solid #374151' } }} />
      
      <div className="max-w-md w-full bg-[#111827] border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">FloodGuard Portal Login</h2>
          <p className="text-xs text-slate-400">Access emergency command tools or community report portal</p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="bg-[#0b1222] p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Demo Access</span>
            <span className="text-[10px] text-emerald-400">Hackathon Ready</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => loginDemo('citizen')}
              disabled={loading}
              className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-blue-400" /> Citizen View
            </button>
            <button
              onClick={() => loginDemo('officer')}
              disabled={loading}
              className="py-2.5 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-xs font-bold text-blue-300 border border-blue-500/30 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Officer Portal
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@floodguard.ai"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Authenticating..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
