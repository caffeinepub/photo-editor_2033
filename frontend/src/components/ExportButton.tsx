import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  onExport: () => void;
  isExporting: boolean;
  disabled: boolean;
}

export function ExportButton({ onExport, isExporting, disabled }: ExportButtonProps) {
  return (
    <Button
      onClick={onExport}
      disabled={disabled || isExporting}
      className="flex items-center gap-2 bg-teal text-editor-bg hover:bg-teal-light font-semibold text-sm px-4 py-2 h-9 shadow-teal transition-all duration-150"
    >
      {isExporting ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Exporting…
        </>
      ) : (
        <>
          <Download size={14} />
          Export PNG
        </>
      )}
    </Button>
  );
}
