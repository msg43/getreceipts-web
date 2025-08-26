-- 03_rpc_get_subgraph.sql: RPC function to get filtered subgraph data

CREATE OR REPLACE FUNCTION get_subgraph(filters jsonb DEFAULT '{}')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  search_query text;
  tag_filters text[];
  time_start timestamptz;
  time_end timestamptz;
  community_ids integer[];
  edge_types text[];
  limit_nodes integer;
BEGIN
  -- Extract filters
  search_query := filters->>'search';
  tag_filters := CASE 
    WHEN filters->'tags' IS NOT NULL 
    THEN ARRAY(SELECT jsonb_array_elements_text(filters->'tags'))
    ELSE NULL
  END;
  time_start := (filters->>'timeStart')::timestamptz;
  time_end := (filters->>'timeEnd')::timestamptz;
  community_ids := CASE
    WHEN filters->'communities' IS NOT NULL
    THEN ARRAY(SELECT (jsonb_array_elements_text(filters->'communities'))::integer)
    ELSE NULL
  END;
  edge_types := CASE
    WHEN filters->'edgeTypes' IS NOT NULL
    THEN ARRAY(SELECT jsonb_array_elements_text(filters->'edgeTypes'))
    ELSE ARRAY['supports', 'refutes', 'related']
  END;
  limit_nodes := COALESCE((filters->>'limit')::integer, 1000);

  -- Build result with filtered nodes, edges, and clusters
  WITH filtered_nodes AS (
    SELECT 
      c.id,
      c.slug,
      c.title,
      c.content,
      c.x,
      c.y,
      c.node_size,
      c.node_color,
      c.community_id,
      c.tags,
      c.metadata,
      c.created_at
    FROM claims c
    WHERE 1=1
      -- Text search
      AND (search_query IS NULL OR search_query = '' OR 
           to_tsvector('english', coalesce(c.title, '') || ' ' || coalesce(c.content, '')) 
           @@ plainto_tsquery('english', search_query))
      -- Tag filters
      AND (tag_filters IS NULL OR c.tags && tag_filters)
      -- Time range
      AND (time_start IS NULL OR c.created_at >= time_start)
      AND (time_end IS NULL OR c.created_at <= time_end)
      -- Community filter
      AND (community_ids IS NULL OR c.community_id = ANY(community_ids))
    ORDER BY c.created_at DESC
    LIMIT limit_nodes
  ),
  node_ids AS (
    SELECT array_agg(id) as ids FROM filtered_nodes
  ),
  filtered_edges AS (
    SELECT 
      e.id,
      e.source_id,
      e.target_id,
      e.edge_type,
      e.weight
    FROM claim_edges e, node_ids n
    WHERE e.source_id = ANY(n.ids) 
      AND e.target_id = ANY(n.ids)
      AND e.edge_type = ANY(edge_types)
  ),
  used_clusters AS (
    SELECT DISTINCT community_id 
    FROM filtered_nodes 
    WHERE community_id IS NOT NULL
  )
  SELECT jsonb_build_object(
    'nodes', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', id::text,
          'slug', slug,
          'label', title,
          'title', title,
          'content', content,
          'x', x,
          'y', y,
          'size', node_size,
          'color', node_color,
          'community', community_id,
          'tags', tags,
          'metadata', metadata,
          'createdAt', created_at
        ) ORDER BY created_at DESC
      ) FROM filtered_nodes),
      '[]'::jsonb
    ),
    'edges', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', id::text,
          'source', source_id::text,
          'target', target_id::text,
          'type', edge_type,
          'weight', weight
        )
      ) FROM filtered_edges),
      '[]'::jsonb
    ),
    'clusters', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', cl.id,
          'name', cl.name,
          'color', cl.color,
          'x', cl.x,
          'y', cl.y,
          'nodeCount', cl.node_count
        )
      ) 
      FROM claim_clusters cl
      JOIN used_clusters uc ON cl.id = uc.community_id),
      '[]'::jsonb
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_subgraph(jsonb) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_subgraph(jsonb) IS 'Returns filtered graph data with nodes, edges, and clusters based on provided filters';