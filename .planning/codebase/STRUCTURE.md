# Codebase Structure

**Analysis Date:** 2026-06-10

## Directory Layout

```
Plantasmon/
├── .planning/               # GSD project planning artifacts
├── .vscode/                 # Editor config
├── AGENTS.md                # GSD workflow instructions
├── app/                     # Expo Router file-based routes
│   ├── _layout.tsx          # Root layout (auth, nav, sync, toast)
│   ├── index.tsx            # Home route → HomeScreen
│   ├── login.tsx            # Login route → loginScreen
│   ├── register.tsx         # Register route → registerScreen
│   ├── explore.tsx          # Plant catalog explorer
│   ├── identify.tsx         # Plant identification (full page logic)
│   ├── camera.tsx           # Camera route → CameraScreen
│   ├── calendar.tsx         # Calendar route → CalendarScreen
│   ├── journal.tsx          # Journal + missions (full page logic)
│   ├── profile.tsx          # Profile route → UserProfile
│   ├── editProfile.tsx      # Edit profile route → EditProfileScreen
│   ├── chat.tsx             # Chat route → ChatScreen
│   ├── companionPlant.tsx   # Companion plant detail (full page logic)
│   └── plant/               # Dynamic route directory
│       └── [id].tsx         # Plant detail by ID
├── assets/
│   └── images/              # Splash, icon, logo images
├── backend/                 # Backend servers
│   ├── index.js             # Express API server (plant identification proxy)
│   ├── package.json
│   ├── .env.example
│   └── chat/                # Python FastAPI chat server
│       ├── main.py          # Uvicorn entry point
│       ├── requirements.txt
│       ├── render.yaml
│       ├── Instrucciones_Frontend_Encriptacion.md
│       └── app/
│           ├── __init__.py
│           ├── config.py           # Settings via pydantic-settings
│           ├── models.py           # Pydantic models
│           ├── connection_manager.py # WebSocket connection manager
│           ├── routes/             # API route handlers
│           └── services/           # Business logic
├── src/                     # Frontend source
│   ├── components/          # Reusable UI components
│   │   ├── calendar/        # Calendar-related components
│   │   ├── chat/            # Chat bubble, FAB, input
│   │   ├── forms/           # Form fields (InputField, ChipSelector)
│   │   ├── home/            # Home screen widgets (11 components)
│   │   ├── profile/         # Profile widgets (10 components)
│   │   ├── screenWrapper/   # SafeArea wrapper component
│   │   ├── ui/              # 59 shadcn-style primitive components
│   │   └── SyncStatusIndicator.tsx
│   ├── config/              # Firebase initialization
│   │   └── firebase.js
│   ├── constants/           # Static data and design tokens
│   │   ├── theme.ts              # Colors, flag/bg/themes, titles
│   │   ├── designSystem.ts       # AppTheme, light/dark palettes
│   │   ├── missionsData.ts       # Mission definitions
│   │   ├── obteniblesData.ts     # Obtainable items
│   │   └── data.ts               # Mock/example data
│   ├── hooks/               # Custom React hooks
│   │   ├── __tests__/             # Hook tests
│   │   ├── useAuth.ts
│   │   ├── useCalendar.ts
│   │   ├── useCamera.ts
│   │   ├── useMissionProgress.ts
│   │   ├── useProfile.ts
│   │   ├── useActivityFeed.ts
│   │   ├── useAchievementUnlock.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── usePopupDismissal.ts
│   │   ├── use-toast.ts
│   │   └── use-mobile.ts
│   ├── lib/                 # Pure utility/validation functions
│   │   ├── __tests__/
│   │   ├── plantValidation.ts
│   │   └── utils.ts
│   ├── schemas/             # Zod validation schemas
│   │   └── editProfileSchema.ts
│   ├── screens/             # Screen-level page components
│   │   ├── auth/            # loginScreen, registerScreen + tests
│   │   ├── calendar/        # CalendarScreen + tests
│   │   ├── chat/            # ChatScreen
│   │   ├── editProfile/     # EditProfileScreen
│   │   ├── home/            # HomeScreen
│   │   ├── identify/        # CameraScreen, styles, icons
│   │   └── userProfile/     # UserProfile + styles
│   ├── services/            # Business logic and data access layer
│   │   ├── __tests__/       # Service tests
│   │   ├── activityService.ts
│   │   ├── authService.ts
│   │   ├── avatarService.ts
│   │   ├── calendarService.ts
│   │   ├── cameraService.ts
│   │   ├── chatService.ts
│   │   ├── missionService.ts
│   │   ├── obteniblesService.ts
│   │   ├── offlineStorage.ts
│   │   ├── permissionService.ts
│   │   ├── plantCatalogService.ts
│   │   ├── plantIdService.ts
│   │   ├── popupService.ts
│   │   ├── syncService.ts
│   │   ├── userAchievementsService.ts
│   │   ├── userPlantsService.ts
│   │   └── userService.ts
│   ├── styles/              # Themed StyleSheet factories
│   │   └── themedStyles.ts
│   ├── types/               # TypeScript type definitions
│   │   └── chat.ts
│   └── utils/               # Utilities
│       ├── crypto.ts        # End-to-end encryption (tweetnacl)
│       └── storage.ts       # AsyncStorage wrapper
├── screenshots/             # UI screenshots for documentation
├── scripts/                 # Helper scripts
│   └── seedUser.js
├── app.json                 # Expo configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript config
├── render.yaml              # Render deployment config
└── serviceAccountKey.json   # Firebase admin SDK key
```

## Directory Purposes

**`app/`:**
- Purpose: Expo Router file-based routing — every `.tsx` file becomes a route
- Contains: Thin route files (usually 1-5 lines re-exporting a screen) plus `_layout.tsx` (91 lines, the root orchestrator)
- Key files: `_layout.tsx` (auth, nav, sync orchestration), `index.tsx` (home), `explore.tsx` (531 lines, catalog with search/filter), `identify.tsx` (207 lines, identification flow), `journal.tsx` (282 lines, calendar + missions + achievements), `companionPlant.tsx` (288 lines, plant detail)

**`src/screens/`:**
- Purpose: Page-level components — one file per screen feature
- Contains: Each subdirectory has a main screen component, optional `__tests__/` folder, and optional `*.styles.ts` files
- Key files: `home/HomeScreen.tsx` (236 lines), `auth/loginScreen.tsx`, `auth/registerScreen.tsx`, `identify/CameraScreen.tsx`, `userProfile/UserProfile.tsx`, `calendar/CalendarScreen.tsx`, `chat/ChatScreen.tsx`

**`src/components/`:**
- Purpose: Reusable visual components organized by domain
- Contains: 7 subdirectories + 1 root component
- `ui/` — 59 shadcn-style primitive components (button, card, badge, dialog, sheet, input, select, tabs, etc.)
- `home/` — 11 components (HomeHeader, StatsBar, DailyMissions, WeeklyMissions, PlantOfTheDay, LastIdentified, UserProgress, HomeTimeline, TipCard, WeeklyCalendarCard, RecentAchievement)
- `profile/` — 10 components (ProfileHero, ProfileAbout, PlantCollection, Achievements, ActivityFeed, ProfileVitrina, CompanionPlantCard, BottomNav + style files)
- `chat/` — 3 components (ChatBubble, ChatFab, ChatInput)
- `forms/` — 2 components (InputField, ChipSelector)
- `calendar/` — 1 component (JournalCalendarSection)
- `screenWrapper/` — ScreenWrapper.tsx + styles

**`src/services/`:**
- Purpose: Data access, business logic, API calls — the thickest architectural layer
- Contains: 17 service modules (16 named + `__tests__/`)
- Key files: `userService.ts` (354 lines, Firestore CRUD for user profile), `missionService.ts` (579 lines, daily/weekly mission logic), `chatService.ts` (275 lines, REST + WebSocket client), `offlineStorage.ts` (66 lines, AsyncStorage cache + sync queue), `syncService.ts` (71 lines, auto-sync on reconnect), `authService.ts` (81 lines, Firebase Auth wrapper), `plantIdService.ts` (117 lines, Plant.id API proxy), `plantCatalogService.ts` (44 lines, Firestore catalog), `activityService.ts` (153 lines, activity feed), `userPlantsService.ts`, `calendarService.ts`, `popupService.ts`, `permissionService.ts`, `cameraService.ts`, `avatarService.ts`, `userAchievementsService.ts`, `obteniblesService.ts`

**`src/hooks/`:**
- Purpose: Custom React hooks that wrap service calls with state management
- Contains: 11 hooks (+ `__tests__/`)
- Key files: `useCalendar.ts` (109 lines, wraps calendarService with events CRUD + derived state), `useMissionProgress.ts`, `useProfile.ts`, `useActivityFeed.ts`, `useAchievementUnlock.ts`, `useNetworkStatus.ts`, `usePopupDismissal.ts`, `useCamera.ts`, `useAuth.ts` (placeholder), `use-toast.ts`, `use-mobile.ts`

**`src/constants/`:**
- Purpose: Static configuration, design tokens, mission/achievement/item definitions
- Contains: 5 files
- No runtime dependencies — pure data exports

**`src/styles/`:**
- Purpose: Centralized theming with component-specific StyleSheet factories
- Contains: Single 1761-line file `themedStyles.ts` with factories for 19 component groups + `useThemedStyles` hook

**`backend/`:**
- Purpose: Server-side code — Node.js Express proxy and Python FastAPI chat server
- Contains: `index.js` (84 lines, Express with `/api/identify` proxy to Plant.id API), `chat/` directory with full FastAPI app

**`backend/chat/`:**
- Purpose: Real-time chat backend (FastAPI + WebSockets)
- Contains: `main.py` (Uvicorn entry), `app/models.py` (Pydantic models), `app/config.py` (settings), `app/connection_manager.py` (WebSocket connections), `app/routes/` (API handlers), `app/services/` (business logic)

**`src/config/`:**
- Purpose: Firebase initialization (firebaseConfig with apiKey, authDomain, etc.)
- Contains: Single `firebase.js` (23 lines)

**`src/utils/`:**
- Purpose: Utility functions and crypto module
- Contains: `crypto.ts` (end-to-end encryption with tweetnacl), `storage.ts` (AsyncStorage helpers)

**`src/types/`:**
- Purpose: TypeScript type definitions shared across modules
- Contains: `chat.ts` (77 lines, all chat-related types)

## Key File Locations

**Entry Points:**
- `app/_layout.tsx`: Root layout — auth listener, routing, nav bar, sync status, toast
- `app/index.tsx`: Home screen (default route)
- `backend/index.js`: Express API server (port 3000)
- `backend/chat/main.py`: FastAPI chat server

**Configuration:**
- `app.json`: Expo project configuration (plugins, splash, icons, permissions)
- `tsconfig.json`: TypeScript config with `@/*` path alias mapping to root
- `package.json`: Scripts (`start`, `android`, `ios`, `web`, `test`, `lint`), dependencies
- `backend/package.json`: Express backend dependencies
- `backend/.env.example`: Environment variable template
- `render.yaml`: Render.com deployment
- `backend/chat/render.yaml`: Chat backend deployment config

**Core Logic:**
- `src/services/userService.ts`: User profile CRUD, watering activity, streak tracking
- `src/services/missionService.ts`: Mission assignment, progress tracking, claiming logic (579 lines — largest service)
- `src/services/authService.ts`: Firebase auth wrapper (login, register, logout, password reset)
- `src/services/chatService.ts`: Chat REST + WebSocket client (ChatRestClient, ChatWebSocketManager classes)
- `src/services/plantIdService.ts`: Plant identification via backend API proxy
- `src/services/syncService.ts`: Auto-sync on network reconnection
- `src/services/offlineStorage.ts`: Offline cache and sync queue
- `src/hooks/useCalendar.ts`: Calendar events CRUD with state management
- `src/styles/themedStyles.ts`: Themed style factories and hook (1761 lines — largest file)

**Testing:**
- `src/services/__tests__/`: `activityService.test.ts`, `missionService.test.ts`
- `src/hooks/__tests__/`: `useMissionProgress.test.ts`
- `src/lib/__tests__/`: `plantValidation.test.ts`
- `src/screens/auth/__tests__/`: Auth screen tests
- `src/screens/calendar/__tests__/`: Calendar screen tests

## Naming Conventions

**Files:**
- **React components (default exports):** PascalCase — `HomeScreen.tsx`, `DailyMissions.tsx`, `ScreenWrapper.tsx`
- **Services (named exports):** camelCase with `Service` suffix — `authService.ts`, `userService.ts`, `syncService.ts`
- **Hooks:** camelCase with `use` prefix — `useAuth.ts`, `useCalendar.ts`, `useMissionProgress.ts`
- **Types:** camelCase — `chat.ts`, `editProfileSchema.ts`
- **Configuration:** camelCase — `firebase.js`
- **Styles:** dot-separated `*.styles.ts` — `ScreenWrapper.styles.ts`, `ProfileHero.styles.ts`, `CameraScreen.styles.ts`
- **Test files:** dot-separated `*.test.ts` — `activityService.test.ts`, `plantValidation.test.ts`
- **Route files (in `app/`):** kebab-case or single word — `_layout.tsx`, `editProfile.tsx`, `companionPlant.tsx`
- **Dynamic routes:** `[id].tsx` bracket syntax — `app/plant/[id].tsx`

**Directories:**
- **Feature directories:** camelCase — `screenWrapper/`, `editProfile/`, `userProfile/`
- **Layer directories:** lowercase single word — `services/`, `hooks/`, `components/`, `screens/`, `constants/`, `utils/`, `types/`, `schemas/`, `config/`, `lib/`, `styles/`

**Functions:**
- **Service functions:** camelCase descriptive verbs — `getAllPlants()`, `getUserProfile()`, `logWateringActivity()`, `identifyPlant()`
- **Component functions:** PascalCase — `HomeScreen()`, `DailyMissions()`, `PlantCard()`, `SkeletonGrid()`
- **Helper functions:** camelCase — `toDateStr()`, `safeParseDate()`, `formatRelativeTime()`, `mapAuthError()`

**Types & Interfaces:**
- Interfaces: PascalCase with descriptive names — `UserProfile`, `CatalogPlant`, `ChatMessage`, `MissionDefinition`, `AppTheme`
- Type aliases: PascalCase — `MissionDisplay`, `SyncStatus`, `WsEvent`, `PlantValidationResult`
- Export enums: PascalCase const objects with `as const`

## Where to Add New Code

**New Feature (e.g., new screen):**
1. Create screen component: `src/screens/{featureName}/{FeatureName}Screen.tsx`
2. Create route: `app/{featureName}.tsx` — re-export screen component
3. Add route to `app/_layout.tsx` Stack.Screen list
4. If needed, add service logic: `src/services/{featureName}Service.ts`
5. If needed, add custom hook: `src/hooks/use{FeatureName}.ts`
6. Add UI widgets: `src/components/{featureName}/`

**New Component:**
- **Feature-specific component:** `src/components/{feature}/{ComponentName}.tsx`
- **Generic/primitive UI component:** `src/components/ui/{componentName}.tsx` (among the 59 existing shadcn-style components)
- **Screen wrapper/structural:** `src/components/screenWrapper/`

**New Service:**
- Add file to `src/services/{serviceName}.ts`
- Use named exports for functions
- Import Firebase via `@/src/config/firebase`
- Follow existing patterns: try/catch with `console.error`, return defaults on error

**New Hook:**
- Add file to `src/hooks/use{FeatureName}.ts`
- Wrap service functions with React state (loading/error/data pattern)
- Export as a hook function

**New Utility Function:**
- **Domain-specific validation:** `src/lib/`
- **Zod schema:** `src/schemas/`
- **Generic utility:** `src/lib/utils.ts`
- **Crypto/storage:** `src/utils/`

**New Constant/Data:**
- **Design tokens:** Add to `src/constants/theme.ts` or `src/constants/designSystem.ts`
- **Mission/achievement/item definitions:** Add to `src/constants/missionsData.ts`, `userAchievementsService.ts`, or `obteniblesData.ts`

**New Tests:**
- **Service tests:** `src/services/__tests__/{serviceName}.test.ts`
- **Hook tests:** `src/hooks/__tests__/use{FeatureName}.test.ts`
- **Screen tests:** `src/screens/{featureName}/__tests__/`
- **Lib tests:** `src/lib/__tests__/`

**New Backend Endpoint:**
- **Plant ID proxy:** Add route in `backend/index.js` (Express)
- **Chat:** Add route in `backend/chat/app/routes/` (FastAPI)

## Special Directories

**`assets/images/`:**
- Purpose: Static images for app icon, splash screen, and logos
- Generated: No
- Committed: Yes

**`.planning/`:**
- Purpose: GSD project management artifacts (roadmap, state, research, phases)
- Generated: Yes (by GSD workflow)
- Committed: Yes

**`screenshots/`:**
- Purpose: UI screenshots used for documentation/reference
- Generated: No
- Committed: Yes

**`backend/chat/`:**
- Purpose: Independent Python FastAPI service for real-time chat (WebSocket + REST)
- Has its own `requirements.txt`, `render.yaml`, `.env`
- Structure: FastAPI app pattern with `app/__init__.py`, `app/config.py`, `app/models.py`, `app/routes/`, `app/services/`

---

*Structure analysis: 2026-06-10*
