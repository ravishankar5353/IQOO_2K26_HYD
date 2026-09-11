'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, Scale, History, Wallet } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/analyze', label: 'Analyze', icon: Scan, isSpecial: true },
    { href: '/compare', label: 'Compare', icon: Scale },
    { href: '/decisions', label: 'Decisions', icon: History },
    { href: '/financial-fit', label: 'FinFit', icon: Wallet },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 dark:border-white/5 pb- safe-area">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group"
                aria-label="Analyze or Scan Product"
              >
                <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/40 group-hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                  <Scan className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-0.5 tracking-tight">
                  Analyze
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 h-full py-1 transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight mt-1">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
