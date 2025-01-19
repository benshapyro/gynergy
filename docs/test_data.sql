-- Insert test daily quote
INSERT INTO daily_quotes (quote, author, active_date)
VALUES ('The only way to do great work is to love what you do.', 'Steve Jobs', CURRENT_DATE);

-- Insert test daily action
INSERT INTO daily_actions (action_text, tip_text, active_date)
VALUES ('Write a thank you note to someone who helped you recently', 'Be specific about how their actions impacted you', CURRENT_DATE);

-- Test journal entry creation
INSERT INTO journal_entries (user_id, date)
VALUES (auth.uid(), CURRENT_DATE);

-- Get the journal entry id for further insertions
DO $$
DECLARE
    journal_id UUID;
BEGIN
    SELECT id INTO journal_id FROM journal_entries 
    WHERE user_id = auth.uid() AND date = CURRENT_DATE;

    -- Insert test morning affirmations
    INSERT INTO morning_affirmations (journal_entry_id, affirmation_text, affirmation_order)
    VALUES 
        (journal_id, 'I am capable of achieving my goals', 1),
        (journal_id, 'I am filled with energy and positivity', 2),
        (journal_id, 'I am grateful for this new day', 3),
        (journal_id, 'I am making progress every day', 4),
        (journal_id, 'I am surrounded by opportunities', 5);

    -- Insert test gratitude items
    INSERT INTO gratitude_excitement (journal_entry_id, type, item_text, item_order)
    VALUES 
        (journal_id, 'gratitude', 'Grateful for my family', 1),
        (journal_id, 'gratitude', 'Grateful for good health', 2),
        (journal_id, 'gratitude', 'Grateful for this opportunity', 3),
        (journal_id, 'excitement', 'Excited about the new project', 1),
        (journal_id, 'excitement', 'Looking forward to learning', 2),
        (journal_id, 'excitement', 'Cant wait to see progress', 3);

    -- Insert gratitude action response
    INSERT INTO gratitude_action_responses (journal_entry_id, action_completed, morning_reflection)
    VALUES (journal_id, false, 'I will write a thank you note to my mentor');

    -- Update morning section
    UPDATE journal_entries 
    SET 
        morning_time = CURRENT_TIME,
        morning_mood_score = 4,
        morning_mood_text = 'Feeling energetic and positive',
        morning_mood_factors = 'Good sleep and exercise',
        mantra = 'Today is full of possibilities'
    WHERE id = journal_id;

    -- Call the complete morning entry function
    PERFORM complete_morning_entry(journal_id);
END $$; 