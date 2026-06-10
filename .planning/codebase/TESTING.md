# Testing Patterns

**Analysis Date:** 2026-06-10

## Test Framework

**Runner:**
- **Jest** v29.7.0 with **jest-expo** preset v~54.0.0
- Config: `jest.config.js` at project root
- Babel: `babel-jest` v29.7.0 for transform

**Assertion Library:**
- **@testing-library/jest-native** v5.4.2 — extends `expect` with React Native-specific matchers
- **@testing-library/react-native** v12.5.1 — `render`, `fireEvent`, `renderHook`

**Run Commands:**
```bash
npm test                          # Run all tests (jest --watchAll=false)
npm run test                      # Same as above
```

## Test File Organization

**Location:**
- Test files are **co-located** in `__tests__/` directories next to the source module
- No centralized `tests/` directory at project root

**Structure:**
```
src/
├── services/
│   ├── activityService.ts
│   ├── missionService.ts
│   └── __tests__/
│       ├── activityService.test.ts
│       └── missionService.test.ts
├── hooks/
│   ├── useMissionProgress.ts
│   └── __tests__/
│       └── useMissionProgress.test.ts
├── screens/
│   ├── auth/
│   │   ├── loginScreen.tsx
│   │   └── __tests__/
│   │       └── loginScreen.test.tsx
│   └── calendar/
│       ├── CalendarScreen.tsx
│       └── __tests__/
│           └── CalendarScreen.test.tsx
└── lib/
    ├── plantValidation.ts
    └── __tests__/
        └── plantValidation.test.ts
```

**Naming:**
- `*.test.ts` for pure TypeScript unit tests
- `*.test.tsx` for React component tests (JSX required)
- Matches `testMatch: ["**/__tests__/**/*.test.(ts|tsx)"]` in `jest.config.js`

## Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|@react-native-community|expo(nent)?|expo-router|@expo(nent)?|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|expo-modules-core)/)"
  ]
};
```

**Setup file** (`jest.setup.ts`):
```typescript
import "@testing-library/jest-native/extend-expect"
```
- Imports jest-native matchers globally (e.g., `toBeTruthy`, `toBeDisabled`, `toHaveTextContent`)

## Test Structure

**Suite Organization:**
```typescript
describe("feature — context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // default mock setup
  });

  describe("sub-feature or function name", () => {
    it("describe expected behavior in Spanish", () => {
      // arrange
      // act
      // assert
    });
  });
});
```

**Patterns:**
- **`describe` nesting**: Top-level for the module, second-level for specific functions/features
- **`beforeEach`**: Always calls `jest.clearAllMocks()` — mock state is reset per test
- **`it` descriptions in Spanish**: Describes the expected behavior in present tense — `"devuelve 'Ahora' cuando la fecha es el mismo instante"`, `"muestra error cuando el formulario está vacío"`
- **Guard pattern for non-exported functions**: Tests use a guard to skip if the function isn't yet exported:
```typescript
const fnExists = typeof formatRelativeTime === "function";
it("test name", () => {
  if (!fnExists) return;  // skip if function not implemented yet
  // ... actual test assertions
});
```

**Testing Non-Exported Functions:**
```typescript
import * as mod from "@/src/services/activityService";

const formatRelativeTime = (mod as any).formatRelativeTime as
  | ((date: Date) => string)
  | undefined;
```
- Access via `(mod as any)` pattern with optional type cast
- Guard checks existence before running

## Mocking

**Framework:** `jest.mock()` (built into Jest)

**Pattern for Firebase:**
```typescript
jest.mock("@/src/config/firebase", () => ({
  db: {},
  auth: { currentUser: { uid: "test_user" } },
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
  },
  serverTimestamp: jest.fn(),
}));
```

**Pattern for Service Mocks:**
```typescript
jest.mock("@/src/services/authService", () => ({
  login: jest.fn(),
  resetPassword: jest.fn(),
}));
```

**Pattern for Data Constant Mocks:**
```typescript
jest.mock("@/src/constants/missionsData", () => ({
  DAILY_MISSIONS: [ /* test data */ ],
  WEEKLY_MISSIONS: [],
  ALL_MISSIONS: [ /* test data */ ],
}));
```

**Pattern for Component Mocks (Screen Tests):**
```typescript
jest.mock("@/src/components/screenWrapper/ScreenWrapper", () => {
  const MockScreenWrapper = ({ children }: any) => children;
  return MockScreenWrapper;
});
```

**Mock Variable Declaration (Hoisting Critical):**
```typescript
// Mock variables MUST be declared before jest.mock calls (hoisted)
const mockGetUserActivities = jest.fn();
const mockToActivityData = jest.fn();
const mockGetCurrentUserId = jest.fn();

jest.mock("@/src/services/activityService", () => ({
  getUserActivities: (...args: any[]) => mockGetUserActivities(...args),
  toActivityData: (...args: any[]) => mockToActivityData(...args),
}));
```

**Pattern for Third-Party Component Mocks:**
```typescript
jest.mock("react-native-calendars", () => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return {
    Calendar: ({ onDayPress, markedDates }: any) => {
      return React.createElement(View, null,
        React.createElement(Text, null, "Calendar"),
        React.createElement(TouchableOpacity, {
          onPress: () => onDayPress && onDayPress({ dateString: "2026-05-24" }),
          testID: "calendar-day",
        }, React.createElement(Text, null, "Tap day"))
      );
    },
    LocaleConfig: { locales: {}, defaultLocale: "en" },
  };
});
```

**Typing Mock Functions:**
```typescript
const mockedGetDoc = getDoc as jest.Mock;
const mockedGetDocs = getDocs as jest.Mock;
const mockedUpdateDoc = updateDoc as jest.Mock;
const mockedGetCurrentUserId = getCurrentUserId as jest.Mock;
```

**What to Mock:**
- Firebase modules (`firebase/firestore`, `firebase/auth`) — always fully mocked
- Internal service dependencies (`userService`, `activityService`, `offlineStorage`)
- Data constants (`missionsData`) — replace with minimal test data
- Third-party libraries with native modules (`expo-router`, `react-native-safe-area-context`, `react-native-calendars`)
- Network modules (`@react-native-community/netinfo`)
- In-app config modules (`@/src/config/firebase`)

**What NOT to Mock:**
- Pure utility functions being tested directly
- Assertion libraries and test utilities
- React itself

## Fixtures and Factories

**Test Data:**
Test data is created inline within test files — no external fixture files observed. Example patterns:

```typescript
// Array of test missions
const dailyMissions = [
  {
    id: "daily_id_01",
    title: "Identifica 1 planta",
    type: "daily",
    category: "identify",
    icon: "📷",
    requirement: { type: "identifications", count: 1 },
    xpReward: 50,
  },
  // ...
];

// User mission progress fixture
const missionProgress = [
  { id: "mission_yesterday", progress: 1, target: 1, completed: true, claimed: false, assignedDate: yesterdayISO },
  { id: "mission_old", progress: 1, target: 1, completed: true, claimed: false, assignedDate: twoDaysAgoISO },
];
```

**Location:**
- Fixtures defined inline in `jest.mock()` second argument or as local `const` arrays
- No `__fixtures__/` directory observed

## Time Management

All time-dependent tests use Jest fake timers with deterministic system time:
```typescript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-05-24T12:00:00Z"));
});

afterEach(() => {
  jest.useRealTimers();
});
```

- System time is fixed to a known instant for deterministic assertions
- Always restore real timers in `afterEach`
- This pattern is essential for any function that uses `new Date()` internally

## Coverage

**Requirements:** None enforced — no `coverageThreshold` in Jest config and no coverage command in package.json scripts

**View Coverage:**
```bash
npx jest --coverage
```
Not configured as an npm script — must be run manually.

## Test Types

**Unit Tests:**
- Standard for all service files, utility functions, and pure helpers
- Tests call functions directly with mock data
- Service functions that interact with Firestore are tested by asserting on mock calls (`expect(mockedUpdateDoc).toHaveBeenCalled()`)

**Integration Tests:**
- Not explicitly separated — unit tests may test service wiring (e.g., `useMissionProgress.test.ts` tests that services are called correctly with `updateDoc`)
- Test files that mock fewer modules tend to be more integration-like

**E2E Tests:**
- Not used — no framework detected (no Detox, no Maestro, no Appium)

**Snapshot Tests:**
- Not used — no `toMatchSnapshot()` calls observed

## Common Patterns

**Async Testing:**
```typescript
it("fetches user missions and updates matching progress", async () => {
  mockedGetDoc.mockResolvedValue({
    exists: () => true,
    data: () => ({ /* test data */ }),
  });
  
  const reportProgress = (mod as any).reportMissionProgress;
  if (typeof reportProgress !== "function") return; // TDD guard
  
  await reportProgress("identify");
  
  expect(mockedUpdateDoc).toHaveBeenCalled();
});
```

**Error Testing:**
```typescript
it("handles errors gracefully without throwing", async () => {
  mockedGetDoc.mockRejectedValue(new Error("Firestore error"));
  
  const reportProgress = (mod as any).reportMissionProgress;
  if (typeof reportProgress !== "function") return;
  
  await expect(reportProgress("identify")).resolves.toBeUndefined();
});
```

**Component Rendering Tests:**
```typescript
import { render, fireEvent } from "@testing-library/react-native";

it("shows error when form is empty", () => {
  const { getByText, queryByText } = render(<LoginScreen />);
  
  expect(queryByText("Por favor completa todos los campos.")).toBeNull();
  fireEvent.press(getByText("Entrar"));
  expect(getByText("Por favor completa todos los campos.")).toBeTruthy();
});
```

**Async Component Rendering (with `findBy`):**
```typescript
it("shows calendar and empty message when no activities", async () => {
  mockGetUserActivities.mockResolvedValue([]);
  
  const { findByText } = render(<CalendarScreen />);
  
  expect(await findByText("Calendar")).toBeTruthy();
  expect(await findByText("No hay actividades este día")).toBeTruthy();
});
```

**Hook Testing:**
```typescript
import { renderHook } from "@testing-library/react-native";

it("useMissionProgress hook returns reportProgress", () => {
  const { result } = renderHook(() => useMissionProgressModule.useMissionProgress());
  expect(result.current.reportProgress).toBeDefined();
  expect(typeof result.current.reportProgress).toBe("function");
});
```

## Test Descriptions

- All test descriptions are in **Spanish**
- Use present tense: `"devuelve... cuando..."`, `"mapea... correctamente"`, `"muestra... cuando..."`
- Component tests describe user-facing behavior in Spanish phrases matching the UI text (assertions on Spanish strings like `"Por favor completa todos los campos."`)

---

*Testing analysis: 2026-06-10*
