import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DecisionType } from './types/trustcart';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDecisionBadgeStyles(decision: DecisionType): {
  bg: string;
  text: string;
  border: string;
  glow: string;
  icon: string;
  label: string;
} {
  switch (decision) {
    case 'BUY':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-500 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
        icon: '🟢',
        label: 'BUY NOW',
      };
    case 'WAIT':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-500 dark:text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
        icon: '🟡',
        label: 'WAIT FOR DROP',
      };
    case 'AVOID':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-500 dark:text-rose-400',
        border: 'border-rose-500/30',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.35)]',
        icon: '🔴',
        label: 'AVOID PURCHASE',
      };
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // emerald
  if (score >= 60) return '#06b6d4'; // cyan
  if (score >= 40) return '#f59e0b'; // amber
  return '#ef4444'; // rose
}

export function getScoreBgColorClass(score: number): string {
  if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (score >= 60) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
  if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
}

export function getScoreRatingText(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Moderate';
  if (score >= 35) return 'Questionable';
  return 'High Risk';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
