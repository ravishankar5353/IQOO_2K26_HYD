'use client';

import { SellerIntelligence } from '@/lib/types/trustcart';
import { Store, ShieldCheck, AlertTriangle, CheckCircle2, Clock, RotateCcw } from 'lucide-react';

interface SellerTrustCardProps {
  sellerIntelligence: SellerIntelligence;
}

export default function SellerTrustCard({ sellerIntelligence }: SellerTrustCardProps) {
  const {
    name,
    rating,
    totalRatings,
    fulfillmentScore,
    returnPolicyTransparency,
    businessAgeMonths,
    riskFlags,
    badges,
    sellerSummary,
  } = sellerIntelligence;

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-foreground">
              {name}
            </h3>
            <p className="text-xs text-slate-400">
              {rating}★ Rating • {totalRatings.toLocaleString('en-IN')} ratings
            </p>
          </div>
        </div>

        {/* Return Policy Badge */}
        <div>
          {returnPolicyTransparency === 'EXCELLENT' ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <RotateCcw className="w-3.5 h-3.5" /> 7–10 Day Easy Return
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" /> Restrictive Return Terms
            </span>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-surface-100/70 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Fulfillment Score</span>
          <p className="text-base font-black font-mono text-emerald-400">{fulfillmentScore}%</p>
          <span className="text-[10px] text-slate-400">On-time shipping</span>
        </div>

        <div className="p-3 rounded-2xl bg-surface-100/70 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> Store Age
          </span>
          <p className="text-base font-black font-mono text-cyan-400">{businessAgeMonths} Months</p>
          <span className="text-[10px] text-slate-400">Active marketplace history</span>
        </div>

        <div className="p-3 rounded-2xl bg-surface-100/70 border border-white/5 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Risk Assessment</span>
          <p
            className={`text-base font-black ${
              riskFlags.length > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {riskFlags.length > 0 ? 'Elevated Risk' : 'Verified Safe'}
          </p>
          <span className="text-[10px] text-slate-400">Dispute & cancellation check</span>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {badges.map((b, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-white/5 text-slate-300 border border-white/10"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {b}
            </span>
          ))}
        </div>
      )}

      {/* Risk flags alert */}
      {riskFlags.length > 0 && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Seller Warnings:
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            {riskFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed bg-surface-100/40 p-3 rounded-xl">
        {sellerSummary}
      </p>
    </div>
  );
}
