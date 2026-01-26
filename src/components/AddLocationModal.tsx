import { useState } from "react";
import { X, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnitSelection } from "@/components/UnitSelection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationAdded: () => void;
}

type Step = "search" | "details" | "unit";

export function AddLocationModal({ isOpen, onClose, onLocationAdded }: AddLocationModalProps) {
  const [step, setStep] = useState<Step>("search");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [category, setCategory] = useState("Personal");
  const [isLoading, setIsLoading] = useState(false);
  const [foundLocation, setFoundLocation] = useState<{ id: string; name: string; address: string } | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = ["Personal", "Work", "Public"];

  const handleSearch = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, address")
        .eq("unique_code", code.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setFoundLocation(data);
        setStep("details");
      } else {
        toast({
          title: "Location not found",
          description: "Please check the code and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToUnit = () => {
    setStep("unit");
  };

  const handleUnitConfirm = async (floorNumber: number, unitNumber: string) => {
    if (!foundLocation || !user) return;

    setSelectedFloor(floorNumber);
    setSelectedUnit(unitNumber);
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("user_locations")
        .insert({
          user_id: user.id,
          location_id: foundLocation.id,
          category,
          nickname: nickname.trim() || null,
          floor_number: floorNumber,
          unit_number: unitNumber,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already added",
            description: "You've already added this location.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }
      
      toast({
        title: "Location added!",
        description: `${foundLocation.name} - Unit ${unitNumber} has been added.`,
      });
      
      onLocationAdded();
      handleReset();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("search");
    setCode("");
    setNickname("");
    setCategory("Personal");
    setFoundLocation(null);
    setSelectedFloor(null);
    setSelectedUnit(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md p-6 animate-slide-up shadow-elevated border border-border/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">
            {step === "search" && "Add Location"}
            {step === "details" && "Location Details"}
            {step === "unit" && "Select Your Unit"}
          </h2>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Search */}
        {step === "search" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Location Code</Label>
              <Input
                id="code"
                placeholder="Enter unique code (e.g., ADAMS325)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="h-12 uppercase"
              />
              <p className="text-xs text-muted-foreground">
                Ask your building management for the location code
              </p>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full h-12 gradient-primary border-0"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? "Searching..." : "Find Location"}
            </Button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === "details" && foundLocation && (
          <div className="space-y-4">
            {/* Found location card */}
            <div className="bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-xl p-4 flex items-center gap-4 border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{foundLocation.name}</h3>
                <p className="text-sm text-muted-foreground">{foundLocation.address}</p>
              </div>
              <Check className="w-5 h-5 text-status-safe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname (optional)</Label>
              <Input
                id="nickname"
                placeholder="e.g., Home, Office"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                      category === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep("search")}
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={handleProceedToUnit}
                className="flex-1 h-12 gradient-primary border-0"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Unit Selection */}
        {step === "unit" && foundLocation && (
          <UnitSelection
            locationId={foundLocation.id}
            locationName={foundLocation.name}
            onConfirm={handleUnitConfirm}
            onBack={() => setStep("details")}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
