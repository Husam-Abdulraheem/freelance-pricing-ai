import React, { useState } from 'react';
import { usePricing } from '../../context/PricingContext';
import { Cpu, BarChart, Zap, X } from 'lucide-react';
import type { Complexity } from '../../types/pricing';

export default function Step2TechnicalDetails() {
  const { state, updateTechnicalDetails, nextStep, prevStep } = usePricing();
  const { technicalDetails } = state;
  const [newTool, setNewTool] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const handleAddTool = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTool.trim()) {
      e.preventDefault();
      updateTechnicalDetails({ tools: [...technicalDetails.tools, newTool.trim()] });
      setNewTool('');
    }
  };

  const removeTool = (toolIndex: number) => {
    const updatedTools = technicalDetails.tools.filter((_, i) => i !== toolIndex);
    updateTechnicalDetails({ tools: updatedTools });
  };

  const handleAddFeature = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newFeature.trim()) {
      e.preventDefault();
      updateTechnicalDetails({ features: [...technicalDetails.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (featureIndex: number) => {
    const updatedFeatures = technicalDetails.features.filter((_, i) => i !== featureIndex);
    updateTechnicalDetails({ features: updatedFeatures });
  };


  const complexOptions: { value: Complexity; label: string; desc: string }[] = [
    { value: 'simple', label: 'بسيط', desc: 'ميزات أساسية، صفحات ثابتة، لا يتطلب قواعد بيانات معقدة.' },
    { value: 'medium', label: 'متوسط', desc: 'تفاعل مستخدم، قواعد بيانات، لوحة تحكم بسيطة.' },
    { value: 'complex', label: 'معقد', desc: 'نظام ضخم، تكاملات متعددة، ذكاء اصطناعي، أمان عالي.' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">التقنية والتعقيد</h2>
        <p className="text-gray-500">حدد الأدوات ومستويات التعقيد للمشروع</p>
      </div>

      <div className="space-y-8">
        {/* Tools Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Cpu className="w-4 h-4" />
            التقنيات والأدوات المستخدمة
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="اكتب اسم الأداة واضغط Enter (مثال: React, Figma, Python)..."
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={handleAddTool}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {technicalDetails.tools.map((tool, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {tool}
                <button onClick={() => removeTool(index)} className="mr-2 hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Complexity Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            <BarChart className="w-4 h-4" />
            مستوى تعقيد المشروع
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {complexOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => updateTechnicalDetails({ complexity: option.value })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${technicalDetails.complexity === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="font-bold text-gray-900 mb-1">{option.label}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{option.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Zap className="w-4 h-4" />
            ميزات خاصة (اختياري)
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="أضف ميزات خاصة واضغط Enter (مثال: دعم متعدد اللغات، بوابات دفع)..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={handleAddFeature}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {technicalDetails.features.map((feature, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {feature}
                <button onClick={() => removeFeature(index)} className="mr-2 hover:text-purple-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <button
            onClick={prevStep}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            السابق
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
          >
            التالي: تقدير الجهد
          </button>
        </div>
      </div>
    </div>
  );
}
