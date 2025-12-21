export type Complexity = 'simple' | 'medium' | 'complex';
export type DeliverySpeed = 'normal' | 'urgent';
export type MarketType = 'local' | 'regional' | 'global';
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'expert';

export interface PricingPackage {
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface PricingResult {
  range: { min: number; max: number };
  level: 'economic' | 'standard' | 'premium';
  reasoning: string;
  packages: {
    economic: PricingPackage;
    standard: PricingPackage;
    premium: PricingPackage;
  };
  justification: string;
  currency: string;
}


export interface ServiceInfo {
  serviceType: string;
  description: string;
  deliverables: string;
}

export interface TechnicalDetails {
  tools: string[];
  complexity: Complexity;
  features: string[];
}

export interface EffortEstimation {
  estimatedHours: number;
  deliverySpeed: DeliverySpeed;
}

export interface FreelancerProfile {
  yearsOfExperience: number;
  expertiseLevel: ExperienceLevel;
  hasSimilarProjects: boolean;
}

export interface MarketInfo {
  freelancerLocation: string;
  clientLocation: string;
  marketType: MarketType;
}



export interface PricingState {
  step: number;
  serviceInfo: ServiceInfo;
  technicalDetails: TechnicalDetails;
  effortEstimation: EffortEstimation;
  freelancerProfile: FreelancerProfile;
  marketInfo: MarketInfo;
  pricingResult?: PricingResult;
}

export const INITIAL_STATE: PricingState = {
  step: 1,
  serviceInfo: {
    serviceType: '',
    description: '',
    deliverables: '',
  },
  technicalDetails: {
    tools: [],
    complexity: 'medium',
    features: [],
  },
  effortEstimation: {
    estimatedHours: 10,
    deliverySpeed: 'normal',
  },
  freelancerProfile: {
    yearsOfExperience: 1,
    expertiseLevel: 'mid',
    hasSimilarProjects: false,
  },
  marketInfo: {
    freelancerLocation: '',
    clientLocation: '',
    marketType: 'local',
  },
};
