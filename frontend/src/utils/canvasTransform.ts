export interface TransformState {
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  crop: CropRect | null;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DEFAULT_TRANSFORM: TransformState = {
  rotation: 0,
  flipH: false,
  flipV: false,
  crop: null,
};

/**
 * Draw an image onto a canvas with the given transformations applied.
 * Returns the canvas element.
 */
export function drawTransformedImage(
  img: HTMLImageElement,
  transform: TransformState,
  targetCanvas: HTMLCanvasElement,
  cssFilter: string
): void {
  const { rotation, flipH, flipV, crop } = transform;

  // Determine source region
  const srcX = crop ? crop.x : 0;
  const srcY = crop ? crop.y : 0;
  const srcW = crop ? crop.width : img.naturalWidth;
  const srcH = crop ? crop.height : img.naturalHeight;

  // Determine output dimensions after rotation
  const isRotated90or270 = rotation === 90 || rotation === 270;
  const outW = isRotated90or270 ? srcH : srcW;
  const outH = isRotated90or270 ? srcW : srcH;

  targetCanvas.width = outW;
  targetCanvas.height = outH;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, outW, outH);

  // Apply CSS filter via canvas filter property
  if (cssFilter && cssFilter !== 'none') {
    ctx.filter = cssFilter;
  } else {
    ctx.filter = 'none';
  }

  ctx.save();
  ctx.translate(outW / 2, outH / 2);

  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  const scaleX = flipH ? -1 : 1;
  const scaleY = flipV ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  ctx.drawImage(img, srcX, srcY, srcW, srcH, -srcW / 2, -srcH / 2, srcW, srcH);
  ctx.restore();
}

/**
 * Export the edited image as a PNG blob at full resolution.
 */
export async function exportImageAsBlob(
  img: HTMLImageElement,
  transform: TransformState,
  cssFilter: string
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  drawTransformedImage(img, transform, canvas, cssFilter);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to export image'));
      },
      'image/png',
      1.0
    );
  });
}
