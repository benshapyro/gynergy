# Gynergy Journal App Documentation

## Table of Contents
1. [Introduction](#introduction)
   - [Project Overview](#project-overview)
   - [Purpose](#purpose)
   - [Technologies Used](#technologies-used)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Setup](#environment-setup)
   - [Database Setup](#database-setup)
   - [Running the Application](#running-the-application)
3. [Project Structure](#project-structure)
4. [User Journey](#user-journey)
   - [1. Initial Entry (Authentication)](#1-initial-entry-authentication)
   - [2. Dashboard Overview](#2-dashboard-overview)
   - [3. Morning Journal Flow](#3-morning-journal-flow)
   - [4. Daily Gratitude Action](#4-daily-gratitude-action)
   - [5. Evening Journal Flow](#5-evening-journal-flow)
   - [6. Progress & Rewards](#6-progress--rewards)
   - [7. Additional Features](#7-additional-features)
5. [Features](#features)
   - [Features Completed](#features-completed)
   - [Features In Progress](#features-in-progress)
   - [Features To Be Done](#features-to-be-done)
6. [Codebase Overview](#codebase-overview)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [API Integration](#api-integration)
7. [Database Schema](#database-schema)
8. [API Routes](#api-routes)
9. [Development Notes](#development-notes)
   - [Current Progress](#current-progress)
   - [Next Steps](#next-steps)
10. [Contribution Guidelines](#contribution-guidelines)
11. [Security](#security)
12. [Testing](#testing)
13. [License](#license)

## Introduction

### Project Overview
**Gynergy Journal App** is a Next.js 14 application designed for daily journaling. It leverages Supabase as its backend and integrates the OpenAI Vision API to enhance user experience through features like OCR for handwritten entries. The app aims to guide users through a structured journaling process, rewarding consistent engagement with a point-based system visualized as a mountain of growth.

### Purpose
The primary goal of the Gynergy Journal App is to foster personal growth and mindfulness through daily reflections, mood tracking, gratitude practices, and goal-setting. By gamifying the journaling experience, the app motivates users to maintain consistent journaling habits, track their progress, and engage with a community for shared growth.

### Technologies Used
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL), OpenAI Vision API
- **Authentication:** Supabase Auth
- **State Management:** React Hooks
- **Additional Libraries:** react-hot-toast for notifications

## Getting Started

### Prerequisites
- **Node.js** (v14 or later)
- **npm** or **yarn**
- **Supabase Account** with a project set up
- **OpenAI API Key** with Vision API access

### Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/benshapyro/gynergy.git
    cd gynergy
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```
    *or*
    ```bash
    yarn install
    ```

### Environment Setup

1. **Configure Environment Variables**
   - Copy the `.env.template` to `.env.local`:
     ```bash
     cp .env.template .env.local
     ```
   - Fill in the required variables in `.env.local`:
     ```env
     # Supabase Configuration
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

     # OpenAI Vision API
     OPENAI_API_KEY=your-openai-api-key

     # Development Configuration
     NEXT_PUBLIC_SITE_URL=http://localhost:3000
     ```

### Database Setup

1. **Run Database Schema**
   - Navigate to the Supabase dashboard and open the SQL Editor.
   - Execute the SQL script located at `docs/schema.sql` to set up the database schema.

2. **Insert Test Data (Optional)**
   - For testing purposes, run the `docs/test_data.sql` script in the Supabase SQL Editor to populate the database with sample data.

### Running the Application

1. **Start the Development Server**
    ```bash
    npm run dev
    ```
    *or*
    ```bash
    yarn dev
    ```

2. **Access the Application**
   - Open your browser and navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Project Structure

```plaintext
gynergy/
├── app/                    # Next.js pages and layouts
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main journal interface
│   ├── history/           # Journal history view
│   ├── leaderboard/       # Points leaderboard
│   ├── profile/           # User profile pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # App providers
├── components/             # React components
│   ├── journal/           # Journal components
│   │   ├── DailyAction.tsx
│   │   ├── DailyQuote.tsx
│   │   ├── JournalStatus.tsx
│   │   └── MorningJournal.tsx
│   └── auth/              # Auth components
│       └── Navigation.tsx
├── lib/                    # Utilities
│   ├── supabase-client.ts
│   ├── supabase-server.ts
│   └── ocrService.ts
├── prisma/                 # Prisma schema (Optional if using Prisma)
│   └── schema.prisma
├── public/                 # Static assets
│   └── placeholder.png
├── docs/                   # Documentation & SQL
│   ├── schema.sql          # Database schema
│   └── test_data.sql       # Test data
├── .env.local              # Environment variables (not committed)
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## User Journey

### 1. Initial Entry (Authentication)

**Description:**  
Users arrive at the Gynergy Journal App and authenticate using their email. Authentication is managed through Supabase.

**Steps:**
- User navigates to the landing page.
- Enters their email to receive a magic link for authentication.
- Upon signing in, first-time users are directed to the onboarding page.

**Status:** **Done**

### 2. Dashboard Overview

**Description:**  
After authentication, users land on the dashboard, which provides an overview of their journaling progress visualized on the "Mountain of Growth."

**Features:**
- **Progress Visualization:** Shows current points and milestone positions.
- **Action Areas:**
  1. **Daily Quote:** Inspirational card to set the day's tone.
  2. **Morning Journal Status:** Indicates pending tasks.
  3. **Daily Gratitude Action:** Specific gratitude task for the day.

**Status:** **Done**

### 3. Morning Journal Flow

**Description:**  
Users engage in the morning journal to reflect on their mood and set positive intentions for the day.

**Steps:**
- Click "Start morning journal."
- Complete the following:
  - **Mood Tracking:** Rate mood on a scale of 1-10 and select influencing factors.
  - **Morning Reflection:** Write reflections.
  - **Daily Affirmations:** Enter 5 positive affirmations.
  - **Gratitude Items:** List 3 gratitude entries.
  - **Excitement Items:** List 3 excitement entries.
- Upon completion, earn +5 points.

**Status:** **Done**

### 4. Daily Gratitude Action

**Description:**  
Users perform a specific gratitude action to cultivate thankfulness.

**Steps:**
- Complete the daily gratitude task (e.g., "Write a thank you note").
- Mark the action as complete.
- Reflect on the experience.
- Earn +10 points upon completion.

**Status:** **Done**

### 5. Evening Journal Flow

**Description:**  
Users reflect on their day, evaluating their mood and setting intentions for the next day.

**Steps:**
- Return to the dashboard later in the day.
- Complete the evening journal, which includes:
  - **Evening Mood Check:** Rate mood.
  - **Day Reflection:** Reflect on the day's events.
  - **Tomorrow's Changes:** Plan improvements for the next day.
- Earn +5 points upon completion.

**Status:** **Done**

### 6. Progress & Rewards

**Description:**  
Users accumulate points through journaling activities, unlocking milestones and visual rewards.

**Milestones:**
- **Base Camp (0 pts):** Starting point.
- **First Rest (50 pts):** Early achievement.
- **Halfway Point (100 pts):** Building momentum.
- **Final Push (200 pts):** Major milestone.
- **Summit (300 pts):** Ultimate achievement.

**Additional Features:**
- **Streak Tracking:** Monitors daily journaling consistency.
- **Visual Progress:** Mountains and milestones represent user progress.

**Status:** **Done**

### 7. Additional Features

**Description:**  
Enhancements to improve user experience and engagement.

**Features:**
- **History View:** Access past journal entries.
- **Profile Page:** Track overall stats and personalize settings.
- **Leaderboard:** Compare progress with the community.

**Status:** **Done**

## Features

### Features Completed
- **User Authentication:** Secure login using Supabase and magic links.
- **Dashboard Overview:** Visual representation of user progress.
- **Morning & Evening Journals:** Structured journaling flows with mood tracking, reflections, affirmations, gratitude, and excitement inputs.
- **Daily Gratitude Action:** Specific daily tasks fostering gratitude.
- **Progress & Rewards System:** Points accumulation and milestone unlocking.
- **History & Profile Pages:** Access to past entries and user profiles.
- **Leaderboard Integration:** Community engagement through progress comparison.

### Features In Progress
- **Enhanced Mountain Visualization:** Integration of 3D elements and interactive milestones using Three.js/React Three Fiber.
- **AI-Powered Mood Analysis:** Leveraging OpenAI for deeper mood insights.
- **Smart Journaling Suggestions:** Personalized prompts and gratitude suggestions based on user data.
- **Voice-to-Text with Emotion Detection:** Allowing users to input journal entries via voice with emotion analysis.

### Features To Be Done
- **Modernized UI/UX:** Implementing glass-morphism design, micro-interactions, dark/light themes, and responsive layouts.
- **Analytics & Insights:** Developing dashboards for personal growth analytics, mood tracking visualization, and progress patterns.
- **Gamification Enhancements:** Adding achievement badges, daily streaks, power hours for bonus points, and collaborative challenges.
- **Performance Optimizations:** Implementing React Suspense, intelligent prefetching, bundle size optimization, and image optimization pipelines.
- **Progressive Web App Features:** Offline support, push notifications, quick-add widgets, app shortcuts, and background sync.
- **Accessibility Improvements:** Ensuring WCAG 2.1 Level AAA compliance, screen reader optimizations, keyboard navigation, high contrast modes, and reduced motion options.
- **Security & Privacy Enhancements:** Implementing end-to-end encryption, privacy-focused analytics, granular sharing controls, two-factor authentication, and regular security audits.
- **Community Features:** Facilitating anonymous journey sharing, group challenges, mentor matching, community-driven prompts, and weekly highlights.

## Codebase Overview

### Frontend

The frontend of the Gynergy Journal App is built with Next.js 14 and React, utilizing TypeScript for type safety. Key frontend components include:

- **Dashboard (`app/dashboard/page.tsx`):** The main interface displaying user progress, daily actions, and navigation to journaling sections.
- **Morning Journal (`components/journal/MorningJournal.tsx`):** Handles the morning journaling flow, including mood tracking and reflections.
- **Evening Journal:** Similar structure to the morning journal for end-of-day reflections.
- **History (`app/history/`):** Provides list and calendar views of past journal entries.
- **Profile (`app/profile/page.tsx`):** User profile management and statistics.
- **Navigation (`components/auth/Navigation.tsx`):** Global navigation bar accessible across the app.
- **Toaster (`react-hot-toast`):** Handles toast notifications for user feedback.

### Backend

The backend leverages Supabase for authentication, database management, and real-time capabilities. Key backend aspects include:

- **Database Schema (`docs/schema.sql`):** Defines tables such as `journal_entries`, `affirmations`, `gratitude_excitement`, and `dream_magic`.
- **API Routes (`app/api/`):** Handles CRUD operations for journal entries, user profiles, and other resources.
- **Supabase Integration (`lib/supabase-client.ts`):** Manages Supabase client setup for frontend interactions.
- **OpenAI Vision API (`lib/ocrService.ts`):** Integrates OCR functionalities for processing handwritten journal entries.

### API Integration

- **Authentication:** Utilizes Supabase Auth for secure user sign-in and sign-out processes.
- **Vision API:** Incorporates OpenAI's Vision API to extract and process text from uploaded journal images.

## Database Schema

The database schema is designed to support the application's journaling features, user management, and progress tracking.

### Key Tables

- **`journal_entries`:**  
  Stores daily journal entries with sections for morning and evening reflections, gratitude actions, and points tracking.

- **`affirmations`:**  
  Contains morning affirmations associated with journal entries.

- **`gratitude_excitement`:**  
  Holds user-entered gratitude and excitement items linked to journal entries.

- **`dream_magic`:**  
  Manages dream magic visualization data, including statements and action steps.

- **`daily_quotes`:**  
  Stores inspirational quotes displayed daily on the dashboard.

- **`daily_actions`:**  
  Contains daily gratitude actions for users to complete.

### Example Schema Definition (`docs/schema.sql`)

```sql
-- Main journal entries table
CREATE TABLE IF NOT EXISTS "journal_entries" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Morning section
    morning_completed BOOLEAN DEFAULT FALSE,
    morning_mood_score INTEGER,
    morning_mood_factors TEXT[],
    morning_reflection TEXT,
    morning_points INTEGER DEFAULT 0,
    
    -- Evening section
    evening_completed BOOLEAN DEFAULT FALSE,
    evening_mood_score INTEGER,
    evening_mood_factors TEXT[],
    evening_reflection TEXT,
    evening_points INTEGER DEFAULT 0,
    
    -- Gratitude action
    gratitude_action_completed BOOLEAN DEFAULT FALSE,
    gratitude_action_points INTEGER DEFAULT 0,
    
    -- Points tracking
    total_points INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, date)
);

-- Affirmations table
CREATE TABLE IF NOT EXISTS "affirmations" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    affirmation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Gratitude and excitement items table
CREATE TABLE IF NOT EXISTS "gratitude_excitement" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('gratitude', 'excitement')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Dream magic table
CREATE TABLE IF NOT EXISTS "dream_magic" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
    statement_text TEXT NOT NULL,
    statement_order INTEGER CHECK (statement_order BETWEEN 1 AND 5),
    action_steps TEXT,  -- Small actions for tomorrow
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Daily quotes table
CREATE TABLE IF NOT EXISTS "daily_quotes" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT,
    active_date DATE UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Daily actions table
CREATE TABLE IF NOT EXISTS "daily_actions" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action_text TEXT NOT NULL,
    tip_text TEXT,
    active_date DATE UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

## API Routes

The application defines several API routes to handle data operations. Below are key API endpoints:

### Authentication Routes

- **`/api/auth/[...nextauth]/route.ts`**
  - Handles user authentication using NextAuth and Supabase.

### Journal Entries Routes

- **`/api/journal/save/route.ts`**
  - Saves a new journal entry or updates an existing one.

- **`/api/journal/upload/route.ts`**
  - Handles uploading and OCR processing of journal photos using the OpenAI Vision API.

### Leaderboard Routes

- **`/api/leaderboard/streaks/route.ts`**
  - Fetches user streak data for the leaderboard.

- **`/api/leaderboard/points/route.ts`**
  - Retrieves points data for users to display on the leaderboard.

### User Profile Routes

- **`/api/user/profile`**
  - **GET:** Retrieves the user's profile information.
  - **PUT:** Updates the user's profile details.

### OCR Route

- **`/api/ocr/route.ts`** (Optional)
  - Processes images uploaded by users to extract text using the OpenAI Vision API.

## Development Notes

### Current Progress

- **Authentication:** Implemented secure email-based authentication with magic link support.
- **Dashboard:** Fully functional dashboard displaying user progress and actionable items.
- **Journaling Features:** Completed morning and evening journal flows with mood tracking, reflections, affirmations, gratitude, and excitement inputs.
- **Gratitude Actions:** Daily gratitude tasks are operational with point rewards.
- **Progress Tracking:** Points accumulate towards defined milestones, visualized on the Mountain of Growth.
- **History & Profile:** Users can view past entries and manage their profiles.
- **Leaderboard:** Community engagement feature to compare progress with peers.
- **Database Schema:** Comprehensive schema set up with necessary tables and relationships.
- **Supabase Integration:** Backend correctly handles data operations, authentication, and real-time updates.

### Next Steps

- **Enhanced Visualizations:** Integrate 3D mountain visuals and interactive milestones.
- **AI Features:** Implement AI-powered mood analysis and smart journaling suggestions.
- **Voice-to-Text:** Enable voice input for journal entries with emotion detection.
- **UI/UX Enhancements:** Modernize the interface with glass-morphism design, animations, and responsive layouts.
- **Analytics Dashboard:** Develop dashboards for personal growth insights and mood tracking analytics.
- **Gamification:** Add achievement badges, daily streaks, and collaborative challenges to boost engagement.
- **Performance Optimization:** Optimize loading times and resource usage with React Suspense and intelligent prefetching.
- **PWA Features:** Implement offline support, push notifications, and background sync.
- **Accessibility:** Ensure full compliance with WCAG 2.1 Level AAA standards and enhance accessibility features.
- **Security Enhancements:** Strengthen security with end-to-end encryption, two-factor authentication, and regular audits.
- **Community Features:** Develop functionalities for group challenges, mentor matching, and community-driven prompts.

## Contribution Guidelines

We welcome contributions from the community! To contribute to the Gynergy Journal App, please follow these guidelines:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/benshapyro/gynergy.git
   cd gynergy
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Your Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Navigate to the repository on GitHub and create a pull request detailing your changes.

**Note:** Ensure that your code adheres to the project's code style and includes necessary tests.

## Security

### Development Mode
- **Authentication Bypass:** Automatically authenticates using a test user without requiring sign-in.
- **Test User Permissions:** Test user has full access; no real security is enforced.
- **Configuration:** Bypassed authentication is configured in `lib/supabase-client.ts`.
  
**Important:** Remove all development-specific code before deploying to production.

### Production Mode
- **Row Level Security (RLS):** Enabled for all relevant tables to ensure users can only access their own data.
- **Authentication:** Real Supabase authentication is enforced; users must sign in with a valid email.
- **Environment Variables:** Securely manage production credentials and never commit `.env.local` to the repository.
- **Session Management:** Proper session handling and expiration are enforced.
  
### Additional Security Measures
- **End-to-End Encryption:** Implements encryption for data at rest and in transit.
- **Two-Factor Authentication:** Plans to enhance authentication security with 2FA.
- **Regular Security Audits:** Scheduled audits to identify and mitigate potential vulnerabilities.

## Testing

### Current Testing Coverage
- **Unit Tests:** Focused on critical components like authentication and journaling functionalities.
- **Integration Tests:** Ensuring seamless interactions between frontend and backend services.

### Planned Testing Enhancements
- **End-to-End Testing:** Implement comprehensive E2E tests using tools like Cypress to simulate user interactions.
- **Automated Testing Pipelines:** Integrate CI/CD pipelines to automate testing on pull requests.
- **Performance Testing:** Assess and optimize application performance under various loads.

## License

The Gynergy Journal App is licensed under the [MIT License](LICENSE).

---

For any questions or support, please contact the development team at [ben@shapyro.com](mailto:ben@shapyro.com).
