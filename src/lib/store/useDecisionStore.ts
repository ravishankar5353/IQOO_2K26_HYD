'use client';

import { useState, useEffect } from 'react';
import { AnalysisResult, UserDecisionRecord, UserProfile } from '../types/trustcart';
import { DEMO_ANALYSES } from '../data/demoProducts';
import { generateId } from '../utils';

const DEFAULT_PROFILE: UserProfile = {
  monthlyBudget: 60000,
  currentSpentThisMonth: 22000,
  defaultPurchaseBudget: 45000,
  savingsGoal: 20000,
  theme: 'dark',
};

const DEFAULT_DECISIONS: UserDecisionRecord[] = [
  {
    id: 'dec-1',
    productId: 'apex-pro-phone',
    productTitle: 'Apex Pro 5G Ultra Smartphone',
    productPrice: 49999,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=60',
    category: 'Smartphones',
    decisionType: 'WAITED',
    calculatedSavings: 5000,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Waited for Autumn Electronics sale festival drop.',
  },
  {
    id: 'dec-2',
    productId: 'ultraturbo-ssd',
    productTitle: 'UltraTurbo 4TB Extreme Portable SSD',
    productPrice: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=60',
    category: 'Storage',
    decisionType: 'AVOIDED',
    calculatedSavings: 1499,
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    notes: 'Avoided counterfeit fake capacity drive.',
  },
  {
    id: 'dec-3',
    productId: 'aurapulse-anc',
    productTitle: 'AuraPulse Max Wireless ANC Headphones',
    productPrice: 11999,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    category: 'Audio',
    decisionType: 'BOUGHT',
    calculatedSavings: 6500,
    timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
    notes: 'Bought at verified all-time low price clearance.',
  },
];

export function useDecisionStore() {
  const [decisions, setDecisions] = useState<UserDecisionRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [comparisonItems, setComparisonItems] = useState<AnalysisResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedDecisions = localStorage.getItem('trustcart_decisions');
      if (storedDecisions) {
        setDecisions(JSON.parse(storedDecisions));
      } else {
        setDecisions(DEFAULT_DECISIONS);
        localStorage.setItem('trustcart_decisions', JSON.stringify(DEFAULT_DECISIONS));
      }

      const storedProfile = localStorage.getItem('trustcart_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      // Default active analysis
      setActiveAnalysis(DEMO_ANALYSES['apex-pro-phone']);
    } catch (e) {
      console.warn('LocalStorage error:', e);
      setDecisions(DEFAULT_DECISIONS);
      setActiveAnalysis(DEMO_ANALYSES['apex-pro-phone']);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addDecision = (record: Omit<UserDecisionRecord, 'id' | 'timestamp'>) => {
    const newRecord: UserDecisionRecord = {
      ...record,
      id: 'dec-' + generateId(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newRecord, ...decisions];
    setDecisions(updated);
    try {
      localStorage.setItem('trustcart_decisions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const removeDecision = (id: string) => {
    const updated = decisions.filter((d) => d.id !== id);
    setDecisions(updated);
    try {
      localStorage.setItem('trustcart_decisions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    try {
      localStorage.setItem('trustcart_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const addToComparison = (item: AnalysisResult) => {
    setComparisonItems((prev) => {
      if (prev.some((p) => p.product.id === item.product.id)) {
        return prev;
      }
      if (prev.length >= 2) {
        return [prev[1], item];
      }
      return [...prev, item];
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparisonItems((prev) => prev.filter((p) => p.product.id !== productId));
  };

  const totalSavings = decisions.reduce((acc, d) => {
    if (d.decisionType === 'WAITED' || d.decisionType === 'AVOIDED' || d.decisionType === 'BOUGHT') {
      return acc + (d.calculatedSavings || 0);
    }
    return acc;
  }, 0);

  const stats = {
    totalDecisions: decisions.length,
    boughtCount: decisions.filter((d) => d.decisionType === 'BOUGHT').length,
    waitedCount: decisions.filter((d) => d.decisionType === 'WAITED').length,
    avoidedCount: decisions.filter((d) => d.decisionType === 'AVOIDED').length,
    totalSavings,
  };

  return {
    decisions,
    profile,
    activeAnalysis,
    comparisonItems,
    isLoaded,
    stats,
    totalSavings,
    addDecision,
    removeDecision,
    updateProfile,
    setActiveAnalysis,
    addToComparison,
    removeFromComparison,
  };
}
