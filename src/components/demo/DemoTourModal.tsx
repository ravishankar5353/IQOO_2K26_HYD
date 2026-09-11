'use client';

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Scale, MessageSquare, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProduct: (productId: string) => void;
  onOpenCopilot: (question?: string) => void;
  onOpenCompare: () => void;
}

export default function DemoTourModal({
  isOpen,
  onClose,
  onNavigateToProduct,
  onOpenCopilot,
  onOpenCompare,
}: DemoTourModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      badge: 'PROBLEM & INGESTION',
      title: 'Intercepting the Impulsive Checkout Trap',
      description: 'Online shoppers are bombarded by inflated MRPs, fake discount countdowns, and deceptive bot reviews. TrustCart acts as an autonomous AI Decision Layer between discovery and checkout.',
      icon: ShieldAlert,
      iconColor: 'text-amber-400',
      actionLabel: 'Analyze Flagship Phone (₹49,999)',
      action: () => {
        onNavigateToProduct('apex-pro-phone');
        setCurrentStep(1);
      },
    },
    {
      step: 2,
      badge: 'AI MULTI-PILLAR MATRIX',
      title: 'AI Scores 6 Pillars & Issues WAIT Verdict',
      description: 'While the hardware specs are good (92/100), TrustCart flags high price timing risk (56/100). The Grand Autumn Electronics Sale starts in 11 days where this item drops to ₹44,999.',
      highlight: 'Decision: 🟡 WAIT FOR DROP • ₹5,000 Potential Savings',
      icon: Sparkles,
      iconColor: 'text-amber-400',
      actionLabel: 'Ask Copilot "Why should I wait?"',
      action: () => {
        onOpenCopilot('Why should I wait to buy this smartphone?');
        setCurrentStep(2);
      },
    },
    {
      step: 3,
      badge: 'COPILOT INTELLIGENCE',
      title: 'Contextual AI Explains the Financial Math',
      description: 'TrustCart Copilot instantly breaks down historical price drops, discount authenticity, and monthly budget cashflow runway so you never make uncalculated purchases.',
      icon: MessageSquare,
      iconColor: 'text-cyan-400',
      actionLabel: 'Show Smart Alternative (₹42,999)',
      action: () => {
        onNavigateToProduct('quantum-x9-phone');
        setCurrentStep(3);
      },
    },
    {
      step: 4,
      badge: 'SMART ALTERNATIVES & COMPARE',
      title: 'Instant Better Alternative with 94 Trust Score',
      description: 'Instead of waiting or overpaying, TrustCart immediately identifies the Quantum X9 Pro with matching Snapdragon 8 Gen 3 specs at ₹42,999 (saving ₹7,000 today with verified 94/100 Trust).',
      icon: Scale,
      iconColor: 'text-emerald-400',
      actionLabel: 'Compare Both Products Side-by-Side',
      action: () => {
        onOpenCompare();
        setCurrentStep(4);
      },
    },
    {
      step: 5,
      badge: 'THE FINTECH + COMMERCE MANIFESTO',
      title: '“Think Before You Spend”',
      description: 'TrustCart doesn’t help you buy more. It helps you spend smarter. By combining multi-modal AI intelligence, price cycle forecasting, review fraud detection, and personal cashflow budgeting, consumers protect their wealth on every purchase.',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      actionLabel: 'Explore TrustCart AI Studio',
      action: () => {
        onClose();
        setCurrentStep(0);
      },
    },
  ];

  const active = steps[currentStep];
  const IconComponent = active.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              HACKATHON DEMO TOUR
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Step {active.step} of 5
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator dots */}
        <div className="flex items-center gap-2 my-5">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all ${
                idx === currentStep
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : idx < currentStep
                  ? 'bg-emerald-500/40'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Content Box */}
        <div className="space-y-4 my-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-200/80 border border-white/10 flex items-center justify-center flex-shrink-0">
              <IconComponent className={`w-6 h-6 ${active.iconColor}`} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                {active.badge}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                {active.title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {active.description}
          </p>

          {active.highlight && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              {active.highlight}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            onClick={active.action}
            className="flex-1 max-w-xs px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-tight shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <span>{active.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
