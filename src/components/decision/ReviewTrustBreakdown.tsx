'use client';

import { ReviewIntelligence } from '@/lib/types/trustcart';
import { ThumbsUp, ThumbsDown, AlertTriangle, ShieldCheck, Star, Bot } from 'lucide-react';

interface ReviewTrustBreakdownProps {
  reviewIntelligence: ReviewIntelligence;
}

export default function ReviewTrustBreakdown({ reviewIntelligence }: ReviewTrustBreakdownProps) {
  const {
    totalAnalyzed,
    suspiciousPercentage,
    sentimentBreakdown,
    patternsDetected,
    keyPositives,
    keyCriticisms,
    trustBadge,
    reviewSummary,
  } = reviewIntelligence;

  const isHighSuspicion = trustBadge === 'HIGH_SUSPICION';

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-foreground">
              Review Authenticity Intelligence
            </h3>
            {isHighSuspicion ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-3 h-3" /> Potentially Suspicious Pattern Detected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" /> High Linguistic Authenticity
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Linguistic repetition analysis across {totalAnalyzed.toLocaleString('en-IN')} buyer reviews.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-semibold">Anomaly Index</span>
          <span
            className={`font-mono font-black text-sm ${
              suspiciousPercentage > 25 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {suspiciousPercentage}% flagged
          </span>
        </div>
      </div>

      {/* Sentiment Distribution Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-300">
          <span>Sentiment Distribution</span>
          <span className="text-slate-400 text-[11px]">
            {sentimentBreakdown.positive}% Positive • {sentimentBreakdown.neutral}% Neutral • {sentimentBreakdown.negative}% Critical
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-surface-300/40 overflow-hidden flex">
          <div
            style={{ width: `${sentimentBreakdown.positive}%` }}
            className="bg-emerald-500 h-full"
            title={`Positive: ${sentimentBreakdown.positive}%`}
          />
          <div
            style={{ width: `${sentimentBreakdown.neutral}%` }}
            className="bg-slate-400 h-full"
            title={`Neutral: ${sentimentBreakdown.neutral}%`}
          />
          <div
            style={{ width: `${sentimentBreakdown.negative}%` }}
            className="bg-rose-500 h-full"
            title={`Critical: ${sentimentBreakdown.negative}%`}
          />
        </div>
      </div>

      {/* Pattern Alerts */}
      {patternsDetected && patternsDetected.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-surface-100/70 border border-white/5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Bot className="w-4 h-4" />
            <span>AI Pattern Detection Insights</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {patternsDetected.map((p, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Positives & Criticisms 2-column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Real Positives */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Verified Buyer Positives</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {keyPositives.length > 0 ? (
              keyPositives.map((pos, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">+</span>
                  <span>{pos}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No consistent positives verified.</li>
            )}
          </ul>
        </div>

        {/* Real Criticisms */}
        <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/15 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Buyer Criticisms & Caveats</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {keyCriticisms.length > 0 ? (
              keyCriticisms.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">-</span>
                  <span>{crit}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No widespread negative clusters reported.</li>
            )}
          </ul>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 italic">
        * Note: Review evaluations classify linguistic repetition anomalies and burst clusters. They indicate statistical confidence, not legal assertions.
      </p>
    </div>
  );
}
