import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import logo from "@/assets/logo.png";

export default function HazardMapPage() {
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
            <h1 className="font-display font-bold text-lg text-amber-500">Hazard Map</h1>
            <p className="text-xs text-muted-foreground">View danger zones & safe areas</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Placeholder for hazard map image */}
        <div className="aspect-square rounded-2xl border-2 border-dashed border-amber-500/30 bg-amber-500/5 flex flex-col items-center justify-center">
          <AlertTriangle className="w-16 h-16 text-amber-500/50 mb-4" />
          <p className="text-lg font-semibold text-foreground">Hazard Map</p>
          <p className="text-sm text-muted-foreground text-center px-8">
            Upload your building's hazard map to display here
          </p>
        </div>

        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <strong>Note:</strong> A hazard map image will be displayed here once uploaded.
          </p>
        </div>
      </main>
    </div>
  );
}
