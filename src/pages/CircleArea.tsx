import React, { useState } from 'react';
import StepControls from '../components/StepControls';

const CircleArea: React.FC = () => {
  const [step, setStep] = useState(0);
  const SLICES = 16; 
  
  const RADIUS = 140;
  const CX = 400;
  const CY = 240;

  const STEPS = [
    {
      title: "整圆展示",
      description: "这是一个标准的圆。我们将它平均分成16份，每一份都是一个小扇形。"
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
      description: "将红蓝两组扇形像牙齿一样互相咬合。因为分得够细，上下边缘看起来很像直线。"
    },
    {
      title: "推导公式",
      description: "这就拼成了一个近似的长方形！\n长 = 圆周长的一半(πr)，宽 = 半径(r)。\n面积 = 长×宽 = πr × r = πr²。"
    }
  ];

  // A single slice path pointing DOWN (centered at 0,0, for Top Half use)
  // Angle width = 360 / 16 = 22.5 deg.
  // We draw it symmetric around Y axis? No, let's draw standard from -11.25 to +11.25
  const anglePerSlice = 360 / SLICES;
  const halfAngle = anglePerSlice / 2;
  
  const createWedgePath = () => {
    // A wedge pointing DOWN (for top half pieces in final state)
    // Vertices: (0,0), and arc from bottom-left to bottom-right
    // Actually, let's draw it pointing UP (Standard -90 deg in SVG is Up)
    // Then we rotate it.
    
    // Let's define a wedge pointing RIGHT (0 deg).
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
    // index 0..7 are Top Half (Blue)
    // index 8..15 are Bottom Half (Red)
    const isTop = index < SLICES / 2;
    
    // Initial Circle State
    // We want the slices to form a circle. 
    // index 0 should be at angle... let's say -90 (Top).
    // The wedge is defined pointing RIGHT (0 deg).
    // So to put index 0 at top, we rotate -90.
    // But we have 16 slices. 
    // Let's arrange them 0..15 clockwise starting from West (-180)?
    // Standard: 0 is Right.
    // Let's put Top Half (0..7) in the upper semi-circle (180 to 360 / -180 to 0).
    // Let's put Bottom Half (8..15) in lower semi-circle (0 to 180).
    
    // Let's map index 0 to Angle 180+halfAngle (Left side of top half).
    // Wait, simpler:
    // Top Half: Angles from 180 to 360.
    // Bottom Half: Angles from 0 to 180.
    
    // Let's just start from 180 (Left) and go clockwise.
    // Start angle = 180 + halfAngle (to center the first wedge)
    const initialAngle = 180 + halfAngle + index * anglePerSlice;

    if (step <= 1) {
      return `translate(${CX}px, ${CY}px) rotate(${initialAngle}deg)`;
    }

    // Step 2 & 3: Rectangle Formation
    // Rect Dimensions
    const arcLength = (Math.PI * RADIUS); // Half circumference
    const sliceWidth = arcLength / (SLICES / 2); // Width of one slice along the rect edge
    
    // Start X for the rectangle (Centered)
    const startX = CX - arcLength / 2 + sliceWidth / 2;

    if (step >= 2) {
        // Target Rotation:
        // Top pieces (Blue) point DOWN -> 90 deg
        // Bottom pieces (Red) point UP -> -90 deg (or 270)
        const targetRotation = isTop ? 90 : 270;
        
        // Target Position:
        // We interlace them.
        // Top pieces are at x = startX + i * sliceWidth
        // Bottom pieces are shifted by half a slice width? 
        // No, in the classic visual, they fit perfectly side by side.
        // B R B R B R ...
        // Index 0 (Blue), Index 8 (Red), Index 1 (Blue), Index 9 (Red)...
        
        // Let's arrange them based on their position in the sequence 0..(N/2-1)
        const posIndex = index % (SLICES / 2);
        
        // X Position
        let tx = startX + posIndex * sliceWidth;
        
        // If it's a bottom piece, it sits "between" the top pieces?
        // Actually, usually it's:
        // V A V A V A
        // The "points" of Top are at Y + R. The "bases" are at Y.
        // The "points" of Bottom are at Y. The "bases" are at Y + R.
        
        // Let's align them on a middle line Y.
        // Top Piece: Center (0,0) is at Y. Radius points down to Y+R.
        // Bottom Piece: Center (0,0) is at Y+R. Radius points up to Y.
        // This makes them interlock perfectly.
        
        let ty = 0;
        let txFinal = tx;

        if (isTop) {
            ty = CY - 50; // Top line of the rect
            // With rotation 90, the wedge points DOWN.
            // (0,0) is the sharp point.
            // If we want the sharp point to be at the bottom of the rect? No.
            // In the "Rectangle", the Top pieces have their CURVE at the top, POINT at the bottom.
            // The Bottom pieces have CURVE at bottom, POINT at top.
            
            // Current Wedge: Points Right.
            // Rotate 270 (-90): Points Up. (Curve is up, Point is down? No. Wedge is Pizza Slice.)
            // Wedge (0,0) is the Center of the Pie (Point).
            // Curve is at R.
            
            // Top Piece: We want Curve Top, Point Bottom.
            // So Point is at (tx, RectBottom). Curve is at (tx, RectTop).
            // Vector (0,0)->(R,0) is the radius.
            // We want vector to point UP (-90 deg).
            // So (0,0) will be at the BOTTOM of the rectangle line.
            
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
            // Blue pieces are at i=0, 1, 2...
            // Red pieces are at i=0.5, 1.5, 2.5...
            txFinal += sliceWidth / 2;
        }

        // Animation Stage 2: Just Separate vertically
        if (step === 2) {
             const sepY = isTop ? CY - 60 : CY + 60;
             // Keep original rotation roughly or reset?
             // Let's rotate them to vertical but keep them apart
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
      <h2 className="text-3xl font-bold text-slate-800 mb-2">圆的面积公式推导</h2>
      <div className="text-slate-500 mb-8">人教版六年级上册 · 圆的面积</div>

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

          {Array.from({ length: SLICES }).map((_, i) => {
             const isTop = i < SLICES / 2;
             // Determine color based on step. 
             // Step 0: All one color? Or just nice alternating? 
             // Step 1+: Blue vs Red.
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
                    strokeWidth="1"
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