# Phase 2: Lab3 - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Lab3 - API + Sincronización: Backend service for plant identification (calls Plant.id API) + React Native app with offline support and sync queue.
</domain>

<decisions>
## Implementation Decisions

### Plant Identification API
- **D-01:** Use Plant.id API for plant identification
  - URL: https://plant.id/api/v3
  - API Key: VQiCcflXT7Q71IyD0qsr40SlBoyvxBwuPZEawXVXKk2MlqeJwL
  - Endpoint: POST /identify with images (Base64)

### Architecture
- **D-02:** Separate backend from frontend
  - Backend: Node.js/Express service deployed to Render
  - Frontend: React Native Expo app
  - Communication: REST API calls from app to backend

### Backend Requirements
- **D-03:** Create backend service (`backend/` directory)
  - Express.js endpoint that receives image, calls Plant.id API
  - Returns normalized plant identification result
  - Deploy to Render with logs

### Local Storage (Frontend)
- **D-04:** Use `expo-sqlite` + `expo-sqlite/kv-store` for local storage
  - Expo Go compatible (no dev client required)
  - Store pending operations when offline
  - Cache plant data for offline viewing

### Offline Support
- **D-05:** Implement sync queue
  - Store pending operations locally when offline
  - Auto-sync when connection restored
  - UI indicators for sync status

### Module Analysis
- **D-06:** Identify which modules work offline
  - Camera: requires device (show graceful error)
  - Plant collection: works offline with local cache
  - Profile: requires network
  - Home dashboard: partial offline with cached data

### Claude's Discretion
- Backend port configuration
- Sync retry strategy (exponential backoff)
- UI design for sync indicators

</decisions>

<canonical_refs>
## Canonical References

### APIs
- Plant.id API: https://github.com/flowerchecker/plant-id-examples/wiki/Plant-identification
- Backend URL: https://plant.id/api/v3 (to be called from Render)

### Technical Stack
- `expo-sqlite` — local storage (docs.expo.dev)
- Backend: Node.js/Express deployed to Render

### Project Context
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria
- `.planning/PROJECT.md` — Core value and existing implementation

</canonical_refs>

ls
## Existing Code Insights

### Reusable Assets
- `src/screens/identify/CameraScreen.tsx` — camera flow, takes photos
- `src/services/userPlantsService.ts` — manages plant collection in Firestore
- `src/hooks/useCamera.ts` — camera permissions and capture logic

### Established Patterns
- Firebase Firestore for data persistence
- Service layer pattern for API calls

### Integration Points
- Camera → backend API → userPlantsService
- Sync queue → Firestore
- UI components → sync status indicators

</code_context>

<specifics>
## Specific Ideas

- Backend directory: `backend/` with Express.js
- Frontend calls: `http://localhost:3000/api/identify` (dev) or Render URL (prod)
- API key stored in backend environment variables (NOT in frontend)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-lab3*
*Context gathered: 2026-04-24*