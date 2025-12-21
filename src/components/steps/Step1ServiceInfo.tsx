import { usePricing } from '../../context/PricingContext';
import { Briefcase, FileText, CheckSquare } from 'lucide-react';

export default function Step1ServiceInfo() {
  const { state, updateServiceInfo, nextStep } = usePricing();
  const { serviceInfo } = state;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceInfo.serviceType && serviceInfo.description) {
      nextStep();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات الخدمة</h2>
        <p className="text-gray-500">أخبرنا عن المشروع الذي تود تسعيره</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4" />
            نوع الخدمة
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="مثال: تصميم شعار، تطوير موقع إلكتروني..."
            value={serviceInfo.serviceType}
            onChange={(e) => updateServiceInfo({ serviceType: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            وصف مختصر للعمل
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder="اشرح بإيجاز ما المطلوب تنفيذه..."
            value={serviceInfo.description}
            onChange={(e) => updateServiceInfo({ description: e.target.value })}
          />
        </div>

        {/* Deliverables */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <CheckSquare className="w-4 h-4" />
            المخرجات المتوقعة
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="مثال: ملفات مفتوحة المصدر، نسخة تجريبية..."
            value={serviceInfo.deliverables}
            onChange={(e) => updateServiceInfo({ deliverables: e.target.value })}
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            التالي: التقنية والتعقيد
          </button>
        </div>
      </form>
    </div>
  );
}
