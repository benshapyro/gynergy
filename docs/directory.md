# Project Directory Structure

```
gynergy/
├── README.md                     # Project overview and setup instructions
├── app/                         # Next.js 14 app directory (App Router)
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   └── route.ts
│   │   ├── history/          # Journal history endpoints
│   │   │   └── route.ts
│   │   ├── journal/         # Journal management endpoints
│   │   │   ├── save/       # Save journal entries
│   │   │   │   └── route.ts
│   │   │   └── upload/    # Handle file uploads
│   │   │       └── route.ts
│   │   ├── leaderboard/  # Leaderboard data endpoints
│   │   │   ├── points/  # Points tracking
│   │   │   │   └── route.ts
│   │   │   └── streaks/ # Streak tracking
│   │   │       └── route.ts
│   │   └── user/      # User profile endpoints
│   │       └── profile/
│   │           └── route.ts
│   ├── auth/         # Authentication pages
│   │   ├── callback/ # Auth callback handling
│   │   │   └── page.tsx
│   │   ├── login/   # Login page
│   │   │   └── page.tsx
│   │   └── register/ # Registration page
│   │       └── page.tsx
│   ├── dashboard/    # Main dashboard
│   │   ├── components/
│   │   │   └── JournalEditor.tsx
│   │   ├── dashboard.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css   # Global styles
│   ├── history/     # Journal history views
│   │   ├── calendar/ # Calendar view
│   │   │   └── page.tsx
│   │   ├── list/    # List view
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── journal/    # Journal entry pages
│   │   ├── evening/ # Evening journal
│   │   │   └── page.tsx
│   │   └── morning/ # Morning journal
│   │       └── page.tsx
│   ├── layout.tsx  # Root layout
│   ├── leaderboard/ # Leaderboard page
│   │   └── page.tsx
│   ├── onboarding/ # User onboarding
│   │   └── page.tsx
│   ├── page.tsx   # Landing page
│   ├── profile/   # User profile page
│   │   └── page.tsx
│   └── providers.tsx # App providers wrapper
├── components/     # Shared components
│   ├── auth/      # Authentication components
│   │   └── LoginButton.tsx
│   ├── journal/   # Journal-related components
│   │   ├── DailyAction.tsx    # Daily gratitude action
│   │   ├── DailyQuote.tsx     # Inspirational quote
│   │   ├── EveningJournal.tsx # Evening journal form
│   │   ├── JournalStatus.tsx  # Journal completion status
│   │   ├── Leaderboard.tsx    # Leaderboard display
│   │   ├── MorningJournal.tsx # Morning journal form
│   │   └── MountainProgress.tsx # Progress visualization
│   └── layout/    # Layout components
│       └── Navigation.tsx
├── docs/         # Documentation
│   ├── database.md           # Database structure
│   ├── development-status.md # Project status
│   ├── directory.md         # This file
│   ├── journey.md          # User journey
│   ├── schema.sql         # Database schema
│   └── test_data.sql     # Test data
├── lib/         # Utilities and libraries
│   ├── database.types.ts  # Database type definitions
│   ├── hooks/            # Custom React hooks
│   │   └── useUserProgress.ts
│   ├── supabase-client.ts # Supabase client setup
│   └── supabase-server.ts # Server-side Supabase
├── middleware.ts        # Next.js middleware
├── next-env.d.ts       # Next.js type definitions
├── next.config.js      # Next.js configuration
├── package-lock.json   # Dependency lock file
├── package.json        # Project dependencies
├── public/            # Static assets
│   └── placeholder.png
├── tsconfig.json      # TypeScript configuration
└── upwork.md         # Project requirements
```

## Key Directories

### `/app`
Next.js 14 app directory using the App Router pattern. Contains all pages, layouts, and API routes.

### `/components`
Reusable React components organized by feature:
- `auth/`: Authentication-related components
- `journal/`: Journal entry and display components
- `layout/`: Layout and navigation components

### `/lib`
Utility functions, custom hooks, and configuration:
- `hooks/`: Custom React hooks
- `database.types.ts`: TypeScript definitions for database
- `supabase-*.ts`: Supabase client configuration

### `/docs`
Project documentation:
- `database.md`: Database structure and relationships
- `development-status.md`: Current project status
- `journey.md`: User journey documentation
- `schema.sql`: Database schema definition
- `test_data.sql`: Sample data for development

## File Naming Conventions

- React components: PascalCase (e.g., `MountainProgress.tsx`)
- Pages: lowercase with hyphens (e.g., `morning-journal.tsx`)
- Utilities: camelCase (e.g., `supabase-client.ts`)
- Documentation: lowercase with hyphens (e.g., `development-status.md`)

## Development Guidelines

1. Place new pages in the appropriate `/app` directory
2. Add reusable components to `/components`
3. Add new API routes under `/app/api`
4. Document database changes in both `schema.sql` and `database.md`
5. Update `development-status.md` when completing features