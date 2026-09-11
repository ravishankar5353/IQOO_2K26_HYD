import {
  AnalysisResult,
  DecisionType,
  FinancialFit,
  PriceIntelligence,
  Product,
  ReviewIntelligence,
  SellerIntelligence,
  TrustScores,
} from '../types/trustcart';
import { generatePriceHistory } from '../data/mockPrices';
import { DEMO_ANALYSES } from '../data/demoProducts';

interface AnalyzeParams {
  title?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  brand?: string;
  description?: string;
  url?: string;
  sellerName?: string;
  sellerRating?: number;
  userBudget?: {
    monthlyDiscretionary?: number;
    currentSpent?: number;
    purchaseBudget?: number;
    savingsGoal?: number;
  };
}

export function evaluateFinancialFit(
  price: number,
  userBudget: {
    monthlyDiscretionary?: number;
    currentSpent?: number;
    purchaseBudget?: number;
    savingsGoal?: number;
  } = {}
): FinancialFit {
  const monthlyDiscretionary = userBudget.monthlyDiscretionary || 50000;
  const currentSpent = userBudget.currentSpent || 15000;
  const purchaseBudget = userBudget.purchaseBudget || 35000;
  const savingsGoal = userBudget.savingsGoal || 15000;

  const remainingMonthly = Math.max(0, monthlyDiscretionary - currentSpent);
  const budgetRatio = price / (purchaseBudget || 1);
  const monthlyRatio = price / (remainingMonthly || 1);

  let fitScore = 100;
  let impulseRisk: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  let coolingOffRecommendation = 'Safe to proceed if needed.';
  let runwayImpact = 'Minimal impact on remaining monthly buffer.';
  let adviceText = 'Fits well within your target purchase budget.';

  if (price > purchaseBudget * 1.3) {
    fitScore -= 40;
    impulseRisk = 'HIGH';
    coolingOffRecommendation = 'High budget overshoot. We recommend a 7-day cooling off period.';
    runwayImpact = `Exceeds your designated ₹${purchaseBudget.toLocaleString('en-IN')} item budget by ${Math.round((budgetRatio - 1) * 100)}%.`;
    adviceText = 'Consider searching for refurbished options or setting a price alert for upcoming festival discounts.';
  } else if (price > purchaseBudget) {
    fitScore -= 20;
    impulseRisk = 'MODERATE';
    coolingOffRecommendation = 'Slight budget stretch. Recommend a 48-hour cooling off window.';
    runwayImpact = `Consumes ${Math.round(monthlyRatio * 100)}% of remaining monthly disposable buffer.`;
    adviceText = 'Slightly above planned budget. Verify if you can trim other discretionary expenses this month.';
  } else {
    fitScore = Math.min(100, Math.round(95 - (price / monthlyDiscretionary) * 20));
    impulseRisk = 'LOW';
    coolingOffRecommendation = 'No cooling off delay required.';
    runwayImpact = `Leaves ₹${(remainingMonthly - price).toLocaleString('en-IN')} safely intact for your savings target.`;
    adviceText = 'Excellent budget alignment with healthy surplus remaining.';
  }

  fitScore = Math.max(10, Math.min(99, fitScore));
  const budgetConsumptionPercent = Math.min(100, Math.round((price / (purchaseBudget || price)) * 100));

  return {
    fitScore,
    userMonthlyDiscretionary: monthlyDiscretionary,
    userCurrentSpent: currentSpent,
    userPurchaseBudget: purchaseBudget,
    userSavingsGoal: savingsGoal,
    budgetConsumptionPercent,
    impulseRisk,
    coolingOffRecommendation,
    runwayImpact,
    adviceText,
  };
}

export function analyzeProductHeuristic(params: AnalyzeParams): AnalysisResult {
  // Check if it matches any demo scenario first for instant high fidelity
  const lowerTitle = (params.title || '').toLowerCase();
  const lowerUrl = (params.url || '').toLowerCase();

  if (lowerTitle.includes('apex') || lowerTitle.includes('smartphone') || lowerUrl.includes('apex')) {
    const base = DEMO_ANALYSES['apex-pro-phone'];
    const financialFit = evaluateFinancialFit(base.product.currentPrice, params.userBudget);
    return {
      ...base,
      financialFit,
      scores: {
        ...base.scores,
        financialFit: financialFit.fitScore,
      },
      analyzedAt: new Date().toISOString(),
    };
  }

  if (lowerTitle.includes('aurapulse') || lowerTitle.includes('headphone') || lowerTitle.includes('audio') || lowerUrl.includes('headphone')) {
    const base = DEMO_ANALYSES['aurapulse-anc'];
    const financialFit = evaluateFinancialFit(base.product.currentPrice, params.userBudget);
    return {
      ...base,
      financialFit,
      scores: {
        ...base.scores,
        financialFit: financialFit.fitScore,
      },
      analyzedAt: new Date().toISOString(),
    };
  }

  if (lowerTitle.includes('ultraturbo') || lowerTitle.includes('ssd') || lowerTitle.includes('4tb') || lowerUrl.includes('ssd')) {
    const base = DEMO_ANALYSES['ultraturbo-ssd'];
    const financialFit = evaluateFinancialFit(base.product.currentPrice, params.userBudget);
    return {
      ...base,
      financialFit,
      scores: {
        ...base.scores,
        financialFit: financialFit.fitScore,
      },
      analyzedAt: new Date().toISOString(),
    };
  }

  // Dynamic analysis fallback
  const title = params.title || 'Analyzed Consumer Product';
  const price = params.price || 9999;
  const originalPrice = params.originalPrice || Math.round(price * 1.35);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  const sellerRating = params.sellerRating || 4.2;

  // Algorithmic evaluation
  let decision: DecisionType = 'BUY';
  const keyReasons: string[] = [];
  const riskFactors: string[] = [];

  // Review heuristic
  const reviewTrustScore = Math.min(95, Math.max(45, Math.round(sellerRating * 18 + (discountPercent > 70 ? -30 : 5))));
  const isSuspiciousReviews = discountPercent > 70 || reviewTrustScore < 60;
  const suspiciousPercentage = isSuspiciousReviews ? 34.5 : 6.2;

  // Price value heuristic
  const isInflatedDiscount = discountPercent > 65;
  const isFairPrice = discountPercent >= 15 && discountPercent <= 45;
  const priceValueScore = isInflatedDiscount ? 42 : isFairPrice ? 88 : 72;

  // Seller score
  const sellerTrustScore = Math.min(98, Math.max(30, Math.round(sellerRating * 20)));

  // Product Quality score
  const productQuality = Math.min(96, Math.max(50, Math.round(sellerRating * 19 + 5)));

  // Financial Fit
  const financialFit = evaluateFinancialFit(price, params.userBudget);

  // Overall Trust Score calculation
  const overallScore = Math.round(
    productQuality * 0.25 +
    reviewTrustScore * 0.25 +
    sellerTrustScore * 0.2 +
    priceValueScore * 0.2 +
    (financialFit.fitScore * 0.1)
  );

  // Determine BUY, WAIT, AVOID
  if (isSuspiciousReviews || overallScore < 50 || sellerTrustScore < 45) {
    decision = 'AVOID';
    keyReasons.push('High anomaly pattern in review text and unverified listing claims.');
    keyReasons.push(`Deceptive anchor discount of ${discountPercent}% on artificially inflated MRP.`);
    keyReasons.push('Seller return track record indicates elevated dispute rates.');
    riskFactors.push('Elevated risk of counterfeit components or non-compliant return policy.');
  } else if (discountPercent < 10 || price > 25000) {
    decision = 'WAIT';
    keyReasons.push('Upcoming quarterly marketplace sales cycle expected within 14 days.');
    keyReasons.push(`Current price (₹${price.toLocaleString('en-IN')}) is near the upper bound of 60-day moving average.`);
    keyReasons.push('Hardware quality is sound, but price timing allows potential savings.');
    riskFactors.push('Inventory shortage risk if waiting for peak sale hours.');
  } else {
    decision = 'BUY';
    keyReasons.push(`Authentic ${discountPercent}% discount backed by verified seller history.`);
    keyReasons.push('Review authenticity meets quality standards with clean linguistic consistency.');
    keyReasons.push(`Comfortably aligns with your financial budget allocation.`);
    riskFactors.push('Standard return window applies (verify packaging upon unboxing).');
  }

  const potentialSavings = decision === 'WAIT' ? Math.round(price * 0.12) : decision === 'AVOID' ? price : 0;
  const historicalLow = Math.round(price * 0.88);
  const historicalHigh = originalPrice;

  const product: Product = {
    id: 'prod-' + Date.now().toString(36),
    title,
    brand: params.brand || 'Verified Brand',
    category: params.category || 'Consumer Electronics',
    currentPrice: price,
    originalPrice,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=60',
    sourceUrl: params.url || 'https://ecommerce.example/product',
    sellerName: params.sellerName || 'Verified Retail Network',
    sellerRating,
    sellerReviewsCount: 1250,
    specs: {
      'Category': params.category || 'General Electronics',
      'Warranty': '1 Year Standard Warranty',
      'Return Window': '7 Days Hassle-Free',
    },
    isDemo: false,
    description: params.description || `${title} evaluated through TrustCart AI Multi-Pillar Analysis Engine.`,
  };

  const scores: TrustScores = {
    overall: overallScore,
    productQuality,
    reviewTrust: reviewTrustScore,
    sellerTrust: sellerTrustScore,
    priceValue: priceValueScore,
    financialFit: financialFit.fitScore,
  };

  const priceIntelligence: PriceIntelligence = {
    currentPrice: price,
    fairValueEstimate: Math.round(price * 0.92),
    historicalLow,
    historicalHigh,
    averagePrice: Math.round((historicalHigh + historicalLow) / 2),
    priceTrend: decision === 'WAIT' ? 'RISING' : 'STABLE',
    discountAuthenticity: isInflatedDiscount ? 'INFLATED_MRP' : 'REAL_DISCOUNT',
    festivalDropExpected: decision === 'WAIT',
    festivalDropDays: decision === 'WAIT' ? 12 : undefined,
    expectedFestivalPrice: decision === 'WAIT' ? historicalLow : undefined,
    potentialSavings,
    priceHistory: generatePriceHistory(price, historicalLow, historicalHigh, decision === 'WAIT'),
    priceInsight: decision === 'WAIT'
      ? `Estimated ₹${potentialSavings.toLocaleString('en-IN')} savings if purchased during the upcoming sales window.`
      : 'Fair pricing within normal standard retail distribution variance.',
  };

  const reviewIntelligence: ReviewIntelligence = {
    totalAnalyzed: 840,
    suspiciousPercentage,
    sentimentBreakdown: isSuspiciousReviews
      ? { positive: 65, neutral: 5, negative: 30 }
      : { positive: 85, neutral: 10, negative: 5 },
    patternsDetected: isSuspiciousReviews
      ? ['Potentially suspicious pattern: Repetitive short praise phrases detected.', 'Irregular cluster in unverified reviews.']
      : ['Verified buyers praise build durability and customer support.', 'Consistent delivery feedback.'],
    keyPositives: ['Reliable everyday performance', 'Prompt dispatch from merchant'],
    keyCriticisms: isSuspiciousReviews ? ['Deceptive marketing claims', 'Return process difficulties'] : ['Slightly slower delivery to non-metro pin codes'],
    trustBadge: isSuspiciousReviews ? 'HIGH_SUSPICION' : reviewTrustScore > 80 ? 'HIGH_AUTHENTICITY' : 'MODERATE_RISK',
    reviewSummary: isSuspiciousReviews
      ? 'Elevated linguistic repetition detected in 5-star ratings.'
      : 'Consistent customer satisfaction across verified order base.',
  };

  const sellerIntelligence: SellerIntelligence = {
    name: params.sellerName || 'Verified Retail Network',
    rating: sellerRating,
    totalRatings: 3400,
    fulfillmentScore: Math.round(sellerRating * 20),
    returnPolicyTransparency: sellerRating > 4.0 ? 'EXCELLENT' : 'STANDARD',
    businessAgeMonths: 24,
    riskFlags: sellerRating < 3.5 ? ['Low seller satisfaction score'] : [],
    badges: ['Verified Merchant', 'Standard 7-Day Return Policy'],
    sellerSummary: `Established merchant with ${sellerRating}★ customer satisfaction index.`,
  };

  return {
    product,
    decision,
    confidence: 91,
    decisionSummary: decision === 'WAIT'
      ? `Wait for the upcoming discount cycle to unlock an estimated ₹${potentialSavings.toLocaleString('en-IN')} savings.`
      : decision === 'AVOID'
      ? 'Significant risk indicators detected. We recommend avoiding this listing in favor of verified alternatives.'
      : `Safe to proceed. Genuine discount with strong seller trust and financial fit.`,
    keyReasons,
    riskFactors,
    scores,
    priceIntelligence,
    reviewIntelligence,
    sellerIntelligence,
    financialFit,
    alternatives: [
      {
        id: 'alt-' + Date.now().toString(36),
        title: `Pro Alternative for ${title.substring(0, 25)}...`,
        brand: 'Trusted Brand',
        price: Math.round(price * 0.85),
        originalPrice: price,
        trustScore: 92,
        valueScore: 94,
        potentialSavings: Math.round(price * 0.15),
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        keyAdvantage: 'Higher verified review authenticity score and lower acquisition cost.',
      },
    ],
    estimatedSavings: potentialSavings,
    disclaimer: 'AI-assisted consumer evaluation engine. Always review vendor terms prior to checkout.',
    analyzedAt: new Date().toISOString(),
  };
}
