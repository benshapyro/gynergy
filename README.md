# Gynergy Member Portal

A **production-ready** MVP of the Gynergy Member Portal, built with:

- **Next.js 13 (App Router)**  
- **NextAuth** for user authentication  
- **Supabase** for database, storing user streaks/points/journal entries  
- **OpenAI** (or any OCR service) for ephemeral photo OCR  
- Full daily journaling flow, leaderboard, profile management, and history views

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Support and Contribution](#support-and-contribution)

## Features

1. **Daily Journaling**: Type text or upload a photo (OCR text extraction).
2. **Ephemeral Photo Upload**: Image is deleted after OCR.
3. **Streak and Points**: If user logs daily, streak increments; each entry gives points.
4. **Leaderboard**: Ranks by longest streak or total points.
5. **Journal History**: View/edit in list or calendar format.
6. **Profile Management**: Edit name, email, profile picture.

## Prerequisites

- **Node.js** v16+  
- **Yarn** or **npm**  
- **Supabase** account (or a local Postgres DB)  
- (Optional) **OpenAI** account or any other OCR provider

## Architecture Overview

- **Next.js 13**: Single codebase for frontend + backend (API routes).
- **NextAuth**: Handles sign in/out, sessions, and user identity.
- **Supabase**: Database (Postgres) for all user/journal data. Also can store Auth (if using SupabaseAdapter).
- **OCR**: Photo is posted to an API route, calls `openAIVisionOCR` or any custom OCR function.

## Getting Started

1. **Clone** this repository:
   ```bash
   git clone https://github.com/yourorg/gynergy-member-portal.git
   cd gynergy-member-portal

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in .env.local:

```bash
NEXTAUTH_SECRET=YourJWTSecret
SUPABASE_DATABASE_URL=postgres://...
NEXT_PUBLIC_SUPABASE_URL=https://yourproj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
OPENAI_API_KEY=sk-xxxx 
```

Environment Variables
NEXTAUTH_SECRET: A secret key for JWT encryption (required by NextAuth).
SUPABASE_DATABASE_URL: If using SupabaseAdapter as your NextAuth DB.
NEXT_PUBLIC_SUPABASE_URL: Public Supabase project URL.
NEXT_PUBLIC_SUPABASE_ANON_KEY: Public anon key from Supabase.
OPENAI_API_KEY: If using OpenAI for OCR. Replace logic if using another provider.

4. Set up the database:

Create tables in your Supabase project or run the included SQL.
If using NextAuth’s SupabaseAdapter, it will manage certain tables automatically.

5. Run the app:

```bash
npm run dev
```
Access the app at http://localhost:3000. 

Database Schema
See schema.sql or the snippet in the codebase to create your User and JournalEntry tables.
If you are using NextAuth with a different adapter (e.g. Prisma), see official docs on required schema.

Running the App
Local: npm run dev → http://localhost:3000
Production:
npm run build
npm run start
Or deploy to Vercel, AWS, Netlify, etc.
Project Structure
See the top-level folder layout in this repo. The key directories:

app/api/*: Route handlers for journaling, profile, leaderboard, etc.
app/(auth)/*: Login and register pages.
app/(dashboard)/*: The main journaling UI.
lib/*: Shared utilities (Supabase client, OCR, NextAuth config).
public/*: Public assets.


## Project Structure
gynergy-member-portal/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── JournalEditor.tsx
│   │       └── PhotoUploadOCR.tsx
│   ├── (leaderboard)/
│   │   └── page.tsx
│   ├── (history)/
│   │   ├── list/
│   │   │   └── page.tsx
│   │   ├── calendar/
│   │   │   └── page.tsx
│   ├── (profile)/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── journal/
│   │   │   ├── save/route.ts
│   │   │   └── upload/route.ts
│   │   ├── leaderboard/
│   │   │   ├── streaks/route.ts
│   │   │   └── points/route.ts
│   │   ├── user/
│   │   │   └── profile/route.ts
│   │   └── ocr/route.ts (Optional if separate)
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── supabaseClient.ts
│   ├── authOptions.ts
│   └── ocrService.ts
├── prisma/
│   └── schema.prisma (Optional if using Prisma)
├── public/
│   └── placeholder.png (example)
├── .env.local (not committed)
├── next.config.js
├── package.json
├── tsconfig.json
├── README.md
└── requirements.txt
