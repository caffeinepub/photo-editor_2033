import { useState, useCallback } from 'react';
import { Adjustments, DEFAULT_ADJUSTMENTS } from '../utils/adjustmentFilters';

export function useAdjustments() {
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULT_ADJUSTMENTS);

  const setAdjustment = useCallback((key: keyof Adjustments, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAdjustments = useCallback(() => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
  }, []);

  return {
    adjustments,
    setAdjustment,
    resetAdjustments,
  };
}
