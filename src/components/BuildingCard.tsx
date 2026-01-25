import { cn } from "@/lib/utils";

interface BuildingCardProps {
  name: string;
  address: string;
  image: string;
  notifications?: number;
  onClick?: () => void;
}

export function BuildingCard({ 
  name, 
  address, 
  image, 
  notifications,
  onClick 
}: BuildingCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full card-elevated flex items-center gap-4 hover:scale-[1.01] transition-transform duration-200 text-left"
    >
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {notifications && notifications > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {notifications > 9 ? "9+" : notifications}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-foreground truncate">{name}</h3>
        <p className="text-sm text-muted-foreground truncate">{address}</p>
      </div>
      {notifications && notifications > 0 && (
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
          {notifications}
        </div>
      )}
    </button>
  );
}
