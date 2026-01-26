-- Update channel_members to reference profiles properly
-- Add a foreign key constraint to ensure only valid users can be added

-- First, add a unique constraint on profiles.user_id if not exists
ALTER TABLE public.channel_members 
ADD CONSTRAINT channel_members_user_profile_fk 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_channel_members_user_id ON public.channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_channel_id ON public.channel_members(channel_id);

-- Allow users to search profiles (read-only for finding members to add)
CREATE POLICY "Users can search profiles for adding to channels"
ON public.profiles FOR SELECT
USING (true);