import React, { createContext, useContext, useState } from 'react';
import { Globe } from 'lucide-react';

const LanguageContext = createContext();

export const translations = {
  en: {
    home: 'Home',
    dashboard: 'Live Dashboard',
    predictor: 'Risk Predictor',
    report: 'Report Incident',
    officerPortal: 'Officer Portal',
    signIn: 'Sign In',
    liveMonitoring: 'LIVE MONITORING',
    criticalWarning: 'CRITICAL FLOOD WARNING: Move to higher ground immediately.',
    emergencyCall: 'Call 1077 or 112 for emergency rescue.'
  },
  kn: {
    home: 'ಮುಖ್ಯ ಪುಟ',
    dashboard: 'ಲೈವ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    predictor: 'ಅಪಾಯ ಮುನ್ಸೂಚನೆ',
    report: 'ಘಟನೆ ವರದಿ ಮಾಡಿ',
    officerPortal: 'ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    signIn: 'ಸೈನ್ ಇನ್',
    liveMonitoring: 'ಲೈವ್ ಮೇಲ್ವಿಚಾರಣೆ',
    criticalWarning: '🚨 ಪ್ರವಾಹದ ಅಪಾಯ ಹೆಚ್ಚಾಗಿದೆ. ತಕ್ಷಣವೇ ತಗ್ಗು ಪ್ರದೇಶಗಳಿಂದ ಸುರಕ್ಷಿತ ಎತ್ತರದ ಸ್ಥಳಗಳಿಗೆ ತೆರಳಿ.',
    emergencyCall: 'ತುರ್ತು ರಕ್ಷಣೆಗೆ 1077 ಅಥವಾ 112 ಗೆ ಕರೆ ಮಾಡಿ.'
  },
  hi: {
    home: 'होम',
    dashboard: 'लाइव डैशबोर्ड',
    predictor: 'जोखिम पूर्वाग्रह',
    report: 'घटना की रिपोर्ट करें',
    officerPortal: 'अधिकारी पोर्टल',
    signIn: 'साइन इन',
    liveMonitoring: 'लाइव निगरानी',
    criticalWarning: '🚨 गंभीर बाढ़ चेतावनी: तुरंत ऊंचे स्थानों पर जाएं। जलमग्न सड़कों से बचें।',
    emergencyCall: 'आपतकालीन सहायता के लिए 1077 या 112 डायल करें।'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

const LanguageSelector = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-[#0b1222] p-1 rounded-xl border border-slate-800 text-xs font-bold text-slate-300">
      <Globe className="w-3.5 h-3.5 text-blue-400 ml-1.5" />
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-lg transition ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => setLang('kn')}
        className={`px-2 py-1 rounded-lg transition ${lang === 'kn' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
      >
        🇮🇳 ಕನ್ನಡ
      </button>
      <button
        onClick={() => setLang('hi')}
        className={`px-2 py-1 rounded-lg transition ${lang === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
      >
        🇮🇳 हिंदी
      </button>
    </div>
  );
};

export default LanguageSelector;
