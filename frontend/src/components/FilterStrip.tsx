import React, { useRef } from 'react';
import { FilterPreset } from '../utils/filterPresets';
import { ImageData } from '../hooks/useImageUpload';

interface FilterStripProps {
  filters: FilterPreset[];
  activeFilterId: string;
  onSelectFilter: (id: string) => void;
  imageData: ImageData | null;
}

export function FilterStrip({ filters, activeFilterId, onSelectFilter, imageData }: FilterStripProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 overflow-x-auto">
      {filters.map((filter) => (
        <FilterThumbnail
          key={filter.id}
          filter={filter}
          isActive={filter.id === activeFilterId}
          onSelect={() => onSelectFilter(filter.id)}
          imageData={imageData}
        />
      ))}
    </div>
  );
}

interface FilterThumbnailProps {
  filter: FilterPreset;
  isActive: boolean;
  onSelect: () => void;
  imageData: ImageData | null;
}

function FilterThumbnail({ filter, isActive, onSelect, imageData }: FilterThumbnailProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        flex-shrink-0 flex flex-col items-center gap-1.5 group transition-all duration-150
      `}
    >
      <div
        className={`
          relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-150
          ${isActive
            ? 'border-teal shadow-teal scale-105'
            : 'border-editor-border hover:border-teal/50 hover:scale-102'
          }
        `}
      >
        {imageData ? (
          <img
            src={imageData.src}
            alt={filter.name}
            className="w-full h-full object-cover"
            style={{ filter: filter.filter === 'none' ? undefined : filter.filter }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-lg"
            style={{
              background: 'linear-gradient(135deg, oklch(0.55 0.18 185), oklch(0.65 0.16 75))',
              filter: filter.filter === 'none' ? undefined : filter.filter,
            }}
          >
            <span className="text-white/80 text-xs">{filter.icon}</span>
          </div>
        )}

        {isActive && (
          <div className="absolute inset-0 bg-teal/10 pointer-events-none" />
        )}
      </div>
      <span
        className={`text-[10px] font-medium transition-colors ${
          isActive ? 'text-teal' : 'text-muted-foreground group-hover:text-foreground'
        }`}
      >
        {filter.name}
      </span>
    </button>
  );
}
