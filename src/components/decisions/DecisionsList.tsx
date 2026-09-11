'use client';

import { useState } from 'react';
import { useDecisionStore } from '@/lib/store/useDecisionStore';
import { formatCurrency } from '@/lib/utils';
import {
  History,
  Sparkles,
  TrendingUp,
  Clock,
  AlertOctagon,
  CheckCircle2,
  Trash2,
  Filter,
  Plus,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function DecisionsList() {
  const { decisions, removeDecision, stats, totalSavings } = useDecisionStore();
  const [filterType, setFilterType] = useState<'ALL' | 'WAITED' | 'AVOIDED' | 'BOUGHT'>('ALL');

  const filtered = decisions.filter((d) => {
    if (filterType === 'ALL') return true;
    return d.decisionType === filterType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Savings KPI Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Savings Ticker */}
        <div className="glass-panel rounded-3xl p-5 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Total Savings Unlocked</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            {formatCurrency(totalSavings)}
          </p>
          <span className="text-[10px] text-slate-400 block">
            Money kept in your wallet by thinking before spending
          </span>
        </div>

        {/* Waited */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Waited For Drop</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
            {stats.waitedCount}
          </p>
          <span className="text-[10px] text-slate-400 block">
            Patience rewards in upcoming sales
          </span>
        </div>

        {/* Avoided */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Scams / Traps Avoided</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
            {stats.avoidedCount}
          </p>
          <span className="text-[10px] text-slate-400 block">
            Counterfeits & inflated traps rejected
          </span>
        </div>

        {/* Bought */}
        <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Smart Buys Executed</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
            {stats.boughtCount}
          </p>
          <span className="text-[10px] text-slate-400 block">
            Verified all-time low acquisitions
          </span>
        </div>
      </div>

      {/* Decision Log Section */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-foreground">
              Recorded Decisions History ({filtered.length})
            </h3>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-100/80 border border-white/5 text-xs">
            {(['ALL', 'WAITED', 'AVOIDED', 'BOUGHT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  filterType === t
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Decisions List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item) => {
              let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              if (item.decisionType === 'WAITED') {
                badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
              } else if (item.decisionType === 'AVOIDED') {
                badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
              }

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-surface-100/60 hover:bg-surface-100/90 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-surface-300 overflow-hidden flex-shrink-0 border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {item.decisionType}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleDateString([], {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate max-w-sm">
                        {item.productTitle}
                      </h4>
                      {item.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Item Price</span>
                      <span className="font-mono font-bold text-slate-200 text-xs sm:text-sm">
                        {formatCurrency(item.productPrice)}
                      </span>
                    </div>

                    {item.calculatedSavings > 0 && (
                      <div className="text-right px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Savings
                        </span>
                        <span className="font-mono font-black text-emerald-400 text-xs sm:text-sm">
                          +{formatCurrency(item.calculatedSavings)}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => removeDecision(item.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <History className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
            <h4 className="text-sm font-bold text-slate-300">No decisions recorded in this view</h4>
            <p className="text-xs text-slate-400">
              Analyze products and log your decisions to start tracking your lifetime savings.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md transition-all mt-2"
            >
              <span>Analyze a Product Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
