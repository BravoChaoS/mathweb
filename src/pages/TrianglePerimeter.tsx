import React, { useState } from 'react';
import StepControls from '../components/StepControls';

// Geometry Constants
const SIDE = 300; // Triangle side length
const RADIUS = SIDE / 2;
const HEIGHT = (Math.sqrt(3) / 2) * SIDE;
const CX = 400; // SVG Center X
const CY = 320; // SVG Center Y

// Vertices of Equilateral Triangle
// Top Vertex
const P1 = { x: CX, y: CY - (2 / 3) * HEIGHT };
// Bottom Left
const P2 = { x: CX - SIDE / 2, y: CY + (1 / 3) * HEIGHT };
// Bottom Right
const P3 = { x: CX + SIDE / 2, y: CY + (1 / 3) * HEIGHT };

const STEPS = [
  {
    title: "题目展示",
    description: "如图，求三角形内阴影部分的周长。阴影部分的边界由三段圆弧组成，每段圆弧的圆心都在三角形的顶点上，半径是边长的一半。"
  },
  {
    title: "分离圆弧",
    description: "阴影部分的周长由三段蓝色的弧线组成。每段弧线对应的圆心角都是60°（因为等边三角形的三个角都是60°）。"
  },
  {
    title: "线性排列",
    description: "我们将这三个扇形取下来，平移到同一条水平线上，准备进行拼接。"
  },
  {
    title: "拼接图形",
    description: "将它们紧密拼合在一起。三个60°的角拼在一起是多少度？ 60° × 3 = 180°。"
  },
  {
    title: "得出结论",
    description: "看！它们正好拼成了一个半圆。所以：阴影周长 = 半圆的弧长 = π × 半径 = 3.14 × (边长÷2)。"
  }
];

const TrianglePerimeter: React.FC = () => {
  const [step, setStep] = useState(0);

  // Helper to generate a sector path centered at (0,0) facing right (0 to angle)
  // We will rotate/translate this path using CSS transforms
  const createSectorPath = (r: number, angle: number) => {
    // Standard SVG arc math
    // Start at (r, 0)
    // End at (r*cos(a), r*sin(a))
    const rad = (angle * Math.PI) / 180;
    const x = r * Math.cos(rad);
    const y = r * Math.sin(rad);
    // Large arc flag is 0 for 60 degrees
    return `M 0 0 L ${r} 0 A ${r} ${r} 0 0 1 ${x} ${y} Z`;
  };

  const createArcLineOnly = (r: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const x = r * Math.cos(rad);
    const y = r * Math.sin(rad);
    return `M ${r} 0 A ${r} ${r} 0 0 1 ${x} ${y}`;
  }

  // Calculate transforms for each step
  const getTransform = (index: number) => {
    // index 0: Top Vertex (Needs to rotate to look down inside triangle)
    // index 1: Bottom Right (Needs to rotate to look left-up)
    // index 2: Bottom Left (Needs to rotate to look right-up)

    // Initial Triangle Rotation angles (based on 0 degrees = East)
    // Top Vertex (P1): Bisector is 90deg (South). Edges are at 60 and 120. 
    // Wait, createSectorPath draws from 0 to 60.
    // So if we rotate by 60deg, it covers 60 to 120. Matches Top vertex geometry.
    const initialRotations = [60, 180, 300]; 
    const initialPositions = [P1, P3, P2];

    if (step <= 1) {
      const pos = initialPositions[index];
      const rot = initialRotations[index];
      return `translate(${pos.x}px, ${pos.y}px) rotate(${rot}deg)`;
    }

    // Step 2 & 3: Move to center line
    // Target: A straight line of sectors forming a semicircle.
    // Semicircle range: 180 deg to 360 deg (Top half of a circle usually, or bottom half?)
    // Let's make a "Rainbow" shape (180 to 360) or "Smile" shape (0 to 180).
    // Let's do a "Rainbow" (Arc points up). 
    // Sector 1: 180-240 deg.
    // Sector 2: 240-300 deg.
    // Sector 3: 300-360 deg.
    
    // Target Center for the semi-circle
    const targetX = CX;
    const targetY = CY + 100;

    if (step === 2) {
        // Just move to separate positions nearby
        const offset = (index - 1) * (RADIUS + 20);
        return `translate(${targetX + offset}px, ${targetY}px) rotate(${180 + index * 60}deg)`;
    }

    if (step >= 3) {
      // Merge together
      // All share the same origin (targetX, targetY)
      // Rotations must align: 
      // Index 0 -> 180 deg (Left part of rainbow)
      // Index 1 -> 240 deg (Middle part)
      // Index 2 -> 300 deg (Right part)
      // Note: createSectorPath is 0..60.
      // Rot 180 covers 180..240. Correct.
      return `translate(${targetX}px, ${targetY}px) rotate(${180 + index * 60}deg)`;
    }

    return `translate(0,0)`;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">阴影部分的周长</h2>
      <div className="text-slate-500 mb-8">人教版六年级上册 · 圆的周长</div>

      <div className="relative bg-white rounded-2xl shadow-inner border border-slate-200 p-4 w-full max-w-[800px] aspect-[4/3] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 800 600" className="w-full h-full">
           <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />

          {/* Reference Triangle */}
          <path 
            d={`M${P1.x},${P1.y} L${P3.x},${P3.y} L${P2.x},${P2.y} Z`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="transition-opacity duration-1000"
            style={{ opacity: step >= 2 ? 0.1 : 1 }}
          />

          {/* Sectors */}
          {[0, 1, 2].map((i) => (
             <g 
                key={i} 
                className="math-shape" 
                style={{ 
                    transform: getTransform(i),
                    transformBox: 'view-box', // Important for SVG transforms
                    transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
             >
                {/* The Sector Fill */}
                <path 
                  d={createSectorPath(RADIUS, 60)} 
                  fill="#dbeafe" 
                  stroke="none"
                />
                {/* The Arc Line (The perimeter part) */}
                <path 
                  d={createArcLineOnly(RADIUS, 60)} 
                  fill="none"
                  stroke={step === 4 ? "#F59E0B" : "#4F46E5"}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                
                {/* Angle Label */}
                {step <= 1 && (
                    <text x={40} y={15} fontSize="14" fill="#64748b" transform="rotate(15)">60°</text>
                )}
             </g>
          ))}

          {/* Result Label */}
          {step === 4 && (
             <g className="animate-fade-in opacity-0" style={{ animation: 'fadeIn 1s forwards' }}>
                <text x={CX} y={CY + 40} textAnchor="middle" className="text-xl font-bold fill-slate-700">
                    半圆弧长 = π × r
                </text>
             </g>
          )}

        </svg>

        {step === 0 && (
           <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg border border-slate-100 text-sm text-slate-500 shadow-sm">
             半径 r = 边长 ÷ 2
           </div>
        )}
      </div>

      <StepControls 
        currentStep={step}
        totalSteps={STEPS.length}
        onNext={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
        onPrev={() => setStep(s => Math.max(0, s - 1))}
        onReset={() => setStep(0)}
        description={STEPS[step].description}
      />
    </div>
  );
};

export default TrianglePerimeter;