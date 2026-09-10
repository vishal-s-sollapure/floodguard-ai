import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Flame } from 'lucide-react';

const RiskBadge = ({ risk_level = 'LOW', size = 'medium' }) => {
  const levelUpper = (risk_level || 'LOW').toUpperCase();

  const styles = {
    LOW: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-500',
      icon: ShieldCheck,
      animate: ''
    },
    MODERATE: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      animate: ''
    },
    HIGH: {
      bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      dot: 'bg-orange-500',
      icon: AlertCircle,
      animate: ''
    },
    CRITICAL: {
      bg: 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse',
      dot: 'bg-red-500 animate-ping',
      icon: Flame,
      animate: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]'
    }
  };

  const current = styles[levelUpper] || styles.LOW;
  const IconComponent = current.icon;

  const sizeClasses = {
    small: 'px-2.5 py-1 text-xs gap-1.5',
    medium: 'px-3.5 py-1.5 text-sm gap-2',
    large: 'px-5 py-2.5 text-base gap-2.5 font-bold'
  };

  return (
    <span className={`inline-flex items-center font-bold tracking-wide rounded-full border ${current.bg} ${current.animate} ${sizeClasses[size]}`}>
      <span className="relative flex h-2 w-2">
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      <IconComponent className="w-4 h-4 shrink-0" />
      {levelUpper} RISK
    </span>
  );
};

export default RiskBadge;
