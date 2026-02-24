import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, ImageIcon, Sparkles } from 'lucide-react';
import { ImageCanvas } from '../components/ImageCanvas';
import { TransformToolbar } from '../components/TransformToolbar';
import { CropTool } from '../components/CropTool';
import { FilterStrip } from '../components/FilterStrip';
import { AdjustmentsPanel } from '../components/AdjustmentsPanel';
import { ExportButton } from '../components/ExportButton';
import { useImageUpload } from '../hooks/useImageUpload';
import { useImageTransform } from '../hooks/useImageTransform';
import { useFilters } from '../hooks/useFilters';
import { useAdjustments } from '../hooks/useAdjustments';
import { useImageExport } from '../hooks/useImageExport';
import { combineFilters } from '../utils/adjustmentFilters';

export function EditorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [canvasDisplaySize, setCanvasDisplaySize] = useState({ w: 0, h: 0 });

  const { imageData, isLoading, error, handleFileChange, handleDrop, clearImage } = useImageUpload();
  const {
    transform,
    rotateClockwise,
    rotateCounterClockwise,
    flipHorizontal,
    flipVertical,
    applyCrop,
    clearCrop,
    resetTransform,
  } = useImageTransform();
  const { filters, activeFilter, activeFilterId, selectFilter } = useFilters();
  const { adjustments, setAdjustment, resetAdjustments } = useAdjustments();
  const { exportImage, isExporting } = useImageExport();

  const cssFilter = combineFilters(activeFilter.filter, adjustments);
  const hasImage = !!imageData;

  // Track canvas display size for crop overlay
  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setCanvasDisplaySize({ w: canvas.offsetWidth, h: canvas.offsetHeight });
  }, []);

  useEffect(() => {
    if (!hasImage) {
      setIsCropping(false);
    }
  }, [hasImage]);

  const handleCropToggle = () => {
    if (isCropping) {
      setIsCropping(false);
    } else {
      setIsCropping(true);
    }
  };

  const handleCropApply = (crop: import('../utils/canvasTransform').CropRect) => {
    applyCrop(crop);
    setIsCropping(false);
  };

  const handleCropCancel = () => {
    setIsCropping(false);
  };

  const handleReset = () => {
    resetTransform();
    resetAdjustments();
    setIsCropping(false);
  };

  const handleExport = () => {
    if (!imageData) return;
    exportImage(imageData.element, transform, cssFilter, imageData.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-screen bg-editor-bg overflow-hidden">
      {/* Top Toolbar */}
      <header className="flex items-center justify-between px-4 py-2 bg-editor-toolbar border-b border-editor-border flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/pixelcraft-logo.dim_256x256.png"
            alt="PixelCraft"
            className="w-7 h-7 rounded-md"
          />
          <div>
            <h1 className="font-display font-bold text-sm text-foreground leading-none">
              PixelCraft
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Photo Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasImage && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {imageData.width} × {imageData.height}px
            </span>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-editor-panel hover:bg-editor-hover border border-editor-border rounded transition-all"
          >
            <Upload size={12} />
            {hasImage ? 'Replace' : 'Upload Photo'}
          </button>

          <ExportButton
            onExport={handleExport}
            isExporting={isExporting}
            disabled={!hasImage}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </header>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Transform Tools */}
        <aside className="w-36 flex-shrink-0 bg-editor-panel border-r border-editor-border overflow-y-auto">
          <TransformToolbar
            onRotateCW={rotateClockwise}
            onRotateCCW={rotateCounterClockwise}
            onFlipH={flipHorizontal}
            onFlipV={flipVertical}
            onCropToggle={handleCropToggle}
            onReset={handleReset}
            isCropping={isCropping}
            disabled={!hasImage}
          />
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Area */}
          <div
            ref={canvasContainerRef}
            className="flex-1 flex items-center justify-center editor-canvas-bg relative overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {isLoading && (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading image…</span>
              </div>
            )}

            {!isLoading && !hasImage && (
              <UploadPlaceholder
                onUploadClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                error={error}
              />
            )}

            {!isLoading && hasImage && (
              <div className="relative flex items-center justify-center w-full h-full p-4">
                <div className="relative inline-flex items-center justify-center">
                  <ImageCanvas
                    imageData={imageData}
                    transform={transform}
                    cssFilter={cssFilter}
                    onCanvasReady={handleCanvasReady}
                  />

                  {isCropping && canvasDisplaySize.w > 0 && (
                    <div
                      className="absolute inset-0"
                      style={{ width: canvasDisplaySize.w, height: canvasDisplaySize.h }}
                    >
                      <CropTool
                        imageWidth={imageData.width}
                        imageHeight={imageData.height}
                        displayWidth={canvasDisplaySize.w}
                        displayHeight={canvasDisplaySize.h}
                        onApply={handleCropApply}
                        onCancel={handleCropCancel}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Filter Strip */}
          <div className="bg-editor-panel border-t border-editor-border flex-shrink-0">
            <div className="px-4 pt-2 pb-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Filters
              </p>
            </div>
            <FilterStrip
              filters={filters}
              activeFilterId={activeFilterId}
              onSelectFilter={selectFilter}
              imageData={imageData}
            />
          </div>
        </main>

        {/* Right Panel - Adjustments */}
        <aside className="w-48 flex-shrink-0 bg-editor-panel border-l border-editor-border overflow-y-auto">
          <AdjustmentsPanel
            adjustments={adjustments}
            onAdjust={setAdjustment}
            onReset={resetAdjustments}
            disabled={!hasImage}
          />
        </aside>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-4 py-1.5 bg-editor-toolbar border-t border-editor-border flex-shrink-0">
        <span className="text-[10px] text-muted-foreground">
          {hasImage ? `${imageData.name}` : 'No image loaded'}
        </span>
        <span className="text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'pixelcraft-editor'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:text-teal-light transition-colors"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}

interface UploadPlaceholderProps {
  onUploadClick: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  error: string | null;
}

function UploadPlaceholder({ onUploadClick, onDrop, onDragOver, error }: UploadPlaceholderProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-6 w-full h-full max-w-md mx-auto px-8
        transition-all duration-200
      `}
      onDrop={(e) => { setIsDragging(false); onDrop(e); }}
      onDragOver={(e) => { setIsDragging(true); onDragOver(e); }}
      onDragLeave={() => setIsDragging(false)}
    >
      <div
        className={`
          w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-teal bg-teal-muted scale-[1.02]'
            : 'border-editor-border hover:border-teal/50 hover:bg-editor-panel/50'
          }
        `}
        onClick={onUploadClick}
      >
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          ${isDragging ? 'bg-teal/20' : 'bg-editor-panel'}
          transition-colors
        `}>
          <ImageIcon size={28} className={isDragging ? 'text-teal' : 'text-muted-foreground'} />
        </div>

        <div className="text-center">
          <p className="font-display font-semibold text-foreground text-base">
            {isDragging ? 'Drop to open' : 'Open a photo'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            JPG, PNG, WebP supported
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2 bg-teal text-editor-bg rounded-lg text-sm font-semibold shadow-teal hover:bg-teal-light transition-all"
          onClick={(e) => { e.stopPropagation(); onUploadClick(); }}
        >
          <Upload size={14} />
          Choose File
        </button>
      </div>

      {/* Sample image hint */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
        <Sparkles size={12} className="text-amber" />
        <span>Professional photo editing in your browser</span>
      </div>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
          {error}
        </p>
      )}
    </div>
  );
}
