import { cn } from "@/lib/utils";
import { Home, Users } from "lucide-react";

export type ChannelType = "unit" | "friends" | "management" | "world" | "rescuers";

interface ChannelCardProps {
  type: ChannelType;
  name: string;
  memberCount: number;
  isOnline?: boolean;
  isLive?: boolean;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
  description?: string;
}

const channelStyles: Record<ChannelType, string> = {
  unit: "bg-channel-unit border-primary/20",
  friends: "bg-channel-friends border-status-evacuating/30",
  management: "bg-channel-management border-muted-foreground/20",
  world: "bg-channel-world border-accent/30",
  rescuers: "bg-channel-rescuers border-status-danger/30",
};

export function ChannelCard({
  type,
  name,
  memberCount,
  isOnline = true,
  isLive = false,
  image,
  selected,
  onClick,
  description,
}: ChannelCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "channel-card border-2 text-left w-full min-h-[100px] relative",
        channelStyles[type],
        selected && "ring-2 ring-primary ring-offset-2",
        !isOnline && "opacity-60"
      )}
    >
      {/* Selected indicator dot */}
      {selected && (
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary" />
      )}
      
      <div className="flex items-start gap-3">
        {image && (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <img src={image} alt={name} className="w-full h-full object-cover" />
            {isOnline && (
              <div className="online-indicator" />
            )}
          </div>
        )}
        <div className="flex-1 min-w-0 pt-0.5">
          <h4 className="font-display font-semibold text-foreground text-base leading-tight mb-1">{name}</h4>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Home className="w-3 h-3" />
            <span className="leading-tight">
              {description || `${memberCount} ${isLive ? "Members LIVE" : "Members"}`}
            </span>
          </div>
        </div>
      </div>
      
      {isLive && (
        <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-status-safe animate-pulse-soft" />
      )}
      
      {!isOnline && (
        <p className="text-xs text-muted-foreground mt-2 font-medium">- OFFLINE -</p>
      )}
    </button>
  );
}
