import { NextRequest, NextResponse } from 'next/server';
import { askCopilot } from '@/lib/ai/gemini';
import { DEMO_ANALYSES } from '@/lib/data/demoProducts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, productContext, productId, history } = body;

    const context = productContext || (productId ? DEMO_ANALYSES[productId] : DEMO_ANALYSES['apex-pro-phone']);

    if (!question || !question.trim()) {
      return NextResponse.json(
        { success: false, error: 'Question is required.' },
        { status: 400 }
      );
    }

    const answer = await askCopilot({
      productContext: context,
      question,
      history,
    });

    return NextResponse.json({
      success: true,
      answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/copilot:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Copilot assistant error.',
        answer: 'Our shopping intelligence engine suggests checking the price trend, review pattern risk, and comparing with smart alternatives before spending.',
      },
      { status: 500 }
    );
  }
}
