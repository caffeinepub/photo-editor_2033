import { useState, useCallback } from 'react';
import { FILTER_PRESETS, FilterPreset } from '../utils/filterPresets';

export function useFilters() {
  const [activeFilterId, setActiveFilterId] = useState<string>('none');

  const activeFilter = FILTER_PRESETS.find((f) => f.id === activeFilterId) ?? FILTER_PRESETS[0];

  const selectFilter = useCallback((id: string) => {
    setActiveFilterId(id);
  }, []);

  const resetFilter = useCallback(() => {
    setActiveFilterId('none');
  }, []);

  return {
    filters: FILTER_PRESETS as FilterPreset[],
    activeFilter,
    activeFilterId,
    selectFilter,
    resetFilter,
  };
}
