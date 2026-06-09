# Phase 10: Chat y PDF - Context

**Gathered:** 2026-06-09
**Status:** Ready for planning
**Source:** User requirements

<domain>
## Phase Boundary

Integrate a new real-time chat module (replacing any existing chat stub), add PDF generation/export capability for app progress reports, and configure the backend infrastructure. The chat backend is a separate Node.js service deployed on Render.

</domain>

<decisions>
## Implementation Decisions

### Chat Backend Integration
- Replace existing chat implementation with new backend from `https://github.com/JoshuaEA54/chat_backend`
- Chat backend is already deployed at `https://chat-backend-4nzg.onrender.com`
- Backend uses Firebase Admin SDK for authentication (serviceAccountKey.json)
- Backend uses Cloudinary for image/file uploads in chat
- CORS configured to allow all origins (`ALLOWED_ORIGINS=*`)
- Group messages limited to 100 in memory
- DM messages limited to 50 per user pair in memory
- Backend runs on port 8002

### Chat Backend Environment (.env)
- `PORT=8002`
- `ALLOWED_ORIGINS=*`
- `MAX_GROUP_MESSAGES=100`
- `MAX_DM_MESSAGES=50`

### Firebase Configuration
- Firebase Admin SDK private key: `serviceAccountKey.json` (project: `chat-backend-3c630`)
- Service account email: `firebase-adminsdk-fbsvc@chat-backend-3c630.iam.gserviceaccount.com`

### Cloudinary Configuration
- `CLOUDINARY_CLOUD_NAME=dxqhnso8y`
- `CLOUDINARY_API_KEY=237545325956988`
- `CLOUDINARY_API_SECRET=3i570hgzJcNgF6mlWht8JlakLbc`

### PDF Export
- User must be able to upload/submit a PDF describing latest app progress
- PDF should include screenshots and link to the Android build preview
- Backend must be running at time of review

### Android Build
- Need to generate an Android build preview (APK/ AAB) for review

### General
- The app project name is "plantasmon" (Expo app)

</decisions>

<canonical_refs>
## Canonical References

### Project Core
- `src/config/firebase.js` — Firebase client SDK config (existing)
- `app/_layout.tsx` — Root layout with auth, navigation, and service initialization
- `src/components/profile/BottomNav.tsx` — Bottom navigation with 5 tabs
- `package.json` — Dependencies

### Chat Backend
- `https://github.com/JoshuaEA54/chat_backend` — Source repo for chat backend
- `https://chat-backend-4nzg.onrender.com` — Deployed backend URL

### Firebase Admin
- `serviceAccountKey.json` — Firebase Admin SDK credentials

</canonical_refs>

<specifics>
## Specific Ideas

1. Add a Chat screen accessible from the app
2. Set up chat backend locally or ensure Render deployment is running
3. Configure Firebase Admin SDK and Cloudinary on the backend
4. Create a PDF generation mechanism (could use expo-print or a backend endpoint)
5. Generate Android build preview via EAS Build
6. Bottom navigation may need a chat tab or chat accessible from profile/home

</specifics>

<deferred>
None — phase scope is well-defined.

</deferred>

---

*Phase: 10-chat-y-pdf*
*Context gathered: 2026-06-09 via direct user input*
