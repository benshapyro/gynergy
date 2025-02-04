-- Clean up existing data first
DO $$
DECLARE
    v_user_id UUID := '23d87cb8-e7ff-4852-a7ed-80f48093f99c';
    v_count INTEGER;
    base_date DATE := '2025-02-04'::DATE;  -- Set base date to match mock client
BEGIN
    -- Delete all related data for this test user in the correct order (respecting foreign key constraints)
    
    -- First, delete child tables that reference journal_entries
    DELETE FROM dream_magic WHERE journal_entry_id IN (SELECT id FROM journal_entries WHERE user_id = v_user_id);
    DELETE FROM free_flow WHERE journal_entry_id IN (SELECT id FROM journal_entries WHERE user_id = v_user_id);
    DELETE FROM gratitude_action_responses WHERE journal_entry_id IN (SELECT id FROM journal_entries WHERE user_id = v_user_id);
    DELETE FROM gratitude_excitement WHERE journal_entry_id IN (SELECT id FROM journal_entries WHERE user_id = v_user_id);
    DELETE FROM affirmations WHERE journal_entry_id IN (SELECT id FROM journal_entries WHERE user_id = v_user_id);
    
    -- Then delete the main journal entries
    DELETE FROM journal_entries WHERE user_id = v_user_id;
    
    -- Clean up daily content for the date range
    DELETE FROM daily_quotes WHERE active_date >= base_date - INTERVAL '6 days' AND active_date <= base_date;
    DELETE FROM daily_actions WHERE active_date >= base_date - INTERVAL '6 days' AND active_date <= base_date;
    
    RAISE NOTICE 'Cleaned up existing data for user % and date range % to %', 
        v_user_id, 
        base_date - INTERVAL '6 days', 
        base_date;
END $$;

-- Set the user ID and email as variables at the start
DO $$
DECLARE
    v_user_id UUID := '23d87cb8-e7ff-4852-a7ed-80f48093f99c';
    i INTEGER;
    current_date_var DATE;
    journal_id UUID;
    v_count INTEGER;
    base_date DATE := '2025-02-04'::DATE;  -- Set base date to match mock client
BEGIN
    -- Create auth user if not exists
    INSERT INTO auth.users (
        id,
        email,
        role,
        aud,
        email_confirmed_at,
        last_sign_in_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        is_anonymous,
        is_sso_user
    )
    VALUES (
        v_user_id,
        'benshapyro@gmail.com',
        'authenticated',
        'authenticated',
        '2025-02-04 11:27:25.583+00'::TIMESTAMPTZ,
        '2025-02-04 11:27:25.583+00'::TIMESTAMPTZ,
        '2025-02-04 11:27:25.583+00'::TIMESTAMPTZ,
        '2025-02-04 11:27:25.583+00'::TIMESTAMPTZ,
        jsonb_build_object(
            'first_name', 'Ben',
            'last_name', 'Shapiro',
            'name', 'Ben Shapiro',
            'onboarded', true,
            'total_points', 120,
            'streak_count', 7
        ),
        false,
        false
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        raw_user_meta_data = EXCLUDED.raw_user_meta_data,
        updated_at = EXCLUDED.updated_at;

    RAISE NOTICE 'Created/Updated auth user %', v_user_id;

    -- Create journal entries for specific dates
    FOR i IN 0..6 LOOP
        current_date_var := base_date - i * INTERVAL '1 day';
        
        -- Insert journal entry
        INSERT INTO journal_entries (
            user_id,
            date,
            morning_completed,
            morning_mood_score,
            morning_mood_factors,
            morning_reflection,
            morning_points,
            evening_completed,
            evening_mood_score,
            evening_mood_factors,
            evening_reflection,
            evening_points,
            gratitude_action_completed,
            gratitude_action_points,
            total_points
        )
        VALUES (
            v_user_id,
            current_date_var,
            true,
            8 - (i % 3),
            ARRAY['Productive', 'Well-rested', 'Motivated'],
            'Starting the day with positive energy and clear goals.',
            5,
            true,
            7 + (i % 3),
            ARRAY['Accomplished', 'Grateful', 'Peaceful'],
            'Had a productive day working on the project.',
            5,
            true,
            10,
            20
        )
        RETURNING id INTO journal_id;

        RAISE NOTICE 'Created journal entry % for date %', journal_id, current_date_var;

        -- Insert affirmations
        INSERT INTO affirmations (journal_entry_id, affirmation)
        VALUES 
            (journal_id, 'I am capable of achieving great things today'),
            (journal_id, 'I choose to be positive and productive'),
            (journal_id, 'I am grateful for this new day'),
            (journal_id, 'I trust in my abilities'),
            (journal_id, 'I embrace all possibilities');

        -- Insert gratitude items
        INSERT INTO gratitude_excitement (journal_entry_id, type, content)
        VALUES 
            (journal_id, 'gratitude', 'Grateful for my supportive family'),
            (journal_id, 'gratitude', 'Thankful for good health'),
            (journal_id, 'gratitude', 'Appreciative of this beautiful day'),
            (journal_id, 'excitement', 'Looking forward to completing the Gynergy project'),
            (journal_id, 'excitement', 'Excited about implementing new features'),
            (journal_id, 'excitement', 'Can''t wait to see user engagement with the app');

        -- Insert gratitude action response
        INSERT INTO gratitude_action_responses (
            journal_entry_id,
            action_completed,
            morning_reflection,
            evening_reflection,
            obstacles
        )
        VALUES (
            journal_id,
            true,
            'I will focus on spreading positivity today',
            'Successfully completed my gratitude action and felt more connected',
            'Initially felt rushed but made time for it'
        );

        -- Insert free flow entry
        INSERT INTO free_flow (journal_entry_id, content)
        VALUES (
            journal_id,
            'Today I''m particularly focused on developing the Gynergy Journal App. The project is coming together nicely, and I''m excited about the potential impact it can have on users'' daily lives.'
        );

        -- Insert dream magic entries
        INSERT INTO dream_magic (journal_entry_id, statement_text, statement_order, action_steps)
        VALUES 
            (journal_id, 'I will complete the Gynergy project milestone', 1, 'Break down the next feature into small tasks'),
            (journal_id, 'I will maintain a healthy work-life balance', 2, 'Set clear boundaries for work hours'),
            (journal_id, 'I will learn new development concepts', 3, 'Spend time on Next.js and Supabase documentation'),
            (journal_id, 'I will contribute to the dev community', 4, 'Share knowledge through documentation and code'),
            (journal_id, 'I will practice mindful coding', 5, 'Take regular breaks and review code quality');
    END LOOP;

    -- Create daily content for the week
    FOR i IN 0..6 LOOP
        current_date_var := base_date - i * INTERVAL '1 day';
        
        -- Daily quotes
        INSERT INTO daily_quotes (quote, author, active_date)
        VALUES (
            'Quote for ' || current_date_var,
            'Author ' || i,
            current_date_var
        ) ON CONFLICT (active_date) DO NOTHING;

        -- Daily actions
        INSERT INTO daily_actions (action_text, tip_text, active_date)
        VALUES (
            'Action for ' || current_date_var,
            'Tip for the action on ' || current_date_var,
            current_date_var
        ) ON CONFLICT (active_date) DO NOTHING;
    END LOOP;

    -- Verify data was inserted
    SELECT COUNT(*) INTO v_count FROM journal_entries WHERE user_id = v_user_id;
    RAISE NOTICE 'Created % journal entries for user %', v_count, v_user_id;

END $$; 