export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
};

/**
 * Convert adjustment values (-100 to +100) to CSS filter string.
 */
export function adjustmentsToCssFilter(adj: Adjustments): string {
  // brightness: 0 => 1.0, -100 => 0.2, +100 => 2.0
  const brightness = 1 + (adj.brightness / 100) * 1.0;
  // contrast: 0 => 1.0, -100 => 0.2, +100 => 2.5
  const contrast = 1 + (adj.contrast / 100) * 1.5;
  // saturation: 0 => 1.0, -100 => 0, +100 => 2.5
  const saturation = 1 + (adj.saturation / 100) * 1.5;

  const parts: string[] = [
    `brightness(${Math.max(0.1, brightness).toFixed(3)})`,
    `contrast(${Math.max(0.1, contrast).toFixed(3)})`,
    `saturate(${Math.max(0, saturation).toFixed(3)})`,
  ];

  // Sharpness via contrast boost (CSS doesn't have a direct sharpness filter)
  if (adj.sharpness > 0) {
    const extra = 1 + (adj.sharpness / 100) * 0.5;
    parts.push(`contrast(${extra.toFixed(3)})`);
  }

  return parts.join(' ');
}

/**
 * Combine a filter preset string with adjustment filters.
 */
export function combineFilters(presetFilter: string, adjustments: Adjustments): string {
  const adjFilter = adjustmentsToCssFilter(adjustments);
  if (presetFilter === 'none') return adjFilter;
  return `${presetFilter} ${adjFilter}`;
}
