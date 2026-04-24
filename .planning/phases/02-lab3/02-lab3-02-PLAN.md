---
phase: 02-lab3
plan: 02
type: execute
wave: 2
depends_on: []
files_modified:
  - src/services/plantIdService.ts
  - app/identify.tsx
autonomous: true
requirements:
  - Plant identification in frontend
  - Offline support
---

<objective>
Integrate frontend with backend API and add offline support with expo-sqlite.
</objective>

<tasks>

<task type="auto">
  <name>Task 1: Create plant identification service</name>
  <files>src/services/plantIdService.ts</files>
  <action>
Create plantIdService.ts that calls the backend:

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface PlantIdentificationResult {
  id: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  description?: string;
  careLevel?: string;
  careInstructions?: string;
  waterSchedule?: string;
  sunlight?: string;
}

export async function identifyPlant(photoUri: string): Promise<PlantIdentificationResult> {
  // Convert image to Base64
  const base64Image = await fetch(photoUri)
    .then(res => res.blob())
    .then(blob => blobToBase64(blob));

  const response = await fetch(`${API_URL}/api/identify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      images: [base64Image]
    })
  });

  if (!response.ok) throw new Error('Identification failed');

  const data = await response.json();
  
  if (data.suggestions && data.suggestions.length > 0) {
    const suggestion = data.suggestions[0];
    return {
      id: suggestion.id,
      commonName: suggestion.plant_name,
      scientificName: suggestion.plant_name, // or taxonomy if available
      confidence: Math.round(suggestion.probability * 100),
      description: suggestion.plant_details?.wiki_description?.value,
      careLevel: suggestion.plant_details?.care_level?.value,
      careInstructions: suggestion.plant_details?.care_instructions?.value,
      waterSchedule: suggestion.plant_details?.water_schedule?.value,
      sunlight: suggestion.plant_details?.sunlight?.value
    };
  }
  
  throw new Error('No plant suggestions found');
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
```
  </action>
  <verify>
    <automated>grep -l "identifyPlant" src/services/plantIdService.ts</automated>
  </verify>
  <done>plantIdService.ts calls backend API</done>
</task>

<task type="auto">
  <name>Task 2: Update identify screen</name>
  <files>app/identify.tsx</files>
  <action>
Update app/identify.tsx to:
1. Accept photoUri from camera (via router params)
2. Call identifyPlant() on mount
3. Display result with confidence score
4. Add "Agregar a mi colección" button

Check existing app/identify.tsx structure first and integrate.
  </action>
  <verify>
    <automated>grep -l "identifyPlant" app/identify.tsx</automated>
  </verify>
  <done>Identify screen shows camera photo result</done>
</task>

<task type="auto">
  <name>Task 3: Add offline support with expo-sqlite</name>
  <files>src/services/offlineStorage.ts</files>
  <action>
Create offline storage service using expo-sqlite:

```typescript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('plantasmon.db');

// Create tables
export async function initOfflineStorage() {
  db.executeSync(`
    CREATE TABLE IF NOT EXISTS plants (
      id TEXT PRIMARY KEY,
      commonName TEXT,
      scientificName TEXT,
      imageUri TEXT,
      addedAt TEXT
    )
  `);
  
  db.executeSync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      data TEXT,
      createdAt TEXT
    )
  `);
}

// Save plant locally
export function savePlantLocal(plant: any) {
  db.executeSync(
    'INSERT OR REPLACE INTO plants VALUES (?, ?, ?, ?, ?)',
    [plant.id, plant.commonName, plant.scientificName, plant.imageUri, new Date().toISOString()]
  );
}

// Add to sync queue
export function addToSyncQueue(action: string, data: any) {
  db.executeSync(
    'INSERT INTO sync_queue (action, data, createdAt) VALUES (?, ?, ?)',
    [action, JSON.stringify(data), new Date().toISOString()]
  );
}
```
  </action>
  <verify>
    <automated>ls -la src/services/offlineStorage.ts</automated>
  </verify>
  <done>Offline storage service created</done>
</task>

</tasks>

<verification>
- [ ] Frontend calls backend API
- [ ] Plant identification returns with confidence score
- [ ] Data can be stored offline
- [ ] Sync queue works

</verification>

<success_criteria>
Frontend integrates with backend API and has offline storage
</success_criteria>