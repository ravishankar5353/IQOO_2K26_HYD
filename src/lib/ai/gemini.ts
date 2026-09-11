import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult } from '../types/trustcart';
import { analyzeProductHeuristic } from './decisionEngine';

const apiKey = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('Failed to initialize GoogleGenerativeAI:', err);
  }
}

export async function analyzeProductWithGemini(params: {
  title?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  userBudget?: {
    monthlyDiscretionary?: number;
    currentSpent?: number;
    purchaseBudget?: number;
    savingsGoal?: number;
  };
}): Promise<AnalysisResult> {
  // If no Gemini key or on error, fallback to heuristic engine with 100% reliability
  if (!genAI) {
    return analyzeProductHeuristic(params);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are the TRUSTCART AI Decision Engine for an Indian e-commerce intelligence platform.
Evaluate this product with deep scrutiny across 6 pillars: Overall Trust, Product Quality, Review Authenticity, Seller Reliability, Price Fair-Value, and FinTech Financial Fit.

Input Details:
- Title: ${params.title || 'Unknown'}
- Current Price: ₹${params.price || 'N/A'}
- MRP / Original: ₹${params.originalPrice || 'N/A'}
- Category: ${params.category || 'General'}
- URL / Context: ${params.url || 'None'}
- Description: ${params.description || 'None'}

Return ONLY a valid JSON object strictly matching this schema with NO markdown wrapping, no code blocks:
{
  "decision": "BUY" | "WAIT" | "AVOID",
  "confidence": number (0-100),
  "decisionSummary": "2 sentence executive summary",
  "keyReasons": ["reason 1", "reason 2", "reason 3"],
  "riskFactors": ["risk 1", "risk 2"],
  "scores": {
    "overall": number,
    "productQuality": number,
    "reviewTrust": number,
    "sellerTrust": number,
    "priceValue": number,
    "financialFit": number
  },
  "priceIntelligence": {
    "priceTrend": "RISING" | "DROPPING" | "STABLE" | "VOLATILE",
    "discountAuthenticity": "REAL_DISCOUNT" | "INFLATED_MRP" | "FAIR_MARKET",
    "festivalDropExpected": boolean,
    "festivalDropDays": number,
    "potentialSavings": number,
    "priceInsight": "string"
  },
  "reviewIntelligence": {
    "suspiciousPercentage": number,
    "patternsDetected": ["pattern 1", "pattern 2"],
    "keyPositives": ["pos 1", "pos 2"],
    "keyCriticisms": ["crit 1"],
    "trustBadge": "HIGH_AUTHENTICITY" | "MODERATE_RISK" | "HIGH_SUSPICION",
    "reviewSummary": "string"
  },
  "sellerIntelligence": {
    "returnPolicyTransparency": "EXCELLENT" | "STANDARD" | "POOR_OR_RESTRICTIVE",
    "riskFlags": ["flag 1"],
    "badges": ["badge 1", "badge 2"],
    "sellerSummary": "string"
  }
}
`;

    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();
    // Clean codeblock markdown if present
    const cleanedJson = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanedJson);

    // Merge with heuristic baseline for structural completeness
    const heuristic = analyzeProductHeuristic(params);
    return {
      ...heuristic,
      decision: parsed.decision || heuristic.decision,
      confidence: parsed.confidence || 90,
      decisionSummary: parsed.decisionSummary || heuristic.decisionSummary,
      keyReasons: parsed.keyReasons?.length ? parsed.keyReasons : heuristic.keyReasons,
      riskFactors: parsed.riskFactors?.length ? parsed.riskFactors : heuristic.riskFactors,
      scores: {
        ...heuristic.scores,
        ...(parsed.scores || {}),
      },
      priceIntelligence: {
        ...heuristic.priceIntelligence,
        ...(parsed.priceIntelligence || {}),
      },
      reviewIntelligence: {
        ...heuristic.reviewIntelligence,
        ...(parsed.reviewIntelligence || {}),
      },
      sellerIntelligence: {
        ...heuristic.sellerIntelligence,
        ...(parsed.sellerIntelligence || {}),
      },
      estimatedSavings: parsed.priceIntelligence?.potentialSavings || heuristic.estimatedSavings,
    };
  } catch (err) {
    console.warn('Gemini API query failed, falling back to deterministic heuristic:', err);
    return analyzeProductHeuristic(params);
  }
}

export async function askCopilot(params: {
  productContext: AnalysisResult;
  question: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
}): Promise<string> {
  const { productContext, question } = params;
  const product = productContext.product;

  if (!genAI) {
    // High-fidelity dynamic fallback answers for common questions
    const q = question.toLowerCase();
    if (q.includes('why') && (q.includes('wait') || productContext.decision === 'WAIT')) {
      return `Here is why you should **WAIT** on the **${product.title}**:\n\n1. **Upcoming Festive Sale Cycle:** Historical pricing records show an electronics festival sale starts in ~${productContext.priceIntelligence.festivalDropDays || 11} days where this category sees genuine discounts.\n2. **₹${productContext.priceIntelligence.potentialSavings.toLocaleString('en-IN')} Expected Savings:** Current ₹${product.currentPrice.toLocaleString('en-IN')} is inflated against its 90-day low of ₹${productContext.priceIntelligence.historicalLow.toLocaleString('en-IN')}.\n3. **Better Immediate Alternative:** Check out the *${productContext.alternatives[0]?.title || 'alternative model'}* which offers matching specs for less today!`;
    }
    if (q.includes('price') || q.includes('good') || q.includes('cost')) {
      return `**Price Assessment for ${product.title}:**\n- Current Price: **₹${product.currentPrice.toLocaleString('en-IN')}**\n- Fair Value Baseline: **₹${productContext.priceIntelligence.fairValueEstimate.toLocaleString('en-IN')}**\n- Discount Authenticity: **${productContext.priceIntelligence.discountAuthenticity === 'REAL_DISCOUNT' ? 'Verified Genuine' : 'Cosmetic / Inflated MRP'}**.\n\n${productContext.priceIntelligence.priceInsight}`;
    }
    if (q.includes('risk') || q.includes('seller') || q.includes('fake') || q.includes('review')) {
      return `**Risk & Authenticity Breakdown:**\n- **Review Trust:** ${productContext.reviewIntelligence.trustBadge.replace(/_/g, ' ')} with ~${productContext.reviewIntelligence.suspiciousPercentage}% suspicious linguistic patterns detected.\n- **Seller Rating:** ${product.sellerRating}★ (${product.sellerName}).\n- **Main Warnings:** ${productContext.riskFactors.join('; ') || 'No critical risks identified.'}`;
    }
    if (q.includes('alternative') || q.includes('cheaper') || q.includes('better')) {
      if (productContext.alternatives.length > 0) {
        const alt = productContext.alternatives[0];
        return `I found a high-value alternative: **${alt.title}** at **₹${alt.price.toLocaleString('en-IN')}** (Trust Score: **${alt.trustScore}/100**). It gives you **${alt.keyAdvantage}** and saves **₹${alt.potentialSavings.toLocaleString('en-IN')}**!`;
      }
      return `Current product already represents the highest value tier in this price category.`;
    }
    return `As your TrustCart Copilot, my analysis indicates a **${productContext.decision}** decision for **${product.title}** with an Overall Trust Score of **${productContext.scores.overall}/100**. ${productContext.decisionSummary}`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are the TRUSTCART AI Copilot ("Think Before You Spend").
You give crisp, candid, consumer-advocate financial and shopping advice in India (₹ INR).
Current Product Context:
- Title: ${product.title}
- Price: ₹${product.currentPrice} (MRP: ₹${product.originalPrice})
- AI Decision: ${productContext.decision} (Trust Score: ${productContext.scores.overall}/100)
- Potential Savings: ₹${productContext.estimatedSavings}
- Key Reasons: ${productContext.keyReasons.join(' | ')}
- Financial Fit Score: ${productContext.scores.financialFit}/100

User Question: "${question}"

Respond conversationally with helpful bullet points and actionable advice. Keep it under 150 words. Focus on protecting the user's money and avoiding impulse regret.
`;
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (err) {
    console.warn('Gemini Copilot API failed, returning contextual fallback:', err);
    return `Based on our multi-pillar evaluation for **${product.title}**, the current verdict is **${productContext.decision}** (Trust Score: ${productContext.scores.overall}/100). ${productContext.decisionSummary}`;
  }
}
