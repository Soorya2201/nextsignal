import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, XCircle, Construction } from "lucide-react";
import logo from "@/assets/logo.png";
import hazardMapImage from "@/assets/hazard-maps/hazard-map-default.png";
import hazardMapBlockedImage from "@/assets/hazard-maps/hazard-map-blocked.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type FlowStep = "initial" | "selectReason" | "selectLocation" | "loading" | "blocked";

const exitLocations = [
  { id: "exit1", label: "Main Entrance (Left)", left: "8%", top: "35%" },
  { id: "exit2", label: "Stairwell Exit (Center)", left: "48%", top: "85%" },
  { id: "exit3", label: "Emergency Exit (Right)", left: "88%", top: "75%" },
];

const blockReasons = [
  { id: "fire", label: "🔥 Fire Hazard", description: "Active fire or smoke detected" },
  { id: "structural", label: "🏚️ Structural Damage", description: "Ceiling collapse or debris" },
  { id: "flood", label: "🌊 Flooding", description: "Water accumulation blocking path" },
  { id: "debris", label: "🧱 Debris/Obstruction", description: "Objects blocking the exit" },
  { id: "emergency", label: "🚨 Cordoned by Emergency Services", description: "Area secured by rescue teams" },
];

export default function HazardMapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location");
  
  const [flowStep, setFlowStep] = useState<FlowStep>("initial");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [selectedExit, setSelectedExit] = useState<string | null>(null);

  const handleExitNonAccessible = () => {
    setFlowStep("selectReason");
  };

  const toggleReason = (reasonId: string) => {
    setSelectedReasons(prev => 
      prev.includes(reasonId) 
        ? prev.filter(id => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleContinueToMap = () => {
    if (selectedReasons.length > 0) {
      setFlowStep("selectLocation");
    }
  };

  const handleSelectExit = (exitId: string) => {
    setSelectedExit(exitId);
    setFlowStep("loading");
    
    // Show loading for 4 seconds, then show blocked map
    setTimeout(() => {
      setFlowStep("blocked");
    }, 4000);
  };

  const handleReset = () => {
    setFlowStep("initial");
    setSelectedReasons([]);
    setSelectedExit(null);
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
        {/* Loading State */}
        {flowStep === "loading" && (
          <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center gap-6">
            <div className="animate-pulse">
              <Construction className="w-24 h-24 text-amber-500" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-center">
                🚧 Exit Blocked
              </h2>
              <p className="text-muted-foreground">Calculating alternative routes...</p>
            </div>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 animate-[loading_4s_ease-in-out]" 
                   style={{ animation: "loading 4s ease-in-out forwards" }} />
            </div>
          </div>
        )}

        {/* Initial State - Exit Non Accessible Button */}
        {flowStep === "initial" && (
          <Button
            onClick={handleExitNonAccessible}
            variant="outline"
            className="w-full mb-4 border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Exit Non Accessible
          </Button>
        )}

        {/* Reset Button when blocked */}
        {flowStep === "blocked" && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full mb-4 border-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Reset Map
          </Button>
        )}

        {/* Hazard Map Image */}
        <div className="relative rounded-2xl overflow-hidden border border-border">
          <img 
            src={flowStep === "blocked" ? hazardMapBlockedImage : hazardMapImage} 
            alt="Building Hazard Map" 
            className="w-full h-auto"
          />
          
          {/* Clickable exit points when selecting location */}
          {flowStep === "selectLocation" && exitLocations.map((exit) => (
            <button
              key={exit.id}
              onClick={() => handleSelectExit(exit.id)}
              className="absolute animate-pulse hover:scale-110 transition-transform"
              style={{ left: exit.left, top: exit.top }}
            >
              <div className="w-12 h-12 rounded-full border-4 border-amber-500 bg-amber-500/30 flex items-center justify-center cursor-pointer hover:bg-amber-500/50">
                <span className="text-lg">📍</span>
              </div>
            </button>
          ))}
          
          {/* Blocked exit indicator */}
          {flowStep === "blocked" && selectedExit && (
            <div 
              className="absolute"
              style={{
                left: exitLocations.find(e => e.id === selectedExit)?.left || "8%",
                top: exitLocations.find(e => e.id === selectedExit)?.top || "35%",
              }}
            >
              <div className="w-14 h-14 rounded-full border-4 border-destructive bg-destructive/40 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
          )}
        </div>

        {/* Select Location Instructions */}
        {flowStep === "selectLocation" && (
          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-amber-500 font-medium text-center">
              👆 Tap on the exit location that is blocked
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 p-4 bg-card rounded-xl border border-border">
          <h3 className="font-semibold text-foreground mb-2">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded" />
              <span className="text-muted-foreground">Exit Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-destructive bg-destructive/30" />
              <span className="text-muted-foreground">Blocked Exit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-3 h-3 bg-destructive rounded-full" />
              </div>
              <span className="text-muted-foreground">Your Location</span>
            </div>
            {flowStep === "blocked" && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center text-amber-500">
                  →
                </div>
                <span className="text-muted-foreground">Alternative Route</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reason Selection Dialog */}
      <Dialog open={flowStep === "selectReason"} onOpenChange={(open) => !open && setFlowStep("initial")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              Why is this exit blocked?
            </DialogTitle>
            <DialogDescription className="text-left">
              Select all reasons that apply:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[300px] overflow-y-auto">
            {blockReasons.map((reason) => (
              <label
                key={reason.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedReasons.includes(reason.id)
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <Checkbox
                  checked={selectedReasons.includes(reason.id)}
                  onCheckedChange={() => toggleReason(reason.id)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium text-foreground">{reason.label}</p>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFlowStep("initial")}>
              Cancel
            </Button>
            <Button 
              onClick={handleContinueToMap}
              disabled={selectedReasons.length === 0}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              Continue to Map
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
