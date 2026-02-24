import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Adjustments } from '../utils/adjustmentFilters';

interface AdjustmentsPanelProps {
  adjustments: Adjustments;
  onAdjust: (key: keyof Adjustments, value: number) => void;
  onReset: () => void;
  disabled: boolean;
}

const ADJUSTMENT_CONFIG: {
  key: keyof Adjustments;
  label: string;
  icon: string;
}[] = [
  { key: 'brightness', label: 'Brightness', icon: '☀' },
  { key: 'contrast', label: 'Contrast', icon: '◑' },
  { key: 'saturation', label: 'Saturation', icon: '◈' },
  { key: 'sharpness', label: 'Sharpness', icon: '◇' },
];

export function AdjustmentsPanel({
  adjustments,
  onAdjust,
  onReset,
  disabled,
}: AdjustmentsPanelProps) {
  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Adjustments
        </p>
        <button
          onClick={onReset}
          disabled={disabled}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-teal transition-colors disabled:opacity-40"
          title="Reset Adjustments"
        >
          <RotateCcw size={10} />
          Reset
        </button>
      </div>

      {ADJUSTMENT_CONFIG.map(({ key, label, icon }) => (
        <AdjustmentSlider
          key={key}
          label={label}
          icon={icon}
          value={adjustments[key]}
          onChange={(val) => onAdjust(key, val)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

interface AdjustmentSliderProps {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

function AdjustmentSlider({ label, icon, value, onChange, disabled }: AdjustmentSliderProps) {
  const isModified = value !== 0;

  return (
    <div className={`px-1 py-2 rounded transition-colors ${isModified ? 'bg-teal-muted' : ''}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{icon}</span>
          <span className={`text-xs font-medium ${isModified ? 'text-teal' : 'text-foreground'}`}>
            {label}
          </span>
        </div>
        <span
          className={`text-[10px] font-mono tabular-nums min-w-[28px] text-right ${
            isModified ? 'text-teal' : 'text-muted-foreground'
          }`}
        >
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <Slider
        min={-100}
        max={100}
        step={1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        disabled={disabled}
        className={`h-1 ${disabled ? 'opacity-40' : ''}`}
      />
    </div>
  );
}
