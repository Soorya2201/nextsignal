import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Floor {
  id: string;
  floor_number: number;
  floor_name: string;
  units_per_floor: number;
}

interface Unit {
  id: string;
  unit_number: string;
  unit_label: string | null;
  position_index: number;
}

interface UnitSelectionProps {
  locationId: string;
  locationName: string;
  onConfirm: (floorNumber: number, unitNumber: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function UnitSelection({
  locationId,
  locationName,
  onConfirm,
  onBack,
  isLoading = false,
}: UnitSelectionProps) {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch floors for this location
  useEffect(() => {
    const fetchFloors = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("location_floors")
          .select("*")
          .eq("location_id", locationId)
          .order("floor_number", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setFloors(data);
          setSelectedFloor(data[0]);
        } else {
          // Create default floors if none exist (1-5)
          const defaultFloors: Floor[] = Array.from({ length: 5 }, (_, i) => ({
            id: `default-${i + 1}`,
            floor_number: i + 1,
            floor_name: `Floor ${i + 1}`,
            units_per_floor: 4,
          }));
          setFloors(defaultFloors);
          setSelectedFloor(defaultFloors[0]);
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
        // Fallback to defaults
        const defaultFloors: Floor[] = Array.from({ length: 5 }, (_, i) => ({
          id: `default-${i + 1}`,
          floor_number: i + 1,
          floor_name: `Floor ${i + 1}`,
          units_per_floor: 4,
        }));
        setFloors(defaultFloors);
        setSelectedFloor(defaultFloors[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchFloors();
  }, [locationId]);

  // Fetch or generate units for selected floor
  useEffect(() => {
    const fetchUnits = async () => {
      if (!selectedFloor) return;

      try {
        // Check if floor has a real ID (not default)
        if (!selectedFloor.id.startsWith("default-")) {
          const { data, error } = await supabase
            .from("location_units")
            .select("*")
            .eq("floor_id", selectedFloor.id)
            .order("position_index", { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            setUnits(data);
            return;
          }
        }

        // Generate default units based on floor number and units_per_floor
        const floorPrefix = selectedFloor.floor_number;
        const defaultUnits: Unit[] = Array.from(
          { length: selectedFloor.units_per_floor },
          (_, i) => ({
            id: `unit-${floorPrefix}${String(i + 1).padStart(2, "0")}`,
            unit_number: `${floorPrefix}${String(i + 1).padStart(2, "0")}`,
            unit_label: null,
            position_index: i,
          })
        );
        setUnits(defaultUnits);
      } catch (error) {
        console.error("Error fetching units:", error);
        // Fallback
        const floorPrefix = selectedFloor.floor_number;
        const defaultUnits: Unit[] = Array.from({ length: 4 }, (_, i) => ({
          id: `unit-${floorPrefix}${String(i + 1).padStart(2, "0")}`,
          unit_number: `${floorPrefix}${String(i + 1).padStart(2, "0")}`,
          unit_label: null,
          position_index: i,
        }));
        setUnits(defaultUnits);
      }
    };

    fetchUnits();
    setSelectedUnit(null);
  }, [selectedFloor]);

  const handleConfirm = () => {
    if (selectedFloor && selectedUnit) {
      onConfirm(selectedFloor.floor_number, selectedUnit);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-display font-bold text-foreground mb-1">
          Select Unit
        </h3>
        <p className="text-sm text-muted-foreground">
          Select your unit to receive accurate evacuation routes
        </p>
      </div>

      {/* Location indicator */}
      <div className="text-center py-2 px-4 bg-secondary/50 rounded-xl">
        <span className="text-sm text-muted-foreground">{locationName}</span>
      </div>

      {/* Selection Card */}
      <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 space-y-6">
        {/* Floor Selector */}
        <div className="space-y-2">
          <Label className="text-foreground">Floor</Label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFloorDropdownOpen(!floorDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-card rounded-xl border border-border text-left hover:border-primary/50 transition-colors"
            >
              <span className="text-foreground">
                {selectedFloor?.floor_name || "Select floor"}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  floorDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {floorDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-card rounded-xl border border-border shadow-elevated overflow-hidden">
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    type="button"
                    onClick={() => {
                      setSelectedFloor(floor);
                      setFloorDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between",
                      selectedFloor?.id === floor.id && "bg-primary/10"
                    )}
                  >
                    <span className="text-foreground">{floor.floor_name}</span>
                    {selectedFloor?.id === floor.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unit Dropdown */}
        <div className="space-y-2">
          <Label className="text-foreground">Apartment / Unit</Label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-card rounded-xl border border-border text-left hover:border-primary/50 transition-colors"
            >
              <span className={selectedUnit ? "text-foreground" : "text-muted-foreground"}>
                {selectedUnit ? `Unit ${selectedUnit}` : "Select unit"}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  unitDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {unitDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-card rounded-xl border border-border shadow-elevated overflow-hidden max-h-48 overflow-y-auto">
                {units.map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => {
                      setSelectedUnit(unit.unit_number);
                      setUnitDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between",
                      selectedUnit === unit.unit_number && "bg-primary/10"
                    )}
                  >
                    <span className="text-foreground">
                      Unit {unit.unit_label || unit.unit_number}
                    </span>
                    {selectedUnit === unit.unit_number && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floor Plan Visual */}
        <div className="space-y-2">
          <Label className="text-foreground">Floor Plan</Label>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="grid grid-cols-4 gap-3">
              {units.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => setSelectedUnit(unit.unit_number)}
                  className={cn(
                    "aspect-[3/4] rounded-lg border-2 flex items-center justify-center font-medium transition-all duration-200",
                    "hover:scale-105 hover:border-primary/50",
                    selectedUnit === unit.unit_number
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50"
                  )}
                >
                  {unit.unit_label || unit.unit_number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedFloor || !selectedUnit || isLoading}
          className="flex-1 h-12 gradient-primary border-0"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Confirming...
            </span>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Confirm My Location
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
