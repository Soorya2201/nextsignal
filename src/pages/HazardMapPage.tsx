import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, XCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import hazardMapImage from "@/assets/hazard-maps/hazard-map-default.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function HazardMapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location");
  const [showBlockedExit, setShowBlockedExit] = useState(false);
  const [showReasonPopup, setShowReasonPopup] = useState(false);

  const handleExitNonAccessible = () => {
    setShowBlockedExit(true);
    setShowReasonPopup(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => locationId ? navigate(`/location/${locationId}`) : navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <img src={logo} alt="Next Signal" className="w-10 h-10" />
          <div>
            <h1 className="font-display font-bold text-lg text-amber-500">Hazard Map</h1>
            <p className="text-xs text-muted-foreground">View danger zones & safe areas</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Exit Non Accessible Button */}
        <Button
          onClick={handleExitNonAccessible}
          variant="outline"
          className="w-full mb-4 border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Exit Non Accessible
        </Button>

        {/* Hazard Map Image */}
        <div className="relative rounded-2xl overflow-hidden border border-border">
          <img 
            src={hazardMapImage} 
            alt="Building Hazard Map" 
            className="w-full h-auto"
          />
          
          {/* Circle overlay when exit is blocked */}
          {showBlockedExit && (
            <div 
              className="absolute animate-pulse"
              style={{
                left: "8%",
                top: "35%",
                width: "80px",
                height: "80px",
              }}
            >
              <div className="w-full h-full rounded-full border-4 border-red-500 bg-red-500/30 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 p-4 bg-card rounded-xl border border-border">
          <h3 className="font-semibold text-foreground mb-2">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-muted-foreground">Exit Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-red-500/30" />
              <span className="text-muted-foreground">Blocked Exit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <span className="text-muted-foreground">Your Location</span>
            </div>
          </div>
        </div>
      </main>

      {/* Reason Popup Dialog */}
      <Dialog open={showReasonPopup} onOpenChange={setShowReasonPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Exit Blocked
            </DialogTitle>
            <DialogDescription className="text-left">
              This exit is currently non-accessible due to:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="font-medium text-destructive">🔥 Fire Hazard</p>
              <p className="text-sm text-muted-foreground mt-1">
                Active fire reported near this exit area. Smoke and flames detected.
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="font-medium text-amber-600 dark:text-amber-400">⚠️ Structural Damage</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ceiling collapse has blocked the pathway. Do not attempt to use.
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="font-medium text-blue-600 dark:text-blue-400">🚨 Emergency Services</p>
              <p className="text-sm text-muted-foreground mt-1">
                Area cordoned off by rescue teams. Use alternative exits.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowReasonPopup(false)}>
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
