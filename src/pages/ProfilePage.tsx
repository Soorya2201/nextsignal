import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Moon, 
  User, 
  Bell, 
  MessageCircle, 
  Database, 
  Lock, 
  Info,
  ChevronRight,
  Search
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { Switch } from "@/components/ui/switch";

import avatar1 from "@/assets/avatars/avatar-1.jpg";

interface SettingsItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  toggle?: boolean;
  value?: boolean;
  onToggle?: (value: boolean) => void;
}

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const settingsItems: SettingsItem[] = [
    { icon: Moon, label: "Dark mode", toggle: true, value: darkMode, onToggle: setDarkMode },
    { icon: User, label: "Account", href: "/profile/account" },
    { icon: Bell, label: "Notification", href: "/profile/notifications" },
    { icon: MessageCircle, label: "Chat settings", href: "/profile/chat" },
    { icon: Database, label: "Data and storage", href: "/profile/data" },
    { icon: Lock, label: "Privacy and security", href: "/profile/privacy" },
    { icon: Info, label: "About", href: "/profile/about" },
  ];

  return (
    <div className="mobile-container">
      <div className="page-content">
        <PageHeader
          title="Settings"
          rightAction={
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          }
        />

        {/* Profile Card */}
        <div className="card-elevated mb-6 animate-slide-up">
          <div className="flex items-center gap-4">
            <Avatar src={avatar1} alt="Soorya Venkat" size="xl" status="online" />
            <div className="flex-1">
              <h2 className="font-display font-bold text-xl text-foreground">Soorya Venkat</h2>
              <p className="text-muted-foreground">325 W Adams Blvd</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-1">
          {settingsItems.map((item, index) => (
            <div
              key={item.label}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.toggle ? (
                <div className="flex items-center justify-between py-4 px-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <Switch
                    checked={item.value}
                    onCheckedChange={item.onToggle}
                  />
                </div>
              ) : (
                <Link
                  to={item.href || "#"}
                  className="flex items-center justify-between py-4 px-2 hover:bg-muted/50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Version info */}
        <p className="text-center text-sm text-muted-foreground mt-8 mb-4">
          Next Signal v1.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
