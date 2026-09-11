'use client';

import { DecisionType } from '@/lib/types/trustcart';
import { CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface RiskFactorListProps {
  decision: DecisionType;
  keyReasons: string[];
  riskFactors: string[];
}

export default function RiskFactorList({
  decision,
  keyReasons,
  riskFactors,
}: RiskFactorListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Key Reasons Box */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              decision === 'BUY'
                ? 'bg-emerald-400'
                : decision === 'WAIT'
                ? 'bg-amber-400'
                : 'bg-rose-400'
            }`}
          />
          <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
            Why TrustCart Recommends This ({decision})
          </h3>
        </div>

        <ul className="space-y-2.5">
          {keyReasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <CheckCircle2
                className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  decision === 'BUY'
                    ? 'text-emerald-400'
                    : decision === 'WAIT'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Factors Box */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
            Identified Risks & Buyer Alerts
          </h3>
        </div>

        {riskFactors && riskFactors.length > 0 ? (
          <ul className="space-y-2.5">
            {riskFactors.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400 italic py-2">
            No critical risk anomalies identified by our multi-vector safety checks.
          </p>
        )}
      </div>
    </div>
  );
}
