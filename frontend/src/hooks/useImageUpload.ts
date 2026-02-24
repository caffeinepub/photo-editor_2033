import { useState, useCallback } from 'react';

export interface ImageData {
  src: string;
  element: HTMLImageElement;
  width: number;
  height: number;
  name: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useImageUpload() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported format. Please use JPG, PNG, or WebP.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImageData({
        src: url,
        element: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        name: file.name,
      });
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image.');
      setIsLoading(false);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadImage(file);
      // Reset input so same file can be re-selected
      e.target.value = '';
    },
    [loadImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) loadImage(file);
    },
    [loadImage]
  );

  const clearImage = useCallback(() => {
    if (imageData?.src) URL.revokeObjectURL(imageData.src);
    setImageData(null);
    setError(null);
  }, [imageData]);

  return {
    imageData,
    isLoading,
    error,
    handleFileChange,
    handleDrop,
    clearImage,
  };
}
