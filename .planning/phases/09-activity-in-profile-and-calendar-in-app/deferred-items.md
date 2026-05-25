# Deferred Items

- `npx tsc --noEmit` fails due to pre-existing TypeScript errors and missing UI dependencies
  (Radix UI, lucide-react, class-variance-authority, etc.) plus unrelated type issues in
  `app/companionPlant.tsx`, `src/services/userService.ts`, and `src/services/userAchievementsService.ts`.
  These are outside the scope of Phase 09-01 changes.
