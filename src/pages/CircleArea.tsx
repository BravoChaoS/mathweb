import React, { useState } from 'react';
import StepControls from '../components/StepControls';

const CircleArea: React.FC = () => {
  const [step, setStep] = useState(0);
  const [sliceCount, setSliceCount] = useState(16);

  const RADIUS = 140;
  const CX = 400;
  const CY = 240;

  const STEPS = [
    {
      title: "整圆展示",
      description: `这是一个标准的圆。我们将它平均分成${sliceCount}份，每一份都是一个小扇形。`
    },
    {
      title: "红蓝分组",
      description: "为了看得更清楚，我们将上半圆涂成蓝色，下半圆涂成红色。"
    },
    {
      title: "展开变形",
      description: "将圆拆开。蓝色的扇形（上半圆）保持尖角朝下，红色的扇形（下半圆）旋转为尖角朝上。"
    },
    {
      title: "交错拼合",
      description: `将红蓝两组扇形像牙齿一样互相咬合。当分数为${sliceCount}时，上下边缘${sliceCount >= 32 ? '几乎就是' : '看起来越来越像'}直线。`
    },
    {
      title: "推导公式",
      description: "这就拼成了一个近似的长方形！\n长 = 圆周长的一半(πr)，宽 = 半径(r)。\n面积 = 长×宽 = πr × r = πr²。"
    }
  ];

  // A single slice path pointing DOWN (centered at 0,0, for Top Half use)
  // Angle width = 360 / sliceCount
  const anglePerSlice = 360 / sliceCount;
  const halfAngle = anglePerSlice / 2;

  const createWedgePath = () => {
    // A wedge pointing RIGHT (0 deg).
    // Start (-halfAngle) to (+halfAngle)
    const r = RADIUS;
    const a1 = -halfAngle * Math.PI / 180;
    const a2 = halfAngle * Math.PI / 180;

    const x1 = r * Math.cos(a1);
    const y1 = r * Math.sin(a1);
    const x2 = r * Math.cos(a2);
    const y2 = r * Math.sin(a2);

    return `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };

  const getTransform = (index: number) => {
    // index 0..(N/2-1) are Top Half (Blue)
    // index (N/2)..(N-1) are Bottom Half (Red)
    const isTop = index < sliceCount / 2;

    // Initial Circle State
    // Start angle = 180 + halfAngle (to center the first wedge)
    const initialAngle = 180 + halfAngle + index * anglePerSlice;

    if (step <= 1) {
      return `translate(${CX}px, ${CY}px) rotate(${initialAngle}deg)`;
    }

    // Step 2 & 3: Rectangle Formation
    // Rect Dimensions
    const arcLength = (Math.PI * RADIUS); // Half circumference
    const sliceWidth = arcLength / (sliceCount / 2); // Width of one slice along the rect edge

    // Start X for the rectangle (Centered)
    const startX = CX - arcLength / 2 + sliceWidth / 2;

    if (step >= 2) {
      // Target Rotation:
      // Top pieces (Blue) point DOWN -> 90 deg
      // Bottom pieces (Red) point UP -> -90 deg (or 270)

      // Target Position:
      const posIndex = index % (sliceCount / 2);

      // X Position
      let tx = startX + posIndex * sliceWidth;

      let ty = 0;
      let txFinal = tx;

      if (isTop) {
        ty = CY + 50; // Bottom line
        // Rotation: -90 (Points Up).
        // Wait, Top Piece should be Blue. Blue is Top Half.
        // In rect: Blue is Top part. So Curve is Top. Point is Bottom.
        // So (0,0) is at Bottom Line. Radius points Up.
        // Rotation: -90.
      } else {
        // Bottom Piece (Red). Bottom Half.
        // In rect: Curve is Bottom. Point is Top.
        // So (0,0) is at Top Line. Radius points Down.
        ty = CY - 50; // Top line
        // Rotation: 90.

        // Shift X: The red pieces slot in between blue pieces.
        txFinal += sliceWidth / 2;
      }

      // Animation Stage 2: Just Separate vertically
      if (step === 2) {
        const sepY = isTop ? CY - 60 : CY + 60;
        return `translate(${txFinal}px, ${sepY}px) rotate(${isTop ? -90 : 90}deg)`;
      }

      // Animation Stage 3: Merge
      if (step >= 3) {
        return `translate(${txFinal}px, ${ty}px) rotate(${isTop ? -90 : 90}deg)`;
      }
    }

    return `translate(${CX}px, ${CY}px)`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full max-w-[800px] justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">圆的面积公式推导</h2>
          <div className="text-slate-500">人教版六年级上册 · 圆的面积</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">切分份数:</span>
          <select
            value={sliceCount}
            onChange={(e) => setSliceCount(Number(e.target.value))}
            className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={8}>8份</option>
            <option value={16}>16份</option>
            <option value={32}>32份</option>
            <option value={64}>64份 (极限)</option>
          </select>
        </div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-inner border border-slate-200 p-4 w-full max-w-[800px] aspect-[4/3] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 800 500" className="w-full h-full">
          <defs>
            {/* Blue Gradient for Top */}
            <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            {/* Red Gradient for Bottom */}
            <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {Array.from({ length: sliceCount }).map((_, i) => {
            const isTop = i < sliceCount / 2;
            // Determine color based on step. 
            const fill = step === 0
              ? (i % 2 === 0 ? "#818cf8" : "#6366f1")
              : (isTop ? "url(#blueGrad)" : "url(#redGrad)");

            return (
              <g
                key={i}
                className="math-shape"
                style={{
                  transform: getTransform(i),
                  transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy effect
                  transformBox: 'view-box'
                }}
              >
                <path
                  d={createWedgePath()}
                  fill={fill}
                  stroke="white"
                  strokeWidth={sliceCount > 32 ? "0.5" : "1"}
                />
              </g>
            );
          })}

          {/* Labels for Final Step */}
          {step === 4 && (
            <g className="animate-fade-in opacity-0" style={{ animation: 'fadeIn 1s forwards 0.5s' }}>
              {/* Width Brace */}
              <path
                d={`M ${CX - 220} ${CY + 70} H ${CX + 220}`}
                stroke="#334155" strokeWidth="2"
                fill="none"
              />
              <path d={`M ${CX - 220} ${CY + 65} V ${CY + 75}`} stroke="#334155" strokeWidth="2" />
              <path d={`M ${CX + 220} ${CY + 65} V ${CY + 75}`} stroke="#334155" strokeWidth="2" />

              <text x={CX} y={CY + 100} textAnchor="middle" fill="#334155" fontSize="18" fontWeight="bold">
                长 = πr (圆周长的一半)
              </text>

              {/* Height Brace */}
              <path
                d={`M ${CX + 240} ${CY - 50} V ${CY + 50}`}
                stroke="#334155" strokeWidth="2"
                fill="none"
              />
              <path d={`M ${CX + 235} ${CY - 50} H ${CX + 245}`} stroke="#334155" strokeWidth="2" />
              <path d={`M ${CX + 235} ${CY + 50} H ${CX + 245}`} stroke="#334155" strokeWidth="2" />

              <text x={CX + 260} y={CY + 5} fill="#334155" fontSize="18" fontWeight="bold">
                宽 = r
              </text>
            </g>
          )}

        </svg>
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

export default CircleArea;