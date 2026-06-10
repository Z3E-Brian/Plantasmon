# External Integrations

**Analysis Date:** 2026-06-10

## APIs & External Services

**Plant Identification:**
- **Plant.id API** — Used for plant species identification from photos
  - Endpoint: `https://api.plant.id/v3/identification`
  - SDK/Client: Direct HTTPS via `fetch()` in `backend/index.js`
  - Auth: API key passed as `Api-Key` header from `PLANT_API_KEY` env var
  - Proxied through the PlantasMon Express backend at `/api/identify` to hide API key from the client
  - Image format: Base64-encoded images, optionally with latitude/longitude metadata
  - Frontend-accessible URL: `https://plantasmon.onrender.com` (configured in `src/services/plantIdService.ts`)

**Chat Backend:**
- **Custom FastAPI Chat Service** — Real-time chat with WebSockets, E2E encryption, and media sharing
  - REST endpoints: `POST /api/chat/join`, `POST /api/chat/logout`, `GET /api/chat/users`, `GET /api/chat/messages`, `POST /api/chat/messages`, `GET /api/chat/messages/dm/{other_id}`, `PUT /api/chat/users/me/public-key`
  - WebSocket endpoint: `/ws/{token}` (auto-upgrade via `http` to `ws` URL replacement)
  - Base URL: `https://chat-backend-4nzg.onrender.com` (configured in `src/services/chatService.ts`)
  - Auth: Bearer token (JWT-based, issued on join)
  - Support for TTL-based ephemeral messages, read receipts, typing indicators
  - Profanity filtering via `spanlp` library

**Media Storage (Chat):**
- **Cloudinary API** — File upload and CDN for chat media attachments
  - Library: `cloudinary` Python SDK >=1.40.0 (in `backend/chat/app/services/cloudinary_service.py`)
  - Credentials: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (from env)
  - Supported types: images (jpeg, png, webp, gif, heic), video (mp4, quicktime, webm), raw documents
  - Max upload: 10 MB (configurable via env)
  - Files stored in `chat/{user_id}/` folder structure

## Data Storage

**Primary Database:**
- **Firebase Firestore** — NoSQL document database
  - Firebase Project ID: `plantasmon-32e0b`
  - Client: `firebase/firestore` via `src/config/firebase.js`
  - Collections used:
    - `users/{uid}` — User profiles, settings, stats, missions, plant collection, obtained items, achievements
    - `users/{uid}/calendarEvents/` — Calendar events (watering, fertilizing, etc.)
    - `users/{uid}/activities/` — User activity feed
    - `plants/{plantId}` — Plant catalog/reference data
    - `missions/` — Mission definitions (daily/weekly)
    - `achievements/` — Achievement definitions
    - `obtenibles/` — Collectible item definitions

**File Storage:**
- **Firebase Storage** — For plant images and user avatars
  - Bucket: `plantasmon-32e0b.firebasestorage.app`
  - Plant images stored at `plants/{plantId}/image.jpg`
  - Avatar images stored at `avatars/{uid}`
  - Client: `firebase/storage` via `src/config/firebase.js`
  - Used in `src/services/userPlantsService.ts` (plant image upload) and `src/services/avatarService.ts`

**Caching/Local Storage:**
- **AsyncStorage** (`@react-native-async-storage/async-storage`) — Local key-value persistence
  - Auth state persistence via `getReactNativePersistence(ReactNativeAsyncStorage)` in `src/config/firebase.js`
  - Offline plant cache at key `plantasmon_cache` (`src/services/offlineStorage.ts`)
  - Offline sync queue at key `plantasmon_offline_queue` (`src/services/offlineStorage.ts`)
  - Popup dismissal tracking at `@plantasmon/popup_*` keys (`src/services/popupService.ts`)
- **expo-secure-store** — For secure token storage (available but specific usage not determined from codebase scan)
- **expo-sqlite** — Available for structured local data

## Authentication & Identity

**Auth Provider:**
- **Firebase Authentication** — Primary auth system
  - Initialized in `src/config/firebase.js` with AsyncStorage persistence
  - Supported methods:
    - Email/password (implemented in `src/services/authService.ts`)
    - Google Sign-In (via `expo-auth-session`, exposed in login screen, marked as deprecated in research)
  - Password reset via `sendPasswordResetEmail`
  - Auth state observer via `onAuthStateChanged`
  - Services resolve current user via `auth.currentUser?.uid` (getter in `src/services/userService.ts`)

**Chat Auth:**
- Custom JWT-based auth for the Chat Backend
- Tokens issued on `POST /api/chat/join` and verified via `Authorization: Bearer <token>` header
- Token contains user identity for WebSocket connections

## Monitoring & Observability

**Error Tracking:**
- None detected. No Sentry, Crashlytics, or similar error tracking SDKs in dependencies.

**Logs:**
- `console.log` / `console.warn` / `console.error` throughout all services and frontend code
- No structured logging library in use
- Chat API uses Python `logging` module with basic configuration
- Express backend uses plain `console.log`
- Render platform logs accessible via Render dashboard

## CI/CD & Deployment

**Hosting:**
- **Frontend:** EAS Build (Expo Application Services) for Android/iOS app store builds — configured in `eas.json`
- **Plant ID API:** Render (Node.js web service) — configured in `render.yaml` at project root
  - Region: Ohio (us-east-2)
  - Plan: Free
  - Root directory: `backend/`
  - Health check: `GET /`
  - Requires env var: `PLANT_API_KEY` (sync: false, set manually in Render dashboard)
- **Chat API:** Render (Python web service) — configured in `backend/chat/render.yaml`
  - Plan: Free
  - Build command: `pip install -r requirements.txt`
  - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**CI Pipeline:**
- None detected. No GitHub Actions, CircleCI, or similar CI configuration files found.

## Environment Configuration

**Required env vars (Plant ID API — `backend/.env`):**
- `PLANT_API_KEY` — Plant.id API key (set manually in Render, no default)
- `PORT` — Server port (defaults to 3000)

**Required env vars (Chat API — `backend/chat/.env`):**
- `JWT_SECRET` — Secret for signing JWT tokens
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `GROUP_ENCRYPTION_KEY` — Key for group message encryption
- `PORT` — Server port (defaults to 8002)

**Hardcoded configuration:**
- Firebase config is embedded directly in `src/config/firebase.js` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
- Plant ID API URL hardcoded in `src/services/plantIdService.ts` (`https://plantasmon.onrender.com`)
- Chat API URL hardcoded in `src/services/chatService.ts` (`https://chat-backend-4nzg.onrender.com`)

**Secrets location:**
- Service account key file present at `serviceAccountKey.json` in project root (for Firebase Admin SDK operations)
- Chat backend uses `.env` file at `backend/chat/.env`
- Plant ID backend uses `.env` file at `backend/.env`

## Webhooks & Callbacks

**Incoming:**
- None detected. No webhook endpoint handlers found in the codebase.

**Outgoing:**
- None detected. No outgoing webhook registrations or third-party event subscriptions.

## Offline Strategy

**Offline-First Patterns:**
- Network detection via `@react-native-community/netinfo` (`NetInfo.fetch()`, `NetInfo.addEventListener`)
- Offline sync queue in `src/services/offlineStorage.ts` (queues operations when offline, processes when online)
- Auto-sync setup in `src/services/syncService.ts` (listens for connectivity changes, processes queue)
- Local plant caching in `src/services/offlineStorage.ts` via AsyncStorage
- Popup dismissal state persisted locally via AsyncStorage in `src/services/popupService.ts`

---

*Integration audit: 2026-06-10*
