# Codebase Structure

**Analysis Date:** 2026-04-22

## Directory Layout

```
plantasmon/
├── app/                    # Expo Router file-based routes
├── src/
│   ├── components/        # Reusable UI components
│   ├── config/          # Firebase configuration
│   ├── constants/       # Theme, design tokens
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities
│   ├── schemas/         # Zod validation schemas
│   ├── screens/        # Screen-level components
│   ├── services/       # Business logic & Firebase
│   ├── styles/        # Style utilities
│   └── theme/          # Theme definitions
├── assets/             # Static assets (images)
├── android/             # Android native project
├── ios/                # iOS native project
├── package.json
├── app.json            # Expo config
├── tsconfig.json
└── eas.json           # EAS Build config
```

## Directory Purposes

**app/:**
- Purpose: File-based routing (expo-router)
- Contains: Route files mapping to URLs
- Key files: `_layout.tsx`, `index.tsx`, `login.tsx`, `identify.tsx`, `profile.tsx`, `journal.tsx`, `explore.tsx`, `editProfile.tsx`, `companionPlant.tsx`

**src/components/:**
- Purpose: Reusable UI components
- Contains:
  - `ui/` - Base UI primitives (button, input, card, etc.)
  - `home/` - Home screen components
  - `profile/` - Profile screen components  
  - `forms/` - Form-specific components
  - `screenWrapper/` - Screen container

**src/screens/:**
- Purpose: Screen-level components
- Contains:
  - `auth/` - Login screen
  - `home/` - Home screen
  - `userProfile/` - Profile screen
  - `editProfile/` - Edit profile screen

**src/services/:**
- Purpose: Business logic layer
- Contains: `authService.ts`, `userService.ts`, `userPlantsService.ts`, `userAchievementsService.ts`

**src/hooks/:**
- Purpose: Custom React hooks
- Contains: `useAuth.ts`, `useProfile.ts`, `useToast.ts`, `useMobile.ts`

**src/config/:**
- Purpose: Firebase initialization
- Contains: `firebase.js`

**src/constants/:**
- Purpose: Static data and tokens
- Contains: `theme.ts`, `designSystem.ts`, `data.ts`

**src/schemas/:**
- Purpose: Zod validation schemas
- Contains: `editProfileSchema.ts`

## Key File Locations

**Entry Points:**
- `app/_layout.tsx` - Root layout with auth, navigation
- `app/index.tsx` - Home route (`/`)
- `app/login.tsx` - Login route (`/login`)

**Configuration:**
- `app.json` - Expo configuration
- `package.json` - Dependencies

**Firebase:**
- `src/config/firebase.js` - Firebase init
- `src/services/authService.ts` - Auth operations
- `src/services/userService.ts` - User operations
- `src/services/userPlantsService.ts` - Plant collection
- `src/services/userAchievementsService.ts` - Achievements

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `PlantCollection.tsx`)
- Services: camelCase with Service suffix (e.g., `authService.ts`)
- Hooks: camelCase with use prefix (e.g., `useAuth.ts`)
- Schemas: camelCase with Schema suffix (e.g., `editProfileSchema.ts`)
- Routes (app/): kebab-case (e.g., `editProfile.tsx`)

**Directories:**
- All lowercase, plural for groups: `components/`, `services/`, `hooks/`
- Feature dirs: `screens/auth/`, `screens/home/`, `components/home/`

## Where to Add New Code

**New Feature Screen:**
- Implementation: `src/screens/<feature>/`
- Route: `app/<feature>.tsx`
- Service: `src/services/<feature>Service.ts`

**New Component:**
- Small/shared: `src/components/ui/`
- Feature-specific: `src/components/<feature>/`

**New Service:**
- Location: `src/services/`

**New Hook:**
- Location: `src/hooks/`

**New Schema:**
- Location: `src/schemas/`

## Special Directories

**assets/:**
- Purpose: Static images, icons
- Generated: No (committed)
- Note: Contains app icons, splash screen

**android/, ios/:**
- Purpose: Native project directories
- Generated: Yes (via `npx expo prebuild`)
- Committed: Yes (in repo)

---

*Structure analysis: 2026-04-22*