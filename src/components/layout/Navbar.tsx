'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Sparkles, Scale, History, Wallet, PlayCircle, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useDecisionStore } from '@/lib/store/useDecisionStore';
import { formatCurrency } from '@/lib/utils';

interface NavbarProps {
  onOpenDemoTour?: () => void;
}

export default function Navbar({ onOpenDemoTour }: NavbarProps) {
  const pathname = usePathname();
  const { totalSavings, stats } = useDecisionStore();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/analyze', label: 'Analyze', icon: Zap },
    { href: '/compare', label: 'Compare', icon: Scale },
    { href: '/decisions', label: 'My Decisions', icon: History },
    { href: '/financial-fit', label: 'Financial Fit', icon: Wallet },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 dark:border-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                TRUST<span className="gradient-text-emerald">CART</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight hidden sm:block">
              Think Before You Spend
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Savings Counter Pill */}
          <Link
            href="/decisions"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            title="Total potential savings unlocked by thinking before spending"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Saved: {formatCurrency(totalSavings || 24500)}</span>
          </Link>

          {/* 2-Minute Judge Demo Button */}
          {onOpenDemoTour && (
            <button
              onClick={onOpenDemoTour}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs tracking-tight shadow-md hover:shadow-amber-500/25 transition-all transform active:scale-95"
            >
              <PlayCircle className="w-4 h-4 fill-slate-950 text-amber-500" />
              <span>2-Min Demo</span>
            </button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
