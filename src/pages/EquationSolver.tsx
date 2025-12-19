import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, RefreshCw, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface EquationState {
  a: number;
  b: number;
  c: number; // RHS
  // equation is ax + b = c
}

interface Step {
  id: string;
  description: string;
  equationStr: string;
}

const EquationSolver: React.FC = () => {
  const [state, setState] = useState<EquationState>({ a: 2, b: 4, c: 10 });
  const [history, setHistory] = useState<Step[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Generate new problem
  const generateProblem = () => {
    // x should be integer [1..10]
    const x = Math.floor(Math.random() * 9) + 1;
    // a should be [1..5]
    const a = Math.floor(Math.random() * 4) + 1; // 1 to 5 actually (0..4 + 1) -> 1..5 is *5
    // b should be [1..10]
    const b = Math.floor(Math.random() * 10) + 1;
    const c = a * x + b;
    setState({ a, b, c });
    setHistory([{ id: 'init', description: '初始方程', equationStr: `${a}x + ${b} = ${c}` }]);
    setMessage(null);
    setInputVal('');
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleOperation = (op: '+' | '-' | '*' | '/') => {
    const val = Number(inputVal);
    if (!inputVal || isNaN(val) || val <= 0) {
      setMessage({ type: 'error', text: '请输入有效的正数' });
      return;
    }

    let { a, b, c } = state;
    let desc = '';

    // We apply operation to BOTH sides mathematically, 
    // but we need to see how it affects the Form ax + b = c.
    // Ideally we want to isolate x.

    // Strategy:
    // 1. Subtract b (or add if b is negative, but we simplify to positive for now)
    // 2. Divide by a

    // However, if user does something else, we calculate the new state.
    // e.g. 2x + 4 = 10. Subtract 2 -> 2x + 2 = 8.
    // e.g. Divide by 2 -> x + 2 = 5.

    // New state vars
    let newA = a;
    let newB = b;
    let newC = c;

    switch (op) {
      case '+':
        newB += val;
        newC += val;
        desc = `两边同时加 ${val}`;
        break;
      case '-':
        // Determine if we are subtracting from the constant term or just modifying the equation conceptually
        // For visual simplicity, we adjust b and c.
        newB -= val;
        newC -= val;
        desc = `两边同时减 ${val}`;
        break;
      case '*':
        newA *= val;
        newB *= val;
        newC *= val;
        desc = `两边同时乘 ${val}`;
        break;
      case '/':
        if (newA % val !== 0 || newB % val !== 0 || newC % val !== 0) {
          // For primary school, maybe warn if not divisible?
          setMessage({ type: 'info', text: '注意：除不尽可能会产生小数/分数' });
        }
        newA /= val;
        newB /= val;
        newC /= val;
        desc = `两边同时除以 ${val}`;
        break;
    }

    setState({ a: newA, b: newB, c: newC });

    const eqStr = `${Number(newA.toFixed(2))}x ${newB >= 0 ? '+' : '-'} ${Math.abs(Number(newB.toFixed(2)))} = ${Number(newC.toFixed(2))}`;

    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      description: desc,
      equationStr: formatEquation(newA, newB, newC)
    }]);

    // Check success
    if (newA === 1 && newB === 0) {
      setMessage({ type: 'success', text: `恭喜！解出 x = ${newC}` });
    } else {
      setMessage(null);
    }
  };

  const formatEquation = (a: number, b: number, c: number) => {
    // Handle cases like 1x, 0x, +0, etc.
    let lhs = '';
    if (a === 1) lhs += 'x';
    else if (a === 0) lhs += ''; // technically gone
    else lhs += `${Number(a.toFixed(2))}x`;

    if (b > 0) lhs += ` + ${Number(b.toFixed(2))}`;
    else if (b < 0) lhs += ` - ${Math.abs(Number(b.toFixed(2)))}`;
    else if (b === 0 && lhs === '') lhs += '0';

    return `${lhs} = ${Number(c.toFixed(2))}`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 max-w-7xl mx-auto min-h-[600px]">
      {/* Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Scale className="text-indigo-600" />
              解方程
            </h2>
            <button onClick={generateProblem} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="text-center p-6 bg-indigo-50 rounded-xl mb-6">
            <div className="text-4xl font-bold text-indigo-900 font-mono tracking-wider">
              {formatEquation(state.a, state.b, state.c)}
            </div>
          </div>

          {/* Operation Controls */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="输入数字"
                className="flex-1 p-3 border border-slate-300 rounded-xl text-lg font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleOperation('+')} className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                <span>+ (加)</span>
              </button>
              <button onClick={() => handleOperation('-')} className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                <span>- (减)</span>
              </button>
              <button onClick={() => handleOperation('*')} className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                <span>× (乘)</span>
              </button>
              <button onClick={() => handleOperation('/')} className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                <span>÷ (除)</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-800' : message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}
              >
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="font-bold">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4">解题步骤</h3>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {history.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-mono text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="text-slate-500 text-xs">{step.description}</div>
                  <div className="font-mono font-bold text-slate-700">{step.equationStr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visualization (Balance Scale) */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-inner p-4 relative min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-4 left-4 text-slate-400 text-sm font-bold tracking-widest">
          VISUALIZATION
        </div>

        {/* Balance Scale SVG */}
        <div className="relative w-full max-w-[600px] aspect-[4/3] flex items-center justify-center">
          <BalanceScale state={state} />
        </div>
      </div>
    </div>
  );
};

const BalanceScale: React.FC<{ state: EquationState }> = ({ state }) => {
  // We need to visually represent ax + b on Left, c on Right
  // And the tilt.
  // Actually, if it's an equation, it should be balanced (tilt = 0).
  // But if user made a mistake? (Our logic assumes operations on both sides, so it stays balanced).
  // So we just keep it balanced but animate the contents.

  const { a, b, c } = state;

  // Render Config
  const SCALE_WIDTH = 400;
  const PAN_Y = 100; // Relative to pivot

  return (
    <svg viewBox="0 0 500 300" className="w-full h-full">
      <g transform="translate(250, 150)">
        {/* Base */}
        <path d="M -40 100 L 40 100 L 0 0 Z" fill="#94a3b8" />

        {/* Beam (Balanced) */}
        <motion.g
          animate={{ rotate: 0 }} // Always balanced for valid equation operations
          transition={{ type: "spring", damping: 10 }}
        >
          <line x1={-200} y1={0} x2={200} y2={0} stroke="#475569" strokeWidth="8" strokeLinecap="round" />

          {/* Left Pan */}
          <g transform="translate(-200, 0)">
            <line x1={0} y1={0} x2={0} y2={80} stroke="#cbd5e1" strokeWidth="2" />
            <path d="M -60 80 Q 0 120 60 80" fill="none" stroke="#475569" strokeWidth="4" />

            {/* Left Content (ax + b) */}
            <g transform="translate(0, 80)">
              {/* Stack Items. We need a way to stack `a` boxes and `b` circles without overlap. */}
              {/* This is tricky in SVG alone. We can use a flex logic or simple grid. */}
              <PanContent type="left" countX={a} count1={b} />
            </g>
          </g>

          {/* Right Pan */}
          <g transform="translate(200, 0)">
            <line x1={0} y1={0} x2={0} y2={80} stroke="#cbd5e1" strokeWidth="2" />
            <path d="M -60 80 Q 0 120 60 80" fill="none" stroke="#475569" strokeWidth="4" />

            {/* Right Content (c) */}
            <g transform="translate(0, 80)">
              <PanContent type="right" countX={0} count1={c} />
            </g>
          </g>
        </motion.g>

        {/* Pivot Point */}
        <circle cx="0" cy="0" r="8" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
      </g>
    </svg>
  );
};

const PanContent: React.FC<{ type: 'left' | 'right', countX: number, count1: number }> = ({ type, countX, count1 }) => {
  // Simple visual stacker
  // X boxes are 30x30
  // 1 circles are r=10

  // We'll arrange them in a pyramid or pile.
  // For simplicity: X's at bottom, 1's on top.

  const elements = [];

  // X Boxes
  for (let i = 0; i < countX; i++) {
    // Arrange in row(s) of 3 centered
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = (col - 1) * 35;
    const y = -15 - (row * 35);

    elements.push(
      <motion.g key={`x-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} layout>
        <rect x={x - 15} y={y - 30} width="30" height="30" rx="4" fill="#6366f1" opacity="0.9" />
        <text x={x} y={y - 12} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">x</text>
      </motion.g>
    );
  }

  // 1 Circles (Weights)
  // Place them above the X's
  const startY = countX > 0 ? -15 - (Math.ceil(countX / 3) * 35) : -10;

  // Limit visualization for large numbers (c can act up to 50+)
  const displayCount1 = Math.min(count1, 50); // Cap at 50 for performance

  for (let i = 0; i < displayCount1; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const x = (col - 2) * 15; // 5 per row
    const y = startY - (row * 15);

    elements.push(
      <motion.circle
        key={`1-${i}`}
        cx={x} cy={y} r="6"
        fill="#10b981" stroke="white" strokeWidth="1"
        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
        layout
      />
    );
  }

  if (count1 > 50) {
    // Show a "+N" badge
    elements.push(
      <motion.text
        key="overflow"
        x={0} y={startY - 40}
        textAnchor="middle" fill="#0f766e" fontSize="12" fontWeight="bold"
      >
        +{Math.round(count1 - 50)} more
      </motion.text>
    );
  }

  return <AnimatePresence>{elements}</AnimatePresence>;
};

export default EquationSolver;
