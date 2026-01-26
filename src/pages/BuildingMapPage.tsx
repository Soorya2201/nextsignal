import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import buildingMapImage from "@/assets/building-map.png";

export default function BuildingMapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location");

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
            <h1 className="font-display font-bold text-lg text-primary">Building Map</h1>
            <p className="text-xs text-muted-foreground">Floor plan & exits</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Building Map Image */}
        <div className="rounded-2xl overflow-hidden border border-border bg-card">
          <img 
            src={buildingMapImage} 
            alt="Building Floor Plan" 
            className="w-full h-auto"
          />
        </div>

        {/* Legend */}
        <div className="mt-4 p-4 bg-card rounded-xl border border-border">
          <h3 className="font-semibold text-foreground mb-2">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/30 rounded border border-primary" />
              <span className="text-muted-foreground">Units (101-104)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center text-xs">🛗</div>
              <span className="text-muted-foreground">Lift / Elevator</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center text-xs">🚪</div>
              <span className="text-muted-foreground">Lobby</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center text-xs">↔️</div>
              <span className="text-muted-foreground">Corridor</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
