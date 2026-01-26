import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Radio, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const priorityOptions = [
  { id: "normal", label: "Normal", icon: Info, color: "from-blue-500 to-cyan-400" },
  { id: "urgent", label: "Urgent", icon: AlertCircle, color: "from-orange-500 to-yellow-400" },
  { id: "critical", label: "Critical", icon: AlertTriangle, color: "from-red-500 to-pink-400" },
];

export default function BroadcastPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !message.trim()) return;

    setIsSubmitting(true);

    try {
      // Get user's first location
      const { data: userLocations } = await supabase
        .from("user_locations")
        .select("location_id")
        .eq("user_id", user.id)
        .limit(1);

      const locationId = userLocations?.[0]?.location_id;

      if (!locationId) {
        toast({
          title: "Error",
          description: "No location found. Please add a location first.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("broadcasts").insert({
        location_id: locationId,
        sender_id: user.id,
        title: title.trim(),
        message: message.trim(),
        priority,
      });

      if (error) throw error;

      toast({
        title: "Broadcast Sent",
        description: "Your message has been sent to all residents.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Broadcast error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send broadcast",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <img src={logo} alt="Next Signal" className="w-10 h-10" />
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">Create Broadcast</h1>
            <p className="text-xs text-muted-foreground">Send emergency updates</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Priority Selection */}
          <div className="space-y-3">
            <Label>Priority Level</Label>
            <div className="grid grid-cols-3 gap-3">
              {priorityOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = priority === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPriority(option.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-300",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      isSelected
                        ? `border-transparent bg-gradient-to-r ${option.color} text-white`
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <Icon className={cn("w-6 h-6 mx-auto mb-2", isSelected ? "text-white" : "text-foreground")} />
                    <div className={cn("text-sm font-medium", isSelected ? "text-white" : "text-foreground")}>
                      {option.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Evacuation Notice - Building A"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter the details of your broadcast message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px] resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              This message will be delivered to all residents via the Next Signal chatbot.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !message.trim()}
            className="w-full h-14 text-lg font-semibold gradient-primary border-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              <>
                <Radio className="w-5 h-5 mr-2" />
                Send Broadcast
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
