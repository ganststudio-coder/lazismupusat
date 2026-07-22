# LAZISMU Jakarta Pusat

React + TypeScript + Vite single-page application for the LAZISMU Jakarta Pusat public website and admin dashboard.

## Stack

- React 18 with Vite
- Tailwind CSS
- Supabase database, storage, and edge functions
- Vercel static hosting

## Environment variables

Set these variables in Vercel and in local `.env` files when running the app locally:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

For local Vite compatibility, `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are also supported. The Vercel build maps the standard `SUPABASE_*` names into the client bundle.

Supabase Edge Functions also require server-side secrets configured in Supabase, including `SUPABASE_SERVICE_ROLE_KEY` and any provider keys used by `ai-chat`.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment notes

- Deploy the repository to Vercel as a Vite project.
- `vercel.json` rewrites all routes to `index.html` so direct links such as `/admin` and `/berita/:id` work in production.
- Apply the SQL migration in `supabase/migrations` and deploy the Supabase functions in `supabase/functions` before using admin CRUD, login, image upload, and AI chat features.
