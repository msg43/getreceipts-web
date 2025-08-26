# Setting Up Environment Variables for Graph Visualization

## Quick Setup

1. **Create `.env.local` file** in your project root:

```bash
touch .env.local
```

2. **Add your Supabase credentials**:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Open your project (or create a new one)
3. Click on **Settings** (gear icon) in the left sidebar
4. Click on **API** under Configuration
5. You'll find:
   - **Project URL**: Copy this as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key: Copy this as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Example .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Verify Setup

After adding credentials:

1. Restart your development server: `npm run dev`
2. Visit http://localhost:3000/graph
3. The error message should change from "credentials not configured" to either:
   - "The get_subgraph function does not exist" → Run the SQL scripts
   - Graph loads successfully → You're all set!

## Troubleshooting

- **Still seeing credential errors?** Make sure you restarted the dev server
- **Using Vercel?** Add these same variables in your Vercel project settings
- **Multiple projects?** Each project needs its own Supabase instance
