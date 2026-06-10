# Technology Stack

**Analysis Date:** 2026-06-10

## Languages

**Primary:**
- TypeScript ~5.9.2 — Used for all frontend application code in `src/`, `app/`, and configuration files
- JavaScript (Node.js) — Used for the Plant ID API backend at `backend/index.js`

**Secondary:**
- Python 3 — Used for the Chat API backend at `backend/chat/`

## Runtime

**Frontend Environment:**
- Expo SDK ~54.0.35 with React Native 0.81.5
- Package Manager: npm (package-lock.json present)
- Expo Router ~6.0.24 (file-based routing from `app/` directory)
- Entry point: `expo-router/entry` (set in `package.json`)

**Backend — Plant ID API:**
- Node.js (Express 4.18.2)
- Defined in `backend/package.json`
- Package Manager: npm (backend/package-lock.json present)

**Backend — Chat API:**
- Python 3 (FastAPI via uvicorn)
- Defined in `backend/chat/requirements.txt`
- Python version managed via `.python-version` at `backend/chat/.python-version`

## Frameworks

**Core Frontend:**
- React 19.1.0 — UI library
- Expo SDK ~54.0.35 — Application framework and development toolchain
- React Native 0.81.5 — Mobile runtime
- Expo Router ~6.0.24 — File-based navigation
- React Navigation 7.x (bottom tabs, native stack) via `@react-navigation/bottom-tabs` ^7.4.0, `@react-navigation/native` ^7.1.8, `@react-navigation/elements` ^2.6.3

**Core Backend — Plant ID API:**
- Express 4.18.2 — HTTP server framework (configured in `backend/index.js`)
- CORS middleware (`cors` ^2.8.5)
- dotenv (`dotenv` ^16.3.1) for environment variables

**Core Backend — Chat API:**
- FastAPI >=0.104.1 — ASGI web framework (defined in `backend/chat/requirements.txt`)
- Uvicorn >=0.24.0 — ASGI server
- Pydantic >=2.5.0 — Data validation and settings
- PyJWT >=2.8.0 — JWT token handling

**Testing:**
- Jest ^29.7.0 — Test runner
- jest-expo ~54.0.0 — Expo Jest preset
- @testing-library/react-native ^12.5.1 — Component testing
- @testing-library/jest-native ^5.4.2 — Custom Jest matchers
- babel-jest ^29.7.0 — Babel transform for Jest
- Config: `jest.config.js` with `jest-expo` preset
- Setup: `jest.setup.ts` imports `@testing-library/jest-native/extend-expect`
- Pattern: Tests co-located in `__tests__/` directories next to source

**Build/Dev:**
- Expo CLI via `expo` commands (start, run:android, run:ios, start --web)
- EAS Build configured in `eas.json` (development, preview, production profiles)
- Expo lint via `eslint-config-expo` ~10.0.0
- ngrok for tunneling: `@expo/ngrok` ^4.1.3

## Key Dependencies

**Critical Frontend:**
- `firebase` ^12.11.0 — Firebase SDK (Auth, Firestore, Storage) — the primary backend-as-a-service
- `react-hook-form` ^7.72.0 — Form management
- `zod` ^4.3.6 — Schema validation, used with `@hookform/resolvers` ^5.2.2
- `react-native-calendars` ^1.1314.0 — Calendar UI component
- `react-native-reanimated` ~4.1.1 — Animations
- `react-native-gesture-handler` ~2.28.0 — Gesture handling
- `react-native-toast-message` ^2.3.3 — Toast notifications

**Infrastructure:**
- `@react-native-async-storage/async-storage` 2.2.0 — Local key-value storage (auth persistence, offline cache, popup tracking)
- `@react-native-community/netinfo` 11.4.1 — Network connectivity detection (offline sync)
- `expo-secure-store` ~15.0.8 — Secure credential storage
- `expo-sqlite` ~16.0.10 — Local SQLite database
- `expo-file-system` ~19.0.23 — File system access
- `expo-crypto` ~15.0.9 — Cryptographic functions

**Infrastructure Frontend (chat/encryption):**
- `tweetnacl` ^1.0.3 — NaCl cryptographic library for E2E encryption
- `@stablelib/base64` ^2.0.1 — Base64 encoding/decoding
- `@stablelib/utf8` ^2.1.0 — UTF8 encoding/decoding
- `react-native-get-random-values` ~1.11.0 — Secure random values for RN

**Infrastructure Backend (chat):**
- `cloudinary` >=1.40.0 — Media cloud storage and CDN
- `python-multipart` >=0.0.9 — Multipart form handling
- `spanlp` ==1.1.0 — Profanity detection and moderation

## Configuration

**Environment:**
- Firebase configuration is hardcoded in `src/config/firebase.js` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
- Plant ID API key loaded via `dotenv` from `backend/.env` as `PLANT_API_KEY`
- Chat API backend uses pydantic-settings to load from `backend/chat/.env` (JWT secret, Cloudinary credentials, group encryption key)
- Example env vars documented in `backend/.env.example`

**Build:**
- `tsconfig.json` extends `expo/tsconfig.base` with strict mode and `@/*` path alias mapping to root
- `eas.json` defines three build profiles: development (dev client, internal), preview (internal), production (auto-increment)
- `eslint.config.js` uses `eslint-config-expo/flat` flat config
- `app.json` / `app.config.js` — not inspected but referenced via `expo-constants`
- `backend/chat/render.yaml` — Render deployment config for chat service

## Platform Requirements

**Development:**
- Node.js (via npm for frontend and Plant ID API)
- Python 3 (for Chat API backend)
- Expo CLI (`npx expo`)
- EAS CLI for builds
- Android Studio / Xcode for native builds
- Expo Go app for development testing

**Production:**
- Frontend: Deployed via EAS Build (Android/iOS app stores) or Expo web
- Plant ID API: Render (free web service, Node.js environment, `render.yaml` at root)
- Chat API: Render (free web service, Python environment, `render.yaml` at `backend/chat/`)
- Firebase services managed via Firebase Console

---

*Stack analysis: 2026-06-10*
