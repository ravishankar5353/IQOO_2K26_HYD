'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Upload,
  Link as LinkIcon,
  Edit3,
  Mic,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import CameraScanner from '@/components/analyzer/CameraScanner';
import ImageUploader from '@/components/analyzer/ImageUploader';
import UrlInput from '@/components/analyzer/UrlInput';
import ManualInput from '@/components/analyzer/ManualInput';
import VoiceInput from '@/components/analyzer/VoiceInput';
import DemoPresetBar from '@/components/demo/DemoPresetBar';
import { useDecisionStore } from '@/lib/store/useDecisionStore';
import { DEMO_ANALYSES } from '@/lib/data/demoProducts';

export default function AnalyzePage() {
  const router = useRouter();
  const { setActiveAnalysis } = useDecisionStore();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'url' | 'manual' | 'voice'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Running Multi-Pillar Analysis...');

  const executeAnalysis = async (params: {
    title?: string;
    price?: number;
    originalPrice?: number;
    category?: string;
    url?: string;
    description?: string;
    sellerName?: string;
    demoId?: string;
  }) => {
    setIsLoading(true);
    setLoadingText('Querying Price & Review Intelligence...');

    try {
      // Check if matches known demo
      if (params.demoId && DEMO_ANALYSES[params.demoId]) {
        setActiveAnalysis(DEMO_ANALYSES[params.demoId]);
        setTimeout(() => {
          router.push(`/product/${params.demoId}`);
        }, 600);
        return;
      }

      const res = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const json = await res.json();

      if (json.success && json.data) {
        setActiveAnalysis(json.data);
        const prodId = json.data.product.id || 'apex-pro-phone';
        router.push(`/product/${prodId}`);
      } else {
        router.push('/product/apex-pro-phone');
      }
    } catch (err) {
      console.warn('Analysis fallback:', err);
      router.push('/product/apex-pro-phone');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen pb-20">
      <DemoPresetBar onSelectScenario={handleSelectScenario} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Product Analyzer Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground">
            Analyze Any Product Before Buying
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Scan with your camera, upload a screenshot, paste a URL, or speak your question.
          </p>
        </div>

        {/* Multi-modal Tabs Bar */}
        <div className="glass-panel p-1.5 rounded-2xl border border-white/10 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'url', label: 'Paste URL', icon: LinkIcon },
            { id: 'camera', label: 'Camera Scan', icon: Camera },
            { id: 'upload', label: 'Upload Screenshot', icon: Upload },
            { id: 'manual', label: 'Manual Entry', icon: Edit3 },
            { id: 'voice', label: 'Voice First', icon: Mic },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative">
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-spin">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{loadingText}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluating review authenticity, fair-market price curves & financial fit
                </p>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <CameraScanner
              onCapture={(dataUrl) => {
                executeAnalysis({
                  title: 'Scanned Mobile Product',
                  price: 49999,
                  category: 'Smartphones & Electronics',
                  demoId: 'apex-pro-phone',
                });
              }}
              onFallbackToUpload={() => setActiveTab('upload')}
            />
          )}

          {activeTab === 'upload' && (
            <ImageUploader
              isLoading={isLoading}
              onImageSelected={(dataUrl, sampleTitle) => {
                if (sampleTitle?.toLowerCase().includes('headphone') || sampleTitle?.toLowerCase().includes('aura')) {
                  executeAnalysis({ demoId: 'aurapulse-anc' });
                } else if (sampleTitle?.toLowerCase().includes('ssd') || sampleTitle?.toLowerCase().includes('ultra')) {
                  executeAnalysis({ demoId: 'ultraturbo-ssd' });
                } else {
                  executeAnalysis({ demoId: 'apex-pro-phone' });
                }
              }}
            />
          )}

          {activeTab === 'url' && (
            <UrlInput
              isLoading={isLoading}
              onAnalyzeUrl={(url, title) => {
                if (url.includes('aurapulse') || url.includes('B0CX928172')) {
                  executeAnalysis({ url, demoId: 'aurapulse-anc' });
                } else if (url.includes('ultraturbo') || url.includes('quickdeals')) {
                  executeAnalysis({ url, demoId: 'ultraturbo-ssd' });
                } else {
                  executeAnalysis({ url, title: title || 'Apex Pro 5G Ultra Smartphone', demoId: 'apex-pro-phone' });
                }
              }}
            />
          )}

          {activeTab === 'manual' && (
            <ManualInput
              isLoading={isLoading}
              onAnalyzeManual={(data) => {
                executeAnalysis(data);
              }}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceInput
              isLoading={isLoading}
              onVoiceTranscript={(query) => {
                if (query.toLowerCase().includes('headphone') || query.toLowerCase().includes('aura')) {
                  executeAnalysis({ demoId: 'aurapulse-anc' });
                } else if (query.toLowerCase().includes('ssd') || query.toLowerCase().includes('scam')) {
                  executeAnalysis({ demoId: 'ultraturbo-ssd' });
                } else {
                  executeAnalysis({ demoId: 'apex-pro-phone' });
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
