'use client';

import { TrustScores } from '@/lib/types/trustcart';
import { getScoreColor, getScoreBgColorClass } from '@/lib/utils';
import { Shield, Star, Store, DollarSign, Wallet, CheckSquare, Info } from 'lucide-react';

interface ScoreMatrixProps {
  scores: TrustScores;
}

export default function ScoreMatrix({ scores }: ScoreMatrixProps) {
  const pillars = [
    {
      key: 'productQuality',
      label: 'Product Quality',
      score: scores.productQuality,
      icon: Shield,
      desc: 'Hardware spec integrity & failure rate indicators',
    },
    {
      key: 'reviewTrust',
      label: 'Review Authenticity',
      score: scores.reviewTrust,
      icon: Star,
      desc: 'Linguistic anomaly & bot repetition filter',
    },
    {
      key: 'sellerTrust',
      label: 'Seller Reliability',
      score: scores.sellerTrust,
      icon: Store,
      desc: 'Fulfillment accuracy & return policy honesty',
    },
    {
      key: 'priceValue',
      label: 'Price Fair Value',
      score: scores.priceValue,
      icon: DollarSign,
      desc: 'Historical price low & upcoming sale cycle risk',
    },
    {
      key: 'financialFit',
      label: 'Financial Fit',
      score: scores.financialFit,
      icon: Wallet,
      desc: 'Monthly cashflow runway & impulse factor',
    },
    {
      key: 'overall',
      label: 'Composite Trust',
      score: scores.overall,
      icon: CheckSquare,
      desc: 'Weighted multi-vector confidence aggregation',
    },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <span>6-Pillar Decision Matrix</span>
          </h3>
          <p className="text-xs text-slate-400">
            Multi-dimensional evaluation verifying authenticity, price, and personal finance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {pillars.map((p) => {
          const Icon = p.icon;
          const color = getScoreColor(p.score);
          const badgeClass = getScoreBgColorClass(p.score);

          return (
            <div
              key={p.key}
              className="p-3.5 rounded-2xl bg-surface-100/60 border border-white/5 hover:border-white/15 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}20`, color: color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {p.label}
                  </span>
                </div>
                <span
                  className={`text-xs font-mono font-black px-2 py-0.5 rounded-md border ${badgeClass}`}
                >
                  {p.score}/100
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-surface-300/40 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${p.score}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}80`,
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-tight">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
