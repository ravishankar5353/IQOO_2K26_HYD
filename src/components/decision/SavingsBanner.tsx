'use client';

import { useState } from 'react';
import { Sparkles, Bell, Check, Calendar, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SavingsBannerProps {
  savingsAmount: number;
  festivalDays?: number;
  onViewAlternative?: () => void;
  productTitle: string;
}

export default function SavingsBanner({
  savingsAmount,
  festivalDays = 11,
  onViewAlternative,
  productTitle,
}: SavingsBannerProps) {
  const [alertSet, setAlertSet] = useState(false);

  if (!savingsAmount || savingsAmount <= 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-cyan-500/15 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-black border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              FINANCIAL BENEFIT DETECTED
            </span>
            {festivalDays && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Sale in ~{festivalDays} days
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground">
            Save <span className="gradient-text-gold">{formatCurrency(savingsAmount)}</span> by waiting for the price cycle
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Historical pricing algorithms forecast a price drop to verified benchmark low during the upcoming festive clearance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setAlertSet(!alertSet)}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
              alertSet
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-surface-200/80 hover:bg-surface-300 text-foreground border-white/10'
            }`}
          >
            {alertSet ? (
              <>
                <Check className="w-4 h-4" />
                <span>Alert Scheduled</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Set Price Alert</span>
              </>
            )}
          </button>

          {onViewAlternative && (
            <button
              onClick={onViewAlternative}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1 transition-all"
            >
              <span>See Cheaper Option</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
