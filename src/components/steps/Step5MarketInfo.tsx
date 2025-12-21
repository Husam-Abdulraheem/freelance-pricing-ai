import React from 'react';
import { usePricing } from '../../context/PricingContext';
import { Globe, MapPin, Building } from 'lucide-react';
import type { MarketType } from '../../types/pricing';

export default function Step5MarketInfo() {
  const { state, updateMarketInfo, nextStep, prevStep } = usePricing();
  const { marketInfo } = state;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (marketInfo.freelancerLocation && marketInfo.marketType) {
      nextStep(); // Goes to results step
    }
  };

  const marketOptions: { value: MarketType; label: string; desc: string }[] = [
    { value: 'local', label: 'سوق محلي', desc: 'منافسة محدودة، أسعار مرتبطة بالاقتصاد المحلي.' },
    { value: 'regional', label: 'سوق إقليمي', desc: 'منافسة متوسطة، تتطلب جودة أعلى وفهم ثقافي.' },
    { value: 'global', label: 'سوق عالمي', desc: 'منافسة شرسة، تتطلب معايير عالمية (أسعار دولية).' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">السوق والموقع</h2>
        <p className="text-gray-500">أين تقدم خدماتك وما هو جمهورك المستهدف؟</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              مكان إقامتك (الدولة)
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="مثال: السعودية، مصر..."
              value={marketInfo.freelancerLocation}
              onChange={(e) => updateMarketInfo({ freelancerLocation: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">يؤثر على تكلفة المعيشة الأساسية.</p>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4" />
              دولة العميل (اختياري)
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="مثال: الإمارات، أمريكا..."
              value={marketInfo.clientLocation}
              onChange={(e) => updateMarketInfo({ clientLocation: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">يؤثر على القدرة الشرائية المتوقعة.</p>
          </div>
        </div>

        {/* Market Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            <Globe className="w-4 h-4" />
            نطاق السوق المستهدف
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => updateMarketInfo({ marketType: option.value })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${marketInfo.marketType === option.value
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

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            السابق
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
          >
            عرض التسعير المقترح
          </button>
        </div>
      </form>
    </div>
  );
}
