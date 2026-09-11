'use client';

import { useRouter } from 'next/navigation';
import DecisionsList from '@/components/decisions/DecisionsList';
import DemoPresetBar from '@/components/demo/DemoPresetBar';
import { History, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DecisionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20">
      <DemoPresetBar onSelectScenario={(scId) => router.push(`/product/${scId}`)} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Personal Savings Portfolio</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground">
              My Shopping Decisions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Measure your impulse control and real money saved across past purchase evaluations.
            </p>
          </div>

          <Link
            href="/analyze"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Analyze New Product</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Decisions List View */}
        <DecisionsList />
      </div>
    </div>
  );
}
