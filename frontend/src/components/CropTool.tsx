import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { CropRect } from '../utils/canvasTransform';

interface CropToolProps {
  imageWidth: number;
  imageHeight: number;
  displayWidth: number;
  displayHeight: number;
  onApply: (crop: CropRect) => void;
  onCancel: () => void;
}

interface DragState {
  type: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;
  startX: number;
  startY: number;
  startCrop: { x: number; y: number; w: number; h: number };
}

export function CropTool({
  imageWidth,
  imageHeight,
  displayWidth,
  displayHeight,
  onApply,
  onCancel,
}: CropToolProps) {
  const scaleX = imageWidth / displayWidth;
  const scaleY = imageHeight / displayHeight;

  // Crop in display coordinates
  const [crop, setCrop] = useState({
    x: displayWidth * 0.1,
    y: displayHeight * 0.1,
    w: displayWidth * 0.8,
    h: displayHeight * 0.8,
  });

  const dragRef = useRef<DragState | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, type: DragState['type']) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = {
        type,
        startX: e.clientX,
        startY: e.clientY,
        startCrop: { x: crop.x, y: crop.y, w: crop.w, h: crop.h },
      };
    },
    [crop]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { type, startX, startY, startCrop } = dragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const MIN = 20;

      setCrop((prev) => {
        let { x, y, w, h } = startCrop;

        if (type === 'move') {
          x = clamp(x + dx, 0, displayWidth - w);
          y = clamp(y + dy, 0, displayHeight - h);
        } else if (type === 'se') {
          w = clamp(w + dx, MIN, displayWidth - x);
          h = clamp(h + dy, MIN, displayHeight - y);
        } else if (type === 'sw') {
          const newX = clamp(x + dx, 0, x + w - MIN);
          w = x + w - newX;
          x = newX;
          h = clamp(h + dy, MIN, displayHeight - y);
        } else if (type === 'ne') {
          w = clamp(w + dx, MIN, displayWidth - x);
          const newY = clamp(y + dy, 0, y + h - MIN);
          h = y + h - newY;
          y = newY;
        } else if (type === 'nw') {
          const newX = clamp(x + dx, 0, x + w - MIN);
          w = x + w - newX;
          x = newX;
          const newY = clamp(y + dy, 0, y + h - MIN);
          h = y + h - newY;
          y = newY;
        } else if (type === 'n') {
          const newY = clamp(y + dy, 0, y + h - MIN);
          h = y + h - newY;
          y = newY;
        } else if (type === 's') {
          h = clamp(h + dy, MIN, displayHeight - y);
        } else if (type === 'e') {
          w = clamp(w + dx, MIN, displayWidth - x);
        } else if (type === 'w') {
          const newX = clamp(x + dx, 0, x + w - MIN);
          w = x + w - newX;
          x = newX;
        }

        return { x, y, w, h };
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [displayWidth, displayHeight]);

  const handleApply = () => {
    onApply({
      x: Math.round(crop.x * scaleX),
      y: Math.round(crop.y * scaleY),
      width: Math.round(crop.w * scaleX),
      height: Math.round(crop.h * scaleY),
    });
  };

  const handleSize = 8;

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 select-none"
      style={{ cursor: 'crosshair' }}
    >
      {/* Dark overlay outside crop */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Crop window cutout */}
      <div
        className="absolute border-2 border-teal"
        style={{
          left: crop.x,
          top: crop.y,
          width: crop.w,
          height: crop.h,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          background: 'transparent',
          cursor: 'move',
        }}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
        {/* Rule of thirds grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute border-white/20 border-r" style={{ left: '33.33%', top: 0, bottom: 0, width: 0 }} />
          <div className="absolute border-white/20 border-r" style={{ left: '66.66%', top: 0, bottom: 0, width: 0 }} />
          <div className="absolute border-white/20 border-b" style={{ top: '33.33%', left: 0, right: 0, height: 0 }} />
          <div className="absolute border-white/20 border-b" style={{ top: '66.66%', left: 0, right: 0, height: 0 }} />
        </div>

        {/* Corner handles */}
        {(['nw', 'ne', 'sw', 'se'] as const).map((pos) => (
          <div
            key={pos}
            className="absolute bg-teal rounded-sm z-10"
            style={{
              width: handleSize * 2,
              height: handleSize * 2,
              top: pos.includes('n') ? -handleSize : undefined,
              bottom: pos.includes('s') ? -handleSize : undefined,
              left: pos.includes('w') ? -handleSize : undefined,
              right: pos.includes('e') ? -handleSize : undefined,
              cursor: `${pos}-resize`,
            }}
            onMouseDown={(e) => handleMouseDown(e, pos)}
          />
        ))}

        {/* Edge handles */}
        {(['n', 's', 'e', 'w'] as const).map((pos) => (
          <div
            key={pos}
            className="absolute bg-teal/80 rounded-sm z-10"
            style={{
              width: pos === 'n' || pos === 's' ? handleSize * 3 : handleSize,
              height: pos === 'e' || pos === 'w' ? handleSize * 3 : handleSize,
              top: pos === 'n' ? -handleSize / 2 : pos === 's' ? undefined : '50%',
              bottom: pos === 's' ? -handleSize / 2 : undefined,
              left: pos === 'w' ? -handleSize / 2 : pos === 'e' ? undefined : '50%',
              right: pos === 'e' ? -handleSize / 2 : undefined,
              transform: pos === 'n' || pos === 's' ? 'translateX(-50%)' : 'translateY(-50%)',
              cursor: `${pos}-resize`,
            }}
            onMouseDown={(e) => handleMouseDown(e, pos)}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div
        className="absolute flex gap-2 z-20"
        style={{
          left: crop.x + crop.w / 2,
          top: crop.y + crop.h + 12,
          transform: 'translateX(-50%)',
        }}
      >
        <button
          onClick={handleApply}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-editor-bg rounded text-xs font-semibold shadow-teal hover:bg-teal-light transition-colors"
        >
          <Check size={12} />
          Apply
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-editor-panel text-foreground border border-editor-border rounded text-xs font-semibold hover:bg-editor-hover transition-colors"
        >
          <X size={12} />
          Cancel
        </button>
      </div>
    </div>
  );
}
