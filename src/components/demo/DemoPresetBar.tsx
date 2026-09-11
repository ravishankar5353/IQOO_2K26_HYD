'use client';

import { DEMO_SCENARIOS } from '@/lib/data/demoProducts';
import { Sparkles, ArrowRight } from 'lucide-react';

interface DemoPresetBarProps {
  onSelectScenario: (scenarioId: string) => void;
  activeScenarioId?: string;
}

export default function DemoPresetBar({ onSelectScenario, activeScenarioId }: DemoPresetBarProps) {
  return (
    <div className="w-full bg-surface-100/90 border-y border-white/10 dark:border-white/5 py-3 px-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Label */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>JUDGE PRESETS</span>
          </div>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            Test live decision scenarios without manual entry:
          </span>
        </div>

        {/* 3 Scenario Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {DEMO_SCENARIOS.map((sc) => {
            const isSelected = activeScenarioId === sc.initialProductId;
            let badgeClass = 'border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20';
            if (sc.scenarioType === 'BUY') {
              badgeClass = 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20';
            } else if (sc.scenarioType === 'AVOID') {
              badgeClass = 'border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20';
            }

            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc.initialProductId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all transform active:scale-95 ${badgeClass} ${
                  isSelected ? 'ring-2 ring-emerald-400 shadow-md' : 'opacity-90'
                }`}
              >
                <span className="font-extrabold">{sc.badgeLabel}</span>
                <span className="text-slate-400 text-[11px] hidden lg:inline">
                  {sc.title.substring(0, 20)}...
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-medium">
                  {sc.savingHighlight}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
