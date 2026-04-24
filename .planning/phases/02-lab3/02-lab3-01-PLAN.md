---
phase: 02-lab3
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/identify.tsx
  - src/services/plantIdService.ts
  - src/types/plant.d.ts
autonomous: true
requirements:
  - LAB3-API-01
  - LAB3-API-02
  - LAB3-API-03
user_setup:
  - service: plantnet
    why: "Plant identification API requires API key registration"
    env_vars:
      - name: PLANTNET_API_KEY
        source: "https://my.plantnet.org/api/key"
    docs: "https://github.com/plantnet/plantnet-api"

must_haves:
  truths:
    - "User can take photo and identify plant using Pl@ntNet API"
    - "Identification results show plant name and details"
    - "Successfully identified plants can be saved to user collection"
  artifacts:
    - path: "src/services/plantIdService.ts"
      provides: "Pl@ntNet API integration"
      exports: ["identifyPlant", "PlantIdentificationResult"]
    - path: "src/types/plant.d.ts"
      provides: "Plant type definitions"
      exports: ["PlantIdentificationResult"]
    - path: "app/identify.tsx"
      provides: "Camera-based plant identification screen"
      exports: ["default"]
  key_links:
    - from: "app/identify.tsx"
      to: "src/services/plantIdService.ts"
      via: "import and call identifyPlant()"
      pattern: "import.*plantIdService"
    - from: "src/services/plantIdService.ts"
      to: "Pl@ntNet API"
      via: "fetch with multipart/form-data"
      pattern: "my\\.plantnet\\.org"
---

<objective>
Implement real plant identification using the Pl@ntNet API. Replace the stub ID-based flow with camera capture and AI-powered plant identification.

Purpose: User can photograph any plant and get instant identification results
Output: Working plant identification screen with camera integration and API calls
</objective>

<execution_context>
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/workflows/execute-plan.md
@/home/brian/4_anno/Moviles/Proyecto en clase/plantasmon/.opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/codebase/ARCHITECTURE.md
@.planning/codebase/STRUCTURE.md

# Existing patterns
@app/identify.tsx  # Current stub implementation to replace
@src/services/cameraService.ts  # Camera service with takePhoto()
@src/services/userPlantsService.ts  # User plant management pattern

# Stack context
@.planning/research/STACK.md
</context>

<interfaces>
<!-- Key types and contracts the executor needs. Extracted from codebase. -->

From src/services/cameraService.ts:
```typescript
export interface PhotoResult {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

export interface CaptureOptions {
  quality?: number;
  base64?: boolean;
  skipProcessing?: boolean;
}

takePhoto(cameraRef: RefObject<CameraView>, options?: CaptureOptions): Promise<PhotoResult>
```

From src/services/userPlantsService.ts:
```typescript
export interface UserPlantUpdate {
  nickname?: string;
  notes?: string;
  lastWatered?: string;
  lastWeeded?: string;
  favorite?: boolean;
  isCompanion?: boolean;
  location?: string;
  personality?: string;
}

updateUserPlant(plantId: string, updates: UserPlantUpdate, userId?: string): Promise<void>
```
</interfaces>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Create Pl@ntNet API service</name>
  <files>src/services/plantIdService.ts, src/types/plant.d.ts</files>
  <behavior>
    - Test 1: identifyPlant(uri, apiKey) with valid image returns PlantIdentificationResult
    - Test 2: identifyPlant with API error throws DescriptiveError
    - Test 3: identifyPlant with no results returns empty species array
  </behavior>
  <action>
Create `src/types/plant.d.ts` with type definitions:

```typescript
export interface PlantSpecies {
  scientificName: string;
  commonNames: string[];
  genus: string;
  family: string;
  score: number;
}

export interface PlantIdentificationResult {
  success: boolean;
  query: {
    project: string;
    images: number;
  };
  results: PlantSpecies[];
  error?: never;
}

export interface PlantIdError {
  success: false;
  error: string;
  code: 'NETWORK_ERROR' | 'API_ERROR' | 'NO_RESULTS';
}
```

Create `src/services/plantIdService.ts`:

1. Export `identifyPlant(imageUri: string, apiKey: string): Promise<PlantIdentificationResult | PlantIdError>`
2. Use FormData with image file for multipart upload
3. Endpoint: `https://my.plantnet.org/v2/identify/all?api-key={apiKey}&project=plantnet`
4. Support organ types: `flower`, `leaf`, `fruit`, `bark`, `habit`
5. Return first 5 best matches sorted by score
6. Handle errors gracefully with typed error responses

**Environment variable:** `PLANTNET_API_KEY` from `process.env.PLANTNET_API_KEY`
  </action>
  <verify>
    <automated>npx tsc --noEmit src/services/plantIdService.ts src/types/plant.d.ts</automated>
  </verify>
  <done>Pl@ntNet service returns typed PlantIdentificationResult with species array</done>
</task>

<task type="auto">
  <name>Task 2: Integrate camera capture into Identify screen</name>
  <files>app/identify.tsx</files>
  <action>
Refactor `app/identify.tsx` to support camera-based identification:

1. Add state for camera mode vs form mode
2. Use expo-camera (CameraView) for photo capture
3. When photo captured, call plantIdService.identifyPlant()
4. Display results with species name and confidence score
5. Allow user to select a result to add to collection
6. Fall back to existing ID-based flow if camera unavailable

**Camera integration:**
- Import CameraView from 'expo-camera'
- Use cameraRef pattern from cameraService.ts
- Display camera preview with capture button
- After capture, show results and offer "Add to Collection" action

**Keep existing:** ID-based shortcuts as fallback when camera not available
  </action>
  <verify>
    <automated>npx tsc --noEmit app/identify.tsx 2>&1 | head -20</automated>
  </verify>
  <done>Camera button triggers capture and displays identification results</done>
</task>

<task type="auto">
  <name>Task 3: Add selected plant to user collection</name>
  <files>app/identify.tsx</files>
  <action>
After user selects a plant from identification results:

1. Create a new document in `plants/` collection with the identified plant data
2. OR use existing plant ID if match found in Firebase
3. Add the plant to user's `userPlants` array (reuse existing logic)

**Flow:**
1. User selects species from results
2. Create plant entry: { id, commonName, scientificName, genus, family }
3. Call existing userPlantsService pattern to add to collection
4. Show success message with plant name
5. Reset form and return to capture mode

**Note:** Reuse the existing Firestore update pattern from the current identify.tsx onSubmit handler
  </action>
  <verify>
    <automated>npx tsc --noEmit app/identify.tsx 2>&1 | grep -i error || echo "Type check passed"</automated>
  </verify>
  <done>Selected identification result added to user collection with Firestore update</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| user → Pl@ntNet API | Untrusted image data posted to external API |
| API response → app | API response parsed and displayed to user |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-LAB3-01 | S | Pl@ntNet API calls | mitigate | API key stored in env var, not hardcoded; rate limiting handled by API |
| T-LAB3-02 | T | Image upload | accept | Images are plant photos, no PII; user explicitly uploads |
| T-LAB3-03 | R | API response parsing | mitigate | Validate response shape before using; TypeScript types enforce structure |
| T-LAB3-04 | I | Firestore plant data | mitigate | Only add plants user explicitly confirms; same auth as existing flows |
</threat_model>

<verification>
1. Run TypeScript check on all modified files
2. Verify PlantIdentificationResult type exported correctly
3. Confirm camera integration compiles without errors
</verification>

<success_criteria>
1. User can take photo and see Pl@ntNet identification results
2. Results display species name with confidence score
3. User can add identified plant to their collection
4. App gracefully falls back to ID-based entry if camera unavailable
5. TypeScript compiles without errors
</success_criteria>

<output>
After completion, create `.planning/phases/02-lab3/02-lab3-01-SUMMARY.md`
</output>