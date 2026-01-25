import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ChannelCard, ChannelType } from "@/components/ChannelCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar, AvatarGroup } from "@/components/Avatar";
import { SOSBadge } from "@/components/SOSBadge";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useStatus } from "@/context/StatusContext";

import avatar1 from "@/assets/avatars/avatar-1.jpg";
import avatar2 from "@/assets/avatars/avatar-2.jpg";
import avatar3 from "@/assets/avatars/avatar-3.jpg";
import avatar4 from "@/assets/avatars/avatar-4.jpg";
import avatar5 from "@/assets/avatars/avatar-5.jpg";
import avatar6 from "@/assets/avatars/avatar-6.jpg";
import avatar7 from "@/assets/avatars/avatar-7.jpg";
import avatar8 from "@/assets/avatars/avatar-8.jpg";
import avatar9 from "@/assets/avatars/avatar-9.jpg";
import avatar10 from "@/assets/avatars/avatar-10.jpg";
import avatar11 from "@/assets/avatars/avatar-11.jpg";
import avatar12 from "@/assets/avatars/avatar-12.jpg";
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
  description?: string;
}

const buildingChannels: Record<string, Channel[]> = {
  "1": [
    { id: "1", type: "unit", name: "Unit", memberCount: 4, isOnline: true, image: building1, description: "4 Members in Unit" },
    { id: "2", type: "friends", name: "Friends", memberCount: 9, isOnline: true, image: avatar3, description: "9 Members added as Friends" },
    { id: "3", type: "management", name: "Management", memberCount: 3, isOnline: true, image: avatar2, description: "3 People" },
    { id: "4", type: "world", name: "Open World", memberCount: 123, isOnline: true, isLive: true, image: building2, description: "123 Members LIVE" },
    { id: "5", type: "rescuers", name: "Rescuers", memberCount: 8, isOnline: false, image: avatar5 },
  ],
  "2": [
    { id: "1", type: "unit", name: "Office Floor 3", memberCount: 12, isOnline: true, image: building2, description: "12 Colleagues" },
    { id: "2", type: "friends", name: "Work Buddies", memberCount: 5, isOnline: true, image: avatar4, description: "5 Work Friends" },
    { id: "3", type: "management", name: "HR & Admin", memberCount: 4, isOnline: true, image: avatar2, description: "4 Staff" },
    { id: "4", type: "world", name: "Building Lobby", memberCount: 89, isOnline: true, isLive: true, image: building2, description: "89 Members LIVE" },
    { id: "5", type: "rescuers", name: "Security Team", memberCount: 6, isOnline: false, image: avatar5 },
  ],
};

const buildingNames: Record<string, string> = {
  "1": "Home",
  "2": "Work",
};

// Dynamic members for each channel per building
const buildingChannelMembers: Record<string, Record<string, { src: string; alt: string; status: "safe" | "evacuating" | "danger" }[]>> = {
  "1": {
    "1": [ // Unit - Home
      { src: avatar1, alt: "Soorya", status: "safe" },
      { src: avatar6, alt: "Priya", status: "safe" },
      { src: avatar9, alt: "Kevin", status: "evacuating" },
      { src: avatar12, alt: "James", status: "safe" },
    ],
    "2": [ // Friends - Home
      { src: avatar1, alt: "Soorya", status: "safe" },
      { src: avatar2, alt: "Mike", status: "safe" },
      { src: avatar3, alt: "Marvin", status: "evacuating" },
      { src: avatar4, alt: "Gregory", status: "safe" },
      { src: avatar5, alt: "Samuel", status: "danger" },
      { src: avatar8, alt: "Lisa", status: "safe" },
      { src: avatar11, alt: "Fatima", status: "safe" },
    ],
    "3": [ // Management - Home
      { src: avatar2, alt: "Mike", status: "safe" },
      { src: avatar7, alt: "Robert", status: "safe" },
      { src: avatar10, alt: "Carlos", status: "safe" },
    ],
    "4": [ // Open World - Home
      { src: avatar6, alt: "Priya", status: "safe" },
      { src: avatar7, alt: "Robert", status: "evacuating" },
      { src: avatar8, alt: "Lisa", status: "safe" },
      { src: avatar9, alt: "Kevin", status: "danger" },
      { src: avatar10, alt: "Carlos", status: "safe" },
      { src: avatar11, alt: "Fatima", status: "evacuating" },
      { src: avatar12, alt: "James", status: "safe" },
    ],
    "5": [ // Rescuers - Home
      { src: avatar5, alt: "Samuel", status: "safe" },
      { src: avatar7, alt: "Robert", status: "safe" },
      { src: avatar10, alt: "Carlos", status: "safe" },
      { src: avatar12, alt: "James", status: "safe" },
    ],
  },
  "2": {
    "1": [ // Unit - Work
      { src: avatar6, alt: "Priya", status: "safe" },
      { src: avatar7, alt: "Robert", status: "safe" },
      { src: avatar8, alt: "Lisa", status: "safe" },
      { src: avatar9, alt: "Kevin", status: "evacuating" },
      { src: avatar10, alt: "Carlos", status: "safe" },
      { src: avatar11, alt: "Fatima", status: "safe" },
    ],
    "2": [ // Friends - Work
      { src: avatar4, alt: "Gregory", status: "safe" },
      { src: avatar8, alt: "Lisa", status: "safe" },
      { src: avatar9, alt: "Kevin", status: "evacuating" },
      { src: avatar11, alt: "Fatima", status: "safe" },
      { src: avatar12, alt: "James", status: "danger" },
    ],
    "3": [ // Management - Work
      { src: avatar2, alt: "Mike", status: "safe" },
      { src: avatar7, alt: "Robert", status: "safe" },
      { src: avatar10, alt: "Carlos", status: "safe" },
      { src: avatar6, alt: "Priya", status: "safe" },
    ],
    "4": [ // Open World - Work
      { src: avatar1, alt: "Soorya", status: "safe" },
      { src: avatar3, alt: "Marvin", status: "evacuating" },
      { src: avatar5, alt: "Samuel", status: "safe" },
      { src: avatar6, alt: "Priya", status: "safe" },
      { src: avatar8, alt: "Lisa", status: "danger" },
      { src: avatar12, alt: "James", status: "safe" },
    ],
    "5": [ // Rescuers - Work
      { src: avatar5, alt: "Samuel", status: "safe" },
      { src: avatar7, alt: "Robert", status: "safe" },
      { src: avatar10, alt: "Carlos", status: "safe" },
      { src: avatar2, alt: "Mike", status: "safe" },
      { src: avatar11, alt: "Fatima", status: "safe" },
      { src: avatar12, alt: "James", status: "safe" },
    ],
  },
};

// CSS class for each channel member section
const channelMemberStyles: Record<string, string> = {
  "1": "channel-members-unit",
  "2": "channel-members-friends",
  "3": "channel-members-management",
  "4": "channel-members-world",
  "5": "channel-members-rescuers",
};

export default function BuildingChannelsPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [selectedChannel, setSelectedChannel] = useState<string>("2");
  const { currentStatus, setCurrentStatus } = useStatus();

  const channels = buildingChannels[buildingId || "1"] || buildingChannels["1"];
  const buildingName = buildingNames[buildingId || "1"] || "Building";
  const activeChannel = channels.find(c => c.id === selectedChannel);
  const rescuersChannel = channels.find(c => c.type === "rescuers");
  const gridChannels = channels.filter(c => c.type !== "rescuers");
  
  const buildingMembers = buildingChannelMembers[buildingId || "1"] || buildingChannelMembers["1"];
  const currentMembers = buildingMembers[selectedChannel] || buildingMembers["2"];
  const currentMemberStyle = channelMemberStyles[selectedChannel] || channelMemberStyles["2"];

  return (
    <div className="mobile-container">
      <div className="page-content">
        {/* Header */}
        <header className="flex items-center justify-between py-4 mb-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Voice Channels</h1>
              <p className="text-sm text-muted-foreground">{buildingName}</p>
            </div>
          </div>
          <Avatar src={avatar1} alt="Profile" size="lg" status="online" />
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
                type={channel.type}
                name={channel.name}
                memberCount={channel.memberCount}
                isOnline={channel.isOnline}
                isLive={channel.isLive}
                image={channel.image}
                selected={selectedChannel === channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                description={channel.description}
              />
            </div>
          ))}
        </div>

        {/* Rescuers - Special full-width card */}
        {rescuersChannel && (
          <div className="mb-5 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="channel-members-rescuers rounded-2xl p-4 flex items-center justify-between border border-status-danger/20">
              <div className="flex items-center gap-3">
                <Avatar src={rescuersChannel.image} alt="Rescuers" size="lg" />
                <div>
                  <h4 className="font-display font-semibold text-foreground">{rescuersChannel.name}</h4>
                  <p className="text-sm text-muted-foreground">- OFFLINE -</p>
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
        <div className="animate-slide-up">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Current Channel</h3>
          <div className="card-elevated">
            <div className="flex items-center gap-3 mb-4">
              <Avatar 
                src={activeChannel?.image || avatar3} 
                alt={activeChannel?.name || "Channel"} 
                size="lg" 
                status="online"
              />
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg text-foreground">
                  {activeChannel?.name || "Friends"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total {currentMembers.length} Members
                </p>
              </div>
            </div>

            {/* Members Preview - Dynamic based on channel */}
            <div className={`${currentMemberStyle} rounded-2xl p-4 flex items-center justify-between transition-all duration-300`}>
              <AvatarGroup avatars={currentMembers} max={5} size="lg" />
              <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
