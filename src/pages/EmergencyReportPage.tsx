import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Flame, Droplets, Wind, Zap, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const emergencyTypes = [
  { id: "fire", label: "Fire", icon: Flame, color: "from-red-500 to-orange-500" },
  { id: "flood", label: "Flood", icon: Droplets, color: "from-blue-500 to-cyan-400" },
  { id: "earthquake", label: "Earthquake", icon: Wind, color: "from-amber-500 to-yellow-400" },
  { id: "electrical", label: "Electrical", icon: Zap, color: "from-purple-500 to-pink-400" },
  { id: "other", label: "Other", icon: AlertTriangle, color: "from-gray-500 to-gray-400" },
];

export default function EmergencyReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location");
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [emergencyType, setEmergencyType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !emergencyType || !locationId) return;

    setIsSubmitting(true);

    try {
      // Create a broadcast with emergency priority
      const { error } = await supabase.from("broadcasts").insert({
        location_id: locationId,
        sender_id: user.id,
        title: `🚨 ${emergencyTypes.find(t => t.id === emergencyType)?.label} Emergency${floorNumber ? ` - Floor ${floorNumber}` : ""}`,
        message: description || `Emergency reported: ${emergencyType}`,
        priority: "critical",
      });

      if (error) throw error;

      toast({
        title: "Emergency Reported",
        description: "Responders have been notified. Stay calm and follow safety protocols.",
      });

      navigate(`/location/${locationId}`);
    } catch (error: any) {
      console.error("Emergency report error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to report emergency",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-destructive/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-destructive/20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <img src={logo} alt="Next Signal" className="w-10 h-10" />
          <div>
            <h1 className="font-display font-bold text-lg text-destructive">Report Emergency</h1>
            <p className="text-xs text-muted-foreground">Alert responders immediately</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Emergency Warning */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Are you in immediate danger?</p>
            <p className="text-sm text-muted-foreground">
              If this is a life-threatening emergency, call emergency services directly.
            </p>
            <a 
              href="tel:911" 
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-destructive text-white rounded-full text-sm font-semibold hover:bg-destructive/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call 911
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emergency Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              What type of emergency?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {emergencyTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = emergencyType === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEmergencyType(type.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-300",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      isSelected
                        ? `border-transparent bg-gradient-to-r ${type.color} text-white shadow-lg`
                        : "border-border bg-card hover:border-destructive/50"
                    )}
                  >
                    <Icon className={cn("w-6 h-6 mx-auto mb-2", isSelected ? "text-white" : "text-foreground")} />
                    <div className={cn("text-xs font-medium", isSelected ? "text-white" : "text-foreground")}>
                      {type.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floor Number */}
          <div className="space-y-2">
            <label htmlFor="floor" className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location (optional)
            </label>
            <input
              id="floor"
              type="text"
              placeholder="e.g., Floor 5, Unit 12B, Stairwell A"
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Additional details (optional)
            </label>
            <Textarea
              id="description"
              placeholder="Describe the situation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !emergencyType}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-destructive to-red-600 hover:from-destructive/90 hover:to-red-600/90 border-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending Alert...
              </span>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Report Emergency
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            This will alert building management and all residents
          </p>
        </form>
      </main>
    </div>
  );
}
