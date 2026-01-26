import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ChannelMember {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  status: "safe" | "evacuating" | "danger";
}

export interface Channel {
  id: string;
  location_id: string;
  name: string;
  type: "unit" | "friends" | "management" | "world" | "rescuers";
  description: string | null;
  is_online: boolean;
  is_live: boolean;
  image_url: string | null;
  members?: ChannelMember[];
  memberCount?: number;
  isEditable?: boolean;
}

// Default member counts for special channels
const CHANNEL_DEFAULTS: Record<string, { memberCount: number; isEditable: boolean }> = {
  management: { memberCount: 3, isEditable: false },
  world: { memberCount: 138, isEditable: false },
  rescuers: { memberCount: 0, isEditable: false },
};

export function useChannels(locationId: string | undefined) {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    if (!locationId || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch channels for this location
      const { data: channelsData, error: channelsError } = await supabase
        .from("channels")
        .select("*")
        .eq("location_id", locationId);

      if (channelsError) throw channelsError;

      // Fetch members for all channels
      const channelIds = channelsData?.map((c) => c.id) || [];
      
      let membersData: any[] = [];
      if (channelIds.length > 0) {
        const { data, error: membersError } = await supabase
          .from("channel_members")
          .select("*")
          .in("channel_id", channelIds);
        
        if (membersError) throw membersError;
        membersData = data || [];
      }

      // Combine channels with their members and apply defaults
      const channelsWithMembers = channelsData?.map((channel) => {
        const channelType = channel.type as Channel["type"];
        const defaults = CHANNEL_DEFAULTS[channelType];
        const actualMembers = membersData.filter((m) => m.channel_id === channel.id).map((m) => ({
          ...m,
          status: m.status as ChannelMember["status"],
        }));

        return {
          ...channel,
          type: channelType,
          members: actualMembers,
          memberCount: defaults?.memberCount ?? actualMembers.length,
          isEditable: defaults?.isEditable ?? true,
        };
      }) || [];

      setChannels(channelsWithMembers);
    } catch (err: any) {
      console.error("Error fetching channels:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (
    channelId: string,
    displayName: string,
    avatarUrl?: string,
    userId?: string
  ) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { error } = await supabase.from("channel_members").insert({
        channel_id: channelId,
        user_id: userId || crypto.randomUUID(), // Use provided or generate placeholder
        display_name: displayName,
        avatar_url: avatarUrl || null,
        status: "safe",
      });

      if (error) throw error;

      // Refresh channels
      await fetchChannels();
      return { error: null };
    } catch (err: any) {
      console.error("Error adding member:", err);
      return { error: err.message };
    }
  };

  const removeMember = async (memberId: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { error } = await supabase
        .from("channel_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      // Refresh channels
      await fetchChannels();
      return { error: null };
    } catch (err: any) {
      console.error("Error removing member:", err);
      return { error: err.message };
    }
  };

  const updateMemberStatus = async (
    memberId: string,
    status: "safe" | "evacuating" | "danger"
  ) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { error } = await supabase
        .from("channel_members")
        .update({ status })
        .eq("id", memberId);

      if (error) throw error;

      // Refresh channels
      await fetchChannels();
      return { error: null };
    } catch (err: any) {
      console.error("Error updating member status:", err);
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [locationId, user]);

  return {
    channels,
    loading,
    error,
    refetch: fetchChannels,
    addMember,
    removeMember,
    updateMemberStatus,
  };
}
