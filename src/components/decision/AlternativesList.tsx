'use client';

import { Alternative } from '@/lib/types/trustcart';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, ArrowRight, Scale, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AlternativesListProps {
  alternatives: Alternative[];
  onAnalyzeAlternative: (altId: string) => void;
  onCompareAlternative: (alt: Alternative) => void;
}

export default function AlternativesList({
  alternatives,
  onAnalyzeAlternative,
  onCompareAlternative,
}: AlternativesListProps) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-foreground">
              Smart High-Value Alternatives
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-matched verified alternatives with higher trust scores or better price efficiency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alternatives.map((alt) => (
          <div
            key={alt.id}
            className="p-4 rounded-2xl bg-surface-100/60 hover:bg-surface-100/90 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="flex gap-3">
              {/* Product Image */}
              <div className="w-16 h-16 rounded-xl bg-surface-300 overflow-hidden flex-shrink-0 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={alt.imageUrl}
                  alt={alt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {alt.brand}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Trust: {alt.trustScore}/100
                  </span>
                </div>
                <h4 className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {alt.title}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-black font-mono text-emerald-400">
                    {formatCurrency(alt.price)}
                  </span>
                  {alt.originalPrice > alt.price && (
                    <span className="text-[11px] text-slate-500 line-through font-mono">
                      {formatCurrency(alt.originalPrice)}
                    </span>
                  )}
                  {alt.potentialSavings > 0 && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                      Save {formatCurrency(alt.potentialSavings)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Advantage Callout */}
            <p className="text-[11px] text-slate-300 bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{alt.keyAdvantage}</span>
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onAnalyzeAlternative(alt.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Analyze Alternative</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onCompareAlternative(alt)}
                className="py-2 px-3 rounded-xl bg-surface-200/80 hover:bg-surface-300 text-slate-200 border border-white/10 font-bold text-xs flex items-center gap-1 transition-all"
                title="Compare Side-by-Side"
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
