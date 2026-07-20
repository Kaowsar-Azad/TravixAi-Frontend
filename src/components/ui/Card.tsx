import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", image, title, description, meta, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col bg-surface border border-border rounded-[16px] overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full h-full ${className}`}
        {...props}
      >
        {image && (
          <div className="w-full h-48 bg-neutral-bg relative overflow-hidden">
            <img src={image} alt={title} className="object-cover w-full h-full" />
          </div>
        )}
        
        {/* Dashed divider between image and content */}
        {image && <div className="w-full border-t border-dashed border-border"></div>}
        
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-lg font-semibold text-text mb-2 line-clamp-1">{title}</h3>
          {description && (
            <p className="text-text-muted text-sm mb-4 line-clamp-2 flex-1">{description}</p>
          )}
          
          {children && <div className="mb-4">{children}</div>}
          
          {/* View Details Action */}
          <div className="mt-4 mb-4 flex items-center justify-between text-xs font-semibold text-accent group-hover:text-accent-hover transition-colors font-display">
            <span>View Details</span>
            <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
          </div>
          
          {meta && (
            <div className="mt-auto pt-4 border-t border-dashed border-border flex items-center justify-between gap-2 text-sm font-mono text-text-muted flex-wrap">
              {meta}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Card.displayName = "Card";
