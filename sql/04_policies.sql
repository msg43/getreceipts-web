-- 04_policies.sql: Row Level Security policies

-- Enable RLS on all tables
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_layouts ENABLE ROW LEVEL SECURITY;

-- Claims policies
-- Everyone can read claims
CREATE POLICY "Claims are viewable by everyone" 
  ON claims FOR SELECT 
  USING (true);

-- Authenticated users can create claims
CREATE POLICY "Authenticated users can create claims" 
  ON claims FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own claims
CREATE POLICY "Users can update own claims" 
  ON claims FOR UPDATE 
  USING (auth.uid() = created_by);

-- Users can delete their own claims
CREATE POLICY "Users can delete own claims" 
  ON claims FOR DELETE 
  USING (auth.uid() = created_by);

-- Edges policies
-- Everyone can read edges
CREATE POLICY "Edges are viewable by everyone" 
  ON claim_edges FOR SELECT 
  USING (true);

-- Authenticated users can create edges
CREATE POLICY "Authenticated users can create edges" 
  ON claim_edges FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own edges
CREATE POLICY "Users can update own edges" 
  ON claim_edges FOR UPDATE 
  USING (auth.uid() = created_by);

-- Users can delete their own edges
CREATE POLICY "Users can delete own edges" 
  ON claim_edges FOR DELETE 
  USING (auth.uid() = created_by);

-- Clusters policies
-- Everyone can read clusters
CREATE POLICY "Clusters are viewable by everyone" 
  ON claim_clusters FOR SELECT 
  USING (true);

-- Only admins can modify clusters (managed by backend)
-- No INSERT/UPDATE/DELETE policies for regular users

-- Bookmarks policies
-- Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks" 
  ON user_bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own bookmarks
CREATE POLICY "Users can create own bookmarks" 
  ON user_bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" 
  ON user_bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- Layouts policies
-- Everyone can read layouts
CREATE POLICY "Layouts are viewable by everyone" 
  ON claim_layouts FOR SELECT 
  USING (true);

-- Only backend/admin can modify layouts
-- No INSERT/UPDATE/DELETE policies for regular users
