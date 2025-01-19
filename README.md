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

Key tables in the Supabase database:

- `users`: User profiles and authentication
- `journal_entries`: Daily journal entries
- `streaks`: User activity streaks
- `points`: Point accumulation and history

See `docs/schema.sql` for complete schema.

### API Routes

- `/api/journal/*`: Journal entry management
- `/api/leaderboard/*`: Streak and point rankings
- `/api/user/*`: User profile operations
- `/api/auth/*`: Authentication endpoints

### Project Structure

```
gynergy/
├── app/                  # Next.js 13 App Router directory
│   ├── (auth)/          # Authentication pages (login, register)
│   ├── (dashboard)/     # Main app interface and journal editor
│   ├── api/             # Backend API routes for all functionality
│   │   ├── auth/        # Authentication API endpoints
│   │   ├── journal/     # Journal entry management endpoints
│   │   ├── leaderboard/ # Streak and points ranking endpoints
│   │   └── user/        # User profile management endpoints
│   └── ...             # Other app pages (history, profile, etc.)
├── lib/                 # Shared utilities and services
│   ├── supabaseClient.ts   # Supabase database client setup
│   ├── authOptions.ts      # NextAuth configuration
│   └── ocrService.ts       # OCR service implementation
├── public/              # Static assets (images, icons)
├── docs/               # Documentation and database schema
└── prisma/             # Database schema and migrations
```

### Key Files

- `.env.local` - Environment variables for local development
- `next.config.js` - Next.js configuration
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `requirements.txt` - Python dependencies (if any)

### Important Directories

#### `/app` - Application Core
Contains all pages, components, and API routes using Next.js 13's App Router architecture. Each subdirectory represents a route in the application.

#### `/lib` - Shared Libraries
Houses reusable utilities, database clients, and service implementations:
- `supabaseClient.ts`: Configures and exports the Supabase client
- `authOptions.ts`: NextAuth.js configuration for authentication
- `ocrService.ts`: Handles OCR processing for journal photo uploads

#### `/app/api` - Backend Endpoints
RESTful API routes that handle:
- User authentication and session management
- Journal entry CRUD operations
- Leaderboard calculations and rankings
- User profile updates

#### `/app/(auth)` - Authentication
Protected routes and authentication-related components:
- Login page with email/password
- Registration flow
- Password reset functionality

#### `/app/(dashboard)` - Main Application
Core application features:
- Journal entry editor
- Photo upload interface
- Daily streak tracking
- Points visualization

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
