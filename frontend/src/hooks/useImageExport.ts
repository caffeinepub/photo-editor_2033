import { useState, useCallback } from 'react';
import { TransformState } from '../utils/canvasTransform';
import { exportImageAsBlob } from '../utils/canvasTransform';

export function useImageExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = useCallback(
    async (
      img: HTMLImageElement,
      transform: TransformState,
      cssFilter: string,
      filename?: string
    ) => {
      setIsExporting(true);
      try {
        const blob = await exportImageAsBlob(img, transform, cssFilter);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename
          ? filename.replace(/\.[^.]+$/, '') + '_edited.png'
          : 'edited_photo.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Export failed:', err);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportImage, isExporting };
}
