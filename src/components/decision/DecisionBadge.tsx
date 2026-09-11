'use client';

import { DecisionType } from '@/lib/types/trustcart';
import { getDecisionBadgeStyles } from '@/lib/utils';
import { ShieldCheck, Clock, AlertOctagon, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface DecisionBadgeProps {
  decision: DecisionType;
  confidence: number;
  summary: string;
  className?: string;
}

export default function DecisionBadge({
  decision,
  confidence,
  summary,
  className = '',
}: DecisionBadgeProps) {
  const styles = getDecisionBadgeStyles(decision);

  const getIcon = () => {
    switch (decision) {
      case 'BUY':
        return <CheckCircle2 className="w-8 h-8 text-emerald-400 stroke-[2.5]" />;
      case 'WAIT':
        return <Clock className="w-8 h-8 text-amber-400 stroke-[2.5] animate-spin-slow" />;
      case 'AVOID':
        return <AlertOctagon className="w-8 h-8 text-rose-400 stroke-[2.5] animate-bounce" />;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 border ${styles.border} ${styles.bg} ${styles.glow} backdrop-blur-xl ${className}`}
    >
      {/* Background glow orb */}
      <div
        className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${
          decision === 'BUY'
            ? 'bg-emerald-500'
            : decision === 'WAIT'
            ? 'bg-amber-500'
            : 'bg-rose-500'
        }`}
      />

      <div className="relative z-10 space-y-4">
        {/* Header bar: Badge + Confidence */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-slate-400">
                  AI DECISION ENGINE
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  {confidence}% Confidence
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${styles.text}`}>
                {styles.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-300">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Multi-Pillar Verified</span>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed bg-black/20 p-3.5 rounded-2xl border border-white/5">
          {summary}
        </p>
      </div>
    </div>
  );
}
