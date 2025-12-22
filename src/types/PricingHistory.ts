import type { PricingState, PricingResult } from './pricing';

export interface PricingHistoryItem {
  id: string; // UUID
  timestamp: number;
  clientName: string;
  projectName: string;
  state: PricingState;
  result: PricingResult;
}
