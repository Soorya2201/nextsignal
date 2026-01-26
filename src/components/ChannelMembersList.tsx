import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { X, UserPlus } from "lucide-react";
import { ChannelMember } from "@/hooks/useChannels";

interface ChannelMembersListProps {
  members: ChannelMember[];
  channelType: string;
  onRemoveMember: (memberId: string) => void;
  onAddMember: () => void;
  editable?: boolean;
}

const memberStyleMap: Record<string, string> = {
  unit: "channel-members-unit",
  friends: "channel-members-friends",
  management: "channel-members-management",
  world: "channel-members-world",
  rescuers: "channel-members-rescuers",
};

export function ChannelMembersList({
  members,
  channelType,
  onRemoveMember,
  onAddMember,
  editable = true,
}: ChannelMembersListProps) {
  const bgClass = memberStyleMap[channelType] || memberStyleMap.friends;

  return (
    <div className={`${bgClass} rounded-2xl p-4 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          {members.length} Members
        </span>
        {editable && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onAddMember}
            className="h-8 px-3 text-primary hover:bg-primary/10"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">No members yet</p>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddMember}
            className="mt-2"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Add First Member
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="relative group animate-fade-in"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <Avatar
                    src={member.avatar_url || "/placeholder.svg"}
                    alt={member.display_name}
                    size="lg"
                    status={member.status}
                  />
                  {editable && (
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-xs text-foreground font-medium max-w-[60px] truncate">
                  {member.display_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
