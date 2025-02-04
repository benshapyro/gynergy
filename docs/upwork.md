# Upwork Project: Complete MVP Features for Gynergy Journal App

## Project Overview

We are looking for a full-stack developer to complete the MVP features of our "Gynergy Journal App" – a gamified journaling platform built with Next.js 14, React, and TypeScript. The app uses Supabase for authentication and data management, and will integrate with OpenAI's Vision API for OCR processing of handwritten journal entries. Our immediate goal is to prepare the app for our US-based test group by completing and polishing core MVP features.

## What's Already Done

- **User Authentication:**  
  - ✅ Email-based magic link authentication via Supabase is fully implemented
  
- **Core Journal Flows:**  
  - ✅ **Morning Journal Flow:** Fully implemented with mood tracking, reflection, affirmations, gratitude, and excitement items
  - ✅ **Evening Journal Flow:** Fully implemented with mood tracking, reflection, and planning for tomorrow
  
- **History Views:**
  - ✅ List view of past journal entries
  - ✅ Calendar view for entry navigation
  
- **Basic Infrastructure:**
  - ✅ Database schema for journal entries, points, and user data
  - ✅ Basic profile system with user information
  - ✅ File upload system structure
  
- **Points & Progress System:**
  - ✅ Points calculation for all activities implemented:
    - Morning Journal (+5 points)
    - Evening Journal (+5 points)
    - Daily Gratitude Action (+10 points)
  - ✅ Mountain Progress visualization with milestones
  - ✅ Real-time progress tracking
  - ✅ Visual milestone indicators
  
- **Daily Quote System:**
  - ✅ Layered card design implemented
  - ✅ Quote display with fallback system
  - ✅ Error handling
  
- **Leaderboard:**
  - ✅ Basic view implementation
  - ✅ Points and streaks tracking
  - ✅ Real-time updates

## What We Need (MVP Must-Haves)

1. **Journal Flow Enhancements:**
   - Add review page at end of morning/evening journals showing all entries
   - Enable editing of any section during review
   - Add "Review All" button to each journal step
   - Implement photo upload option for AI-assisted journal completion
   - Create unified journal entry view component for consistency

2. **History View Improvements:**
   - Enable opening and viewing complete journal entries
   - Add detailed view modal/page for past entries
   - Implement edit functionality for recent entries
   - Add photo upload option for past entries
   - Create consistent journal entry display component

3. **Weekly Challenges System:**
   - Implement weekly challenge creation and management
   - Add challenge completion verification (+50 points)
   - Create challenge history tracking
   - Build user participation metrics
   - Design challenge card for dashboard

4. **OCR Integration:**
   - Implement OpenAI Vision API for handwritten journal processing
   - Complete image upload workflow with progress feedback
   - Add error handling and fallback options
   - Ensure proper text extraction and formatting
   - Enable photo-to-text for both new and past entries

## Post-MVP Features

1. **Points System Enhancements:**
   - Implement achievement notifications
   - Create points history tracking
   - Add visual celebrations for milestones
   - Complete weekly leaderboard implementation

2. **Content Management:**
   - Build quote library and management system
   - Create gratitude actions library
   - Implement content rotation logic
   - Add admin interface for content management

## Skills & Experience Required

- Experience with Next.js 14, React, and TypeScript
- Proven experience with Supabase (authentication and database)
- Experience integrating OpenAI APIs, specifically the Vision API
- Strong understanding of gamification mechanics and point systems
- Ability to work with existing codebase and maintain consistent code quality

## Deliverables

1. **Enhanced Journal System:**
   - Complete journal review page implementation
   - Unified journal entry viewing component
   - Photo upload integration with OCR
   - Edit functionality for all journal sections

2. **History View Updates:**
   - Detailed journal entry viewing system
   - Past entry editing capability
   - Photo upload for past entries
   - Consistent entry display across app

3. **Weekly Challenges System:**
   - Complete challenge management system
   - Challenge progress tracking and verification
   - Dashboard integration with challenge card
   - Points integration for challenge completion

4. **OCR System:**
   - Complete OpenAI Vision API integration
   - Robust image upload and processing workflow
   - Error handling and user feedback
   - Integration with journal review system

## Project Timeline and Budget

- **Timeline:** We're looking to have these MVP features completed within [insert timeline] to begin user testing
- **Budget:** [insert budget range], negotiable based on experience and proposed approach

## Technical Requirements

### Component Requirements

1. **Journal Entry View/Edit:**
```typescript
interface JournalEntry {
    id: string;
    date: string;
    userId: string;
    morning?: {
        mood: number;
        moodFactors: string[];
        reflection: string;
        affirmations: string[];
        gratitude: string[];
        excitement: string[];
    };
    evening?: {
        mood: number;
        moodFactors: string[];
        reflection: string;
        tomorrow: string;
    };
    photos?: {
        id: string;
        url: string;
        processedText?: string;
        uploadedAt: Date;
    }[];
    isEditable: boolean;
}

interface JournalReviewProps {
    entry: JournalEntry;
    onEdit: (section: string, data: any) => Promise<void>;
    onPhotoUpload: (file: File) => Promise<void>;
    onSubmit: () => Promise<void>;
}
```

2. **Weekly Challenge Card:**
```typescript
interface WeeklyChallenge {
    id: string;
    title: string;
    description: string;
    points: number;
    startDate: Date;
    endDate: Date;
    requirements: Record<string, any>;
    status: 'in_progress' | 'completed' | 'failed';
    progress?: number;
}
```

### Database Updates Needed
```sql
-- Add photo support to journal entries
ALTER TABLE journal_entries
ADD COLUMN photos JSONB DEFAULT '[]'::jsonb;

-- Weekly Challenges Tables
CREATE TABLE weekly_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    points INTEGER DEFAULT 50,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    requirements JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users,
    challenge_id UUID REFERENCES weekly_challenges,
    status TEXT NOT NULL DEFAULT 'in_progress',
    progress_data JSONB,
    completed_at TIMESTAMPTZ,
    points_awarded INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, challenge_id)
);

-- Add RLS Policies
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are viewable by all authenticated users"
    ON weekly_challenges FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can only view their own challenge progress"
    ON user_challenge_progress FOR ALL
    USING (auth.uid() = user_id);
```

## How to Apply

Please include in your proposal:
- Your experience with similar gamification/points systems and OCR integrations
- Examples of your work with Next.js, Supabase, and OpenAI APIs
- Estimated timeline for completing these specific features
- Any questions about the MVP requirements

If you're confident in delivering these core features and have experience with similar applications, we'd love to hear from you! 