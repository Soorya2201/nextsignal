import { cn } from "@/lib/utils";

interface SOSBadgeProps {
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
};

export function SOSBadge({ size = "md", pulse = false, onClick }: SOSBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "sos-badge relative",
        sizeClasses[size],
        onClick && "cursor-pointer hover:scale-105 active:scale-95 transition-transform"
      )}
    >
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-sos animate-pulse-ring" />
      )}
      <span className="relative z-10 font-bold">SOS</span>
    </button>
  );
}
