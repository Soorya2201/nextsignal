import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { ChannelCard, ChannelType } from "@/components/ChannelCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar, AvatarGroup } from "@/components/Avatar";
import { SOSBadge } from "@/components/SOSBadge";
import { Bell, UserPlus } from "lucide-react";

import avatar1 from "@/assets/avatars/avatar-1.jpg";
import avatar2 from "@/assets/avatars/avatar-2.jpg";
import avatar3 from "@/assets/avatars/avatar-3.jpg";
import avatar4 from "@/assets/avatars/avatar-4.jpg";
import avatar5 from "@/assets/avatars/avatar-5.jpg";
import building1 from "@/assets/buildings/building-1.jpg";
import building2 from "@/assets/buildings/building-2.jpg";

interface Channel {
  id: string;
  type: ChannelType;
  name: string;
  memberCount: number;
  isOnline: boolean;
  isLive?: boolean;
  image: string;
}

const channels: Channel[] = [
  { id: "1", type: "unit", name: "Unit", memberCount: 4, isOnline: true, image: building1 },
  { id: "2", type: "friends", name: "Friends", memberCount: 9, isOnline: true, image: avatar3 },
  { id: "3", type: "management", name: "Management", memberCount: 3, isOnline: true, image: avatar2 },
  { id: "4", type: "world", name: "Open World", memberCount: 123, isOnline: true, isLive: true, image: building2 },
  { id: "5", type: "rescuers", name: "Rescuers", memberCount: 8, isOnline: false, image: avatar5 },
];

const friendsMembers = [
  { src: avatar1, alt: "Soorya", status: "safe" as const },
  { src: avatar2, alt: "Mike", status: "safe" as const },
  { src: avatar3, alt: "Marvin", status: "evacuating" as const },
  { src: avatar4, alt: "Gregory", status: "safe" as const },
  { src: avatar5, alt: "Samuel", status: "danger" as const },
];

export default function ChannelsPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>("2");
  const [currentStatus, setCurrentStatus] = useState<"safe" | "evacuating" | "danger">("safe");

  const activeChannel = channels.find(c => c.id === selectedChannel);

  return (
    <div className="mobile-container">
      <div className="page-content">
        <PageHeader
          title="Voice Channels"
          rightAction={
            <Avatar src={avatar1} alt="Profile" size="lg" status="online" />
          }
        />

        {/* Channels Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {channels.slice(0, 4).map((channel, index) => (
            <div
              key={channel.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ChannelCard
                type={channel.type}
                name={channel.name}
                memberCount={channel.memberCount}
                isOnline={channel.isOnline}
                isLive={channel.isLive}
                image={channel.image}
                selected={selectedChannel === channel.id}
                onClick={() => setSelectedChannel(channel.id)}
              />
            </div>
          ))}
        </div>

        {/* Rescuers (special styling) */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="bg-channel-rescuers rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={avatar5} alt="Rescuers" size="lg" />
              <div>
                <h4 className="font-display font-semibold text-foreground">Rescuers</h4>
                <p className="text-sm text-muted-foreground">- OFFLINE -</p>
              </div>
            </div>
            <SOSBadge size="md" pulse />
          </div>
        </div>

        {/* Status Selection */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
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

        {/* Draggable handle indicator */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        {/* Current Channel Section */}
        <div className="card-elevated animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Avatar 
                src={activeChannel?.image || avatar3} 
                alt={activeChannel?.name || "Channel"} 
                size="lg" 
                status="online"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg text-foreground">
                {activeChannel?.name || "Friends"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Total {activeChannel?.memberCount || 9} Members
              </p>
            </div>
          </div>

          {/* Members Preview */}
          <div className="bg-channel-friends rounded-2xl p-4 flex items-center justify-between">
            <AvatarGroup avatars={friendsMembers} max={5} size="lg" />
            <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
              <UserPlus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
