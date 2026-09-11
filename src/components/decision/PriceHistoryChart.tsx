'use client';

import { useState } from 'react';
import { PriceIntelligence } from '@/lib/types/trustcart';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface PriceHistoryChartProps {
  priceIntelligence: PriceIntelligence;
}

export default function PriceHistoryChart({ priceIntelligence }: PriceHistoryChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const {
    currentPrice,
    fairValueEstimate,
    historicalLow,
    historicalHigh,
    discountAuthenticity,
    priceHistory,
    priceInsight,
  } = priceIntelligence;

  const width = 600;
  const height = 220;
  const padding = 40;

  // Compute SVG coordinates
  const minPrice = Math.min(...priceHistory.map((p) => p.price), historicalLow) * 0.95;
  const maxPrice = Math.max(...priceHistory.map((p) => p.price), historicalHigh) * 1.05;

  const getX = (index: number) => {
    return padding + (index / (priceHistory.length - 1)) * (width - padding * 2);
  };

  const getY = (price: number) => {
    return height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2);
  };

  const pointsString = priceHistory
    .map((p, idx) => `${getX(idx)},${getY(p.price)}`)
    .join(' ');

  const fairValueY = getY(fairValueEstimate);

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-foreground">
              Price Intelligence & Trend
            </h3>
            {discountAuthenticity === 'REAL_DISCOUNT' ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Real Discount
              </span>
            ) : discountAuthenticity === 'INFLATED_MRP' ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-3 h-3" /> Deceptive Anchor / Inflated MRP
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Fair Market Value
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            12-month historical marketplace cycles with fair value baseline.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Hist. Low</span>
            <span className="font-mono font-bold text-emerald-400">{formatCurrency(historicalLow)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Fair Value</span>
            <span className="font-mono font-bold text-cyan-400">{formatCurrency(fairValueEstimate)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Current</span>
            <span className="font-mono font-black text-foreground">{formatCurrency(currentPrice)}</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] overflow-visible"
        >
          {/* Fair Value Baseline (Dashed) */}
          <line
            x1={padding}
            y1={fairValueY}
            x2={width - padding}
            y2={fairValueY}
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text
            x={width - padding}
            y={fairValueY - 6}
            fill="#06b6d4"
            fontSize="10"
            textAnchor="end"
            fontWeight="bold"
          >
            Fair Value Baseline ({formatCurrency(fairValueEstimate)})
          </text>

          {/* Area under line */}
          <polygon
            points={`${pointsString} ${getX(priceHistory.length - 1)},${height - padding} ${getX(0)},${height - padding}`}
            fill="url(#priceGradient)"
            opacity="0.25"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Main Price Line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Interactive Data Points */}
          {priceHistory.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.price);
            const isHovered = hoveredPoint?.date === p.date;
            return (
              <g key={idx} onMouseEnter={() => setHoveredPoint(p)} onMouseLeave={() => setHoveredPoint(null)}>
                {p.isFestival && (
                  <circle cx={cx} cy={cy} r="8" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : p.isFestival ? 5 : 4}
                  fill={p.isFestival ? '#f59e0b' : '#10b981'}
                  stroke="#090d16"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                />
                {/* Month labels */}
                {idx % 2 === 0 && (
                  <text
                    x={cx}
                    y={height - 15}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {p.date.split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs font-semibold shadow-lg flex items-center gap-2 pointer-events-none">
            <span className="text-slate-300">{hoveredPoint.date}:</span>
            <span className="text-emerald-400 font-bold font-mono">{formatCurrency(hoveredPoint.price)}</span>
            {hoveredPoint.event && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                {hoveredPoint.event}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Insight footer */}
      <div className="p-3 rounded-2xl bg-surface-100/70 border border-white/5 text-xs text-slate-300 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p>{priceInsight}</p>
      </div>
    </div>
  );
}
