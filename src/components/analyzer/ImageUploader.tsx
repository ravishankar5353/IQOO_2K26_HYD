'use client';

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string, sampleTitle?: string) => void;
  isLoading?: boolean;
}

const SAMPLE_SCREENSHOTS = [
  {
    title: 'Apex Pro 5G Ultra Smartphone',
    tag: 'Flagship Deal',
    url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=60',
  },
  {
    title: 'AuraPulse Wireless ANC Headphones',
    tag: '52% Off Deal',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
  },
  {
    title: 'UltraTurbo 4TB Extreme Portable SSD',
    tag: 'Suspicious 95% Off',
    url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=60',
  },
];

export default function ImageUploader({ onImageSelected, isLoading }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedSampleName, setSelectedSampleName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setSelectedSampleName(file.name);
      onImageSelected(result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sample: typeof SAMPLE_SCREENSHOTS[0]) => {
    setPreview(sample.url);
    setSelectedSampleName(sample.title);
    onImageSelected(sample.url, sample.title);
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedSampleName(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : 'border-white/15 hover:border-emerald-500/40 bg-surface-100/50 hover:bg-surface-100/80'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {preview ? (
          <div className="relative z-10 space-y-3">
            <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready for AI Extraction
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-xs mx-auto">
                {selectedSampleName}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Drop product screenshot or click to browse
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports Flipkart / Amazon screenshots, price tags & specification sheets
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Sample Presets */}
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Or test with sample product screenshots:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_SCREENSHOTS.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => handleSampleClick(s)}
              className="flex items-center gap-2 p-2 rounded-xl bg-surface-200/50 hover:bg-surface-200 border border-white/5 hover:border-emerald-500/30 text-left transition-all text-xs group"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-300 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-200 group-hover:text-emerald-400 truncate text-[11px]">
                  {s.title}
                </p>
                <span className="text-[9px] px-1 rounded bg-white/5 text-slate-400">
                  {s.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
