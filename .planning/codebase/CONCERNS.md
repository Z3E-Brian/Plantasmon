# Codebase Concerns

**Analysis Date:** 2026-06-10

## Tech Debt

### Widespread use of `any` types throughout services
- Issue: Over 79 instances of `any` type annotations across the TypeScript codebase, particularly in data transformation and mapping logic. This defeats TypeScript's type-checking benefits and makes refactoring hazardous.
- Files: `src/services/userPlantsService.ts` (lines 71, 81, 103, 147, 169, 190, 263, 389, 412), `src/services/missionService.ts` (lines 176, 194, 245, 261, 282, 295, 341, 363, 421, 425, 471, 475, 544, 557, 564), `src/services/userService.ts` (lines 57, 76, 152), `src/services/userAchievementsService.ts` (lines 410, 421, 452, 512), `src/services/activityService.ts` (lines 42, 147), `src/services/plantIdService.ts` (lines 40, 86), `src/services/offlineStorage.ts` (line 8), `src/services/calendarService.ts` (lines 156, 158), `src/services/authService.ts` (lines 18, 30, 41, 52), `src/screens/auth/loginScreen.tsx` (lines 68, 94, 111), `src/screens/auth/registerScreen.tsx` (line 58), `src/screens/identify/CameraScreen.tsx` (line 43)
- Impact: No type safety on data flows; silent `undefined` crashes possible; difficult to understand data shapes; IDE autocomplete degraded.
- Fix approach: Replace `any` with proper interfaces or generics. Prioritize `userPlantsService.ts` and `missionService.ts` where data structures are most complex.

### Circular dependency workaround with inline `require()`
- Issue: Multiple services import each other circularly and use dynamic `require()` inside functions (bypassing ES module imports) with eslint-disable comments. This works at runtime but breaks static analysis, tree-shaking, and type checking.
- Files: `src/services/userService.ts` (lines 173-174, 235-236, 280-281), `src/services/userPlantsService.ts` (lines 339-340), `src/services/userAchievementsService.ts` (lines 41-42), `src/services/missionService.ts` (lines 504-505)
- Impact: Cannot detect import errors at build time; circular dependency indicates poor separation of concerns; all suppressed with `// eslint-disable-next-line @typescript-eslint/no-var-requires`.
- Fix approach: Extract shared types/events into a separate module that both services import, or use dependency injection. The `activityService.logActivity()` is the main culprit — called from 4 different services.

### Excessive `console.log`/`console.warn`/`console.error` statements
- Issue: Over 113 console logging statements scattered across all services and screens. These are a mix of debug logging, error reporting, and informational messages with no structured logging approach. Many use Spanish text, making them inconsistent with potential tooling.
- Files: Throughout `src/services/` (especially `userService.ts`, `missionService.ts`, `userPlantsService.ts`, `chatService.ts`), `src/screens/` (especially `ChatScreen.tsx`, `HomeScreen.tsx`), `src/hooks/useAchievementUnlock.ts`, `app/_layout.tsx`
- Impact: Spams Metro bundler console in development; no log levels (error vs debug); sensitive data could leak in production builds if not stripped; no remote logging infrastructure.
- Fix approach: Implement a structured logger (e.g., `loglevel` or a custom wrapper) with level-based filtering. Strip debug logs in production builds via babel plugin.

### Hardcoded fallback image URLs with external CDNs
- Issue: Fallback plant images use hardcoded URLs from `picsum.photos` and `images.unsplash.com`. If these services change their URL scheme or go down, plant images will break silently.
- Files: `src/services/userPlantsService.ts` (lines 119, 427), `src/constants/data.ts` (lines 37, 49, 61, 73, 85, 97, 199)
- Impact: Visual breakage — users see broken image placeholders. No graceful fallback chain.
- Fix approach: Use local placeholder images as final fallback, or upload a default image to Firebase Storage and reference by download URL.

### Hardcoded API URLs in source code
- Issue: External API URLs for the chat backend and plant identification service are hardcoded directly in source files, not configurable via environment variables.
- Files: `src/services/plantIdService.ts` (line 1: `const API_URL = 'https://plantasmon.onrender.com'`), `src/services/chatService.ts` (line 10: `const CHAT_API_URL = "https://chat-backend-4nzg.onrender.com"`), `app/_layout.tsx` (line 47: `process.env.EXPO_PUBLIC_API_URL || "https://plantasmon.onrender.com"`)
- Impact: Cannot point to different environments (staging, dev, local) without code changes. Accidentally committing a changed URL affects all developers.
- Fix approach: Move all API URLs to `EXPO_PUBLIC_*` environment variables in `.env` files with sensible defaults in config constants.

### Massive monolithic style file
- Issue: `src/styles/themedStyles.ts` is 1736 lines long, containing all component styles in a single file. This makes it hard to maintain, diff, or review changes.
- Files: `src/styles/themedStyles.ts` (1736 lines)
- Impact: Poor developer experience; merge conflicts are likely; any style change touches a huge file; hard to find specific component styles.
- Fix approach: Split styles into component-specific files (most already exist in `*.styles.ts` pattern) and remove their definitions from the mega-file, or use CSS-in-JS co-located with components.

### Large service files with multiple responsibilities
- Issue: Several service files exceed 300 lines and handle multiple concerns: data fetching, data transformation, business logic, and Firestore operations mixed together.
- Files: `src/services/userAchievementsService.ts` (549 lines), `src/services/missionService.ts` (491 lines), `src/services/userPlantsService.ts` (383 lines), `src/services/userService.ts` (315 lines)
- Impact: Hard to test, reason about, and refactor. Single Responsibility Principle violated.
- Fix approach: Split into smaller modules by concern (e.g., data access vs business logic vs transformation helpers).

### Redundant Firebase config duplication
- Issue: The Firebase configuration object is duplicated in `scripts/seedUser.js`, creating a maintenance burden when credentials change.
- Files: `src/config/firebase.js` (lines 7-14), `scripts/seedUser.js` (lines 4-11)
- Impact: API key rotation requires updating two files; risk of one copy getting out of sync.
- Fix approach: Import the config from a shared module or load from environment variables in the seed script.

### Unused UI components from shadcn/ui template
- Issue: Many complex UI components appear to be from a web-focused shadcn/ui template (sidebar, menubar, context-menu, dropdown-menu, etc.) that may not be used in the mobile app.
- Files: `src/components/ui/sidebar.tsx` (672 lines), `src/components/ui/menubar.tsx` (244 lines), `src/components/ui/context-menu.tsx` (223 lines), `src/components/ui/dropdown-menu.tsx` (230 lines), `src/components/ui/chart.tsx` (316 lines), and ~40 other `.tsx` files in `src/components/ui/`
- Impact: Bloats the bundle with dead code; increases maintenance surface; distracts from actual mobile UI patterns.
- Fix approach: Audit and remove unused UI components. Keep only those referenced in app screens.

### Placeholder `expo-env.d.ts` committed to git
- Issue: The generated `expo-env.d.ts` file is committed to git despite being listed in `.gitignore`. This file is auto-generated by Expo and can cause confusion.
- Files: `expo-env.d.ts` (in gitignore but tracked in git)
- Impact: Conflicts when switching branches with different Expo SDK versions; generated file pollutes git history.
- Fix approach: Remove from git tracking with `git rm --cached expo-env.d.ts`.

---

## Known Bugs

### Streak calculation in `getUserProfile` is unreliable
- Symptoms: The streak logic in profile loading checks `diffDays === 0` and `diffDays === 1` and handles both the same way (returning existing streak), but when `diffDays === 1`, the streak should already have been incremented by `logWateringActivity`. If the user visits their profile before watering today, the streak may show stale data.
- Files: `src/services/userService.ts` (lines 80-94)
- Trigger: Viewing profile after midnight before watering on the new day.
- Workaround: Water a plant to trigger the streak update in `logWateringActivity`.

### No input size validation for Base64 images on backend
- Symptoms: The Express backend accepts up to 10mb JSON bodies but does not validate Base64 image size before forwarding to Plant.id API. Large images cause upstream rejection or timeout.
- Files: `backend/index.js` (line 9: `express.json({ limit: '10mb' })`, lines 18-79 lack image size validation)
- Trigger: Uploading a very large photo (high resolution) for plant identification.
- Workaround: None — the request silently fails or times out. Users may not know why.

### Chat fallback to plaintext when group key is missing
- Symptoms: When the chat backend has no `group_encryption_key` configured, the frontend logs `[Chat] No group key, sending plaintext` and sends unencrypted messages to the group.
- Files: `src/screens/chat/ChatScreen.tsx` (lines 251-258), `backend/chat/app/config.py` (line 16: `group_encryption_key: str = ""`)
- Trigger: Chat backend deployed without setting `group_encryption_key` environment variable.
- Workaround: Set the environment variable before deploying. Messages are still sent functionally, just without group encryption.

### `CalendarScreen.test.tsx` mock prevents Calendar from actually rendering
- Symptoms: The Calendar component mock in CalendarScreen tests only renders a placeholder `<Text>Calendar</Text>` instead of the real component. Tests verify the placeholder text exists but never validate real calendar behavior.
- Files: `src/screens/calendar/__tests__/CalendarScreen.test.tsx` (lines 45-63)
- Trigger: Running the test suite — these tests pass but provide no meaningful coverage.
- Workaround: None — the mock is too aggressive. Tests should use a lightweight Calendar mock that preserves real behavior (day press, marking).

---

## Security Considerations

### Firebase API key and credentials exposed in source code
- Risk: The Firebase API key (`AIzaSyB1Xj_H9WcB3Ld8NqwWTKDXE1t53H-CTks`), auth domain, project ID, and app ID are hardcoded in `src/config/firebase.js` and duplicated in `scripts/seedUser.js`. While Firebase API keys are somewhat public by design (they identify the project to Firebase services), exposing them alongside Firebase config makes it easier for attackers to target the project with abusive requests.
- Files: `src/config/firebase.js` (lines 7-14), `scripts/seedUser.js` (lines 4-11)
- Current mitigation: Firebase Security Rules (if configured properly) restrict data access — the API key alone is insufficient for unauthorized data access.
- Recommendations: Move all Firebase config to environment variables (`EXPO_PUBLIC_FIREBASE_*`) loaded at build time. Remove the duplicate in `scripts/seedUser.js` by having the script read from environment variables.

### `credentials.txt` tracked in git
- Risk: A file named `credentials.txt` exists in the repository root and is tracked by git (`git ls-files credentials.txt` confirms it). This likely contains sensitive credentials.
- Files: `credentials.txt` (tracked in git)
- Current mitigation: The filename suggests it may contain credentials. Its contents were NOT read in this analysis per policy.
- Recommendations: Immediately add `credentials.txt` to `.gitignore`. Use `git rm --cached credentials.txt` to remove from tracking. Rotate any credentials it contained. Move to environment variables or a secrets manager.

### `serviceAccountKey.json` present on disk
- Risk: A Firebase service account key JSON file exists in the project root. While it's gitignored (`serviceAccountKey.json` in `.gitignore`), its presence on disk for all developers poses a risk of accidental exposure (screenshots, sharing, backups, etc.).
- Files: `serviceAccountKey.json` (present on disk, gitignored)
- Current mitigation: Listed in `.gitignore` so it won't be committed. Not tracked in git.
- Recommendations: Move the file outside the project directory entirely. Use a path reference or environment variable to locate it. Ensure `.gitignore` has no exceptions (e.g., `!serviceAccountKey.json`) that could accidentally include it.

### CORS wide open on Express backend
- Risk: The Express backend enables CORS with no origin restrictions (`app.use(cors())` defaults to `*`), and binds to `0.0.0.0`, accepting connections from any IP.
- Files: `backend/index.js` (line 8: `app.use(cors())`, line 81: `app.listen(PORT, '0.0.0.0', ...)`)
- Current mitigation: The API key check for Plant.id provides basic protection, but the `/api/identify` endpoint is accessible to any website that discovers the URL.
- Recommendations: Restrict CORS to the specific frontend origin(s). Remove the `0.0.0.0` binding if not needed, or add IP whitelisting.

### Chat backend `allowed_origins` defaults to wildcard
- Risk: The Python chat FastAPI backend has `allowed_origins: str = "*"` in its settings, meaning CORS is unrestricted.
- Files: `backend/chat/app/config.py` (line 6: `allowed_origins: str = "*"`)
- Current mitigation: WebSocket connections require a valid JWT token, providing some protection.
- Recommendations: Set `allowed_origins` to the specific frontend origin in production environment variables.

### No rate limiting on auth endpoints or plant ID API
- Risk: Firebase authentication endpoints are called directly from the frontend (Firebase SDK handles rate limiting server-side), but the backend `/api/identify` endpoint has no rate limiting. A malicious actor could exhaust the Plant.id API quota.
- Files: `backend/index.js` (lines 18-79) — no rate limiting middleware
- Current mitigation: None.
- Recommendations: Add `express-rate-limit` middleware to the backend, especially for the `/api/identify` endpoint which consumes a third-party paid API.

---

## Performance Bottlenecks

### Unnecessary Firestore reads in `getUserPlants`
- Problem: For each user plant, the function issues a separate `getDoc` call to the `plants` catalog collection. This causes N+1 reads per user loading, where N is the number of plants owned by the user.
- Files: `src/services/userPlantsService.ts` (lines 102-129)
- Cause: Plant catalog data is fetched individually per plant ID instead of batched or cached.
- Improvement path: Use `getDocs` with `in` query (limited to 10 per batch) to fetch all referenced plants in parallel. Cache catalog data locally. Pre-join plant details in the user document to avoid catalog lookups entirely.

### Sync service fetches entire queue and processes sequentially
- Problem: The `processSyncQueue` function reads the entire offline queue into memory and processes items one-at-a-time in a serial loop. If one item fails, the entire sync stops.
- Files: `src/services/syncService.ts` (lines 29-62)
- Cause: Naive for-loop pattern with early return on first error.
- Improvement path: Process items with a concurrency limit (e.g., 3 parallel). Skip failed items instead of aborting. Add exponential backoff for retries.

### Large Base64 image transfers from device to backend
- Problem: Plant identification sends full-resolution Base64 images to the backend over the network. A single photo can be 3-5MB as Base64, causing slow uploads and high bandwidth usage.
- Files: `src/services/plantIdService.ts` (lines 21-27)
- Cause: No image compression or resizing before upload on the client side.
- Improvement path: Resize images to 1024px max dimension and compress to JPEG 0.7 quality before converting to Base64. This typically reduces payload by 80-90%.

### No Firestore query pagination in activity service
- Problem: `getUserActivities` and `getRecentActivities` fetch all matching documents without pagination for large result sets. The frontend only displays a limited number, but the query retrieves everything.
- Files: `src/services/activityService.ts` (lines 76-141)
- Cause: `limit()` is applied but `startAfter()` cursor-based pagination is not used, so the query always reads the first N documents even if more exist.
- Improvement path: Implement cursor-based pagination using Firestore's `startAfter()` with the last visible document.

---

## Fragile Areas

### Chat backend state is entirely in-memory
- Files: `backend/chat/app/connection_manager.py` (lines 17-26)
- Why fragile: All chat state — users, messages, DMs, read receipts, expiry tasks — lives in Python in-memory data structures. Any server restart, crash, or scale-out wipes all data. Multiple instances cannot share state.
- Safe modification: Adding persistence requires a database (Redis, SQLite, or PostgreSQL). The `save_group_message` and `save_dm_message` methods would need to write to DB first, then cache in memory for fast access.
- Test coverage: No tests found for `connection_manager.py`.

### Inline `require()` for circular dependency resolution
- Files: `src/services/userService.ts`, `src/services/userPlantsService.ts`, `src/services/userAchievementsService.ts`, `src/services/missionService.ts`
- Why fragile: The dynamic `require()` pattern is a code smell that hides a circular dependency chain. If the import order ever changes or Metro bundler processes modules differently, these could break at runtime with cryptic errors. The `require()` is suppressed with eslint-disable, so linting won't catch related issues.
- Safe modification: Before adding new imports to any of these services, verify that the circular dependency chain is not worsened. Prefer extracting shared logic into a new module.
- Test coverage: Only `activityService.test.ts` and `missionService.test.ts` have tests among these files.

### Backend Express.js with no input sanitization or validation
- Files: `backend/index.js` (lines 18-79)
- Why fragile: The only validation is checking `images.length > 0`. No validation on image format, size, content type. No request body schema validation. Malformed requests could crash the server or cause unexpected behavior.
- Safe modification: Use a validation library (Zod, Joi, or express-validator) to validate request body shape and types. Add try/catch around JSON.parse-like operations.
- Test coverage: No backend tests exist.

### Sync service race condition with multiple sync triggers
- Files: `src/services/syncService.ts` (lines 29-62)
- Why fragile: The `isSyncing` boolean guard can race if `processSyncQueue` is called while already syncing (it returns early). But the setup in `_layout.tsx` via `setupAutoSync` registers a NetInfo listener that fires on every connectivity change. If connectivity rapidly toggles, the sync could be skipped or lost.
- Safe modification: Add a proper queue with mutex, or use a state machine for sync lifecycle (idle → syncing → complete/error).
- Test coverage: No tests found for `syncService.ts`.

### Hardcoded `apiKey` in `firebase.js` duplicated across files
- Files: `src/config/firebase.js`, `scripts/seedUser.js`
- Why fragile: If the Firebase project is rotated or a new project is used, the API key and other config must be updated in every file that hardcodes it. Missing one update could break authentication or Firestore access silently.
- Safe modification: Centralize Firebase config into a single config module imported everywhere. Use environment variables for the values.
- Test coverage: None of these are tested.

---

## Scaling Limits

### Chat backend memory-bound user storage
- Current capacity: Limited by available RAM (typically 512MB-1GB on free Render tier). Each user and message object adds overhead.
- Limit: At ~1000 concurrent users with ~100 group messages each, memory usage could exceed several hundred MB. Chat messages are never pruned except for TTL-expired ones.
- Scaling path: Add Redis for shared state across instances and PostgreSQL/SQLite for message persistence. This would also enable horizontal scaling.

### Plant.id API quota on free tier
- Current capacity: Plant.id API has a free tier with limited daily identifications (typically 100-500/day depending on plan).
- Limit: Once daily quota is exhausted, all identification requests fail with 429 or 403 until the next day.
- Scaling path: Implement response caching for repeated identifications of the same species. Add a queue system to prioritize requests. Monitor API usage via the backend analytics. Upgrade to a paid tier when user base grows.

### Firestore read quota for Firestore (Spark plan)
- Current capacity: Firebase Spark (free) plan allows 50K reads/day, 20K writes/day, 20K deletes/day.
- Limit: Each home screen load triggers up to 10+ reads (user profile, missions, achievements, plants, catalog lookups) per user. With 100 daily active users, that's 1000+ reads just for home screens.
- Scaling path: Implement aggressive caching with AsyncStorage for static data (catalog plants, mission definitions). Reduce Firestore reads by computing derived stats on the client. Upgrade to Blaze (pay-as-you-go) when thresholds are reached.

---

## Dependencies at Risk

### `react-native-calendars` — large external dependency for simple calendar
- Risk: This package is a heavy dependency (~400KB) used only for a simple calendar view on one screen. It has known performance issues and a complex API.
- Impact: Increases bundle size and build time. The library's full Calendar component is imported but only basic functionality is used.
- Migration plan: Replace with `expo-calendar` (native calendar API) or a lightweight custom calendar component (under 50 lines).

### `react-native-toast-message` — duplicate toast functionality
- Risk: The app depends on `react-native-toast-message` (line 57 of package.json), but also has a custom `InfoBottomSheet` component and `sonner.tsx` toast component from shadcn/ui. Having multiple toast/notification systems is redundant.
- Impact: Confusion about which toast system to use. Unnecessary bundle size.
- Migration plan: Choose one toast solution and remove the others. The custom `InfoBottomSheet` is well-integrated and preferred for consistency.

### `tweetnacl` + `@stablelib/*` for encryption — fundamental to chat E2E
- Risk: These packages handle the core E2E encryption for the chat feature. If either package has a security vulnerability, all chat messages are compromised. The encryption scheme uses `nacl.box` (Curve25519-XSalsa20-Poly1305) which is well-audited, but the implementation is custom and hasn't been reviewed.
- Impact: Chat confidentiality depends entirely on these libraries and the custom implementation in `src/utils/crypto.ts`.
- Migration plan: Consider using `libsodium.js` (via `react-native-sodium`) for a more widely-audited implementation, or keep `tweetnacl` but have the implementation formally reviewed.

---

## Missing Critical Features

### No structured error tracking/monitoring
- Problem: The app has no error tracking service (Sentry, Crashlytics, etc.). All errors are logged to console and silently swallowed. Production crashes are invisible to developers.
- Blocks: Identifying and fixing production bugs. Understanding crash rates and user-impacting issues.

### No automated CI pipeline
- Problem: There are no CI configuration files (GitHub Actions, CircleCI, etc.) found in the repository. Tests must be run manually.
- Blocks: Preventing regressions when merging PRs. Enforcing test quality gates. Automated linting and type checking.

### No Firestore security rules visible in repository
- Problem: No Firestore security rules file (`firestore.rules`) was found in the repository. These rules control data access and are critical for preventing unauthorized data access.
- Blocks: Security audit. The app relies entirely on Firebase Security Rules to protect user data since the API key is public.

---

## Test Coverage Gaps

### `userPlantsService.ts` — zero test coverage
- What's not tested: All plant CRUD operations (add, update, delete, toggle favorite, set companion, upload image). This is the most heavily used service.
- Files: `src/services/userPlantsService.ts` (383 lines)
- Risk: Adding/changing plant management logic could silently break the home screen, profile, and plant detail screens.
- Priority: High

### `userService.ts` — zero test coverage
- What's not tested: User profile loading, settings updates, watering activity logging, streak logic, user document creation.
- Files: `src/services/userService.ts` (315 lines)
- Risk: The streak calculation has logic bugs as noted above. Profile display could break or show stale data.
- Priority: High

### `chatService.ts` and `ChatScreen.tsx` — zero test coverage
- What's not tested: WebSocket connection management, message encryption/decryption, reconnection logic, chat UI states.
- Files: `src/services/chatService.ts` (241 lines), `src/screens/chat/ChatScreen.tsx` (423 lines)
- Risk: Chat is a complex feature with encryption, WebSocket state machine, and multiple UI states. Failures cause silent data loss (messages not sent/displayed).
- Priority: High

### `syncService.ts` — zero test coverage
- What's not tested: Offline sync queue processing, auto-sync on connectivity change, progress tracking.
- Files: `src/services/syncService.ts` (71 lines)
- Risk: Offline data could be lost without syncing. Race conditions in sync could cause duplicate or lost entries.
- Priority: Medium

### `backend/index.js` — zero test coverage
- What's not tested: Plant identification endpoint, API key validation, image processing, upstream error handling.
- Files: `backend/index.js` (84 lines)
- Risk: Backend failures are opaque to the frontend (just "Identification failed" errors). Changes to the backend are untested.
- Priority: Medium

### `backend/chat/` — zero test coverage
- What's not tested: WebSocket message handling, JWT auth, connection management, message expiry, moderation, Cloudinary integration.
- Files: All Python files in `backend/chat/`
- Risk: Chat backend is a critical service with complex async logic. No regression protection.
- Priority: Medium

---

*Concerns audit: 2026-06-10*
