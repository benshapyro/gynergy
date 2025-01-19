-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS "morning_affirmations" CASCADE;
DROP TABLE IF EXISTS "gratitude_excitement" CASCADE;
DROP TABLE IF EXISTS "gratitude_action_responses" CASCADE;
DROP TABLE IF EXISTS "free_flow" CASCADE;
DROP TABLE IF EXISTS "dream_magic" CASCADE;
DROP TABLE IF EXISTS "journal_entries" CASCADE;
DROP TABLE IF EXISTS "daily_quotes" CASCADE;
DROP TABLE IF EXISTS "daily_actions" CASCADE;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables first, then we'll add RLS
-- Daily quotes table
CREATE TABLE IF NOT EXISTS "daily_quotes" (
    id SERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT,
    active_date DATE UNIQUE NOT NULL
);

-- Daily gratitude actions table
CREATE TABLE IF NOT EXISTS "daily_actions" (
    id SERIAL PRIMARY KEY,
    action_text TEXT NOT NULL,
    tip_text TEXT,
    active_date DATE UNIQUE NOT NULL
);

-- Main journal entries table
CREATE TABLE IF NOT EXISTS "journal_entries" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Morning section
    morning_time TIME,
    had_dream BOOLEAN DEFAULT FALSE,
    dream_description TEXT,
    morning_mood_score INTEGER CHECK (morning_mood_score BETWEEN 1 AND 5),
    morning_mood_text TEXT,  -- How are you feeling this morning?
    morning_mood_factors TEXT,  -- What contributed to your mood?
    mantra TEXT,  -- My mantra
    morning_completed BOOLEAN DEFAULT FALSE,
    
    -- Evening section
    evening_time TIME,
    evening_mood_score INTEGER CHECK (evening_mood_score BETWEEN 1 AND 5),
    evening_mood_text TEXT,  -- How are you feeling this evening?
    thought_of_day TEXT,  -- One unique thought/insight
    thought_impact TEXT,  -- How this insight changes perspective
    success_replication TEXT,  -- How to replicate success
    change_steps TEXT,  -- Steps to make change happen
    evening_completed BOOLEAN DEFAULT FALSE,
    
    -- Points tracking
    morning_points INTEGER DEFAULT 0 CHECK (morning_points BETWEEN 0 AND 5),
    evening_points INTEGER DEFAULT 0 CHECK (evening_points BETWEEN 0 AND 5),
    gratitude_action_points INTEGER DEFAULT 0 CHECK (gratitude_action_points BETWEEN 0 AND 10),
    total_points INTEGER GENERATED ALWAYS AS (morning_points + evening_points + gratitude_action_points) STORED,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Positive affirmations (morning "I am" statements)
CREATE TABLE IF NOT EXISTS "morning_affirmations" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    affirmation_text TEXT NOT NULL,
    affirmation_order INTEGER CHECK (affirmation_order BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gratitude and excitement items
CREATE TABLE IF NOT EXISTS "gratitude_excitement" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('gratitude', 'excitement')),
    item_text TEXT NOT NULL,
    item_order INTEGER CHECK (item_order BETWEEN 1 AND 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gratitude action responses
CREATE TABLE IF NOT EXISTS "gratitude_action_responses" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    action_completed BOOLEAN DEFAULT FALSE,
    morning_reflection TEXT,  -- Reflection & commitment
    evening_reflection TEXT,  -- How did it make you feel
    obstacles TEXT,  -- What obstacles did you encounter
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Free flow section
CREATE TABLE IF NOT EXISTS "free_flow" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dream magic visualization
CREATE TABLE IF NOT EXISTS "dream_magic" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    statement_text TEXT NOT NULL,
    statement_order INTEGER CHECK (statement_order BETWEEN 1 AND 5),
    action_steps TEXT,  -- Small actions for tomorrow
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE morning_affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_excitement ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_action_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_magic ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Journal entries policies
CREATE POLICY "Users can CRUD own journal entries" ON journal_entries
    FOR ALL USING (auth.uid() = user_id);

-- Affirmations policies
CREATE POLICY "Users can CRUD own affirmations" ON morning_affirmations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM journal_entries
            WHERE id = journal_entry_id
            AND user_id = auth.uid()
        )
    );

-- Gratitude/excitement policies
CREATE POLICY "Users can CRUD own gratitude items" ON gratitude_excitement
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM journal_entries
            WHERE id = journal_entry_id
            AND user_id = auth.uid()
        )
    );

-- Gratitude actions policies
CREATE POLICY "Users can CRUD own action responses" ON gratitude_action_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM journal_entries
            WHERE id = journal_entry_id
            AND user_id = auth.uid()
        )
    );

-- Free flow policies
CREATE POLICY "Users can CRUD own free flow" ON free_flow
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM journal_entries
            WHERE id = journal_entry_id
            AND user_id = auth.uid()
        )
    );

-- Dream magic policies
CREATE POLICY "Users can CRUD own dream magic" ON dream_magic
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM journal_entries
            WHERE id = journal_entry_id
            AND user_id = auth.uid()
        )
    );

-- Public content policies
CREATE POLICY "Anyone can read quotes" ON daily_quotes FOR SELECT USING (true);
CREATE POLICY "Anyone can read actions" ON daily_actions FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_journal_entries_user_date ON journal_entries(user_id, date);
CREATE INDEX idx_morning_affirmations_entry ON morning_affirmations(journal_entry_id);
CREATE INDEX idx_gratitude_excitement_entry ON gratitude_excitement(journal_entry_id);
CREATE INDEX idx_gratitude_responses_entry ON gratitude_action_responses(journal_entry_id);
CREATE INDEX idx_free_flow_entry ON free_flow(journal_entry_id);
CREATE INDEX idx_dream_magic_entry ON dream_magic(journal_entry_id);

-- Function to check if morning section is complete
CREATE OR REPLACE FUNCTION is_morning_complete(journal_entry_id UUID) 
RETURNS BOOLEAN AS $$
DECLARE
    morning_affirmation_count INTEGER;
    gratitude_count INTEGER;
    excitement_count INTEGER;
BEGIN
    -- Check main morning fields
    IF NOT EXISTS (
        SELECT 1 FROM journal_entries 
        WHERE id = journal_entry_id 
        AND morning_time IS NOT NULL
        AND morning_mood_score IS NOT NULL
        AND morning_mood_text IS NOT NULL
        AND morning_mood_factors IS NOT NULL
        AND mantra IS NOT NULL
    ) THEN
        RETURN FALSE;
    END IF;

    -- Check affirmations (need all 5)
    SELECT COUNT(*) INTO morning_affirmation_count
    FROM morning_affirmations
    WHERE journal_entry_id = journal_entry_id;
    
    -- Check gratitude items (need all 3)
    SELECT COUNT(*) INTO gratitude_count
    FROM gratitude_excitement
    WHERE journal_entry_id = journal_entry_id AND type = 'gratitude';
    
    -- Check excitement items (need all 3)
    SELECT COUNT(*) INTO excitement_count
    FROM gratitude_excitement
    WHERE journal_entry_id = journal_entry_id AND type = 'excitement';
    
    RETURN morning_affirmation_count >= 5 
        AND gratitude_count >= 3 
        AND excitement_count >= 3;
END;
$$ LANGUAGE plpgsql;

-- Function to check if evening section is complete
CREATE OR REPLACE FUNCTION is_evening_complete(journal_entry_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM journal_entries 
        WHERE id = journal_entry_id 
        AND evening_time IS NOT NULL
        AND evening_mood_score IS NOT NULL
        AND evening_mood_text IS NOT NULL
        AND thought_of_day IS NOT NULL
        AND thought_impact IS NOT NULL
        AND success_replication IS NOT NULL
        AND change_steps IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update points
CREATE OR REPLACE FUNCTION update_journal_points(entry_id UUID)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    morning_complete BOOLEAN;
    evening_complete BOOLEAN;
    action_complete BOOLEAN;
    user_id UUID;
BEGIN
    -- Get user_id for this entry
    SELECT journal_entries.user_id INTO user_id
    FROM journal_entries
    WHERE journal_entries.id = entry_id;

    -- Only proceed if the user owns this entry
    IF user_id = auth.uid() THEN
        morning_complete := is_morning_complete(entry_id);
        evening_complete := is_evening_complete(entry_id);
        
        SELECT action_completed INTO action_complete
        FROM gratitude_action_responses
        WHERE journal_entry_id = entry_id;

        -- Update points
        UPDATE journal_entries
        SET 
            morning_points = CASE WHEN morning_complete THEN 5 ELSE 0 END,
            evening_points = CASE WHEN evening_complete THEN 5 ELSE 0 END,
            gratitude_action_points = CASE WHEN action_complete THEN 10 ELSE 0 END
        WHERE id = entry_id;

        -- Update user's total points
        UPDATE users 
        SET total_points = (
            SELECT COALESCE(SUM(total_points), 0)
            FROM journal_entries
            WHERE user_id = auth.uid()
        )
        WHERE id = auth.uid();
    END IF;
END;
$$;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(user_id UUID)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    last_entry_date DATE;
    current_streak INTEGER;
    latest_entry_date DATE;
BEGIN
    -- Only proceed if this is the user's own streak
    IF user_id = auth.uid() THEN
        -- Get the user's latest entry date
        SELECT date INTO latest_entry_date
        FROM journal_entries
        WHERE user_id = auth.uid()
        ORDER BY date DESC
        LIMIT 1;

        -- Get the previous entry date
        SELECT date INTO last_entry_date
        FROM journal_entries
        WHERE user_id = auth.uid()
        AND date < latest_entry_date
        ORDER BY date DESC
        LIMIT 1;

        -- Get current streak
        SELECT streak_count INTO current_streak
        FROM users
        WHERE id = auth.uid();

        -- Update streak based on entry dates
        IF last_entry_date IS NULL OR latest_entry_date = last_entry_date + INTERVAL '1 day' THEN
            -- First entry or consecutive day
            UPDATE users 
            SET streak_count = COALESCE(current_streak, 0) + 1
            WHERE id = auth.uid();
        ELSIF latest_entry_date > last_entry_date + INTERVAL '1 day' THEN
            -- Streak broken
            UPDATE users 
            SET streak_count = 1
            WHERE id = auth.uid();
        END IF;
    END IF;
END;
$$;

-- Create functions that can be called from the client
CREATE OR REPLACE FUNCTION complete_morning_entry(entry_id UUID)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    -- Update points
    PERFORM update_journal_points(entry_id);
    -- Update streak
    PERFORM update_user_streak(auth.uid());
END;
$$;

CREATE OR REPLACE FUNCTION complete_evening_entry(entry_id UUID)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    -- Update points
    PERFORM update_journal_points(entry_id);
END;
$$;

CREATE OR REPLACE FUNCTION complete_gratitude_action(entry_id UUID)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    -- Update points
    PERFORM update_journal_points(entry_id);
END;
$$; 