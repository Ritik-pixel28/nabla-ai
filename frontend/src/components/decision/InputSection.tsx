import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Zap, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (situation: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
    }
  };

  const handleExample = () => {
    const example = "Should I focus on DSA or take an internship?";
    setInput(example);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative group transition-all duration-500">
        <div className="relative glass rounded-[2rem] p-2 transition-all duration-500 ring-1 ring-white/10 group-focus-within:ring-blue-500/40 group-focus-within:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] hover:ring-white/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your situation... e.g., Should I focus on DSA or take an internship?"
            className="w-full h-56 p-8 text-2xl bg-transparent border-none focus:outline-none focus:ring-0 resize-none placeholder:text-slate-600 text-white leading-relaxed"
            disabled={isLoading}
          />
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-[1.5rem] border border-white/5">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleExample}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-400 hover:text-white transition-all bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 active:scale-95 group relative overflow-hidden"
              >
                <Sparkles size={18} className="text-yellow-500" />
                Try Example
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 group relative overflow-hidden"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshIcon />
                </motion.div>
              ) : (
                <>
                  Generate Decision
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      <div className="mt-6 flex justify-center items-center gap-6 text-slate-500 text-sm font-medium">
         <span className="flex items-center gap-2"><Zap size={14} className="text-yellow-500" /> Instant Analysis</span>
         <span className="flex items-center gap-2"><Zap size={14} className="text-blue-500" /> Actionable Steps</span>
         <span className="flex items-center gap-2"><Zap size={14} className="text-purple-500" /> 0% Overthinking</span>
      </div>
    </motion.div>
  );
};

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);
