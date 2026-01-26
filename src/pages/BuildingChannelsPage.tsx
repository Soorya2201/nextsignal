import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ChannelCard, ChannelType } from "@/components/ChannelCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { SOSBadge } from "@/components/SOSBadge";
import { AddMemberModal } from "@/components/AddMemberModal";
import { ChannelMembersList } from "@/components/ChannelMembersList";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useStatus } from "@/context/StatusContext";
import { useAuth } from "@/hooks/useAuth";
import { useChannels, Channel } from "@/hooks/useChannels";
import { supabase } from "@/integrations/supabase/client";

export default function BuildingChannelsPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentStatus, setCurrentStatus } = useStatus();
  const { channels, loading, removeMember, refetch } = useChannels(buildingId);
  
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>("Location");
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Fetch location details
  useEffect(() => {
    const fetchLocation = async () => {
      if (!buildingId) return;
      
      const { data } = await supabase
        .from("locations")
        .select("name")
        .eq("id", buildingId)
        .single();
      
      if (data) {
        setLocationName(data.name);
      }
    };
    
    fetchLocation();
  }, [buildingId]);

  // Set initial selected channel
  useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      const friendsChannel = channels.find((c) => c.type === "friends");
      setSelectedChannel(friendsChannel?.id || channels[0].id);
    }
  }, [channels, selectedChannel]);

  const activeChannel = channels.find((c) => c.id === selectedChannel);
  const existingMemberIds = activeChannel?.members?.map((m) => m.user_id) || [];
  const rescuersChannel = channels.find((c) => c.type === "rescuers");
  const gridChannels = channels.filter((c) => c.type !== "rescuers");

  const handleMemberAdded = () => {
    // Refetch channels to update the member list
    refetch();
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember(memberId);
  };

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <div className="page-content">
        {/* Header */}
        <header className="flex items-center justify-between py-4 mb-2">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Voice Channels
              </h1>
              <p className="text-sm text-muted-foreground">{locationName}</p>
            </div>
          </div>
          <Avatar
            src={user?.user_metadata?.avatar_url || "/placeholder.svg"}
            alt="Profile"
            size="lg"
            status="online"
          />
        </header>

        {/* Channels Grid - 2x2 layout */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {gridChannels.slice(0, 4).map((channel, index) => (
            <div
              key={channel.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ChannelCard
                type={channel.type as ChannelType}
                name={channel.name}
                memberCount={channel.members?.length || 0}
                isOnline={channel.is_online}
                isLive={channel.is_live}
                image={channel.image_url || getDefaultChannelImage(channel.type)}
                selected={selectedChannel === channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                description={
                  channel.description ||
                  `${channel.members?.length || 0} Members`
                }
              />
            </div>
          ))}
        </div>

        {/* Rescuers - Special full-width card */}
        {rescuersChannel && (
          <div className="mb-5 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="channel-members-rescuers rounded-2xl p-4 flex items-center justify-between border border-status-danger/20">
              <div className="flex items-center gap-3">
                <Avatar
                  src={rescuersChannel.image_url || "/placeholder.svg"}
                  alt="Rescuers"
                  size="lg"
                />
                <div>
                  <h4 className="font-display font-semibold text-foreground">
                    {rescuersChannel.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {rescuersChannel.is_online ? "ONLINE" : "- OFFLINE -"}
                  </p>
                </div>
              </div>
              <SOSBadge size="md" pulse />
            </div>
          </div>
        )}

        {/* Status Selection */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-none">
          <StatusBadge
            status="safe"
            selected={currentStatus === "safe"}
            onClick={() => setCurrentStatus("safe")}
          />
          <StatusBadge
            status="evacuating"
            selected={currentStatus === "evacuating"}
            onClick={() => setCurrentStatus("evacuating")}
          />
          <StatusBadge
            status="danger"
            selected={currentStatus === "danger"}
            onClick={() => setCurrentStatus("danger")}
          />
        </div>

        {/* Draggable handle */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        {/* Current Channel Section */}
        {activeChannel && (
          <div className="animate-slide-up">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Current Channel
            </h3>
            <div className="card-elevated">
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={activeChannel.image_url || getDefaultChannelImage(activeChannel.type)}
                  alt={activeChannel.name}
                  size="lg"
                  status="online"
                />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg text-foreground">
                    {activeChannel.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeChannel.members?.length || 0} Members
                  </p>
                </div>
              </div>

              {/* Dynamic Members List */}
              <ChannelMembersList
                members={activeChannel.members || []}
                channelType={activeChannel.type}
                onRemoveMember={handleRemoveMember}
                onAddMember={() => setAddMemberOpen(true)}
              />
            </div>
          </div>
        )}
      </div>

      <BottomNav />

      {/* Add Member Modal */}
      {activeChannel && (
        <AddMemberModal
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
          channelName={activeChannel.name}
          channelId={activeChannel.id}
          existingMemberIds={existingMemberIds}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
}

// Helper function to get default images based on channel type
function getDefaultChannelImage(type: string): string {
  const images: Record<string, string> = {
    unit: "https://api.dicebear.com/7.x/shapes/svg?seed=unit",
    friends: "https://api.dicebear.com/7.x/shapes/svg?seed=friends",
    management: "https://api.dicebear.com/7.x/shapes/svg?seed=management",
    world: "https://api.dicebear.com/7.x/shapes/svg?seed=world",
    rescuers: "https://api.dicebear.com/7.x/shapes/svg?seed=rescuers",
  };
  return images[type] || "/placeholder.svg";
}
