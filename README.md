# NextSignal

**Emergency coordination for buildings during climate disasters and evacuations: role-based broadcasts, hazard reporting, live building channels, and an AI safety assistant.**

## Features

- **Role-based access.** Residents, building management and responders each get a separate dashboard and permissions (Supabase Auth + `user_roles` with row-level security).
- **Broadcasts.** Management sends severity-tagged alerts (e.g. "Evacuation Notice – Building A") to everyone in a building.
- **Building channels.** Per-building and per-floor chat channels with membership management.
- **Emergency reports.** Residents report fire, structural damage, flooding, debris, or areas cordoned off by emergency services.
- **Hazard and building maps.** Exit routes (main entrance, stairwell, emergency exit) are shown with blocked or open status.
- **AI safety assistant.** A streaming chat assistant (a Supabase Edge Function calling Gemini) answers in short, actionable steps and always escalates life-threatening situations to 911.

## Stack

React · TypeScript · Vite · Tailwind / shadcn-ui · Supabase (Postgres, Auth, RLS, Edge Functions) · Gemini

Built with [Lovable](https://lovable.dev) (AI app builder) on a Supabase backend.

## Data model

`locations → location_floors → location_units`, `profiles`, `user_roles`, `user_locations`, `channels`, `channel_members`, `chat_messages`, `broadcasts`, `blueprints` (see `supabase/migrations/`).

## Run locally

```bash
cp .env.example .env    # fill in your Supabase project URL, ID and anon key
npm install
npm run dev
```

The chat assistant needs the `chat` Edge Function deployed (`supabase functions deploy chat`) with an LLM gateway key set as a function secret.
