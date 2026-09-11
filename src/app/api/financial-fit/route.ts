import { NextRequest, NextResponse } from 'next/server';
import { evaluateFinancialFit } from '@/lib/ai/decisionEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { price, monthlyDiscretionary, currentSpent, purchaseBudget, savingsGoal } = body;

    const fit = evaluateFinancialFit(Number(price) || 20000, {
      monthlyDiscretionary: Number(monthlyDiscretionary) || 60000,
      currentSpent: Number(currentSpent) || 20000,
      purchaseBudget: Number(purchaseBudget) || 30000,
      savingsGoal: Number(savingsGoal) || 15000,
    });

    return NextResponse.json({
      success: true,
      data: fit,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate financial fit' },
      { status: 500 }
    );
  }
}
