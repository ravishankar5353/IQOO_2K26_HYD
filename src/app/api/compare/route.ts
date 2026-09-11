import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResult } from '@/lib/types/trustcart';
import { DEMO_ANALYSES } from '@/lib/data/demoProducts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productAId, productBId, itemA, itemB } = body;

    const prodA: AnalysisResult = itemA || (productAId ? DEMO_ANALYSES[productAId] : DEMO_ANALYSES['apex-pro-phone']);
    const prodB: AnalysisResult = itemB || (productBId ? DEMO_ANALYSES[productBId] : DEMO_ANALYSES['quantum-x9-phone']);

    const priceDiff = prodA.product.currentPrice - prodB.product.currentPrice;
    const trustDiff = prodA.scores.overall - prodB.scores.overall;

    let verdict = '';
    let winner: 'A' | 'B' | 'TIE' = 'TIE';

    if (trustDiff > 10 && priceDiff <= 2000) {
      winner = 'A';
      verdict = `${prodA.product.title} is the clear winner with significantly higher trust and build quality at minimal price difference.`;
    } else if (trustDiff < -5 || priceDiff > 5000) {
      winner = 'B';
      verdict = `${prodB.product.title} offers superior overall value, saving ₹${Math.abs(priceDiff).toLocaleString('en-IN')} with comparable or higher Trust Score (${prodB.scores.overall}/100).`;
    } else {
      winner = 'A';
      verdict = `Both options are competitive. Choose ${prodA.product.title} if you prioritize ${Object.keys(prodA.product.specs)[0] || 'brand presence'}, or choose ${prodB.product.title} for maximum savings.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        productA: prodA,
        productB: prodB,
        winner,
        verdict,
        priceDifference: Math.abs(priceDiff),
        trustScoreDifference: Math.abs(trustDiff),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate comparison' },
      { status: 500 }
    );
  }
}
