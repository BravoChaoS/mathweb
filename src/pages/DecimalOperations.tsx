import React, { useState } from 'react';
import { Calculator, X, RefreshCw } from 'lucide-react';

const DecimalOperations: React.FC = () => {
  const [num1, setNum1] = useState<number>(0.3);
  const [num2, setNum2] = useState<number>(0.4);
  const [showResult, setShowResult] = useState<boolean>(true);

  // Ensure precision
  const n1 = Math.round(num1 * 10); // 0.3 -> 3
  const n2 = Math.round(num2 * 10); // 0.4 -> 4
  const product = (num1 * num2).toFixed(2);

  // Generate grid cells
  const cells = Array.from({ length: 100 }, (_, i) => {
    const row = Math.floor(i / 10);
    const col = i % 10;

    // Representation: 
    // Num1 (0.X) -> Vertical Columns (Yellow)
    // Num2 (0.Y) -> Horizontal Rows (Blue)
    const inCols = col < n1;
    const inRows = row < n2;
    const isOverlap = inCols && inRows;

    return {
      id: i,
      row,
      col,
      inCols,
      inRows,
      isOverlap
    };
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Calculator size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">小数乘法 (Decimal Multiplication)</h1>
        </div>
        <p className="text-slate-600">
          通过面积模型来理解小数乘法。计算 <span className="font-mono bg-slate-100 px-1 rounded text-orange-600">{num1}</span> × <span className="font-mono bg-slate-100 px-1 rounded text-blue-600">{num2}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Area */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-8">
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">1</span>
              设置第一个小数 (0.X)
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">竖向列</span>
                <span className="text-orange-600">{num1}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={num1}
                onChange={(e) => setNum1(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0.1</span>
                <span>0.5</span>
                <span>0.9</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
              设置第二个小数 (0.Y)
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">横向行</span>
                <span className="text-blue-600">{num2}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={num2}
                onChange={(e) => setNum2(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0.1</span>
                <span>0.5</span>
                <span>0.9</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 text-sm">算式计算</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Results</span>
            </div>
            <div className="text-3xl font-mono font-bold text-slate-800 flex items-center justify-center gap-2 py-2">
              <span className="text-orange-600">{num1}</span>
              <span className="text-slate-300">×</span>
              <span className="text-blue-600">{num2}</span>
              <span className="text-slate-300">=</span>
              <span className="text-emerald-600">{product}</span>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex flex-col items-center">
          <h3 className="font-semibold text-slate-800 mb-6 w-full text-left">面积模型 (1.0 × 1.0)</h3>

          <div className="relative w-full max-w-[400px] aspect-square bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-inner">
            {/* CSS Grid for cells */}
            <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
              {cells.map((cell) => {
                // Determine styling based on overlap state
                let bgClass = 'bg-white';
                let borderClass = 'border-[0.5px] border-slate-100';

                if (cell.isOverlap) {
                  bgClass = 'bg-emerald-400/80'; // Intersection
                  borderClass = 'border-[0.5px] border-emerald-500/30';
                } else if (cell.inCols) {
                  bgClass = 'bg-orange-200/50'; // Num1
                  borderClass = 'border-[0.5px] border-orange-200/50';
                } else if (cell.inRows) {
                  bgClass = 'bg-blue-200/50'; // Num2
                  borderClass = 'border-[0.5px] border-blue-200/50';
                }

                return (
                  <div
                    key={cell.id}
                    className={`${bgClass} ${borderClass} transition-colors duration-300 flex items-center justify-center`}
                    title={`Pos: ${cell.col},${cell.row}`}
                  >
                    {/* Optional: Show small dots on intersection for counting */}
                    {cell.isOverlap && (
                      <div className="w-1 h-1 bg-emerald-600 rounded-full opacity-50" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Axis Labels (Optional Enhancement) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-slate-300 rounded-lg"></div>
          </div>

          {/* Stats Legend */}
          <div className="mt-8 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-200 border border-orange-300"></div>
              <span className="text-slate-600">{n1} 列 ({num1})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-200 border border-blue-300"></div>
              <span className="text-slate-600">{n2} 行 ({num2})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-400 border border-emerald-500"></div>
              <span className="text-slate-600">重叠 {n1 * n2} 格 ({product})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecimalOperations;
