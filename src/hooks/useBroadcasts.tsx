import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  priority: string;
  created_at: string;
  location_id: string;
  sender_id: string;
}

export function useBroadcasts() {
  const { user } = useAuth();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBroadcasts = async () => {
      try {
        // Get user's locations first
        const { data: userLocations } = await supabase
          .from("user_locations")
          .select("location_id")
          .eq("user_id", user.id);

        if (!userLocations || userLocations.length === 0) {
          setBroadcasts([]);
          setLoading(false);
          return;
        }

        const locationIds = userLocations.map((ul) => ul.location_id);

        // Fetch broadcasts for user's locations
        const { data, error } = await supabase
          .from("broadcasts")
          .select("*")
          .in("location_id", locationIds)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setBroadcasts(data || []);
      } catch (err) {
        console.error("Error fetching broadcasts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBroadcasts();

    // Subscribe to new broadcasts in real-time
    const channel = supabase
      .channel("broadcasts-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "broadcasts",
        },
        (payload) => {
          setBroadcasts((prev) => [...prev, payload.new as Broadcast]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { broadcasts, loading };
}
