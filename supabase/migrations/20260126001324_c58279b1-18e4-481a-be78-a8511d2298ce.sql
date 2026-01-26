-- Create channels table for each location
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'unit' CHECK (type IN ('unit', 'friends', 'management', 'world', 'rescuers')),
  description TEXT,
  is_online BOOLEAN DEFAULT true,
  is_live BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create channel members table
CREATE TABLE public.channel_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'safe' CHECK (status IN ('safe', 'evacuating', 'danger')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;

-- Channels policies - users can view channels for locations they belong to
CREATE POLICY "Users can view channels for their locations"
ON public.channels FOR SELECT
USING (
  location_id IN (
    SELECT location_id FROM public.user_locations WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create channels for their locations"
ON public.channels FOR INSERT
WITH CHECK (
  location_id IN (
    SELECT location_id FROM public.user_locations WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update channels for their locations"
ON public.channels FOR UPDATE
USING (
  location_id IN (
    SELECT location_id FROM public.user_locations WHERE user_id = auth.uid()
  )
);

-- Channel members policies
CREATE POLICY "Users can view channel members"
ON public.channel_members FOR SELECT
USING (
  channel_id IN (
    SELECT c.id FROM public.channels c
    JOIN public.user_locations ul ON c.location_id = ul.location_id
    WHERE ul.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add channel members"
ON public.channel_members FOR INSERT
WITH CHECK (
  channel_id IN (
    SELECT c.id FROM public.channels c
    JOIN public.user_locations ul ON c.location_id = ul.location_id
    WHERE ul.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update channel members"
ON public.channel_members FOR UPDATE
USING (
  channel_id IN (
    SELECT c.id FROM public.channels c
    JOIN public.user_locations ul ON c.location_id = ul.location_id
    WHERE ul.user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove channel members"
ON public.channel_members FOR DELETE
USING (
  channel_id IN (
    SELECT c.id FROM public.channels c
    JOIN public.user_locations ul ON c.location_id = ul.location_id
    WHERE ul.user_id = auth.uid()
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_channels_updated_at
BEFORE UPDATE ON public.channels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create default channels for existing locations
INSERT INTO public.channels (location_id, name, type, description, is_online, is_live)
SELECT 
  id as location_id,
  'Unit' as name,
  'unit' as type,
  'Unit members' as description,
  true as is_online,
  false as is_live
FROM public.locations;

INSERT INTO public.channels (location_id, name, type, description, is_online, is_live)
SELECT 
  id as location_id,
  'Friends' as name,
  'friends' as type,
  'Friends & neighbors' as description,
  true as is_online,
  false as is_live
FROM public.locations;

INSERT INTO public.channels (location_id, name, type, description, is_online, is_live)
SELECT 
  id as location_id,
  'Management' as name,
  'management' as type,
  'Building management' as description,
  true as is_online,
  false as is_live
FROM public.locations;

INSERT INTO public.channels (location_id, name, type, description, is_online, is_live)
SELECT 
  id as location_id,
  'Open World' as name,
  'world' as type,
  'Everyone in the building' as description,
  true as is_online,
  true as is_live
FROM public.locations;

INSERT INTO public.channels (location_id, name, type, description, is_online, is_live)
SELECT 
  id as location_id,
  'Rescuers' as name,
  'rescuers' as type,
  'Emergency responders' as description,
  false as is_online,
  false as is_live
FROM public.locations;