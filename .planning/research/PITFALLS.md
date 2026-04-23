# Domain Pitfalls

**Domain:** Plant Care Mobile Application
**Project:** PlantasMon
**Researched:** 2026-04-22

## Critical Pitfalls

Mistakes that cause rewrites or major user experience failures.

### Pitfall 1: Trusting AI Plant Identification as Truth

**What goes wrong:** Users receive incorrect plant identification and apply wrong care, leading to plant death.

**Why it happens:**
- Research shows plant ID apps achieve 4-90% accuracy (varies wildly by species/conditions)
- Apps identify only plants in their database (cannot identify new/rare species)
- Photo quality, growth stage, and environmental stress affect accuracy
- Confidence scores often not displayed or hidden behind paywall

**Consequences:**
- Users trust "expert" identification and follow wrong care instructions
- Misidentified rare/native plants may be removed as "weeds"
- Liability if users consume misidentified plants

**Prevention:**
- Always display confidence scores to users
- Provide multiple identification options ranked by confidence
- Include disclaimer that identification is a starting point, not final answer
- Allow users to correct identification and learn from mistakes
- Ground truth: Add verification flow for community confirmation

**Detection:**
- Track user correction rate on identifications
- Monitor which plants users remove vs keep after ID

**Phase:** Plant Identification API Integration (phase should address this)

---

### Pitfall 2: Static Care Schedules Ignored by Environmental Context

**What goes wrong:** Care reminders based on calendar don't match user's actual conditions.

**Why it happens:**
- Plants in humid Singapore need different watering than dry Denver
- Apps assume "water when top inch dry" applies universally
- Real-time sensor data (humidity, light, temperature) not used

**Consequences:**
- Overwatering → root rot (most common plant death cause)
- Underwatering → stress and leaf drop
- Users ignore app because "it doesn't know my conditions"

**Prevention:**
- Request user to input their local environment (humidity zone, light exposure)
- Use phone's ambient light sensor where available
- Remind users: "Check soil before watering" not just "Water today"
- Allow threshold customization per plant

**Detection:**
- Monitor watering logs per plant
- Track which plants users mark for "skip watering"

**Phase:** Journal/Explore completion phases need environmental input

---

### Pitfall 3: Disease Diagnosis Without Appropriate Caveats

**What goes wrong:** App diagnoses plant health incorrectly, users apply wrong treatment.

**Why it happens:**
- AI diagnosis is 80-90% accurate for common issues
- Misses rare or region-specific diseases
- Cannot differentiate abiotic stress (overwatering) from disease

**Consequences:**
- Users spend money on unnecessary treatments
- Delay in proper treatment kills plant
- Users lose trust in app

**Prevention:**
- Display confidence scores prominently
- Always recommend consulting local extension service for serious issues
- Distinguish between "likely" and "possible" diagnoses
- Never diagnose without multiple image angles

**Phase:** Plant Doctor/diagnosis feature (future phase)

---

### Pitfall 4: Notification Fatigue Causes Churn

**What goes wrong:** Users disable all notifications or uninstall app.

**Why it happens:**
- Too many reminders ("Water your plant!" daily)
- Generic messages feel robotic, not personalized
- No customization of notification frequency

**Consequences:**
- Users ignore all notifications
- Uninstall rate increases

**Prevention:**
- Start with watering reminders only, add fertilizing/misting later
- Allow per-plant notification customization
- Make messages actionable and specific: "[Plant Name] needs water today"
- Let users snooze or skip without guilt

**Phase:** This affects all reminder-related phases

---

### Pitfall 5: Hardcoded Configuration Exposed in Source

**What goes wrong:** Firebase config visible in source code, API keys rotatable only via code change.

**Why it happens:**
- Config placed directly in `src/config/firebase.js`
- No environment variable management set up

**Consequences:**
- Security risk (keys exposed in repo)
- Cannot rotate keys without app update
- Violates security best practices

**Prevention:**
- Use Expo secrets (`EXPO_PUBLIC_FIREBASE_*` env vars)
- Or use `.env` with `dotenv` for local development
- Never commit actual API keys

**Detection:**
- Security audit looks for hardcoded secrets

**Phase:** Tech debt cleanup phase (addressing CONCERNS.md)

---

## Moderate Pitfalls

### Pitfall 6: Hardcoded User ID Breaks Multi-User Support

**What goes wrong:** App only works for one test user.

**Why it happens:**
- `userService.ts` uses `CURRENT_USER_ID = "u_001"`
- Not connected to Firebase Auth user ID

**Consequences:**
- All users see same data
- Real user authentication doesn't actually work
- New users have blank profiles

**Prevention:**
- Use Firebase Auth: `auth.currentUser?.uid`
- Replace all hardcoded user references with auth-based lookup

**Phase:** Connect to real Firebase Auth UID (from PROJECT.md active requirements)

---

### Pitfall 7: Platform Differences Break Functionality

**What goes wrong:** Features work on iOS but crash/freeze on Android.

**Why it happens:**
- Platform-specific native code behaves differently
- Animation APIs differ (Android doesn't support flex transformations)
- Font rendering differences

**Consequences:**
- User reviews mention "works on one platform only"

**Prevention:**
- Test on both platforms during development
- Use platform check utilities for different code paths
- Don't trust any library until tested on both platforms

**Phase:** QA and testing phase

---

### Pitfall 8: No Error Boundaries = Full App Crashes

**What goes wrong:** Single component error crashes entire app.

**Why it happens:**
- No React error boundaries implemented
- Uncaught errors propagate to root

**Consequences:**
- User sees white screen, must force close app
- Poor App Store ratings

**Prevention:**
- Wrap screens in error boundary components
- Provide graceful fallback UI for component failures

**Phase:** Testing framework setup should include error boundary testing

---

### Pitfall 9: No Test Coverage = Bugs Undetected

**What goes wrong:** Bugs only discovered in production.

**Why it happens:**
- No test framework configured
- Zero test coverage

**Consequences:**
- Regressions undetected
- Refactoring too risky

**Prevention:**
- Set up Jest/Testing Library
- Write unit tests for services
- Add integration tests for auth flows

**Phase:** Test framework and coverage (from CONCERNS.md)

---

## Minor Pitfalls

### Pitfall 10: Overloaded Home Screen

**What goes wrong:** Too many features compete for attention, users confused about first action.

**Why it happens:**
- Home dashboard has plant of day, daily missions, tips, achievements
- No clear user journey

**Prevention:**
- Progressive disclosure: show core actions first
- Deep links directly to plant identification or add plant

**Phase:** UX refinement should address navigation

---

### Pitfall 11: No Offline Persistence

**What goes wrong:** App unusable without internet.

**Why it happens:**
- Firebase offline persistence not configured

**Consequences:**
- App crashes on poor connectivity

**Prevention:**
- Enable Firestore offline persistence when needed

**Phase:** Future if user requests offline

---

### Pitfall 12: Google OAuth Broken

**What goes wrong:** Google sign-in button throws error.

**Why it happens:**
- Google Auth configured but frontend call incomplete

**Prevention:**
- Complete Google OAuth or remove button with note

**Phase:** Fix Google OAuth (from PROJECT.md active requirements)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Plant Identification | Trust ID as truth | Display confidence, add caveats |
| Care Reminders | Generic schedules | Add environmental context |
| Disease Diagnosis | Wrong treatment | Recommend human verification |
| Firebase Auth | Hardcoded user ID | Connect to real auth UID |
| Testing | Any refactor | Breaks - no tests exist |
| Error Handling | Component crashes | Add error boundaries |
| Notifications | User churn | Start minimal, let users customize |

---

## Sources

- Household Plant Care Blog: "Best Apps for Plant Care 2026" (2026-04-08)
- Household Plant Care Blog: "How to Check Plant Health" (2026-03-28)
- Fylora: "AI Plant ID Mistakes" (2026-01-22)
- PLos ONE (Campbell et al.): "Testing of smartphone apps that identify plants" (2023-04-06)
- New Scientist: "Apps can be as little as 4% accurate" (2023-04-05)
- Dev.to: "Why Even the Best Plant Care App Fails Without Thoughtful UI/UX" (2025-02-14)
- Plain English: "Top 20 Mistakes React Native Developers Still Make" (2025-12-03)
- Expostarter.com: "Expo mobile development pitfalls" (2025)
- ImaginaryCloud: "5 common errors in React Native app using Expo"
- CONCERNS.md: Current codebase issues (2026-04-22)

---

*Research generated: 2026-04-22*