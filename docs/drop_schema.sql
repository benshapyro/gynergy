-- First, drop indexes
DROP INDEX IF EXISTS idx_morning_entries_user_date;
DROP INDEX IF EXISTS idx_evening_entries_user_date;
DROP INDEX IF EXISTS idx_daily_points_user_date;
DROP INDEX IF EXISTS idx_daily_action_tracking_user_date;
DROP INDEX IF EXISTS idx_dream_magic_user_date;
DROP INDEX IF EXISTS idx_free_flow_entries_user_date;

-- Drop tables with foreign keys first
DROP TABLE IF EXISTS "morning_affirmations";
DROP TABLE IF EXISTS "morning_gratitude_excitement";
DROP TABLE IF EXISTS "free_flow_entries";
DROP TABLE IF EXISTS "daily_points";
DROP TABLE IF EXISTS "daily_action_tracking";
DROP TABLE IF EXISTS "dream_magic";
DROP TABLE IF EXISTS "morning_entries";
DROP TABLE IF EXISTS "evening_entries";

-- Drop independent tables
DROP TABLE IF EXISTS "daily_quotes";
DROP TABLE IF EXISTS "daily_actions";
DROP TABLE IF EXISTS "users";

-- Note: Don't drop the uuid-ossp extension as it might be used by other tables 