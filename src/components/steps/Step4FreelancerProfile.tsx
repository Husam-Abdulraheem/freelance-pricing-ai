import { usePricing } from '../../context/PricingContext';
import { User, Award, Briefcase } from 'lucide-react';
import type { ExperienceLevel } from '../../types/pricing';

export default function Step4FreelancerProfile() {
  const { state, updateFreelancerProfile, nextStep, prevStep } = usePricing();
  const { freelancerProfile } = state;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (freelancerProfile.yearsOfExperience >= 0) {
      nextStep();
    }
  };

  const expertiseOptions: { value: ExperienceLevel; label: string; desc: string }[] = [
    { value: 'junior', label: 'مبتدئ', desc: 'أقل من سنتين خبرة، أعمل على بناء معرض أعمالي.' },
    { value: 'mid', label: 'متوسط', desc: '2-5 سنوات خبرة، نفذت مشاريع متعددة بنجاح.' },
    { value: 'senior', label: 'خبير', desc: '+5 سنوات خبرة، متخصص في مجالي ولدي سجل حافل.' },
    { value: 'expert', label: 'مستشار', desc: '+10 سنوات خبرة، مرجع في المجال وأقدم حلولاً استراتيجية.' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الملف المهني</h2>
        <p className="text-gray-500">ساعدنا في تحديد قيمة خبرتك في السوق</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Years of Experience */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4" />
            عدد سنوات الخبرة
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.5"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="مثال: 3 سنوات"
              value={freelancerProfile.yearsOfExperience}
              onChange={(e) => updateFreelancerProfile({ yearsOfExperience: parseFloat(e.target.value) || 0 })}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              سنوات
            </span>
          </div>
        </div>

        {/* Expertise Level */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            <Award className="w-4 h-4" />
            المستوى المهني
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expertiseOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => updateFreelancerProfile({ expertiseLevel: option.value })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${freelancerProfile.expertiseLevel === option.value
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

        {/* Similar Projects */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center justify-center w-6 h-6 bg-white border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 transition-colors">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-blue-600"
                checked={freelancerProfile.hasSimilarProjects}
                onChange={(e) => updateFreelancerProfile({ hasSimilarProjects: e.target.checked })}
              />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                هل نفذت مشاريع مشابهة من قبل؟
              </div>
              <p className="text-xs text-gray-500 mt-1">
                الخبرة السابقة في نفس نوع المشروع تزيد من موثوقية التقدير.
              </p>
            </div>
          </label>
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
            التالي: السوق
          </button>
        </div>
      </form>
    </div>
  );
}
