'use client';

import { useState, useRef, useEffect } from 'react';
import { AnalysisResult, CopilotMessage } from '@/lib/types/trustcart';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  X,
  Mic,
  ChevronDown,
  Minimize2,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { generateId } from '@/lib/utils';

interface CopilotDrawerProps {
  productContext: AnalysisResult;
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
  onNavigateToAlternative?: (altId: string) => void;
}

const QUICK_PROMPTS = [
  'Why should I wait?',
  'Is this price good or inflated?',
  'Show cheaper alternatives',
  'What are the hidden seller risks?',
  'How does this fit my monthly budget?',
];

export default function CopilotDrawer({
  productContext,
  isOpen,
  onClose,
  initialQuestion,
  onNavigateToAlternative,
}: CopilotDrawerProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I'm your **TrustCart AI Copilot**. I've evaluated the **${productContext.product.title}** across price trends, review patterns, seller history, and your budget.\n\nOur current recommendation is **${productContext.decision}** (Trust Score: **${productContext.scores.overall}/100**). What would you like to know before spending?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial question from external triggers
  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: generateId(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query.trim(),
          productContext,
        }),
      });
      const data = await res.json();

      const assistantMsg: CopilotMessage = {
        id: generateId(),
        sender: 'assistant',
        text: data.answer || 'Analysis complete.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: CopilotMessage = {
        id: generateId(),
        sender: 'assistant',
        text: `Based on our multi-pillar evaluation, the current verdict is **${productContext.decision}** (Trust Score: **${productContext.scores.overall}/100**). ${productContext.decisionSummary}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] shadow-2xl animate-fade-in">
      <div className="glass-panel rounded-3xl border border-emerald-500/30 overflow-hidden flex flex-col bg-surface-50/95 backdrop-blur-2xl">
        {/* Header */}
        <div className="p-4 bg-surface-100/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-foreground">
                  TrustCart Copilot
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  AI Context Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                {productContext.product.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body (Collapsible) */}
        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="p-4 h-80 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-tr-none'
                        : 'bg-surface-200/80 text-slate-200 border border-white/5 rounded-tl-none space-y-1.5'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <span className="block text-[9px] opacity-60 text-right mt-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 p-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>TrustCart AI thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2.5 bg-surface-100/60 border-t border-white/5 overflow-x-auto flex gap-1.5 no-scrollbar">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-surface-200 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/5 text-[11px] font-medium transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-surface-100/90 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask TrustCart AI anything about this product..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-surface-200/80 border border-white/10 focus:border-emerald-500 focus:outline-none text-xs text-foreground placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
