import { usePricing } from '../../context/PricingContext';

export default function PlaceholderStep({ title }: { title: string }) {
  const { nextStep, prevStep } = usePricing();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-500">سيتم تنفيذ هذه الخطوة قريباً...</p>
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          السسابق
        </button>
        <button
          onClick={nextStep}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          التالي
        </button>
      </div>
    </div>
  );
}
