'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Scan,
  TrendingDown,
  DollarSign,
  Bot,
  Zap,
  Scale,
  Award,
  Wallet,
  Lock,
} from 'lucide-react';
import DemoPresetBar from '@/components/demo/DemoPresetBar';
import DemoTourModal from '@/components/demo/DemoTourModal';
import { DEMO_SCENARIOS } from '@/lib/data/demoProducts';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  const handleSelectScenario = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1-Click Judge Demo Preset Bar */}
      <DemoPresetBar onSelectScenario={handleSelectScenario} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Hackathon Track Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10">
            <Award className="w-4 h-4 text-amber-400" />
            <span>iQOO Hackathon • FinTech + Commerce Track</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
              Think Before <br className="hidden sm:inline" />
              You <span className="gradient-text-emerald">Spend.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              <strong>“TrustCart doesn&apos;t help you buy more. It helps you spend smarter.”</strong>
              <br />
              The AI consumer decision layer between product discovery and checkout.
            </p>
          </div>

          {/* Primary Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/analyze"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base tracking-tight shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
            >
              <Scan className="w-5 h-5 stroke-[2.5]" />
              <span>Analyze a Product</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-surface-100/80 hover:bg-surface-200 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-extrabold text-sm sm:text-base tracking-tight shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2.5 transition-all"
            >
              <PlayCircle className="w-5 h-5 fill-amber-400 text-slate-950" />
              <span>Try Live 2-Min Demo</span>
            </button>
          </div>

          {/* Visual Decision Pipeline Flow Diagram */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                AUTONOMOUS SHOPPING DECISION FLOW
              </span>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-surface-100/70 border border-white/5 space-y-1 text-left">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                    <Scan className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Input</span>
                  <p className="text-xs font-black text-foreground">Camera / URL / Photo</p>
                </div>

                <div className="hidden md:flex justify-center text-slate-500">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-surface-100/70 border border-emerald-500/20 space-y-1 text-left">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Analysis</span>
                  <p className="text-xs font-black text-foreground">6-Pillar Trust Matrix</p>
                </div>

                <div className="hidden md:flex justify-center text-slate-500">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 space-y-1 text-left">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Verdict</span>
                  <p className="text-xs font-black text-foreground">BUY / WAIT / AVOID</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Live Demo Scenarios Section */}
      <section className="py-16 bg-surface-50/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              REAL-WORLD BENCHMARKS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground">
              3 Typical Shopping Pitfalls Solved by AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any scenario below to explore how TrustCart protects consumers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scenario 1: WAIT */}
            <div
              onClick={() => handleSelectScenario('apex-pro-phone')}
              className="glass-panel-interactive rounded-3xl p-6 border border-amber-500/30 cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black">
                  🟡 WAIT FOR DROP
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Save ₹5,000
                </span>
              </div>

              <div className="aspect-video rounded-2xl bg-surface-300 overflow-hidden border border-white/10 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=60"
                  alt="Apex Pro Smartphone"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-amber-400 transition-colors">
                  Apex Pro 5G Ultra Smartphone
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Inflated price trap: Festive sale starts in 11 days where this item drops by ₹5,000.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="font-mono font-black text-amber-400">₹49,999</span>
                <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Analyze Scenario <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Scenario 2: BUY */}
            <div
              onClick={() => handleSelectScenario('aurapulse-anc')}
              className="glass-panel-interactive rounded-3xl p-6 border border-emerald-500/30 cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black">
                  🟢 BUY NOW
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  52% Genuine Low
                </span>
              </div>

              <div className="aspect-video rounded-2xl bg-surface-300 overflow-hidden border border-white/10 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60"
                  alt="AuraPulse ANC"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                  AuraPulse Wireless ANC Headphones
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  True clearance discount verified against 365-day history and 98% positive official brand store.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="font-mono font-black text-emerald-400">₹11,999</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Analyze Scenario <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Scenario 3: AVOID */}
            <div
              onClick={() => handleSelectScenario('ultraturbo-ssd')}
              className="glass-panel-interactive rounded-3xl p-6 border border-rose-500/30 cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-black">
                  🔴 AVOID PURCHASE
                </span>
                <span className="text-xs font-mono font-bold text-rose-400">
                  Scam Capacity Alert
                </span>
              </div>

              <div className="aspect-video rounded-2xl bg-surface-300 overflow-hidden border border-white/10 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=60"
                  alt="UltraTurbo SSD"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-rose-400 transition-colors">
                  UltraTurbo 4TB Extreme Portable SSD
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Fake 95% discount on ₹1,499 &quot;4TB&quot; drive from an 18-day old seller with bot review repetition.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="font-mono font-black text-rose-400">₹1,499</span>
                <span className="text-rose-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Analyze Scenario <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Minute Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateToProduct={(productId) => router.push(`/product/${productId}`)}
        onOpenCopilot={() => router.push('/product/apex-pro-phone?copilot=true')}
        onOpenCompare={() => router.push('/compare')}
      />
    </div>
  );
}
