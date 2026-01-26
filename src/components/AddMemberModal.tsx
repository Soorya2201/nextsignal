import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, Search, UserX, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/Avatar";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelName: string;
  channelId: string;
  existingMemberIds: string[];
  onMemberAdded: () => void;
}

export function AddMemberModal({
  open,
  onOpenChange,
  channelName,
  channelId,
  existingMemberIds,
  onMemberAdded,
}: AddMemberModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  // Search for users in the database
  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, avatar_url")
        .or(`full_name.ilike.%${query}%,user_id.eq.${isValidUUID(query) ? query : '00000000-0000-0000-0000-000000000000'}`)
        .limit(10);

      if (error) throw error;

      // Filter out users already in the channel
      const filteredResults = (data || []).filter(
        (user) => !existingMemberIds.includes(user.user_id)
      );

      setSearchResults(filteredResults);
    } catch (err: any) {
      console.error("Error searching users:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [existingMemberIds]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUser(null);
    }
  }, [open]);

  const handleAddMember = async () => {
    if (!selectedUser) {
      toast({
        variant: "destructive",
        title: "No user selected",
        description: "Please search and select a user from the database",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("channel_members").insert({
        channel_id: channelId,
        user_id: selectedUser.user_id,
        display_name: selectedUser.full_name || "Unknown User",
        avatar_url: selectedUser.avatar_url,
        status: "safe",
      });

      if (error) throw error;

      toast({
        title: "Member added!",
        description: `${selectedUser.full_name || "User"} has been added to ${channelName}`,
      });

      onMemberAdded();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Error adding member:", err);
      toast({
        variant: "destructive",
        title: "Failed to add member",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add Member to {channelName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search by Name or User ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Type at least 2 characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-2">
            {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
              <div className="flex flex-col items-center py-6 text-muted-foreground">
                <UserX className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm font-medium">No users found</p>
                <p className="text-xs">Try a different name or user ID</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="border rounded-lg divide-y max-h-[200px] overflow-y-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left ${
                      selectedUser?.id === user.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <Avatar
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={user.full_name || "User"}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {user.full_name || "Unnamed User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        ID: {user.user_id.slice(0, 8)}...
                      </p>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected User Preview */}
          {selectedUser && (
            <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
              <Avatar
                src={selectedUser.avatar_url || "/placeholder.svg"}
                alt={selectedUser.full_name || "User"}
                size="lg"
              />
              <div>
                <p className="font-semibold text-foreground">
                  {selectedUser.full_name || "Unnamed User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ready to add to {channelName}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              className="flex-1"
              disabled={loading || !selectedUser}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper to check if string is valid UUID
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
