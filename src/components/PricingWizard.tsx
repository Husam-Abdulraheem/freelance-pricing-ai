import { usePricing } from '../context/PricingContext';
import Step1ServiceInfo from './steps/Step1ServiceInfo';
import Step2TechnicalDetails from './steps/Step2TechnicalDetails';
import Step3EffortEstimation from './steps/Step3EffortEstimation';
import Step4FreelancerProfile from './steps/Step4FreelancerProfile';
import Step5MarketInfo from './steps/Step5MarketInfo';
import PricingResults from './PricingResults';
import PlaceholderStep from './steps/PlaceholderStep';
import { Layers, Zap, Clock, User, Globe } from 'lucide-react';

export default function PricingWizard() {
  const { state } = usePricing();
  const currentStep = state.step;

  const steps = [
    { id: 1, title: 'الخدمة', icon: Layers },
    { id: 2, title: 'التعقيد', icon: Zap },
    { id: 3, title: 'الجهد', icon: Clock },
    { id: 4, title: 'الخبرة', icon: User },
    { id: 5, title: 'السوق', icon: Globe },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ServiceInfo />;
      case 2:
        return <Step2TechnicalDetails />;
      case 3:
        return <Step3EffortEstimation />;
      case 4:
        return <Step4FreelancerProfile />;
      case 5:
        return <Step5MarketInfo />;
      default:
        return <PricingResults />;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-['Tajawal']">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className={`flex flex-col items-center ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-1 transition-colors
                  ${isActive ? 'border-blue-600 bg-blue-50' : isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            );
          })}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
        {renderStep()}
      </div>
    </div>
  );
}
