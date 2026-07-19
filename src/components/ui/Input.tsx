import * as React from "react";
import { useState } from "react";
import { PiEyeDuotone, PiEyeClosedDuotone } from "react-icons/pi";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";
    const currentType = isPasswordType && showPassword ? "text" : type;

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
            type={currentType}
            className={`w-full h-11 rounded-lg border border-border bg-surface px-4 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${icon ? 'pl-10' : ''} ${isPasswordType ? 'pr-10' : ''} ${error ? 'border-destructive focus:ring-destructive' : ''} ${className}`}
            {...props}
          />
          {isPasswordType && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <PiEyeDuotone size={20} /> : <PiEyeClosedDuotone size={20} />}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-destructive mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
