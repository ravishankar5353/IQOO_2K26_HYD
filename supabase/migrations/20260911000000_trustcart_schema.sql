-- TrustCart AI Database Schema Migration

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  monthly_budget NUMERIC(12, 2) DEFAULT 4000.00,
  current_spent NUMERIC(12, 2) DEFAULT 1450.00,
  purchase_budget NUMERIC(12, 2) DEFAULT 800.00,
  savings_goal NUMERIC(12, 2) DEFAULT 1200.00,
  theme_preference TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  current_price NUMERIC(12, 2) NOT NULL,
  original_price NUMERIC(12, 2),
  currency TEXT DEFAULT 'USD',
  seller_name TEXT,
  seller_rating NUMERIC(3, 2),
  image_url TEXT,
  source_url TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sellers Table
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 4.0,
  fulfillment_score INT DEFAULT 85,
  return_policy TEXT DEFAULT '30-day return policy',
  business_age_months INT DEFAULT 24,
  risk_flags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Analyses Table
CREATE TABLE IF NOT EXISTS public.product_analyses (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  decision TEXT NOT NULL CHECK (decision IN ('BUY', 'WAIT', 'AVOID')),
  confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
  scores JSONB NOT NULL,
  price_intelligence JSONB NOT NULL,
  review_intelligence JSONB NOT NULL,
  seller_intelligence JSONB NOT NULL,
  financial_fit JSONB NOT NULL,
  alternatives JSONB DEFAULT '[]'::jsonb,
  estimated_savings NUMERIC(12, 2) DEFAULT 0.00,
  disclaimer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Price Snapshots Table
CREATE TABLE IF NOT EXISTS public.price_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  price NUMERIC(12, 2) NOT NULL,
  source_name TEXT DEFAULT 'TrustCart Tracker',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating NUMERIC(2, 1),
  author TEXT,
  is_suspicious BOOLEAN DEFAULT FALSE,
  sentiment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Financial Preferences Table
CREATE TABLE IF NOT EXISTS public.financial_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  monthly_budget NUMERIC(12, 2) DEFAULT 4000.00,
  current_spent NUMERIC(12, 2) DEFAULT 1450.00,
  purchase_budget NUMERIC(12, 2) DEFAULT 800.00,
  savings_goal NUMERIC(12, 2) DEFAULT 1200.00,
  impulse_delay_hours INT DEFAULT 48,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Purchase Decisions Table
CREATE TABLE IF NOT EXISTS public.purchase_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  product_title TEXT NOT NULL,
  product_price NUMERIC(12, 2) NOT NULL,
  decision_type TEXT NOT NULL CHECK (decision_type IN ('BUY', 'WAIT', 'AVOID')),
  calculated_savings NUMERIC(12, 2) DEFAULT 0.00,
  user_action TEXT DEFAULT 'SAVED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Saved Products Table
CREATE TABLE IF NOT EXISTS public.saved_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 10. Comparisons Table
CREATE TABLE IF NOT EXISTS public.comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_a_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  product_b_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  winner_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  verdict TEXT,
  comparison_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_analyses_product_id ON public.product_analyses(product_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.product_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_product ON public.price_snapshots(product_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_purchase_decisions_user ON public.purchase_decisions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to analyses" ON public.product_analyses FOR SELECT USING (true);
CREATE POLICY "Allow public read access to sellers" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to price snapshots" ON public.price_snapshots FOR SELECT USING (true);

-- User Policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
