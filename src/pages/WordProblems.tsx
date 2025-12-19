import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowRight, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';

// --- Types ---
type ProblemType = 'multiple' | 'sum_diff' | 'movement';

interface Problem {
  id: string;
  title: string;
  text: string;
  type: ProblemType;
  params: {
    unitLabel: string;   // e.g. "舞蹈队"
    totalLabel: string; // e.g. "合唱队"
    multiple?: number;   // e.g. 4
    totalValue?: number; // e.g. 48
    diffValue?: number;
    unitValue?: number; // The answer (12)
  };
  hint: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 'p1',
    title: '倍数关系 (Multiples)',
    text: '学校合唱队有48人，是舞蹈队人数的4倍。舞蹈队有多少人？',
    type: 'multiple',
    params: {
      unitLabel: '舞蹈队',
      totalLabel: '合唱队',
      multiple: 4,
      totalValue: 48,
      unitValue: 12
    },
    hint: '设舞蹈队有 x 人，那么合唱队有多少人？'
  },
  {
    id: 'p2',
    title: '和倍问题 (Sum-Multiples)',
    text: '果园里桃树和梨树一共有280棵，桃树的棵数是梨树的3倍。梨树有多少棵？',
    type: 'multiple', // Strictly 'sum_multiple' but can adapt
    params: {
      unitLabel: '梨树',
      totalLabel: '桃树', // Note: This mapping might need adjustment for Sum-Multiples logic
      multiple: 3,
      totalValue: 280, // This is sum
      unitValue: 70
    },
    hint: '设梨树有 x 棵，那么桃树有 3x 棵。一共 280 棵。'
  }
];

// --- Components ---

const BarModel = ({ problem, showSolution }: { problem: Problem; showSolution: boolean }) => {
  const { unitLabel, totalLabel, multiple = 1, totalValue } = problem.params;

  // Dimensions
  const barHeight = 40;
  const gap = 20;
  const startX = 100;
  const unitWidth = 60; // Base width for 'x'

  // Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };

  const barVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: (custom: number) => ({
      width: custom,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" }
    })
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 overflow-x-auto min-h-[300px] flex items-center justify-center">
      <svg width={600} height={300} className="w-full max-w-2xl">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Unit Bar (Unknown x) */}
        <g transform={`translate(${startX}, 50)`}>
          <text x="-10" y={barHeight / 2} textAnchor="end" dominantBaseline="middle" className="text-sm font-bold fill-slate-600">
            {unitLabel}
          </text>
          <motion.rect
            initial="hidden"
            animate="visible"
            custom={unitWidth}
            variants={barVariants}
            height={barHeight}
            fill="#6366f1"
            rx="4"
          />
          <text x={unitWidth / 2} y={barHeight / 2} textAnchor="middle" dominantBaseline="middle" className="text-white font-bold fill-white">
            x
          </text>
        </g>

        {/* Total Bar (Known Multiple) */}
        <g transform={`translate(${startX}, ${50 + barHeight + gap})`}>
          <text x="-10" y={barHeight / 2} textAnchor="end" dominantBaseline="middle" className="text-sm font-bold fill-slate-600">
            {totalLabel}
          </text>

          {/* Render segments */}
          {Array.from({ length: multiple }).map((_, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: i * (unitWidth + 2) }} // +2 for gap
              transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
            >
              <rect
                width={unitWidth}
                height={barHeight}
                fill="#f43f5e"
                rx="4"
              />
              <text x={unitWidth / 2} y={barHeight / 2} textAnchor="middle" dominantBaseline="middle" className="text-white font-medium text-xs">
                x
              </text>
            </motion.g>
          ))}

          {/* Brace for Total */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <path
              d={`M 0 ${barHeight + 10} q 10 10 20 10 h ${(multiple * unitWidth) / 2 - 30} q 10 0 10 10 q 0 -10 10 -10 h ${(multiple * unitWidth) / 2 - 30} q 10 0 20 -10`}
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              transform={`translate(0, 0)`}
            />
            <text
              x={(multiple * unitWidth) / 2}
              y={barHeight + 40}
              textAnchor="middle"
              className="text-slate-700 font-bold"
            >
              {totalValue} 人
            </text>
          </motion.g>
        </g>
      </svg>
    </div>
  );
};

const EquationBuilder = ({ problem, onSolve }: { problem: Problem; onSolve: (eq: string) => void }) => {
  const [equation, setEquation] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    // Simple check logic (very basic for now)
    // For p1: "4x=48" or "4*x=48"
    const cleanEq = equation.replace(/\s/g, '').toLowerCase();
    const correct = cleanEq === '4x=48' || cleanEq === '4*x=48' || cleanEq === 'x*4=48';

    setIsCorrect(correct);
    if (correct) {
      onSolve(equation);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Calculator size={20} className="text-indigo-500" />
        列出方程 (Equation Builder)
      </h3>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <div className="relative">
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="例如: 4x = 48"
              className={`w-full p-4 text-xl font-mono border-2 rounded-lg outline-none transition-colors
                ${isCorrect === true ? 'border-green-500 bg-green-50' :
                  isCorrect === false ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'}
              `}
            />
            {isCorrect === true && (
              <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {isCorrect === false && (
            <p className="text-red-500 text-sm mt-2">试试看: {problem.hint}</p>
          )}
        </div>

        <button
          onClick={checkAnswer}
          className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          验证 (Check)
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <p className="text-sm text-slate-400 w-full mb-2">常用符号:</p>
        {['x', '=', '+', '-', '*', '/'].map(sym => (
          <button
            key={sym}
            onClick={() => setEquation(prev => prev + sym)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 font-mono font-bold text-indigo-600 transition-colors"
          >
            {sym}
          </button>
        ))}
      </div>
    </div>
  );
};

const WordProblems: React.FC = () => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [solved, setSolved] = useState(false);

  const problem = PROBLEMS[currentProblemIndex];

  const handleNext = () => {
    if (currentProblemIndex < PROBLEMS.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setSolved(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">列方程解决问题</h1>
          <p className="text-slate-500 mt-1">Solving Word Problems with Equations</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <HelpCircle size={24} />
          </button>
        </div>
      </header>

      {/* Problem Card */}
      <motion.div
        key={problem.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden"
      >
        {/* Title Bar */}
        <div className="bg-indigo-50/50 p-6 border-b border-indigo-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
              Problem {currentProblemIndex + 1}
            </span>
            <h2 className="text-lg font-bold text-indigo-900">{problem.title}</h2>
          </div>
          {/* Progress dots or simple counter */}
          <div className="text-slate-400 text-sm">
            {currentProblemIndex + 1} / {PROBLEMS.length}
          </div>
        </div>

        <div className="p-8">
          <p className="text-2xl text-slate-800 leading-relaxed font-medium mb-8">
            {problem.text}
          </p>

          <BarModel problem={problem} showSolution={solved} />

          <EquationBuilder problem={problem} onSolve={() => setSolved(true)} />

          {solved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6"
            >
              <h3 className="font-bold text-green-800 mb-2">解题过程 (Solution):</h3>
              <div className="font-mono text-green-700 space-y-1">
                <p>解：设{problem.params.unitLabel}有 x 人。</p>
                <p className="pl-8">{problem.params.multiple}x = {problem.params.totalValue}</p>
                <p className="pl-8">  x = {problem.params.totalValue} ÷ {problem.params.multiple}</p>
                <p className="pl-8">  x = {problem.params.unitValue}</p>
                <p>答：{problem.params.unitLabel}有 {problem.params.unitValue} 人。</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!solved || currentProblemIndex === PROBLEMS.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                    ${solved
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                `}
          >
            下一题 (Next)
            <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WordProblems;
