import { useState } from 'react';
import { Header } from './components/common/Header';
import { InputSection } from './components/decision/InputSection';
import { ResultDisplay } from './components/decision/ResultDisplay';
import { getDecision } from './api/client';
import type { DecisionResponse } from './api/client';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [result, setResult] = useState<DecisionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (situation: string) => {
    console.log("Analyzing dilemma:", situation);
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await getDecision(situation);
      // Simulate extra loading for "Thinking" effect
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Something went wrong while analyzing.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full py-20 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[1000px] flex flex-col items-center">
        <Header />
        
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InputSection onSubmit={handleAnalyze} isLoading={loading} />
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 text-center space-y-4"
                >
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-3 h-3 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-slate-400 font-medium animate-pulse">
                    Analyzing your situation...
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ResultDisplay result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-20 text-center text-slate-600 text-sm">
        Built with Precision by Nabla AI © 2026
      </footer>
    </div>
  );
}

export default App;
