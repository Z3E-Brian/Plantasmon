# Features Implemented

**Analysis Date:** 2026-04-22

## Screens (Routes)

### Auth Screens

**Login (`/login`):**
- `app/login.tsx` → `src/screens/auth/loginScreen.tsx`
- Features: Email/password login, password reset, Google sign-in (broken), register link
- Status: Mostly working (Google broken)

### Main App Screens

**Home (`/`):**
- `app/index.tsx` → `src/screens/home/HomeScreen.tsx`
- Components: HomeHeader, PlantOfTheDay, LastIdentified, UserProgress, DailyMissions, RecentAchievement, TipCard
- Status: Complete

**Explore (`/explore`):**
- `app/explore.tsx`
- Status: Placeholder ("Próximamente...")

**Identify (`/identify`):**
- `app/identify.tsx`
- Features: Plant ID entry with validation, verify plant exists in Firestore, add plant to collection, nickname/notes
- Status: Working (dev/testing screen)

**Journal (`/journal`):**
- `app/journal.tsx`
- Status: Placeholder ("Próximamente...")

**Profile (`/profile`):**
- `app/profile.tsx` → `src/screens/userProfile/UserProfile.tsx`
- Features: ProfileHero (avatar, level, XP, plants), ProfileAbout (bio, location, streak, care score), PlantCollection, ActivityFeed, Achievements
- Tabs: collection, activity, badges
- Status: Complete

**EditProfile (`/editProfile`):**
- `app/editProfile.tsx` → `src/screens/editProfile/EditProfileScreen.tsx`
- Features: Bio editing, location, theme customization
- Status: Implemented (see `app/editProfile.tsx` routing)

**CompanionPlant (`/companionPlant`):**
- `app/companionPlant.tsx`
- Features: Set companion plant from collection
- Status: Implemented

## Firebase Collections

**`users` collection:**
- Profile data: displayName, username, aboutme (bio), location
- Stats: level, xp, streakDays, plantsIdentified
- Settings: themeId, titleId, frameId
- Arrays: userPlants, userAchievements (or nested in subcollections)
- Status: Working

**`plants` collection:**
- Plant definitions: commonName, scientificName, wateringDays, light
- Status: Referenced but not populated in code

**`achievements` collection:**
- Global achievement definitions: name, description, category, target, xpReward
- Status: Referenced but not populated in code

## Key Functionality

### Authentication
- Email/password login ✅
- Password reset ✅
- Auth state persistence ✅
- Auth guards in layout ✅
- Google OAuth ❌ (broken - throws "not implemented")

### User Profile
- Fetch profile from Firestore ✅
- Update bio/location ✅
- Update settings (theme, title, frame) ✅
- Level/XP system ✅
- Streak tracking ✅
- Care score ✅

### Plant Collection
- Fetch user plants ✅
- Add plant to collection (via ID) ✅
- Toggle favorite ✅
- Set companion plant ✅
- Update plant details (nickname, notes) ✅

### Achievements
- Fetch achievements ✅
- Progress tracking ⚠️ (stubbed in UI)
- Earned/unlocked display ✅

### UI Components (Key)
- Button, Input, Card - `src/components/ui/`
- Avatar, Badge, Progress - `src/components/ui/`
- Toast notifications - `react-native-toast-message`
- Theme system - `src/constants/theme.ts`, custom hooks

### Navigation
- Expo Router file-based routing ✅
- Bottom navigation (BottomNav) ✅
- Stack navigation implied ✅

---

*Features analysis: 2026-04-22*