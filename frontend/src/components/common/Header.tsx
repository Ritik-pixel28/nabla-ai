import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" } as any}
      className="text-center mb-16 space-y-6"
    >
      <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
        AI-Powered Clarity
      </div>
      <h1 className="text-8xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 tracking-tighter leading-none">
        Nabla
      </h1>
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Stop overthinking. <span className="text-blue-500">Start deciding.</span>
        </h2>
        <p className="text-slate-400 text-xl font-medium leading-relaxed opacity-70">
          The ultimate engine for high-stakes career and life choices. 
          Powered by reasoning, built for action.
        </p>
      </div>
    </motion.div>
  );
};
