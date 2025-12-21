import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type PricingState, INITIAL_STATE, type PricingResult } from '../types/pricing';

interface PricingContextType {
  state: PricingState;
  updateStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateServiceInfo: (data: Partial<PricingState['serviceInfo']>) => void;
  updateTechnicalDetails: (data: Partial<PricingState['technicalDetails']>) => void;
  updateEffortEstimation: (data: Partial<PricingState['effortEstimation']>) => void;
  updateFreelancerProfile: (data: Partial<PricingState['freelancerProfile']>) => void;
  updateMarketInfo: (data: Partial<PricingState['marketInfo']>) => void;
  updatePricingResult: (result: PricingResult) => void;
  resetPricing: () => void;
}

const STORAGE_KEY = 'pricing_wizard_state';

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PricingState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const updateStep = (step: number) => {
    setState((prev) => ({ ...prev, step }));
  };

  const nextStep = () => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 6) }));
  };

  const prevStep = () => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const updateServiceInfo = (data: Partial<PricingState['serviceInfo']>) => {
    setState((prev) => ({
      ...prev,
      serviceInfo: { ...prev.serviceInfo, ...data },
      pricingResult: undefined, // Invalidate cached result
    }));
  };

  const updateTechnicalDetails = (data: Partial<PricingState['technicalDetails']>) => {
    setState((prev) => ({
      ...prev,
      technicalDetails: { ...prev.technicalDetails, ...data },
      pricingResult: undefined, // Invalidate cached result
    }));
  };

  const updateEffortEstimation = (data: Partial<PricingState['effortEstimation']>) => {
    setState((prev) => ({
      ...prev,
      effortEstimation: { ...prev.effortEstimation, ...data },
      pricingResult: undefined, // Invalidate cached result
    }));
  };

  const updateFreelancerProfile = (data: Partial<PricingState['freelancerProfile']>) => {
    setState((prev) => ({
      ...prev,
      freelancerProfile: { ...prev.freelancerProfile, ...data },
      pricingResult: undefined, // Invalidate cached result
    }));
  };

  const updateMarketInfo = (data: Partial<PricingState['marketInfo']>) => {
    setState((prev) => ({
      ...prev,
      marketInfo: { ...prev.marketInfo, ...data },
      pricingResult: undefined, // Invalidate cached result
    }));
  };

  const updatePricingResult = (result: PricingResult) => {
    setState((prev) => ({ ...prev, pricingResult: result }));
  };

  const resetPricing = () => {
    setState(INITIAL_STATE);
  };

  return (
    <PricingContext.Provider
      value={{
        state,
        updateStep,
        nextStep,
        prevStep,
        updateServiceInfo,
        updateTechnicalDetails,
        updateEffortEstimation,
        updateFreelancerProfile,
        updateMarketInfo,
        updatePricingResult,
        resetPricing,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}
