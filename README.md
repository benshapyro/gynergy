# Gynergy Member Portal

![Gynergy Logo](public/logo.png)

A **production-ready** MVP of the Gynergy Member Portal - a comprehensive platform for daily journaling, community engagement, and personal growth tracking.

## 🌟 Key Features

- ✍️ **Smart Journaling**
  - Daily text entries with rich text formatting
  - Photo-to-text conversion using OCR
  - Automatic deletion of photos after processing (privacy-first)

- 🏆 **Engagement & Gamification**
  - Daily streaks for consistent journaling
  - Points system for various activities
  - Community leaderboard
  
- 📱 **User Experience**
  - Responsive design for all devices
  - Dark/light mode support
  - Intuitive calendar and list views for history

- 🔒 **Security & Privacy**
  - NextAuth.js authentication
  - Secure data storage with Supabase
  - Ephemeral photo processing

## 🛠️ Tech Stack

- **Frontend**: Next.js 13 (App Router), TailwindCSS, TypeScript
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL (via Supabase)
- **OCR**: OpenAI Vision API (configurable)
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/benshapyro/gynergy.git
   cd gynergy
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file:
   ```bash
   # Authentication
   NEXTAUTH_SECRET=your-jwt-secret
   NEXTAUTH_URL=http://localhost:3000

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_DATABASE_URL=your-connection-string

   # OCR (Optional)
   OPENAI_API_KEY=your-api-key
   ```

3. **Database Setup**
   ```bash
   # If using the provided schema
   npm run db:setup
   
   # Or manually create tables in Supabase dashboard
   # See schema.sql in /docs folder
   ```

4. **Development**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

5. **Production**
   ```bash
   npm run build
   npm run start
   ```

## 📚 Documentation

### Database Schema

Our PostgreSQL database (via Supabase) consists of the following key tables:

#### Core Tables
- **users**
  - Extends NextAuth's user table
  - Tracks streak_count and total_points
  - Protected by Row Level Security (RLS)

- **journal_entries**
  - Main table for daily entries
  - Contains morning and evening sections
  - Tracks points and mood scores
  - Unique constraint on user_id + date

#### Journal Components
- **affirmations**
  - Linked to journal_entries
  - Types: 'morning' or 'dream_magic'
  - Maximum 5 affirmations per entry

- **gratitude_excitement**
  - Tracks both gratitude and excitement items
  - Maximum 3 items per type per entry
  - Linked to journal_entries

- **gratitude_actions**
  - Daily action tracking
  - Includes completion status and reflections
  - Points awarded for completion

- **free_flow**
  - Unstructured journal content
  - Linked to journal_entries

#### Content Tables
- **daily_quotes**
  - System-managed inspirational quotes
  - One quote per active_date
  - Readable by all users

- **daily_actions**
  - System-managed gratitude actions
  - Includes tips and guidance
  - One action per active_date

### Security Features
- Row Level Security (RLS) enabled on all user-related tables
- Custom policies ensure users can only access their own data
- Public tables (daily_quotes, daily_actions) are read-only

### Project Structure

```
gynergy/
├── app/                    # Next.js 14 App Router directory
│   ├── (auth)/            # Authentication related pages
│   │   ├── login/         # Login page and components
│   │   └── register/      # Registration page and components
│   ├── (dashboard)/       # Main application interface
│   │   ├── page.tsx       # Dashboard home page
│   │   └── components/    # Dashboard-specific components
│   │       ├── JournalEditor.tsx    # Main journaling interface
│   │       └── PhotoUploadOCR.tsx   # Photo upload and OCR
│   ├── api/               # Backend API routes
│   │   ├── auth/          # Authentication endpoints
│   │   │   └── [...nextauth]  # NextAuth configuration
│   │   ├── journal/       # Journal CRUD operations
│   │   │   ├── save/      # Save journal entries
│   │   │   └── upload/    # Handle photo uploads
│   │   ├── leaderboard/   # Leaderboard endpoints
│   │   │   ├── streaks/   # Streak calculations
│   │   │   └── points/    # Points tracking
│   │   └── user/          # User profile management
│   └── layout.tsx         # Root layout component
├── lib/                   # Shared utilities and services
│   ├── supabaseClient.ts  # Supabase client configuration
│   ├── authOptions.ts     # NextAuth configuration
│   └── ocrService.ts      # OCR service implementation
├── public/                # Static assets
└── docs/                  # Additional documentation
    └── schema.sql         # Complete database schema
```

### Key Files

#### Configuration Files
- `next.config.js` - Next.js configuration
  - Configures build settings
  - Defines API routes
  - Sets environment variables

- `tsconfig.json` - TypeScript configuration
  - Configures path aliases
  - Sets compilation options
  - Defines included/excluded files

#### Core Components
- `app/layout.tsx` - Root layout
  - Implements authentication provider
  - Sets up global styles
  - Manages navigation structure

- `app/dashboard/components/JournalEditor.tsx`
  - Main journaling interface
  - Handles form state
  - Manages entry submissions

#### Service Files
- `lib/supabaseClient.ts`
  - Configures Supabase connection
  - Sets up real-time subscriptions
  - Manages database interactions

- `lib/authOptions.ts`
  - Configures NextAuth providers
  - Sets up authentication callbacks
  - Manages session handling

- `lib/ocrService.ts`
  - Handles image processing
  - Integrates with OpenAI Vision
  - Manages OCR results

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the powerful backend platform
- OpenAI for the Vision API
- All contributors and users of Gynergy

---

Made with ❤️ by the Gynergy team
