import { PricingProvider } from './context/PricingContext';
import PricingWizard from './components/PricingWizard';



function App() {
  return (
    <PricingProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900" dir="rtl">
        <PricingWizard />
      </div>
    </PricingProvider>
  );
}

export default App;
