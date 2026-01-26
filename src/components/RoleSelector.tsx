import { User, Building2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/hooks/useUserRole";

interface RoleSelectorProps {
  selectedRole: AppRole | null;
  onSelect: (role: AppRole) => void;
  disabled?: boolean;
}

const roles: { id: AppRole; label: string; description: string; icon: React.ElementType; gradient: string }[] = [
  {
    id: "resident",
    label: "Individual",
    description: "Resident or working professional",
    icon: User,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: "management",
    label: "Management",
    description: "Building manager or authority",
    icon: Building2,
    gradient: "from-purple-500 to-pink-400",
  },
  {
    id: "rescuer",
    label: "Rescuer",
    description: "Emergency responder or rescue team",
    icon: Shield,
    gradient: "from-orange-500 to-red-400",
  },
];

export function RoleSelector({ selectedRole, onSelect, disabled }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Select your role</label>
      <div className="grid gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(role.id)}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "border-primary bg-gradient-to-r " + role.gradient + " text-white shadow-lg"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  isSelected ? "bg-white/20" : "bg-gradient-to-r " + role.gradient
                )}
              >
                <Icon className={cn("w-6 h-6", isSelected ? "text-white" : "text-white")} />
              </div>
              <div className="flex-1 text-left">
                <div className={cn("font-semibold", isSelected ? "text-white" : "text-foreground")}>
                  {role.label}
                </div>
                <div className={cn("text-sm", isSelected ? "text-white/80" : "text-muted-foreground")}>
                  {role.description}
                </div>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
