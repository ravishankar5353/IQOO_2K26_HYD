'use client';

import { useEffect, useState } from 'react';
import { getScoreColor, getScoreRatingText } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface TrustScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export default function TrustScoreGauge({
  score,
  label = 'Overall Trust Score',
  size = 180,
  strokeWidth = 14,
}: TrustScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);
  const ratingText = getScoreRatingText(score);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Circle Gauge */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-surface-300/40"
          />
          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 10px ${color}80)`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color }} />
            <span>TRUST</span>
          </div>
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground font-mono">
            {animatedScore}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 border"
            style={{
              color: color,
              borderColor: `${color}40`,
              backgroundColor: `${color}15`,
            }}
          >
            {ratingText}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-slate-300">
        {label}
      </p>
    </div>
  );
}
