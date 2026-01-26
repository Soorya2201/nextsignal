-- Add floor and unit fields to user_locations
ALTER TABLE public.user_locations 
ADD COLUMN IF NOT EXISTS floor_number integer,
ADD COLUMN IF NOT EXISTS unit_number text;

-- Create location_floors table for building floor configurations
CREATE TABLE public.location_floors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  floor_number integer NOT NULL,
  floor_name text NOT NULL,
  units_per_floor integer NOT NULL DEFAULT 4,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(location_id, floor_number)
);

ALTER TABLE public.location_floors ENABLE ROW LEVEL SECURITY;

-- Anyone can view floor configurations
CREATE POLICY "Anyone can view location floors"
ON public.location_floors
FOR SELECT
USING (true);

-- Management can manage floors
CREATE POLICY "Management can manage floors"
ON public.location_floors
FOR ALL
USING (public.has_role(auth.uid(), 'management'))
WITH CHECK (public.has_role(auth.uid(), 'management'));

-- Create location_units table for individual unit configurations
CREATE TABLE public.location_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  floor_id uuid REFERENCES public.location_floors(id) ON DELETE CASCADE NOT NULL,
  unit_number text NOT NULL,
  unit_label text,
  position_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(floor_id, unit_number)
);

ALTER TABLE public.location_units ENABLE ROW LEVEL SECURITY;

-- Anyone can view unit configurations
CREATE POLICY "Anyone can view location units"
ON public.location_units
FOR SELECT
USING (true);

-- Management can manage units
CREATE POLICY "Management can manage units"
ON public.location_units
FOR ALL
USING (public.has_role(auth.uid(), 'management'))
WITH CHECK (public.has_role(auth.uid(), 'management'));