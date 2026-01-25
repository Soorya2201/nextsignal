import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "safe" | "evacuating" | "danger";
  label?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  selected?: boolean;
}

const statusConfig = {
  safe: {
    label: "Not in Premises",
    className: "status-safe",
  },
  evacuating: {
    label: "Evacuating",
    className: "status-evacuating",
  },
  danger: {
    label: "Stuck - Need HELP!",
    className: "status-danger",
  },
};

export function StatusBadge({ 
  status, 
  label, 
  size = "md", 
  onClick, 
  selected 
}: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "status-badge font-semibold transition-all duration-200",
        config.className,
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        onClick && "cursor-pointer hover:scale-105 active:scale-95",
        selected && "ring-2 ring-offset-2 ring-offset-background ring-foreground/20 scale-105"
      )}
    >
      {label || config.label}
    </button>
  );
}
