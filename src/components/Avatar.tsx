import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "safe" | "evacuating" | "danger" | "online" | "offline";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export function Avatar({ src, alt, size = "md", status, className }: AvatarProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover border-2 border-card",
          sizeClasses[size],
          status === "safe" && "ring-2 ring-status-safe ring-offset-1 ring-offset-card",
          status === "evacuating" && "ring-2 ring-status-evacuating ring-offset-1 ring-offset-card",
          status === "danger" && "ring-2 ring-status-danger ring-offset-1 ring-offset-card"
        )}
      />
      {(status === "online" || status === "safe") && (
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-status-safe border-2 border-card" />
      )}
      {status === "evacuating" && (
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-status-evacuating border-2 border-card" />
      )}
      {status === "danger" && (
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-status-danger border-2 border-card animate-pulse" />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: { src: string; alt: string; status?: AvatarProps["status"] }[];
  max?: number;
  size?: AvatarProps["size"];
}

export function AvatarGroup({ avatars, max = 5, size = "md" }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-3">
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          status={avatar.status}
          className="ring-2 ring-card"
        />
      ))}
      {remaining > 0 && (
        <div className={cn(
          "rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm ring-2 ring-card",
          sizeClasses[size]
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
