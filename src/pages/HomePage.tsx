import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Plus, LogIn } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { BuildingCard } from "@/components/BuildingCard";
import { FilterChipGroup } from "@/components/FilterChip";
import { AddLocationModal } from "@/components/AddLocationModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

import building1 from "@/assets/buildings/building-1.jpg";
import building2 from "@/assets/buildings/building-2.jpg";

interface UserLocation {
  id: string;
  nickname: string | null;
  category: string;
  location: {
    id: string;
    name: string;
    address: string;
    unique_code: string;
    image_url: string | null;
  };
}

const filterOptions = ["All", "Personal", "Work", "Public"];
const buildingImages = [building1, building2];

export default function HomePage() {
  const [filter, setFilter] = useState("All");
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const fetchUserLocations = async () => {
    if (!user) {
      setUserLocations([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_locations")
        .select(`
          id,
          nickname,
          category,
          location:locations(id, name, address, unique_code, image_url)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      
      setUserLocations(data as unknown as UserLocation[]);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchUserLocations();
    }
  }, [user, authLoading]);

  const filteredLocations = filter === "All"
    ? userLocations
    : userLocations.filter(ul => ul.category === filter);

  const handleBuildingClick = (locationId: string) => {
    navigate(`/location/${locationId}`);
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="mobile-container">
        <div className="page-content flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
            <LogIn className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Welcome to Next Signal
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xs">
            Sign in to access your locations and stay safe during emergencies
          </p>
          <Link to="/auth">
            <Button className="gradient-primary border-0 h-12 px-8 text-base font-semibold">
              Sign In or Create Account
            </Button>
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="page-content">
        <PageHeader
          title="Locations"
          rightAction={
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          }
        />

        <FilterChipGroup
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />

        <div className="mt-6 space-y-4">
          {isLoading || authLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-muted/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No locations yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add your first location using a unique code
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="gradient-primary border-0"
              >
                Add Location
              </Button>
            </div>
          ) : (
            filteredLocations.map((ul, index) => (
              <div 
                key={ul.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BuildingCard
                  name={ul.nickname || ul.location.name}
                  address={ul.location.address}
                  image={buildingImages[index % buildingImages.length]}
                  notifications={0}
                  onClick={() => handleBuildingClick(ul.location.id)}
                />
              </div>
            ))
          )}
        </div>

        {/* Floating action button */}
        {user && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="fab-button fixed bottom-24 right-6 text-primary-foreground"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      <BottomNav />
      
      <AddLocationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onLocationAdded={fetchUserLocations}
      />
    </div>
  );
}
