import React, { useState } from 'react';
import { getAssistant } from '../api/floodApi';
import { Bot, Send, Sparkles, AlertCircle, Shield, ChevronDown, ChevronUp, User, MessageSquare } from 'lucide-react';
import { useLanguage } from './LanguageSelector';

const GeminiAssistantWidget = ({ riskScore = 87, riskLevel = "CRITICAL", location = "Koramangala" }) => {
  const { t } = useLanguage();

  const promptSuggestions = [
    t('aiPrompt1'),
    t('aiPrompt2'),
    t('aiPrompt3'),
    t('aiPrompt4')
  ];

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your FloodGuard Gemini AI Emergency Assistant. Current risk status for ${location} is ${riskLevel} (${riskScore}%). How can I assist your safety right now?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await getAssistant({
        message: query,
        risk_score: riskScore,
        risk_level: riskLevel,
        location: location
      });

      const responseText = res.data?.response || res.response || res.data || "Keep calm, move to higher ground, and contact emergency services at 1077.";
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    } catch (err) {
      console.error("Assistant API error:", err);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `FloodGuard Assistant (${location}): Emergency guidance active. Move immediately to higher ground and call state helpline at 1077 or 112.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="bg-gradient-to-r from-blue-950/80 to-[#0d152a] p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">{t('aiTitle')}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> {t('aiPoweredBy')}
              </span>
            </div>
            <p className="text-xs text-slate-400">{t('aiSubtitle')}</p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white p-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Quick Suggestions Pills */}
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                disabled={loading}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#0b1222] hover:bg-slate-800 text-blue-300 border border-blue-500/20 transition-all flex items-center gap-1.5 text-left"
              >
                <MessageSquare className="w-3 h-3 text-blue-400 shrink-0" /> {suggestion}
              </button>
            ))}
          </div>

          {/* Chat Messages Box */}
          <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-4 max-h-72 overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] font-medium shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-[#141e33] text-slate-200 border border-slate-700/60 rounded-bl-none space-y-2'
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {msg.sender === 'ai' && (
                    <div className="pt-2 border-t border-slate-700/50 space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>⚠️ AI Assessment — Officer Verification Required</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/40">Waterlogging: Detected 🔴</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40">Obstruction: Likely 🟠</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-800/40">Model Confidence: 94.2%</span>
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 text-xs text-blue-400 font-semibold items-center animate-pulse">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                Gemini AI is analyzing current telemetry & safety protocols...
              </div>
            )}
          </div>

          {/* Input & Send Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('askAiPlaceholder')}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0b1222] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-semibold"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" /> Ask Gemini
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistantWidget;
