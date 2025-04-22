import React from "react";
import { X } from "lucide-react";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Sheet = ({ isOpen, onClose, children, title }: SheetProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 backdrop-blur-sm">
      <div className="fixed -bottom-4 left-0 right-0 z-50 w-full mx-auto rounded-t-2xl bg-layer-1 p-4 animate-in slide-in-from-bottom duration-300 border-t border-solid border-border-dark">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div /> {/* Empty div for spacing */}
          {title && (
            <p className="text-text-primary text-lg font-semibold">{title}</p>
          )}
          <button
            className="bg-transparent h-9 w-9 flex items-center justify-center border-none cursor-pointer text-text-primary"
            type="button"
            onClick={onClose}
          >
            <X className="size-4 text-text-primary" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default Sheet;
