'use client';

import { useState } from 'react';
import { useDecisionStore } from '@/lib/store/useDecisionStore';
import { formatCurrency } from '@/lib/utils';
import { Wallet, ShieldCheck, TrendingUp, AlertTriangle, Sparkles, Sliders, ArrowRight } from 'lucide-react';

interface ImpulseCalculatorProps {
  currentProductPrice?: number;
  onBudgetUpdated?: () => void;
}

export default function ImpulseCalculator({ currentProductPrice = 49999 }: ImpulseCalculatorProps) {
  const { profile, updateProfile } = useDecisionStore();

  const [monthlyBudget, setMonthlyBudget] = useState(profile.monthlyBudget || 60000);
  const [currentSpent, setCurrentSpent] = useState(profile.currentSpentThisMonth || 22000);
  const [purchaseBudget, setPurchaseBudget] = useState(profile.defaultPurchaseBudget || 45000);
  const [savingsGoal, setSavingsGoal] = useState(profile.savingsGoal || 20000);
  const [isSaved, setIsSaved] = useState(false);

  const remainingMonthlyDiscretionary = Math.max(0, monthlyBudget - currentSpent);
  const budgetRatio = currentProductPrice / (purchaseBudget || 1);
  const budgetImpactPercent = Math.min(100, Math.round((currentProductPrice / (remainingMonthlyDiscretionary || 1)) * 100));

  let impulseRisk: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  let coolingPeriod = 'No delay required';

  if (budgetRatio > 1.2 || budgetImpactPercent > 80) {
    impulseRisk = 'HIGH';
    coolingPeriod = 'Recommend 72-Hour Cooling-off Delay';
  } else if (budgetRatio > 1.0 || budgetImpactPercent > 50) {
    impulseRisk = 'MODERATE';
    coolingPeriod = 'Recommend 24-Hour Cooling-off Window';
  }

  const handleSave = () => {
    updateProfile({
      monthlyBudget,
      currentSpentThisMonth: currentSpent,
      defaultPurchaseBudget: purchaseBudget,
      savingsGoal,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-emerald-500/30 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground">
              Personal FinTech & Budget Fit Engine
            </h3>
            <p className="text-xs text-slate-400">
              100% Private & Non-Custodial. Zero bank credentials or OTPs required.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-xl border ${
              impulseRisk === 'LOW'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : impulseRisk === 'MODERATE'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            Impulse Risk: {impulseRisk}
          </span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Monthly Discretionary */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Monthly Discretionary Budget</span>
            <span className="font-mono text-emerald-400">{formatCurrency(monthlyBudget)}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={200000}
            step={5000}
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Spent This Month */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Spent So Far This Month</span>
            <span className="font-mono text-cyan-400">{formatCurrency(currentSpent)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={monthlyBudget}
            step={2000}
            value={currentSpent}
            onChange={(e) => setCurrentSpent(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Purchase Item Budget */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Target Item Budget</span>
            <span className="font-mono text-amber-400">{formatCurrency(purchaseBudget)}</span>
          </div>
          <input
            type="range"
            min={1000}
            max={150000}
            step={2500}
            value={purchaseBudget}
            onChange={(e) => setPurchaseBudget(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Monthly Savings Target */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Target Monthly Savings Goal</span>
            <span className="font-mono text-violet-400">{formatCurrency(savingsGoal)}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={100000}
            step={5000}
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Real-time Spending Impact Card */}
      <div className="p-4 rounded-2xl bg-surface-100/80 border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-300">
            Cashflow Impact of This Purchase ({formatCurrency(currentProductPrice)})
          </span>
          <span className="text-amber-400">{budgetImpactPercent}% of remaining buffer</span>
        </div>

        <div className="w-full h-2 rounded-full bg-surface-300/40 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              budgetImpactPercent > 80
                ? 'bg-rose-500'
                : budgetImpactPercent > 50
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, budgetImpactPercent)}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
          <p className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{coolingPeriod}</span>
          </p>
          <span className="text-emerald-400 font-semibold">
            Unused buffer: {formatCurrency(Math.max(0, remainingMonthlyDiscretionary - currentProductPrice))}
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <span>{isSaved ? 'Preferences Saved!' : 'Save Financial Fit Profile'}</span>
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
