import React from 'react';

interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  description?: string;
}

const StepControls: React.FC<StepControlsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onReset,
  description
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 mt-6 w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-slate-700">演示步骤 {currentStep + 1} / {totalSteps}</h3>
          <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-slate-600 text-lg leading-relaxed min-h-[3.5rem]">
          {description || "请点击下一步观看演示..."}
        </p>
      </div>
      
      <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
        <button
          onClick={onReset}
          className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors mr-auto"
        >
          重置
        </button>
        
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            currentStep === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          上一步
        </button>
        
        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className={`px-6 py-2 rounded-lg font-medium text-white shadow-md transition-all ${
            currentStep === totalSteps - 1
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
          }`}
        >
          下一步
        </button>
      </div>
    </div>
  );
};

export default StepControls;