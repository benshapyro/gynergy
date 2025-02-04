# User Journey: Gynergy Journal App

Status Key:
✅ Complete
🚧 In Progress
❌ Not Started

## 1. Initial Entry (Authentication) ✅
- User arrives at the site and logs in using their email
- They're authenticated through Supabase
- First-time users start at "Base Camp" (0 points)

## 2. Dashboard Overview 🚧
Users see their progress on the Mountain of Growth:
- Current position on mountain visualization ✅
- Four main action areas:
  1. Daily Quote (inspiration card) ✅
  2. Morning Journal Status ✅
  3. Daily Gratitude Action ✅
  4. Weekly Challenge Card ❌

## 3. Morning Journal Flow 🚧
User clicks "Start morning journal" and completes:
1. Mood tracking (1-10 score + factors) ✅
2. Morning reflection ✅
3. 5 daily affirmations ✅
4. 3 gratitude items ✅
5. 3 excitement items ✅
6. Review & Edit Page ❌
   - See all completed sections in one view
   - Edit any section if needed
   - Upload photo of handwritten journal
   - AI processes handwritten text
   - Submit final version
- Upon completion: +5 points ✅

## 4. Daily Gratitude Action ✅
- A specific action to practice gratitude
- User marks it complete and reflects on the experience
- Upon completion: +10 points
- Action history in profile

## 5. Evening Journal Flow 🚧
User returns later to complete evening reflection:
1. Evening mood check ✅
2. Day reflection ✅
3. Tomorrow's changes ✅
4. Review & Edit Page ❌
   - See all completed sections in one view
   - Edit any section if needed
   - Upload photo of handwritten journal
   - AI processes handwritten text
   - Submit final version
- Upon completion: +5 points ✅

## 6. Weekly Challenges ❌
- Users see current weekly challenge on dashboard
- Complete specific tasks for bonus points
- Track progress throughout the week
- Upon completion: +50 points
- View challenge history in profile
- New challenges every Monday

## 7. Progress & Rewards ✅
Points accumulate toward milestones:
- Base Camp (0 pts) - Starting point
- First Rest (50 pts) - Early achievement
- Halfway Point (100 pts) - Building momentum
- Final Push (200 pts) - Major milestone
- Summit (300 pts) - Ultimate achievement

Features include:
- Streak tracking for consistent journaling ✅
- Visual progress on the mountain ✅
- Weekly challenge achievements ❌
- Achievement notifications 🚧

## 8. History & Review 🚧
Users can:
- View past entries in list format ✅
- View past entries in calendar format ✅
- Open detailed view of any past entry ❌
- Edit recent entries ❌
- Upload photos to complete past entries ❌
- Track journaling consistency ✅

## 9. Profile Features 🚧
- Overall stats dashboard ✅
- Achievement collection ❌
- Challenge history ❌
- Journaling streaks ✅
- Points breakdown ✅
- Personal best records ❌

## 10. Community Features ❌
Future enhancements:
- Group challenges
- Community milestones
- Shared achievements
- Anonymous sharing
- Mentor matching

## Technical Features

### OCR Integration ❌
- Upload handwritten journal photos
- AI processes text using OpenAI Vision
- Auto-fills journal sections
- Saves original photo with entry
- Edit AI-processed text

### Real-time Updates ✅
- Points tracking
- Leaderboard positions
- Achievement notifications
- Challenge progress

### Mobile Optimization ✅
- Responsive design
- Touch-friendly interface
- Quick journal entries
- Photo upload from device

### Data Security ✅
- End-to-end encryption
- Secure authentication
- Privacy controls
- Data backup

## Post-MVP Features ❌

1. **Enhanced Gamification**
   - Daily bonus challenges
   - Special event challenges
   - Achievement badges
   - Custom rewards

2. **Social Features**
   - Private groups
   - Mentor system
   - Anonymous sharing
   - Community events

3. **Advanced Analytics**
   - Mood tracking patterns
   - Journal topic analysis
   - Progress insights
   - Personal growth metrics

4. **Content Personalization**
   - AI-generated prompts
   - Custom challenge difficulty
   - Personalized quotes
   - Adaptive goals