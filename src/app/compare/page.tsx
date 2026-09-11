'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CompareView from '@/components/compare/CompareView';
import DemoPresetBar from '@/components/demo/DemoPresetBar';
import { useDecisionStore } from '@/lib/store/useDecisionStore';
import { DEMO_ANALYSES } from '@/lib/data/demoProducts';
import { Scale, ArrowLeft } from 'lucide-react';

export default function ComparePage() {
  const router = useRouter();
  const { comparisonItems } = useDecisionStore();

  const itemA = comparisonItems[0] || DEMO_ANALYSES['apex-pro-phone'];
  const itemB = comparisonItems[1] || DEMO_ANALYSES['quantum-x9-phone'];

  return (
    <div className="min-h-screen pb-20">
      <DemoPresetBar onSelectScenario={(scId) => router.push(`/product/${scId}`)} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Dual Product Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground">
              Compare Products Side-by-Side
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              AI cross-evaluates price value, review trust patterns, hardware specs, and budget fit.
            </p>
          </div>
        </div>

        {/* Comparison Component */}
        <CompareView
          initialItemA={itemA}
          initialItemB={itemB}
          onSelectProduct={(id) => router.push(`/product/${id}`)}
        />
      </div>
    </div>
  );
}
