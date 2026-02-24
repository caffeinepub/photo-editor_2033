import { useState, useCallback } from 'react';
import { TransformState, DEFAULT_TRANSFORM, CropRect } from '../utils/canvasTransform';

export function useImageTransform() {
  const [transform, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM);

  const rotateClockwise = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      rotation: ((prev.rotation + 90) % 360) as 0 | 90 | 180 | 270,
    }));
  }, []);

  const rotateCounterClockwise = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      rotation: ((prev.rotation - 90 + 360) % 360) as 0 | 90 | 180 | 270,
    }));
  }, []);

  const flipHorizontal = useCallback(() => {
    setTransform((prev) => ({ ...prev, flipH: !prev.flipH }));
  }, []);

  const flipVertical = useCallback(() => {
    setTransform((prev) => ({ ...prev, flipV: !prev.flipV }));
  }, []);

  const applyCrop = useCallback((crop: CropRect) => {
    setTransform((prev) => ({ ...prev, crop }));
  }, []);

  const clearCrop = useCallback(() => {
    setTransform((prev) => ({ ...prev, crop: null }));
  }, []);

  const resetTransform = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  return {
    transform,
    rotateClockwise,
    rotateCounterClockwise,
    flipHorizontal,
    flipVertical,
    applyCrop,
    clearCrop,
    resetTransform,
  };
}
