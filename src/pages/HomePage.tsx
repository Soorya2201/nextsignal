import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { BuildingCard } from "@/components/BuildingCard";
import { FilterChipGroup } from "@/components/FilterChip";

import building1 from "@/assets/buildings/building-1.jpg";
import building2 from "@/assets/buildings/building-2.jpg";

const buildings = [
  {
    id: "1",
    name: "Home",
    address: "325 W Adams Blvd",
    image: building1,
    notifications: 5,
    category: "Your",
  },
  {
    id: "2",
    name: "Work",
    address: "3245 East Bell Gardens",
    image: building2,
    notifications: 0,
    category: "Work",
  },
];

const filterOptions = ["Your", "Personal", "Work", "Public"];

export default function HomePage() {
  const [filter, setFilter] = useState("Your");
  const navigate = useNavigate();

  const filteredBuildings = filter === "Your" 
    ? buildings 
    : buildings.filter(b => b.category === filter);

  const handleBuildingClick = (buildingId: string) => {
    navigate(`/channels/${buildingId}`);
  };

  return (
    <div className="mobile-container">
      <div className="page-content">
        <PageHeader
          title="Location"
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
          {filteredBuildings.map((building, index) => (
            <div 
              key={building.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BuildingCard
                name={building.name}
                address={building.address}
                image={building.image}
                notifications={building.notifications}
                onClick={() => handleBuildingClick(building.id)}
              />
            </div>
          ))}
        </div>

        {/* Floating action button */}
        <button className="fab-button fixed bottom-24 right-6 text-primary-foreground">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
