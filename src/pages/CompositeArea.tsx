import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Scissors, Calculator, RotateCw } from 'lucide-react';

interface Shape {
  id: string;
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label?: string;
  rotation?: number;
}

const CompositeArea: React.FC = () => {
  const initialShapes: Shape[] = [
    { id: 's1', type: 'rect', x: 100, y: 100, width: 200, height: 100, color: 'bg-indigo-400', label: 'A', rotation: 0 },
    { id: 's2', type: 'rect', x: 100, y: 200, width: 100, height: 150, color: 'bg-emerald-400', label: 'B', rotation: 0 },
  ];

  const [shapes, setShapes] = useState<Shape[]>(initialShapes);

  const GRID_SIZE = 20;

  const handleSplit = () => {
    setShapes(prev => prev.map(s => {
      if (s.id === 's1') return { ...s, x: 50, y: 50 }; // Move A up/left
      if (s.id === 's2') return { ...s, x: 280, y: 250 }; // Move B down/right
      return s;
    }));
  };

  const handleReset = () => {
    setShapes(initialShapes);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 max-w-7xl mx-auto">
      {/* Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MousePointer2 className="text-indigo-600" />
            组合图形面积
          </h2>

          <p className="text-slate-600 mb-4">
            拖拽图形来观察面积的组合与分割。
            (Drag shapes to observe area composition and splitting)
          </p>

          <div className="space-y-4">
            <button onClick={handleSplit} className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-colors">
              <Scissors size={20} />
              分割图形 (Split)
            </button>
            <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
              <RotateCw size={20} />
              重置 (Reset)
            </button>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-4">
            <Calculator size={18} />
            面积计算
          </h3>
          <div className="space-y-2">
            {shapes.map(shape => (
              <div key={shape.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                <span className="font-bold text-slate-700">图形 {shape.label}</span>
                <span className="font-mono text-indigo-600">{shape.width / GRID_SIZE} × {shape.height / GRID_SIZE} = {(shape.width * shape.height) / (GRID_SIZE * GRID_SIZE)}</span>
              </div>
            ))}
            <div className="border-t border-indigo-200 pt-2 mt-2 flex justify-between items-center font-bold text-lg">
              <span>总面积:</span>
              <span className="text-indigo-700">
                {shapes.reduce((acc, s) => acc + (s.width * s.height), 0) / (GRID_SIZE * GRID_SIZE)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner relative overflow-hidden min-h-[500px]"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
        }}>

        <div className="absolute top-4 left-4 text-slate-400 text-sm font-bold tracking-widest pointer-events-none">
          CANVAS (1 unit = {GRID_SIZE}px)
        </div>

        {/* Target Outline (L-Shape Goal) */}
        <div className="absolute top-[100px] left-[350px] opacity-80 pointer-events-none">
          <div className="absolute top-0 left-0 w-[200px] h-[100px] border-4 border-dashed border-indigo-300 bg-indigo-50/50 flex items-center justify-center">
            <span className="text-indigo-400 font-bold">Target</span>
          </div>
          <div className="absolute top-[100px] left-0 w-[100px] h-[150px] border-4 border-dashed border-indigo-300 border-t-0 bg-indigo-50/50"></div>
          {/* Dimensions for Target */}
          <div className="absolute -top-6 left-0 w-[200px] text-center text-xs font-mono text-indigo-400">200</div>
          <div className="absolute top-[100px] -left-8 h-[150px] flex items-center text-xs font-mono text-indigo-400">150</div>
          <div className="absolute top-0 -left-8 h-[100px] flex items-center text-xs font-mono text-indigo-400">100</div>
          <div className="absolute top-[250px] left-0 w-[100px] text-center text-xs font-mono text-indigo-400">100</div>
        </div>

        {/* Shapes */}
        {shapes.map(shape => (
          <motion.div
            key={shape.id}
            drag
            dragMomentum={false}
            animate={{ x: shape.x, y: shape.y }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onDragEnd={(e, info) => {
              setShapes(prev => prev.map(s =>
                s.id === shape.id
                  ? { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y }
                  : s
              ));
            }}
            className={`absolute flex items-center justify-center shadow-lg border-2 border-white/50 cursor-grab active:cursor-grabbing hover:brightness-110 ${shape.color}`}
            style={{
              width: shape.width,
              height: shape.height
              // No inline x needed if handled by animate/initial
            }}
            initial={{ x: shape.x, y: shape.y }}
          >
            <span className="text-white font-bold opacity-80 select-none">{shape.label}</span>

            {/* Dimensions Label */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-slate-500 bg-white/80 px-1 rounded pointer-events-none">
              {shape.width / GRID_SIZE}
            </div>
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 text-xs font-mono text-slate-500 bg-white/80 px-1 rounded pointer-events-none">
              {shape.height / GRID_SIZE}
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
};

export default CompositeArea;
