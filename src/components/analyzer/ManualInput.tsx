'use client';

import { useState } from 'react';
import { Edit3, ArrowRight } from 'lucide-react';

interface ManualInputProps {
  onAnalyzeManual: (data: {
    title: string;
    price: number;
    originalPrice?: number;
    category?: string;
    sellerName?: string;
    description?: string;
  }) => void;
  isLoading?: boolean;
}

export default function ManualInput({ onAnalyzeManual, isLoading }: ManualInputProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Smartphones & Electronics');
  const [sellerName, setSellerName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    onAnalyzeManual({
      title: title.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      sellerName: sellerName.trim() || undefined,
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Product Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Apex Pro 5G Ultra Smartphone (12GB+256GB)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100/70 border border-white/10 hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-slate-500 transition-all"
          />
        </div>

        {/* Current Price */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Current Listed Price (₹) *
          </label>
          <input
            type="number"
            required
            min={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 49999"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100/70 border border-white/10 hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-slate-500 transition-all font-mono"
          />
        </div>

        {/* Original / MRP Price */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Original MRP (₹) (Optional)
          </label>
          <input
            type="number"
            min={1}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="e.g. 54999"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100/70 border border-white/10 hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-slate-500 transition-all font-mono"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100/70 border border-white/10 hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-foreground transition-all"
          >
            <option value="Smartphones & Electronics">Smartphones & Electronics</option>
            <option value="Audio & Wearables">Audio & Wearables</option>
            <option value="Computers & Storage">Computers & Storage</option>
            <option value="Gaming & Laptops">Gaming & Laptops</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
          </select>
        </div>

        {/* Seller */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Seller Store Name (Optional)
          </label>
          <input
            type="text"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            placeholder="e.g. OmniTech Direct"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100/70 border border-white/10 hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-slate-500 transition-all"
          />
        </div>

        {/* Description / Key Specs */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Description or Key Specs (Optional)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Snapdragon 8 Gen 3, 144Hz AMOLED display, 120W fast charging"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100/70 border border-white/10 hover:border-emerald-500/40 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-foreground placeholder:text-slate-500 transition-all resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!title.trim() || !price || isLoading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 transform active:scale-95 transition-all"
      >
        <Edit3 className="w-4 h-4" />
        <span>Run AI Product Intelligence</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
