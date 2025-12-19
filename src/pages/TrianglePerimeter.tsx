import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ALargeSmall } from 'lucide-react';

const TrianglePerimeter: React.FC = () => {
    // State for side lengths
    const [sides, setSides] = useState({ a: 100, b: 100, c: 100 });

    // Constants for visuals
    const SCALE = 2; // Visual scale factor
    const MAX_SIDE = 200;

    // Check validity logic
    const isValid = useMemo(() => {
        const { a, b, c } = sides;
        return a + b > c && a + c > b && b + c > a;
    }, [sides]);

    // Derived properties
    const calculatedProperties = useMemo(() => {
        const { a, b, c } = sides;
        const s = (a + b + c) / 2;
        const area = isValid ? Math.sqrt(s * (s - a) * (s - b) * (s - c)) : 0;

        // Coordinates calculation
        // Place side c on x-axis: A(0,0) to B(c,0)
        // Vertex C(x,y)
        // x = (c^2 + b^2 - a^2) / (2c)
        // Note: We use 'b' as the side attached to A (Length AC = b) and 'a' as side attached to B (Length BC = a)
        // Standard convention: side 'a' is opposite A, 'b' opposite B, 'c' opposite C.
        // Let's stick to: Base is 'c' (AB). Left side is 'b' (AC). Right side is 'a' (BC).

        let x = 0;
        let y = 0;

        if (isValid) {
            x = (c * c + b * b - a * a) / (2 * c);
            const ySq = b * b - x * x;
            y = ySq > 0 ? -Math.sqrt(ySq) : 0; // Negative y to point up in SVG
        } else {
            // If invalid, we simulate them "collapsing"
            // If b + c < a (a is too long), AC and AB are collinear? No, that's complex.
            // Let's just calculate "attempted" coordinates or default to flat.

            // Scenario 1: c is too long (a+b < c). 
            // b lies on AB from A. a lies on AB from B. They don't meet.
            if (a + b <= c) {
                x = b; // Tip of side b
                y = 0;
            }
            // Scenario 2: b is too long (a+c < b).
            // Side b extends past c. Side a folds back?
            // Let's just keep 'b' flat along X-axis for visualization if it breaks
            else if (a + c <= b) {
                // x direction? 
                // Let's keep it simple: just flatten them.
                // If invalid, y = 0.
                // We need to determine x for C based on which inequality broke or just layout flat?

                // If we want "collapsed", we can just set y=0 and determine x so they try to meet.
                // Actually, simpler visual:
                // Base c is always (0,0) to (c,0).
                // Side b starts at (0,0).
                // Side a starts at (c,0).
                // If invalid, they lie on the axis.
                if (a + b <= c) { // Gap in middle
                    x = b;
                    y = 0;
                } else if (b + c <= a) { // a overlaps structure?
                    // a is huge.
                    // draw b going left? or calculate projection?
                    x = -b; // flatten away?
                    y = 0;
                }
                y = 0;
                // A heuristic position to show the "break"
                if (Math.abs(b - a) > c) {
                    // The difference is too big
                    if (b > a) x = b; // Flattened
                    else x = c - a;
                } else {
                    x = (c * c + b * b - a * a) / (2 * c); // Using the valid formula might give NaN or math trouble if impossible?
                    // (c^2 + b^2 - a^2) / 2c
                    // This formula works for Projection X even if triangle is invalid, 
                    // but b^2 - x^2 will be negative.
                    // So we keep X, set Y to 0.
                }
            }
        }

        return { area, x, y };
    }, [sides, isValid]);

    // Handlers
    const updateSide = (key: keyof typeof sides, value: number) => {
        setSides(prev => ({ ...prev, [key]: Math.min(MAX_SIDE, Math.max(10, value)) }));
    };

    const setPreset = (type: 'equilateral' | 'isosceles' | 'scalene') => {
        if (type === 'equilateral') setSides({ a: 100, b: 100, c: 100 });
        if (type === 'isosceles') setSides({ a: 100, b: 100, c: 150 });
        if (type === 'scalene') setSides({ a: 80, b: 120, c: 150 });
    };

    // Center the Drawing
    const offsetX = 400 - (sides.c * SCALE) / 2;
    const offsetY = 400; // Base Y

    const A = { x: offsetX, y: offsetY };
    const B = { x: offsetX + sides.c * SCALE, y: offsetY };
    const C = { x: offsetX + calculatedProperties.x * SCALE, y: offsetY + calculatedProperties.y * SCALE };

    // Validation Status Message
    let statusMessage = "三角形成立！";
    let statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (!isValid) {
        statusColor = "text-rose-600 bg-rose-50 border-rose-200";
        if (sides.a + sides.b <= sides.c) statusMessage = `无法构成：a + b (${sides.a + sides.b}) ≤ c (${sides.c})`;
        else if (sides.a + sides.c <= sides.b) statusMessage = `无法构成：a + c (${sides.a + sides.c}) ≤ b (${sides.b})`;
        else if (sides.b + sides.c <= sides.a) statusMessage = `无法构成：b + c (${sides.b + sides.c}) ≤ a (${sides.a})`;
    }

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 p-6 max-w-7xl mx-auto">

            {/* Left Panel: Controls */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ALargeSmall className="text-indigo-600" />
                        参数设置
                    </h2>

                    {/* Status Alert */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border mb-6 text-sm font-bold ${statusColor}`}
                    >
                        {statusMessage}
                    </motion.div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        {(['a', 'b', 'c'] as const).map(side => (
                            <div key={side}>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-600 uppercase">边 {side}</label>
                                    <span className="text-sm font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{sides[side]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="200"
                                    value={sides[side]}
                                    onChange={(e) => updateSide(side, parseInt(e.target.value))}
                                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${side === 'a' ? 'bg-indigo-200 accent-indigo-600' :
                                        side === 'b' ? 'bg-emerald-200 accent-emerald-600' :
                                            'bg-amber-200 accent-amber-600'
                                        }`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Presets */}
                    <div className="mt-8 grid grid-cols-3 gap-2">
                        <button onClick={() => setPreset('equilateral')} className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">
                            等边
                        </button>
                        <button onClick={() => setPreset('isosceles')} className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">
                            等腰
                        </button>
                        <button onClick={() => setPreset('scalene')} className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors">
                            不等边
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="text-slate-500 text-sm">
                            周长: <span className="font-bold text-slate-800">{sides.a + sides.b + sides.c}</span>
                        </div>
                        {isValid && (
                            <div className="text-slate-500 text-sm">
                                面积: <span className="font-bold text-slate-800">{calculatedProperties.area.toFixed(1)}</span>
                            </div>
                        )}
                        <button onClick={() => setPreset('equilateral')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-2">三角形三边关系定理</h3>
                    <p className="text-sm text-indigo-700 leading-relaxed">
                        在任意三角形中，任意两边之和大于第三边。
                        <br /><br />
                        公式表示：<br />
                        a + b &gt; c<br />
                        a + c &gt; b<br />
                        b + c &gt; a
                    </p>
                </div>
            </div>

            {/* Right Panel: Visualization */}
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 800 600" className="w-full h-full">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="800" height="600" fill="url(#grid)" />

                    {/* Base C */}
                    <g>
                        <line
                            x1={A.x} y1={A.y}
                            x2={B.x} y2={B.y}
                            stroke="#d97706"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <text x={(A.x + B.x) / 2} y={A.y + 30} textAnchor="middle" className="text-sm font-bold fill-amber-600">c = {sides.c}</text>
                    </g>

                    {/* Side B (from A) */}
                    <g>
                        <motion.line
                            initial={false}
                            animate={{ x1: A.x, y1: A.y, x2: C.x, y2: C.y }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            stroke="#059669"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <motion.text
                            animate={{ x: (A.x + C.x) / 2 - 20, y: (A.y + C.y) / 2 }}
                            textAnchor="middle"
                            className="text-sm font-bold fill-emerald-600"
                        >
                            b = {sides.b}
                        </motion.text>
                    </g>

                    {/* Side A (from B) */}
                    <g>
                        <motion.line
                            initial={false}
                            animate={{ x1: B.x, y1: B.y, x2: C.x, y2: C.y }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            stroke="#4f46e5"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <motion.text
                            animate={{ x: (B.x + C.x) / 2 + 20, y: (B.y + C.y) / 2 }}
                            textAnchor="middle"
                            className="text-sm font-bold fill-indigo-600"
                        >
                            a = {sides.a}
                        </motion.text>
                    </g>

                    {/* Vertices */}
                    <circle cx={A.x} cy={A.y} r="6" fill="#64748b" />
                    <circle cx={B.x} cy={B.y} r="6" fill="#64748b" />
                    <motion.circle
                        animate={{ cx: C.x, cy: C.y }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        r={isValid ? "6" : "4"}
                        fill={isValid ? "#64748b" : "#ef4444"}
                    />

                    {/* Invalid Indicator (Gap) */}
                    {!isValid && (
                        <motion.path
                            d={`M ${C.x} ${C.y} L ${C.x} ${C.y}`}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            stroke="#ef4444"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                    )}

                </svg>
            </div>
        </div>
    );
};

export default TrianglePerimeter;
