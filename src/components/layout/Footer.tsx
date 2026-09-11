'use client';

import Link from 'next/link';
import { ShieldCheck, Lock, Heart, Award, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 dark:border-white/5 bg-surface-50/50 backdrop-blur-md pb-24 md:pb-8 pt-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight">
                TRUST<span className="gradient-text-emerald">CART</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              <strong>“TrustCart doesn&apos;t help you buy more. It helps you spend smarter.”</strong> An AI-powered consumer decision layer that intercepts impulsive purchases, detects deceptive discounts, and safeguards your personal financial health.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400/90 font-medium">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> 100% Non-Custodial FinTech Privacy
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Multimodal AI Decision Engine
              </span>
            </div>
          </div>

          {/* Decision Pillars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Trust Score Pillars
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>1. Product Quality Index</li>
              <li>2. Review Trust & Bot Detection</li>
              <li>3. Seller Reliability & Returns</li>
              <li>4. Price Value & Historical Fair Baseline</li>
              <li>5. FinTech Budget & Runway Fit</li>
              <li>6. Composite Decision Engine</li>
            </ul>
          </div>

          {/* Hackathon Badge & Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              iQOO Hackathon MVP
            </h4>
            <div className="p-3 rounded-xl bg-surface-100/70 border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <Award className="w-4 h-4" />
                <span>FinTech + Commerce Track</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Built to solve the online consumer regret crisis through real-time shopping intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} TRUSTCART AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for smarter consumer spending
          </p>
        </div>
      </div>
    </footer>
  );
}
