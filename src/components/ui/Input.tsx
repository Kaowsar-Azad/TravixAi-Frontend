import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && <label className="text-sm font-medium text-text">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-11 rounded-lg border border-border bg-surface px-4 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${icon ? 'pl-10' : ''} ${error ? 'border-destructive focus:ring-destructive' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-destructive mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
