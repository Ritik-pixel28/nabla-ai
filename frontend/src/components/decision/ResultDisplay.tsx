import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, Copy, RefreshCcw, Zap } from 'lucide-react';
import type { DecisionResponse } from '../../api/client';

interface ResultDisplayProps {
  result: DecisionResponse | null;
  onReset: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" } as any
  }
};

const TypingText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  if (!result) return null;

  const handleCopy = () => {
    const text = `
Recommendation: ${result.recommendation}

Pros:
${result.pros.map(p => `- ${p}`).join('\n')}

Cons:
${result.cons.map(c => `- ${c}`).join('\n')}

Action Plan:
${result.action_plan.map((s, i) => `${i + 1}. ${s}`).join('\n')}
    `.trim();
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[1000px] mx-auto mt-24 space-y-16 pb-24"
    >
      <div className="flex flex-col items-center gap-4 text-center">
         <div className="w-12 h-1 bg-blue-500 rounded-full mb-2 opacity-50" />
         <h3 className="text-4xl font-black text-white tracking-tight">
            Decision Framework
         </h3>
         <div className="flex gap-4">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-all bg-white/5 rounded-full border border-white/10 hover:bg-white/10 active:scale-95"
            >
              <Copy size={16} className="text-blue-400" />
              Copy Report
            </button>
            <button 
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-all bg-white/5 rounded-full border border-white/10 hover:bg-white/10 active:scale-95"
            >
              <RefreshCcw size={16} className="text-rose-400" />
              New Analysis
            </button>
         </div>
      </div>

      {/* Recommendation Section */}
      <motion.div variants={cardVariants} className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-card !p-12 border-white/10 shadow-blue-500/10">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/40">
              <Trophy className="text-white" size={32} />
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em]">The Verdict</h4>
              <div className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                <TypingText text={result.recommendation} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pros */}
        <motion.div variants={cardVariants} className="glass-card">
          <h4 className="text-xl font-black text-emerald-400 flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
               <CheckCircle2 size={24} />
            </div>
            Strategic Advantages
          </h4>
          <ul className="space-y-6">
            {result.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-4 text-slate-300 text-lg leading-relaxed">
                <span className="text-emerald-500 font-black mt-1">✔</span>
                {pro}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Cons */}
        <motion.div variants={cardVariants} className="glass-card">
          <h4 className="text-xl font-black text-rose-400 flex items-center gap-3 mb-8">
            <div className="p-2 bg-rose-500/10 rounded-lg">
               <XCircle size={24} />
            </div>
            Potential Risks
          </h4>
          <ul className="space-y-6">
            {result.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-4 text-slate-300 text-lg leading-relaxed">
                <span className="text-rose-500 font-black mt-1">❌</span>
                {con}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Action Plan Section */}
      <motion.div variants={cardVariants} className="glass-card !bg-white/[0.04]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <h4 className="text-2xl font-black text-white flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
               <Zap size={28} className="text-indigo-400 fill-indigo-400" />
            </div>
            24-Hour Execution Strategy
          </h4>
          <div className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest">
             High Priority Steps
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {result.action_plan.map((step, index) => (
            <div 
              key={index}
              className="flex items-start gap-6 p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.06] transition-all duration-300 group cursor-default"
            >
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-xl font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {index + 1}
              </div>
              <p className="text-slate-300 text-lg font-medium leading-relaxed group-hover:text-white transition-colors">{step}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={cardVariants} className="text-center pt-8">
         <p className="text-slate-500 font-medium">
            Clarity achieved. Now proceed with confidence.
         </p>
      </motion.div>
    </motion.div>
  );
};
