import type { PricingHistoryItem } from '../types/PricingHistory';

const HISTORY_STORAGE_KEY = 'pricing_history';
const MAX_HISTORY_ITEMS = 50; // Limit to prevent localStorage overflow

/**
 * Generate a simple UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Save a pricing item to history
 */
export function saveToHistory(item: Omit<PricingHistoryItem, 'id' | 'timestamp'>): void {
  try {
    const history = loadHistory();

    const newItem: PricingHistoryItem = {
      ...item,
      id: generateUUID(),
      timestamp: Date.now(),
    };

    // Add to beginning of array (most recent first)
    history.unshift(newItem);

    // Keep only MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save to history:', error);
    // If localStorage is full, try to delete oldest items
    try {
      const history = loadHistory();
      const reducedHistory = history.slice(0, Math.floor(MAX_HISTORY_ITEMS / 2));
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(reducedHistory));
    } catch {
      console.error('Failed to recover from storage error');
    }
  }
}

/**
 * Load all pricing history
 */
export function loadHistory(): PricingHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Delete a specific history item by ID
 */
export function deleteHistoryItem(id: string): void {
  try {
    const history = loadHistory();
    const filtered = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}

/**
 * Clear all history
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

/**
 * Export history as JSON string
 */
export function exportHistory(): string {
  const history = loadHistory();
  return JSON.stringify(history, null, 2);
}

/**
 * Import history from JSON string
 */
export function importHistory(data: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return { success: false, error: 'البيانات المستوردة يجب أن تكون مصفوفة' };
    }

    // Basic validation
    for (const item of parsed) {
      if (!item.id || !item.timestamp || !item.clientName || !item.result) {
        return { success: false, error: 'صيغة البيانات غير صحيحة' };
      }
    }

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(parsed));
    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل تحليل البيانات. تأكد من صحة ملف JSON' };
  }
}
