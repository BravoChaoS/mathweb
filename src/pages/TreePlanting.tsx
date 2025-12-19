import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, Info } from 'lucide-react';

// Tree Component - Moved outside to prevent re-mounting on every render
const TreeIcon: React.FC<{ x: number, y: number, index: number, isGhost?: boolean }> = ({ x, y, index, isGhost = false }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0, x, y }}
    animate={{ scale: 1, opacity: isGhost ? 0.3 : 1, x, y }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ delay: index * 0.05, type: "spring" }}
  >
    {/* Simple Tree SVG - Adjusted coordinates to be centered at (0,0) for better positioning */}
    <path d="M 0 0 L 0 -20" stroke="#854d0e" strokeWidth="4" />
    <path d="M 0 -20 L -10 -10 L -6 -20 L -12 -30 L 0 -50 L 12 -30 L 6 -20 L 10 -10 Z" fill={isGhost ? "#cbd5e1" : "#16a34a"} />
    <circle cx="0" cy="0" r="3" fill="#3f3f46" />
  </motion.g>
);

const TreePlanting: React.FC = () => {
  const [totalLength, setTotalLength] = useState(100); // meters
  const [interval, setInterval] = useState(20); // meters
  const [mode, setMode] = useState<'both' | 'one' | 'neither' | 'closed'>('both');

  // Calculations
  const gapCount = Math.floor(totalLength / interval);

  let treeCount = 0;
  let explanation = "";
  let formula = "";

  switch (mode) {
    case 'both':
      treeCount = gapCount + 1;
      explanation = "两端都种：树的数量比间隔数多 1";
      formula = "棵数 = 间隔数 + 1";
      break;
    case 'one':
      treeCount = gapCount;
      explanation = "只种一端（或闭合曲线）：树的数量等于间隔数";
      formula = "棵数 = 间隔数";
      break;
    case 'neither':
      treeCount = Math.max(0, gapCount - 1);
      explanation = "两端都不种：树的数量比间隔数少 1";
      formula = "棵数 = 间隔数 - 1";
      break;
    case 'closed':
      treeCount = gapCount;
      explanation = "封闭路路线（圆形）：树的数量等于间隔数";
      formula = "棵数 = 间隔数";
      break;
  }

  // Visuals
  const VISUAL_WIDTH = 600;
  const VISUAL_HEIGHT = 400;
  const PADDING = 60;
  const START_X = PADDING;
  const END_X = VISUAL_WIDTH - PADDING;
  const DRAW_LENGTH = END_X - START_X; // 480px representing `totalLength`

  // Safety check for division by zero, though min interval is 5
  const scale = totalLength > 0 ? DRAW_LENGTH / totalLength : 1; // pixels per meter

  const renderLinear = () => {
    const trees = [];
    const gaps = [];

    // Trees
    // We iterate up to gapCount. 
    // If mode is 'neither', we skip 0 and gapCount.
    // If mode is 'one', we skip gapCount (end).
    // If mode is 'both', we include 0 and gapCount.

    // However, gapCount is 'number of intervals'. Points are 0..gapCount. (Total gapCount+1 points).
    // Wait. points count is gapCount + 1.

    const numPoints = gapCount + 1;

    for (let i = 0; i < numPoints; i++) {
      const x = START_X + i * interval * scale;

      // Check if this point should have a tree
      let isTree = false;
      if (mode === 'both') isTree = true;
      else if (mode === 'one') isTree = (i < gapCount); // First 'gapCount' points. i.e. 0 to gapCount-1. point 'gapCount' is Last.
      else if (mode === 'neither') isTree = (i > 0 && i < gapCount);

      // Limit x to within bounds visually (sometimes floating point errors)
      if (x > END_X + 2) break;

      if (isTree) {
        trees.push(<TreeIcon key={`tree-${i}`} x={x} y={VISUAL_HEIGHT / 2} index={i} />);
      } else {
        trees.push(<TreeIcon key={`ghost-${i}`} x={x} y={VISUAL_HEIGHT / 2} index={i} isGhost={true} />);
      }
    }

    // Gaps Labels
    for (let i = 0; i < gapCount; i++) {
      const x = START_X + i * interval * scale + (interval * scale) / 2;
      if (x > END_X) break;

      gaps.push(
        <motion.text
          key={`gap-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={x}
          y={VISUAL_HEIGHT / 2 + 30}
          textAnchor="middle"
          className="text-xs fill-slate-400 font-mono"
        >
          {interval}m
        </motion.text>
      );
    }

    return (
      <>
        {/* Road */}
        <line x1={START_X} y1={VISUAL_HEIGHT / 2} x2={END_X} y2={VISUAL_HEIGHT / 2} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />

        {/* Length Label */}
        <path d={`M ${START_X} ${VISUAL_HEIGHT / 2 + 50} H ${END_X}`} stroke="#64748b" strokeWidth="1" />
        <path d={`M ${START_X} ${VISUAL_HEIGHT / 2 + 45} V ${VISUAL_HEIGHT / 2 + 55}`} stroke="#64748b" strokeWidth="1" />
        <path d={`M ${END_X} ${VISUAL_HEIGHT / 2 + 45} V ${VISUAL_HEIGHT / 2 + 55}`} stroke="#64748b" strokeWidth="1" />
        <text x={VISUAL_WIDTH / 2} y={VISUAL_HEIGHT / 2 + 70} textAnchor="middle" className="fill-slate-600 font-bold">总长: {gapCount * interval}m (余 {totalLength - gapCount * interval}m)</text>

        <AnimatePresence>
          {gaps}
          {trees}
        </AnimatePresence>
      </>
    );
  };

  const renderCircular = () => {
    const CX = VISUAL_WIDTH / 2;
    const CY = VISUAL_HEIGHT / 2;
    const R = 120;

    // For circular, totalLength is circumference.
    // We place trees around.

    const trees = [];
    const gaps = [];

    for (let i = 0; i < gapCount; i++) {
      // Angle for tree i
      const angle = (i * interval / totalLength) * 360 - 90; // Start at top
      const rad = angle * Math.PI / 180;
      const tx = CX + R * Math.cos(rad);
      const ty = CY + R * Math.sin(rad);

      trees.push(<TreeIcon key={`circ-tree-${i}`} x={tx} y={ty} index={i} />);

      // Gap label
      // Position between i and i+1
      // Angle shift for half interval
      const halfAngle = (interval / 2 / totalLength) * 360;
      const labelAngle = angle + halfAngle;
      const labelRad = labelAngle * Math.PI / 180;

      const lx = CX + (R - 25) * Math.cos(labelRad);
      const ly = CY + (R - 25) * Math.sin(labelRad);

      gaps.push(
        <text key={`gap-${i}`} x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] fill-slate-400">
          {interval}
        </text>
      );
    }

    return (
      <>
        <circle cx={CX} cy={CY} r={R} stroke="#94a3b8" strokeWidth="4" fill="none" />
        <AnimatePresence>
          {trees}
          {gaps}
        </AnimatePresence>
        <text x={CX} y={CY} textAnchor="middle" className="fill-slate-300 font-bold text-4xl opacity-20">{totalLength}m</text>
      </>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 max-w-7xl mx-auto">
      {/* Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trees className="text-emerald-600" />
            植树问题演示
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">总长 (Total Length)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range" min="10" max="200" step="10"
                  value={totalLength} onChange={e => setTotalLength(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="font-mono bg-slate-100 px-2 py-1 rounded">{totalLength}m</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">间隔 (Interval)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range" min="5" max="50" step="5"
                  value={interval} onChange={e => setInterval(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="font-mono bg-slate-100 px-2 py-1 rounded">{interval}m</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">种植模式 (Mode)</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setMode('both')} className={`p-2 rounded border text-sm ${mode === 'both' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 hover:bg-slate-50'}`}>两端都种</button>
                <button onClick={() => setMode('one')} className={`p-2 rounded border text-sm ${mode === 'one' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 hover:bg-slate-50'}`}>只种一端</button>
                <button onClick={() => setMode('neither')} className={`p-2 rounded border text-sm ${mode === 'neither' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 hover:bg-slate-50'}`}>两端不种</button>
                <button onClick={() => setMode('closed')} className={`p-2 rounded border text-sm ${mode === 'closed' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 hover:bg-slate-50'}`}>封闭圆形</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 space-y-4">
          <h3 className="font-bold text-emerald-900 flex items-center gap-2">
            <Info size={18} />
            计算结果
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-emerald-100">
              <div className="text-xs text-slate-500 uppercase">间隔数 (Gaps)</div>
              <div className="text-2xl font-bold text-slate-800">{gapCount}</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-emerald-100">
              <div className="text-xs text-slate-500 uppercase">树的棵数 (Trees)</div>
              <div className="text-2xl font-bold text-emerald-600">{treeCount}</div>
            </div>
          </div>

          <div className="text-sm text-emerald-800 bg-white/50 p-3 rounded-lg">
            <strong>规律总结：</strong><br />
            {explanation}<br />
            <code className="block mt-2 bg-emerald-100 p-1 rounded text-center font-bold">{formula}</code>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center justify-center relative overflow-hidden p-4 min-h-[500px]">
        <div className="absolute top-4 left-4 text-slate-400 text-sm font-bold tracking-widest">VISUALIZATION</div>
        <svg viewBox={`0 0 ${VISUAL_WIDTH} ${VISUAL_HEIGHT}`} className="w-full h-full max-h-[600px]">
          {mode === 'closed' ? renderCircular() : renderLinear()}
        </svg>
      </div>
    </div>
  );
};

export default TreePlanting;
