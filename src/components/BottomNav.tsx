import { Home, MessageCircle, Phone, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/channels", icon: Phone, label: "Channels" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-bottom-nav z-50">
      <div className="max-w-md mx-auto flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "bottom-nav-item",
                isActive && "active"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "text-primary")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* iPhone home indicator space */}
      <div className="h-safe-bottom bg-card" />
    </nav>
  );
}
