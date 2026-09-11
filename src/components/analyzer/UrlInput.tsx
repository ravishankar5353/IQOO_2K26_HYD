'use client';

import { useState } from 'react';
import { Link as LinkIcon, Sparkles, Globe, ArrowRight } from 'lucide-react';

interface UrlInputProps {
  onAnalyzeUrl: (url: string, title?: string) => void;
  isLoading?: boolean;
}

const SAMPLE_URLS = [
  {
    store: 'Flipkart',
    title: 'Apex Pro 5G Ultra (12GB+256GB)',
    url: 'https://www.flipkart.com/apex-pro-5g-ultra-smartphone/p/itm192849182',
    demoId: 'apex-pro-phone',
  },
  {
    store: 'Amazon India',
    title: 'AuraPulse Max ANC Headphones',
    url: 'https://www.amazon.in/dp/B0CX928172/aurapulse-max-anc-headphones',
    demoId: 'aurapulse-anc',
  },
  {
    store: 'QuickDeal Store',
    title: 'UltraTurbo 4TB SSD (95% Off Trap)',
    url: 'https://www.quickdeals-india.in/deals/ultraturbo-4tb-portable-ssd',
    demoId: 'ultraturbo-ssd',
  },
];

export default function UrlInput({ onAnalyzeUrl, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyzeUrl(url.trim());
  };

  const handleSampleClick = (sample: typeof SAMPLE_URLS[0]) => {
    setUrl(sample.url);
    onAnalyzeUrl(sample.url, sample.title);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product link (e.g., https://amazon.in/dp/... or flipkart.com/...)"
            className="w-full pl-10 pr-24 py-3 rounded-2xl bg-surface-100/70 border border-white/10 hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground text-xs sm:text-sm placeholder:text-slate-500 transition-all"
          />
          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all"
          >
            <span>Analyze</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Sample Links */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Or test with live demo marketplace links:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_URLS.map((s) => (
            <button
              key={s.store}
              type="button"
              onClick={() => handleSampleClick(s)}
              className="p-2.5 rounded-xl bg-surface-200/50 hover:bg-surface-200 border border-white/5 hover:border-cyan-500/30 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  {s.store}
                </span>
                <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <p className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                {s.title}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                {s.url.replace('https://', '')}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
