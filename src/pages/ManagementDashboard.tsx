import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Radio, 
  Upload, 
  AlertTriangle, 
  Users, 
  ArrowRight,
  Building,
  Map,
  FileText
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logo from "@/assets/logo.png";

interface StatCardProps {
  label: string;
  count: number;
  color: "safe" | "evacuating" | "danger";
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ label, count, color, icon: Icon }: StatCardProps) {
  const colorStyles = {
    safe: "bg-status-safe/10 border-status-safe/30 text-status-safe",
    evacuating: "bg-status-evacuating/10 border-status-evacuating/30 text-status-evacuating",
    danger: "bg-status-danger/10 border-status-danger/30 text-status-danger",
  };

  const countStyles = {
    safe: "text-status-safe",
    evacuating: "text-status-evacuating",
    danger: "text-status-danger",
  };

  return (
    <div className={`rounded-2xl border-2 p-4 ${colorStyles[color]} animate-slide-up`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6" />
        <span className={`text-3xl font-display font-bold ${countStyles[color]}`}>{count}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>
  );
}

export default function ManagementDashboard() {
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [alertLevel, setAlertLevel] = useState<string>("");

  const stats = {
    inPremises: 142,
    evacuating: 28,
    needHelp: 5,
  };

  return (
    <div className="mobile-container min-h-screen">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="Next Signal" className="w-12 h-12" />
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">Next SIGNAL</h1>
            <p className="text-sm text-muted-foreground">Management Dashboard</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            label="In Premises"
            count={stats.inPremises}
            color="safe"
            icon={Building}
          />
          <StatCard
            label="Evacuating"
            count={stats.evacuating}
            color="evacuating"
            icon={Users}
          />
          <StatCard
            label="Need Help"
            count={stats.needHelp}
            color="danger"
            icon={AlertTriangle}
          />
        </div>

        {/* Broadcast Button */}
        <button
          onClick={() => setShowBroadcast(true)}
          className="w-full gradient-primary text-primary-foreground rounded-2xl p-5 flex items-center justify-between mb-4 hover:scale-[1.01] transition-transform animate-slide-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6" />
            <div className="text-left">
              <h3 className="font-display font-bold text-lg">Broadcast Alert</h3>
              <p className="text-sm opacity-90">Send emergency notification to all residents</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Upload Blueprint */}
        <div 
          className="card-elevated border-2 border-dashed border-border p-6 text-center mb-4 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Map className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            Upload Floor Plan
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload building blueprints to help mark fire exits and evacuation routes
          </p>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Choose File
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "250ms" }}>
          <button className="card-elevated p-4 text-left hover:scale-[1.02] transition-transform">
            <FileText className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-semibold text-foreground">View Reports</h4>
            <p className="text-xs text-muted-foreground">Status history</p>
          </button>
          <button className="card-elevated p-4 text-left hover:scale-[1.02] transition-transform">
            <Users className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-semibold text-foreground">All Residents</h4>
            <p className="text-xs text-muted-foreground">175 registered</p>
          </button>
        </div>

        {/* User type switch link */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-sm text-primary hover:underline"
          >
            Switch to Resident View →
          </Link>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end animate-fade-in">
          <div className="bg-card w-full rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
            
            <h2 className="font-display font-bold text-xl text-foreground mb-6">
              Create Broadcast
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Alert Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Forest Fire Warning"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="level">Alert Level</Label>
                <Select value={alertLevel} onValueChange={setAlertLevel}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical - Evacuate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe the situation and any instructions..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowBroadcast(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gradient-primary border-0"
                  onClick={() => {
                    // Handle broadcast
                    setShowBroadcast(false);
                    setBroadcastMessage("");
                    setBroadcastTitle("");
                    setAlertLevel("");
                  }}
                >
                  <Radio className="w-4 h-4 mr-2" />
                  Send Broadcast
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
