import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  leftAction, 
  rightAction,
  className 
}: PageHeaderProps) {
  return (
    <header className={cn("flex items-center justify-between py-4", className)}>
      <div className="flex items-center gap-3">
        {leftAction}
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {rightAction}
    </header>
  );
}
