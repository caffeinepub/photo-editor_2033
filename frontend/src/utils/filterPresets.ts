export interface FilterPreset {
  id: string;
  name: string;
  filter: string;
  icon: string;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'none',
    name: 'Original',
    filter: 'none',
    icon: '○',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    filter: 'saturate(1.6) contrast(1.15) brightness(1.05)',
    icon: '◉',
  },
  {
    id: 'bw',
    name: 'B&W',
    filter: 'grayscale(1) contrast(1.1)',
    icon: '◑',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    filter: 'sepia(0.85) contrast(1.05) brightness(1.05)',
    icon: '◐',
  },
  {
    id: 'warm',
    name: 'Warm',
    filter: 'saturate(1.2) sepia(0.25) brightness(1.08) hue-rotate(-10deg)',
    icon: '◕',
  },
  {
    id: 'cool',
    name: 'Cool',
    filter: 'saturate(1.1) brightness(1.05) hue-rotate(20deg)',
    icon: '◔',
  },
  {
    id: 'fade',
    name: 'Fade',
    filter: 'saturate(0.7) brightness(1.15) contrast(0.85)',
    icon: '◌',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    filter: 'contrast(1.4) saturate(1.2) brightness(0.9)',
    icon: '◈',
  },
  {
    id: 'matte',
    name: 'Matte',
    filter: 'contrast(0.9) saturate(0.85) brightness(1.1)',
    icon: '◇',
  },
];
