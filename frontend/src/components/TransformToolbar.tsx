import React from 'react';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Crop, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

interface TransformToolbarProps {
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  onCropToggle: () => void;
  onReset: () => void;
  isCropping: boolean;
  disabled: boolean;
}

export function TransformToolbar({
  onRotateCW,
  onRotateCCW,
  onFlipH,
  onFlipV,
  onCropToggle,
  onReset,
  isCropping,
  disabled,
}: TransformToolbarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-1 p-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-1">
          Transform
        </p>

        <ToolButton
          icon={<RotateCcw size={15} />}
          label="Rotate CCW"
          onClick={onRotateCCW}
          disabled={disabled}
        />
        <ToolButton
          icon={<RotateCw size={15} />}
          label="Rotate CW"
          onClick={onRotateCW}
          disabled={disabled}
        />

        <Separator className="my-1 bg-editor-border" />

        <ToolButton
          icon={<FlipHorizontal size={15} />}
          label="Flip Horizontal"
          onClick={onFlipH}
          disabled={disabled}
        />
        <ToolButton
          icon={<FlipVertical size={15} />}
          label="Flip Vertical"
          onClick={onFlipV}
          disabled={disabled}
        />

        <Separator className="my-1 bg-editor-border" />

        <ToolButton
          icon={<Crop size={15} />}
          label={isCropping ? 'Cancel Crop' : 'Crop'}
          onClick={onCropToggle}
          disabled={disabled}
          active={isCropping}
        />

        <Separator className="my-1 bg-editor-border" />

        <ToolButton
          icon={<X size={15} />}
          label="Reset All"
          onClick={onReset}
          disabled={disabled}
          variant="destructive"
        />
      </div>
    </TooltipProvider>
  );
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: 'default' | 'destructive';
}

function ToolButton({ icon, label, onClick, disabled, active, variant }: ToolButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={`
            flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs font-medium
            transition-all duration-150 text-left
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            ${
              active
                ? 'bg-teal-muted text-teal border border-teal/30'
                : variant === 'destructive'
                ? 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-editor-hover'
            }
          `}
        >
          <span className={active ? 'text-teal' : ''}>{icon}</span>
          <span>{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
