import React, { useRef, useEffect, useCallback } from 'react';
import { ImageData } from '../hooks/useImageUpload';
import { TransformState } from '../utils/canvasTransform';
import { drawTransformedImage } from '../utils/canvasTransform';

interface ImageCanvasProps {
  imageData: ImageData | null;
  transform: TransformState;
  cssFilter: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function ImageCanvas({ imageData, transform, cssFilter, onCanvasReady }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;
    drawTransformedImage(imageData.element, transform, canvas, cssFilter);
    if (onCanvasReady) onCanvasReady(canvas);
  }, [imageData, transform, cssFilter, onCanvasReady]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  if (!imageData) return null;

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full max-h-full object-contain rounded-sm shadow-panel"
      style={{ display: 'block' }}
    />
  );
}
