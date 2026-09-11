'use client';

import { useRouter } from 'next/navigation';
import ImpulseCalculator from '@/components/fintech/ImpulseCalculator';
import DemoPresetBar from '@/components/demo/DemoPresetBar';
import { Wallet, ShieldCheck, Lock, Sparkles } from 'lucide-react';

export default function FinancialFitPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20">
      <DemoPresetBar onSelectScenario={(scId) => router.push(`/product/${scId}`)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Wallet className="w-3.5 h-3.5" />
            <span>FinTech Discretionary Budgeting</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground">
            Personal Financial Fit Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Calibrate your monthly discretionary budget and savings goals. TrustCart dynamically aligns every product recommendation against your real purchasing power.
          </p>
        </div>

        {/* Privacy Callout */}
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3 text-xs text-slate-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-emerald-400">100% Client-Side Privacy Guarantee</p>
            <p className="text-[11px] text-slate-400">
              We never ask for bank accounts, UPI PINs, card numbers, or passwords. Your spending preferences are securely stored on your device.
            </p>
          </div>
        </div>

        {/* Impulse Calculator */}
        <ImpulseCalculator />
      </div>
    </div>
  );
}
