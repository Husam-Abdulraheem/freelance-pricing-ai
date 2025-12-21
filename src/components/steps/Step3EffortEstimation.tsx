import { usePricing } from '../../context/PricingContext';
import { Clock, Calendar } from 'lucide-react';
import type { DeliverySpeed } from '../../types/pricing';

export default function Step3EffortEstimation() {
  const { state, updateEffortEstimation, nextStep, prevStep } = usePricing();
  const { effortEstimation } = state;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effortEstimation.estimatedHours > 0) {
      nextStep();
    }
  };

  const deliveryOptions: { value: DeliverySpeed; label: string; desc: string }[] = [
    { value: 'normal', label: 'تسليم عادي', desc: 'جدول زمني مريح، يسمح بالجودة العالية والمراجعة المتأنية.' },
    { value: 'urgent', label: 'تسليم مستعجل', desc: 'يتطلب العمل ساعات إضافية أو في عطلات نهاية الأسبوع (سعر أعلى).' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تقدير الجهد والوقت</h2>
        <p className="text-gray-500">كم من الوقت يحتاج هذا العمل لإنجازه؟</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Estimated Hours */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            عدد الساعات التقديرية
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="مثال: 20 ساعة"
              value={effortEstimation.estimatedHours}
              onChange={(e) => updateEffortEstimation({ estimatedHours: parseInt(e.target.value) || 0 })}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              ساعة عمل
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            قدّر الوقت اللازم للتخطيط، التصميم، البرمجة، والاختبار.
          </p>
        </div>

        {/* Delivery Speed */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            <Calendar className="w-4 h-4" />
            موعد التسليم
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => updateEffortEstimation({ deliverySpeed: option.value })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${effortEstimation.deliverySpeed === option.value
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
            className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
          >
            التالي: الملف المهني
          </button>
        </div>
      </form>
    </div>
  );
}
