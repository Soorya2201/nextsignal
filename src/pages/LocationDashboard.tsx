import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Shield, 
  Map, 
  Navigation, 
  AlertTriangle, 
  ChevronRight,
  MapPin,
  Edit2,
  Phone,
  MessageSquare
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UnitSelection } from "@/components/UnitSelection";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LocationDetails {
  id: string;
  name: string;
  address: string;
  image_url: string | null;
}

interface UserLocationDetails {
  id: string;
  floor_number: number | null;
  unit_number: string | null;
  nickname: string | null;
}

export default function LocationDashboard() {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUnitEditor, setShowUnitEditor] = useState(false);
  const [isUpdatingUnit, setIsUpdatingUnit] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      if (!locationId) return;
      
      try {
        // Fetch location details
        const { data: locData } = await supabase
          .from("locations")
          .select("id, name, address, image_url")
          .eq("id", locationId)
          .single();
        
        if (locData) setLocation(locData);

        // Fetch user's location details (floor/unit)
        const { data: userLocData } = await supabase
          .from("user_locations")
          .select("id, floor_number, unit_number, nickname")
          .eq("location_id", locationId)
          .eq("user_id", user.id)
          .single();
        
        if (userLocData) setUserLocation(userLocData);
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationId, user, navigate]);

  const handleUnitUpdate = async (floorNumber: number, unitNumber: string) => {
    if (!userLocation || !user) return;

    setIsUpdatingUnit(true);
    try {
      // Delete and re-insert since UPDATE is not allowed by RLS
      const { error: deleteError } = await supabase
        .from("user_locations")
        .delete()
        .eq("id", userLocation.id);

      if (deleteError) throw deleteError;

      const { data: newData, error: insertError } = await supabase
        .from("user_locations")
        .insert({
          user_id: user.id,
          location_id: locationId,
          floor_number: floorNumber,
          unit_number: unitNumber,
          nickname: userLocation.nickname,
          category: "Personal",
        })
        .select("id, floor_number, unit_number, nickname")
        .single();

      if (insertError) throw insertError;

      if (newData) {
        setUserLocation(newData);
      }
      setShowUnitEditor(false);
    } catch (error) {
      console.error("Error updating unit:", error);
    } finally {
      setIsUpdatingUnit(false);
    }
  };

  const handleEmergencyAlert = () => {
    navigate(`/emergency-report?location=${locationId}`);
  };

  const handleHazardMap = () => {
    navigate(`/hazard-map?location=${locationId}`);
  };

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="page-content pb-24">
        {/* Header */}
        <header className="flex items-center justify-between py-4 mb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                {userLocation?.nickname || location?.name || "Location"}
              </h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{location?.address}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Building Status Banner */}
        <div 
          className={`rounded-2xl p-5 mb-6 ${
            isEmergencyActive 
              ? "bg-gradient-to-r from-destructive to-destructive/80" 
              : "bg-gradient-to-r from-status-safe to-emerald-500"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-display font-bold text-white">
                {isEmergencyActive ? "Emergency Active" : "All Clear"}
              </h2>
              <p className="text-white/80 text-sm">
                {isEmergencyActive 
                  ? "Follow evacuation instructions" 
                  : "No active hazards reported"}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs text-white font-medium">System Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Info Card */}
        <div className="card-elevated mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Unit</p>
                <p className="font-semibold text-foreground">
                  {userLocation?.unit_number 
                    ? `Floor ${userLocation.floor_number} • Unit ${userLocation.unit_number}`
                    : "Not set"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUnitEditor(true)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Building Map */}
            <button
              onClick={() => navigate(`/channels/${locationId}`)}
              className="card-elevated flex flex-col items-center justify-center py-8 hover:scale-[1.02] transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <Map className="w-7 h-7 text-primary" />
              </div>
              <span className="font-semibold text-foreground">Building Map</span>
              <span className="text-xs text-muted-foreground">View exits & routes</span>
            </button>

            {/* Practice Drill */}
            <button
              onClick={() => setIsEmergencyActive(!isEmergencyActive)}
              className="card-elevated flex flex-col items-center justify-center py-8 hover:scale-[1.02] transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-3">
                <Navigation className="w-7 h-7 text-amber-500" />
              </div>
              <span className="font-semibold text-foreground">Practice Drill</span>
              <span className="text-xs text-muted-foreground">Simulate evacuation</span>
            </button>
          </div>
        </div>

        {/* Hazard Map Button */}
        <button
          onClick={handleHazardMap}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl p-4 flex items-center justify-between mb-4 hover:scale-[1.01] transition-transform shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Hazard Map</p>
              <p className="text-xs text-white/80">View danger zones & safe areas</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Voice Channels Button */}
        <button
          onClick={() => navigate(`/channels/${locationId}`)}
          className="w-full card-elevated flex items-center justify-between mb-4 hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Voice Channels</p>
              <p className="text-xs text-muted-foreground">Connect with neighbors</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* AI Chat Button */}
        <button
          onClick={() => navigate("/chat")}
          className="w-full card-elevated flex items-center justify-between mb-6 hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-violet-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">AI Emergency Guide</p>
              <p className="text-xs text-muted-foreground">Get instant help & info</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Report Emergency - Full Width Red Button */}
        <button
          onClick={handleEmergencyAlert}
          className="w-full bg-gradient-to-r from-destructive to-red-600 rounded-2xl p-5 flex items-center justify-between hover:scale-[1.01] transition-transform shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-white text-lg">Report Emergency</p>
              <p className="text-white/80 text-sm">Tap to alert responders immediately</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      <BottomNav />

      {/* Unit Editor Dialog */}
      <Dialog open={showUnitEditor} onOpenChange={setShowUnitEditor}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          {location && (
            <UnitSelection
              locationId={location.id}
              locationName={location.name}
              onConfirm={handleUnitUpdate}
              onBack={() => setShowUnitEditor(false)}
              isLoading={isUpdatingUnit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
