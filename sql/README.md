# Graph Visualization SQL Setup

## Overview

These SQL files set up the database schema for the claims graph visualization system.

## Files to Run (in order)

1. **01_schema.sql** - Creates the core tables:
   - `claims` - The nodes in the graph (claims/statements)
   - `claim_edges` - Connections between claims (supports/refutes/related)
   - `claim_clusters` - Community groupings for visual organization
   - `user_bookmarks` - User's saved claims
   - `claim_layouts` - Cached positions for different layout algorithms

2. **02_indexes.sql** - Adds performance indexes for:
   - Fast text search
   - Efficient graph traversal
   - Tag and metadata filtering
   - Time-based queries

3. **03_rpc_get_subgraph.sql** - Creates the main RPC function:
   - `get_subgraph(filters)` - Returns filtered graph data
   - Supports search, tags, time range, communities
   - Returns nodes, edges, and clusters as JSON

4. **04_policies.sql** - Sets up Row Level Security:
   - Public read access to claims and edges
   - Authenticated users can create content
   - Users can only modify their own content
   - Private bookmarks per user

5. **05_sample_data.sql** - Adds test data:
   - 5 topic clusters (Technology, Science, Philosophy, Politics, Economics)
   - 15 interconnected claims
   - Various edge types showing relationships

## How to Run

1. Open your Supabase project's SQL Editor
2. Copy and paste each file's contents in order
3. Run each script (wait for completion before next)
4. Verify with: `SELECT * FROM claims;`

## Verification

After running all scripts, test the RPC function:

```sql
-- Get all nodes (with default limit of 1000)
SELECT * FROM get_subgraph('{}');

-- Filter by search term
SELECT * FROM get_subgraph('{"search": "AI"}');

-- Filter by community
SELECT * FROM get_subgraph('{"communities": [1, 2]}');

-- Combine filters
SELECT * FROM get_subgraph('{
  "search": "consciousness",
  "tags": ["philosophy"],
  "limit": 10
}');
```

## Next Steps

1. Set your Supabase credentials in `.env.local`
2. Run `npm run dev`
3. Visit http://localhost:3000 to see the graph

## Notes

- The `get_subgraph` function is marked `SECURITY DEFINER` for read access
- All tables have RLS enabled for security
- Sample data includes x,y coordinates for initial layout
- For production, implement server-side layout computation
