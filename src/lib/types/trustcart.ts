export type DecisionType = 'BUY' | 'WAIT' | 'AVOID';

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  imageUrl: string;
  sourceUrl?: string;
  sellerName: string;
  sellerRating: number;
  sellerReviewsCount: number;
  specs: Record<string, string>;
  isDemo?: boolean;
  description: string;
}

export interface TrustScores {
  overall: number; // 0-100
  productQuality: number; // 0-100
  reviewTrust: number; // 0-100
  sellerTrust: number; // 0-100
  priceValue: number; // 0-100
  financialFit: number; // 0-100
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  event?: string;
  isFestival?: boolean;
}

export interface PriceIntelligence {
  currentPrice: number;
  fairValueEstimate: number;
  historicalLow: number;
  historicalHigh: number;
  averagePrice: number;
  priceTrend: 'RISING' | 'DROPPING' | 'STABLE' | 'VOLATILE';
  discountAuthenticity: 'REAL_DISCOUNT' | 'INFLATED_MRP' | 'FAIR_MARKET';
  festivalDropExpected: boolean;
  festivalDropDays?: number;
  expectedFestivalPrice?: number;
  potentialSavings: number;
  priceHistory: PriceHistoryPoint[];
  priceInsight: string;
}

export interface ReviewIntelligence {
  totalAnalyzed: number;
  suspiciousPercentage: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  patternsDetected: string[];
  keyPositives: string[];
  keyCriticisms: string[];
  trustBadge: 'HIGH_AUTHENTICITY' | 'MODERATE_RISK' | 'HIGH_SUSPICION';
  reviewSummary: string;
}

export interface SellerIntelligence {
  name: string;
  rating: number;
  totalRatings: number;
  fulfillmentScore: number;
  returnPolicyTransparency: 'EXCELLENT' | 'STANDARD' | 'POOR_OR_RESTRICTIVE';
  businessAgeMonths: number;
  riskFlags: string[];
  badges: string[];
  sellerSummary: string;
}

export interface FinancialFit {
  fitScore: number; // 0-100
  userMonthlyDiscretionary: number;
  userCurrentSpent: number;
  userPurchaseBudget: number;
  userSavingsGoal: number;
  budgetConsumptionPercent: number;
  impulseRisk: 'LOW' | 'MODERATE' | 'HIGH';
  coolingOffRecommendation: string;
  runwayImpact: string;
  adviceText: string;
}

export interface Alternative {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice: number;
  trustScore: number;
  valueScore: number;
  potentialSavings: number;
  imageUrl: string;
  keyAdvantage: string;
  sourceUrl?: string;
  specs?: Record<string, string>;
}

export interface AnalysisResult {
  product: Product;
  decision: DecisionType;
  confidence: number; // 0-100
  decisionSummary: string;
  keyReasons: string[];
  riskFactors: string[];
  scores: TrustScores;
  priceIntelligence: PriceIntelligence;
  reviewIntelligence: ReviewIntelligence;
  sellerIntelligence: SellerIntelligence;
  financialFit: FinancialFit;
  alternatives: Alternative[];
  estimatedSavings: number;
  disclaimer: string;
  analyzedAt: string;
}

export interface UserDecisionRecord {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  imageUrl: string;
  category: string;
  decisionType: 'BOUGHT' | 'WAITED' | 'AVOIDED';
  calculatedSavings: number;
  timestamp: string;
  notes?: string;
}

export interface UserProfile {
  monthlyBudget: number;
  currentSpentThisMonth: number;
  defaultPurchaseBudget: number;
  savingsGoal: number;
  theme: 'dark' | 'light';
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  quickActions?: Array<{
    label: string;
    action: string;
    payload?: any;
  }>;
}

export interface DemoScenario {
  id: string;
  scenarioType: DecisionType;
  badgeLabel: string;
  title: string;
  subtitle: string;
  price: number;
  savingHighlight: string;
  initialProductId: string;
}
