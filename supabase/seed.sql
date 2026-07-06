-- Seed data for the work review application
-- Note: In production, users are created through Supabase Auth.
-- These entries assume auth.users already exist with these UUIDs.

-- CEO account
INSERT INTO profiles (id, email, name, role, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'ceo@gamestudio.com', 'Alex Director', 'ceo', NULL);

-- Developer accounts
INSERT INTO profiles (id, email, name, role, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000002', 'dev1@gamestudio.com', 'Maria Garcia', 'developer', NULL),
  ('00000000-0000-0000-0000-000000000003', 'dev2@gamestudio.com', 'Carlos Lopez', 'developer', NULL),
  ('00000000-0000-0000-0000-000000000004', 'dev3@gamestudio.com', 'Sofia Martinez', 'developer', NULL),
  ('00000000-0000-0000-0000-000000000005', 'dev4@gamestudio.com', 'Diego Hernandez', 'developer', NULL);

-- Sample submissions for developers
INSERT INTO submissions (developer_id, title, description, file_url, file_type, status) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Character Model v1', 'Initial character model for the main protagonist', NULL, 'image', 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'Animation Sprint Notes', 'Weekly progress notes for animation work', NULL, 'note', 'pending'),
  ('00000000-0000-0000-0000-000000000003', 'Level Design Document', 'Complete level design for Stage 3', NULL, 'pdf', 'approved'),
  ('00000000-0000-0000-0000-000000000003', 'Gameplay Video Demo', 'Recorded gameplay of the new mechanics', NULL, 'video', 'pending'),
  ('00000000-0000-0000-0000-000000000004', 'UI Mockups', 'HUD and menu mockups for review', NULL, 'image', 'pending'),
  ('00000000-0000-0000-0000-000000000005', 'Sound Design Report', 'Progress report on ambient sounds', NULL, 'pdf', 'approved');
