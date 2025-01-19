# Gynergy Journal App

A Next.js 14 application for daily journaling with Supabase backend.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/benshapyro/gynergy.git
   cd gynergy
   npm install
   ```

2. **Environment Setup**
   Create `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Database Setup**
   - Run `docs/schema.sql` in your Supabase SQL Editor
   - For testing, run `docs/test_data.sql` to create sample data

4. **Development**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000/dashboard

## 🔑 Development vs Production

### Development Mode
Development mode includes features to make testing easier:

1. **Authentication Bypass**
   - Automatic authentication with a test user
   - No need to sign in
   - Test user details:
     ```typescript
     {
       id: 'test-user-123',
       email: 'test@example.com',
       name: 'Test User'
     }
     ```
   - Configured in:
     - `lib/supabase-client.ts`
     - `lib/supabase-server.ts`

2. **Test Data**
   - Sample data available in `docs/test_data.sql`
   - Includes:
     - Daily quotes
     - Gratitude actions
     - Journal entries
     - Affirmations

### Production Mode
Before deploying to production:

1. **Remove Development Code**
   - Delete all code blocks marked with:
     ```typescript
     // For development only - remove in production
     ```
   - These blocks are in:
     - `lib/supabase-client.ts`
     - `lib/supabase-server.ts`

2. **Authentication**
   - Real Supabase authentication will be active
   - Users must sign in with email
   - Magic link authentication flow

3. **Environment Variables**
   - Set production Supabase credentials in your hosting platform
   - Never commit `.env.local`
   - Use production-grade secrets

## 📁 Project Structure

```
gynergy/
├── app/                    # Next.js pages and layouts
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main journal interface
│   ├── history/         # Journal history view
│   ├── leaderboard/     # Points leaderboard
│   ├── profile/         # User profile pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── providers.tsx    # App providers
├── components/            # React components
│   ├── journal/          # Journal components
│   │   ├── DailyAction.tsx
│   │   ├── DailyQuote.tsx
│   │   └── JournalStatus.tsx
│   └── auth/             # Auth components
├── lib/                  # Utilities
│   ├── supabase-client.ts  # Client-side Supabase
│   └── supabase-server.ts  # Server-side Supabase
└── docs/                 # Documentation & SQL
    ├── schema.sql        # Database schema
    └── test_data.sql     # Test data
```

## 💾 Database Schema

Key tables:
- `journal_entries` - Daily entries with points tracking
- `affirmations` - Morning affirmations
- `gratitude_excitement` - Gratitude and excitement items
- `gratitude_actions` - Daily actions and responses
- `daily_quotes` - Inspirational quotes

## 🎮 Points System

Users earn points automatically:
- Morning journal: 5 points
- Evening journal: 5 points
- Gratitude action: 10 points

Points are tracked through database triggers.

## 🔒 Security Notes

1. **Development Mode**
   - Authentication is bypassed
   - Test user has full access
   - No real security enforced

2. **Production Mode**
   - Row Level Security (RLS) active
   - Users can only access their own data
   - Proper authentication required
   - Session management enforced

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE)
