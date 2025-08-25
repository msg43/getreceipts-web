# Graph Visualization Setup Guide

## ✅ What's Been Done

1. **Dependencies Installed**
   - `graphology` - Graph data structure library
   - `@react-sigma/core` - 2D graph visualization
   - `react-force-graph-3d` - 3D graph visualization
   - `react-force-graph-2d` - 2D force-directed graph

2. **Files Created**
   - All TypeScript/React components in `src/`
   - SQL schema and setup files in `graph-proto-v5/sql/`
   - Three-pane layout with filters, graph view, and details

## 🚀 Quick Start

### 1. Set up Supabase

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Run SQL Scripts

In your Supabase SQL Editor, run these files in order:

```sql
-- Run each file from graph-proto-v5/sql/ in sequence:
1. 01_schema.sql      -- Creates tables
2. 02_indexes.sql     -- Adds performance indexes
3. 03_rpc_get_subgraph.sql  -- Creates the RPC function
4. 04_policies.sql    -- Sets up Row Level Security
5. 05_sample_data.sql -- Adds sample data (optional)
```

### 3. Access the Graph Explorer

The graph visualization is now available at `/` (home page).

To create a dedicated route, you can:
- Move `src/app/page.tsx` to `src/app/graph/page.tsx` for `/graph` route
- Or create a new route like `/claims-graph` or `/explore`

### 4. Test the Installation

```bash
npm run dev
```

Visit http://localhost:3000 and you should see:
- Left pane: Filters and bookmarks
- Center: Interactive graph (toggle between 2D/3D)
- Right pane: Node details when selected

## 🎯 Features

- **2D Mode**: Fast, precise navigation using Sigma.js
- **3D Mode**: Immersive exploration with react-force-graph-3d
- **Filters**: Search, tags, communities, time range
- **Bookmarks**: Save interesting nodes (localStorage)
- **Keyboard Shortcuts**: j/k navigate, m toggle mode, / search, esc clear

## 🔧 Customization

### Change Graph Data Source

Edit `src/lib/useSubgraph.ts` to:
- Modify the RPC function name
- Add authentication headers
- Transform data format

### Style the Graph

- 2D styles: Edit `src/components/Graph2D.tsx` sigma settings
- 3D styles: Edit `src/components/Graph3D.tsx` ForceGraph3D props
- UI theme: Modify Tailwind classes in components

### Add New Filters

1. Update `src/lib/types.ts` Filters interface
2. Add UI controls in `src/components/LeftPane.tsx`
3. Update SQL function `03_rpc_get_subgraph.sql`

## 📊 Performance Tips

- Start with `limit: 500` nodes for smooth interaction
- Use community clustering for 1000+ nodes
- Implement pagination or progressive loading for 10k+ nodes
- Consider server-side layout computation for large graphs

## 🐛 Troubleshooting

**Graph not loading?**
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Ensure RPC function exists: `SELECT * FROM pg_proc WHERE proname = 'get_subgraph';`

**Nodes overlapping?**
- The sample data includes x,y coordinates
- For real data, compute layouts server-side or use force simulation

**Performance issues?**
- Reduce node limit in filters
- Switch to 2D mode for large graphs
- Check database indexes are created

## 🚦 Next Steps

1. **Production Deployment**
   - Set env vars in Vercel/hosting platform
   - Enable Supabase connection pooling
   - Add error boundaries and loading states

2. **Enhanced Features**
   - Server-side layout algorithms (ForceAtlas2, UMAP)
   - Time-based animation slider
   - Shortest path visualization
   - Cluster expand/collapse
   - Mini-map overlay

3. **Data Integration**
   - Connect to your real claims data
   - Implement data ingestion pipeline
   - Add real-time updates via Supabase subscriptions
