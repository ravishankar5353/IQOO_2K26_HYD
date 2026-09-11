import { NextRequest, NextResponse } from 'next/server';
import { analyzeProductWithGemini } from '@/lib/ai/gemini';
import { DEMO_ANALYSES } from '@/lib/data/demoProducts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, price, originalPrice, category, description, url, demoId, userBudget } = body;

    // Fast return if specific demoId requested
    if (demoId && DEMO_ANALYSES[demoId]) {
      return NextResponse.json({
        success: true,
        data: DEMO_ANALYSES[demoId],
        source: 'demo_preset',
      });
    }

    const result = await analyzeProductWithGemini({
      title,
      price: price ? Number(price) : undefined,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      description,
      url,
      userBudget,
    });

    return NextResponse.json({
      success: true,
      data: result,
      source: process.env.GEMINI_API_KEY ? 'gemini_ai' : 'heuristic_engine',
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze product. Falling back to default benchmark.',
        fallback: DEMO_ANALYSES['apex-pro-phone'],
      },
      { status: 500 }
    );
  }
}
