'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DEMO_ANALYSES } from '@/lib/data/demoProducts';
import { AnalysisResult, DecisionType } from '@/lib/types/trustcart';
import { useDecisionStore } from '@/lib/store/useDecisionStore';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';

import DecisionBadge from '@/components/decision/DecisionBadge';
import TrustScoreGauge from '@/components/decision/TrustScoreGauge';
import ScoreMatrix from '@/components/decision/ScoreMatrix';
import SavingsBanner from '@/components/decision/SavingsBanner';
import RiskFactorList from '@/components/decision/RiskFactorList';
import PriceHistoryChart from '@/components/decision/PriceHistoryChart';
import ReviewTrustBreakdown from '@/components/decision/ReviewTrustBreakdown';
import SellerTrustCard from '@/components/decision/SellerTrustCard';
import AlternativesList from '@/components/decision/AlternativesList';
import CopilotDrawer from '@/components/copilot/CopilotDrawer';
import ImpulseCalculator from '@/components/fintech/ImpulseCalculator';
import DemoPresetBar from '@/components/demo/DemoPresetBar';

import {
  Sparkles,
  Bot,
  Scale,
  CheckCircle2,
  Clock,
  AlertOctagon,
  ArrowLeft,
} from 'lucide-react';

function ProductDecisionContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeAnalysis, setActiveAnalysis, addDecision, addToComparison } = useDecisionStore();

  const productId = (params.id as string) || 'apex-pro-phone';
  const [analysis, setAnalysis] = useState<AnalysisResult>(
    DEMO_ANALYSES[productId] || activeAnalysis || DEMO_ANALYSES['apex-pro-phone']
  );
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [initialCopilotQuestion, setInitialCopilotQuestion] = useState<string | undefined>();
  const [decisionLogged, setDecisionLogged] = useState<string | null>(null);

  useEffect(() => {
    if (productId && DEMO_ANALYSES[productId]) {
      setAnalysis(DEMO_ANALYSES[productId]);
      setActiveAnalysis(DEMO_ANALYSES[productId]);
    } else if (activeAnalysis) {
      setAnalysis(activeAnalysis);
    }
  }, [productId, activeAnalysis, setActiveAnalysis]);

  useEffect(() => {
    if (searchParams.get('copilot') === 'true') {
      setIsCopilotOpen(true);
      setInitialCopilotQuestion('Why should I wait on this product?');
    }
  }, [searchParams]);

  const handleLogDecision = (type: 'WAITED' | 'AVOIDED' | 'BOUGHT') => {
    const savings =
      type === 'WAITED'
        ? analysis.estimatedSavings || 5000
        : type === 'AVOIDED'
        ? analysis.product.currentPrice
        : analysis.estimatedSavings || 0;

    addDecision({
      productId: analysis.product.id,
      productTitle: analysis.product.title,
      productPrice: analysis.product.currentPrice,
      imageUrl: analysis.product.imageUrl,
      category: analysis.product.category,
      decisionType: type,
      calculatedSavings: savings,
      notes: `Recorded via TrustCart AI decision engine (${analysis.decision} verdict).`,
    });

    setDecisionLogged(type);

    if (type === 'WAITED' || type === 'AVOIDED' || type === 'BOUGHT') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setTimeout(() => setDecisionLogged(null), 3500);
  };

  const handleAnalyzeAlternative = (altId: string) => {
    if (DEMO_ANALYSES[altId]) {
      router.push(`/product/${altId}`);
    } else {
      router.push(`/product/quantum-x9-phone`);
    }
  };

  const handleCompareAlternative = (alt: any) => {
    addToComparison(analysis);
    const altAnalysis = DEMO_ANALYSES[alt.id] || DEMO_ANALYSES['quantum-x9-phone'];
    addToComparison(altAnalysis);
    router.push('/compare');
  };

  const handleSelectScenario = (scId: string) => {
    router.push(`/product/${scId}`);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* 1-Click Judge Demo Preset Bar */}
      <DemoPresetBar
        onSelectScenario={handleSelectScenario}
        activeScenarioId={analysis.product.id}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* Navigation back and Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.push('/analyze')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analyzer Studio</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                addToComparison(analysis);
                router.push('/compare');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/10 text-xs font-bold text-slate-200 transition-all"
            >
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add to Compare</span>
            </button>

            <button
              onClick={() => {
                setIsCopilotOpen(true);
                setInitialCopilotQuestion('Why should I wait or buy this?');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs shadow-md hover:shadow-emerald-500/20 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>

        {/* Product Overview Header Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Product Image */}
            <div className="md:col-span-4 aspect-square rounded-2xl bg-surface-300 overflow-hidden border border-white/10 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={analysis.product.imageUrl}
                alt={analysis.product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-200 text-[10px] font-bold border border-white/10">
                {analysis.product.category}
              </span>
            </div>

            {/* Product Info & Price */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                {analysis.product.brand}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground leading-tight">
                {analysis.product.title}
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                {analysis.product.description}
              </p>

              {/* Price Details */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                  {formatCurrency(analysis.product.currentPrice)}
                </span>
                {analysis.product.originalPrice > analysis.product.currentPrice && (
                  <span className="text-sm font-mono text-slate-500 line-through">
                    {formatCurrency(analysis.product.originalPrice)}
                  </span>
                )}
                {analysis.product.originalPrice > analysis.product.currentPrice && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {Math.round(
                      ((analysis.product.originalPrice - analysis.product.currentPrice) /
                        analysis.product.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                )}
              </div>

              {/* Seller snippet */}
              <div className="text-xs text-slate-400 pt-1">
                Sold by <span className="font-bold text-slate-200">{analysis.product.sellerName}</span> ({analysis.product.sellerRating}★)
              </div>
            </div>

            {/* Radial Animated Trust Score Gauge */}
            <div className="md:col-span-3 flex justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0">
              <TrustScoreGauge score={analysis.scores.overall} />
            </div>
          </div>
        </div>

        {/* Primary BUY / WAIT / AVOID Decision Badge */}
        <DecisionBadge
          decision={analysis.decision}
          confidence={analysis.confidence}
          summary={analysis.decisionSummary}
        />

        {/* Potential Savings Banner (if applicable) */}
        {analysis.estimatedSavings > 0 && (
          <SavingsBanner
            savingsAmount={analysis.estimatedSavings}
            festivalDays={analysis.priceIntelligence.festivalDropDays}
            productTitle={analysis.product.title}
            onViewAlternative={() => {
              if (analysis.alternatives[0]) {
                handleAnalyzeAlternative(analysis.alternatives[0].id);
              }
            }}
          />
        )}

        {/* 6-Pillar Decision Matrix */}
        <ScoreMatrix scores={analysis.scores} />

        {/* Why TrustCart Recommends This + Risk Breakdown */}
        <RiskFactorList
          decision={analysis.decision}
          keyReasons={analysis.keyReasons}
          riskFactors={analysis.riskFactors}
        />

        {/* Price History and Trend Analysis */}
        <PriceHistoryChart priceIntelligence={analysis.priceIntelligence} />

        {/* Review Authenticity Intelligence */}
        <ReviewTrustBreakdown reviewIntelligence={analysis.reviewIntelligence} />

        {/* Seller Trust & Transparency */}
        <SellerTrustCard sellerIntelligence={analysis.sellerIntelligence} />

        {/* Smart Alternatives */}
        <AlternativesList
          alternatives={analysis.alternatives}
          onAnalyzeAlternative={handleAnalyzeAlternative}
          onCompareAlternative={handleCompareAlternative}
        />

        {/* FinTech Financial Fit Engine */}
        <ImpulseCalculator currentProductPrice={analysis.product.currentPrice} />

        {/* Log Decision Action Bar */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                Track This Decision in Your Portfolio
              </h3>
              <p className="text-xs text-slate-400">
                Log your decision to record potential savings and measure impulse resistance over time.
              </p>
            </div>

            {decisionLogged && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-pulse">
                ✓ Recorded as {decisionLogged}! Savings updated.
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleLogDecision('WAITED')}
              className="py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Clock className="w-4 h-4" />
              <span>I Decided to WAIT (+₹{analysis.estimatedSavings.toLocaleString('en-IN')})</span>
            </button>

            <button
              onClick={() => handleLogDecision('AVOIDED')}
              className="py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>I Decided to AVOID</span>
            </button>

            <button
              onClick={() => handleLogDecision('BOUGHT')}
              className="py-3 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Bought Confidently</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating TrustCart Copilot Assistant Drawer */}
      <CopilotDrawer
        productContext={analysis}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialQuestion={initialCopilotQuestion}
        onNavigateToAlternative={handleAnalyzeAlternative}
      />

      {/* Floating Copilot Trigger Button (when closed) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs shadow-2xl shadow-emerald-500/40 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-5 h-5 stroke-[2.5]" />
          <span>Copilot: Ask Why</span>
        </button>
      )}
    </div>
  );
}

export default function ProductDecisionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-emerald-400">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ProductDecisionContent />
    </Suspense>
  );
}
