'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/types/trustcart';
import { DEMO_ANALYSES } from '@/lib/data/demoProducts';
import { formatCurrency, getScoreColor } from '@/lib/utils';
import { Scale, Trophy, CheckCircle2, ArrowRight, ShieldCheck, DollarSign, Star, Store, Wallet } from 'lucide-react';

interface CompareViewProps {
  initialItemA?: AnalysisResult;
  initialItemB?: AnalysisResult;
  onSelectProduct?: (productId: string) => void;
}

export default function CompareView({
  initialItemA,
  initialItemB,
  onSelectProduct,
}: CompareViewProps) {
  const [itemA, setItemA] = useState<AnalysisResult>(
    initialItemA || DEMO_ANALYSES['apex-pro-phone']
  );
  const [itemB, setItemB] = useState<AnalysisResult>(
    initialItemB || DEMO_ANALYSES['quantum-x9-phone']
  );

  const priceDiff = itemA.product.currentPrice - itemB.product.currentPrice;
  const trustDiff = itemA.scores.overall - itemB.scores.overall;

  const getWinner = () => {
    if (itemB.scores.overall >= itemA.scores.overall && priceDiff > 0) {
      return {
        product: itemB,
        title: itemB.product.title,
        reason: `Saves ${formatCurrency(Math.abs(priceDiff))} with equal or higher Trust Score (${itemB.scores.overall}/100 vs ${itemA.scores.overall}/100).`,
      };
    }
    if (itemA.scores.overall > itemB.scores.overall && priceDiff <= 0) {
      return {
        product: itemA,
        title: itemA.product.title,
        reason: `Highest composite Trust Score (${itemA.scores.overall}/100) at lowest price.`,
      };
    }
    return {
      product: itemB,
      title: itemB.product.title,
      reason: `Best overall price-to-trust value ratio in current market cycle.`,
    };
  };

  const winner = getWinner();

  const comparisonMetrics = [
    {
      label: 'Decision Verdict',
      valA: itemA.decision,
      valB: itemB.decision,
      highlightA: itemA.decision === 'BUY' ? 'text-emerald-400' : 'text-amber-400',
      highlightB: itemB.decision === 'BUY' ? 'text-emerald-400' : 'text-amber-400',
    },
    {
      label: 'Current Price',
      valA: formatCurrency(itemA.product.currentPrice),
      valB: formatCurrency(itemB.product.currentPrice),
      better: priceDiff > 0 ? 'B' : 'A',
    },
    {
      label: 'Overall Trust Score',
      valA: `${itemA.scores.overall}/100`,
      valB: `${itemB.scores.overall}/100`,
      better: trustDiff > 0 ? 'A' : 'B',
    },
    {
      label: 'Product Quality Index',
      valA: `${itemA.scores.productQuality}/100`,
      valB: `${itemB.scores.productQuality}/100`,
      better: itemA.scores.productQuality >= itemB.scores.productQuality ? 'A' : 'B',
    },
    {
      label: 'Review Authenticity',
      valA: `${itemA.scores.reviewTrust}/100`,
      valB: `${itemB.scores.reviewTrust}/100`,
      better: itemA.scores.reviewTrust >= itemB.scores.reviewTrust ? 'A' : 'B',
    },
    {
      label: 'Price Fair-Value Index',
      valA: `${itemA.scores.priceValue}/100`,
      valB: `${itemB.scores.priceValue}/100`,
      better: itemA.scores.priceValue >= itemB.scores.priceValue ? 'A' : 'B',
    },
    {
      label: 'FinTech Budget Fit',
      valA: `${itemA.scores.financialFit}/100`,
      valB: `${itemB.scores.financialFit}/100`,
      better: itemA.scores.financialFit >= itemB.scores.financialFit ? 'A' : 'B',
    },
    {
      label: 'Seller Rating',
      valA: `${itemA.product.sellerRating}★ (${itemA.product.sellerName})`,
      valB: `${itemB.product.sellerRating}★ (${itemB.product.sellerName})`,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Winner Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
              AI COMPARISON VERDICT
            </span>
            <h3 className="text-lg sm:text-xl font-black text-foreground">
              Winner: {winner.title}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              {winner.reason}
            </p>
          </div>
        </div>

        {onSelectProduct && (
          <button
            onClick={() => onSelectProduct(winner.product.product.id)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-all self-end sm:self-auto"
          >
            <span>Analyze Winner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Side by Side Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
        {/* Product Cards Header */}
        <div className="grid grid-cols-2 gap-4">
          {/* Product A */}
          <div className="p-4 rounded-2xl bg-surface-100/70 border border-white/5 space-y-3">
            <div className="aspect-video rounded-xl bg-surface-300 overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={itemA.product.imageUrl}
                alt={itemA.product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Option A</span>
              <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2">
                {itemA.product.title}
              </h4>
              <p className="text-base sm:text-lg font-mono font-black text-emerald-400 mt-1">
                {formatCurrency(itemA.product.currentPrice)}
              </p>
            </div>
          </div>

          {/* Product B */}
          <div className="p-4 rounded-2xl bg-surface-100/70 border border-emerald-500/20 space-y-3">
            <div className="aspect-video rounded-xl bg-surface-300 overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={itemB.product.imageUrl}
                alt={itemB.product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Option B (Smart Match)</span>
              <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2">
                {itemB.product.title}
              </h4>
              <p className="text-base sm:text-lg font-mono font-black text-cyan-400 mt-1">
                {formatCurrency(itemB.product.currentPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Metric Rows */}
        <div className="space-y-2">
          {comparisonMetrics.map((row, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-surface-100/40 hover:bg-surface-100/80 transition-colors grid grid-cols-3 items-center text-xs gap-2"
            >
              <div
                className={`font-semibold ${
                  row.better === 'A' ? 'text-emerald-400 font-bold' : row.highlightA || 'text-slate-300'
                }`}
              >
                {row.valA}
              </div>

              <div className="text-center font-bold text-slate-400 text-[11px] uppercase tracking-wider">
                {row.label}
              </div>

              <div
                className={`text-right font-semibold ${
                  row.better === 'B' ? 'text-emerald-400 font-bold' : row.highlightB || 'text-slate-300'
                }`}
              >
                {row.valB}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
