---
phase: 02-lab3
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - backend/
  - backend/index.js
  - backend/package.json
  - backend/.env
  - render.yaml
autonomous: true
requirements:
  - Plant identification via API
---

<objective>
Create backend service that receives plant images and returns identification results from Plant.id API.
</objective>

<tasks>

<task type="auto">
  <name>Task 1: Create backend directory and package.json</name>
  <files>backend/package.json</files>
  <action>
Create backend directory with package.json:

```json
{
  "name": "plantasmon-api",
  "version": "1.0.0",
  "description": "PlantasMon Plant Identification API",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```
  </action>
  <verify>
    <automated>test -f backend/package.json && cat backend/package.json</automated>
  </verify>
  <done>Backend directory and package.json created</done>
</task>

<task type="auto">
  <name>Task 2: Implement Express server with Plant.id endpoint</name>
  <files>backend/index.js</files>
  <action>
Create backend/index.js:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PLANT_API_KEY = process.env.PLANT_API_KEY;
const PLANT_API_URL = 'https://plant.id/api/v3/identify';

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'PlantasMon API running' });
});

app.post('/api/identify', async (req, res) => {
  const { images, latitude, longitude } = req.body;
  
  console.log('Identification request received');
  console.log('Images count:', images ? images.length : 0);
  
  if (!images || images.length === 0) {
    return res.status(400).json({ error: 'No images provided' });
  }
  
  try {
    const response = await fetch(PLANT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANT_API_KEY
      },
      body: JSON.stringify({
        images: images,
        modifiers: ['crops_fast', 'align_full_image'],
        plant_details: ['common_names', 'url', 'wiki_description', 'care_level', 'care_instructions', 'water_schedule', 'sunlight'],
        latitude: latitude || 0,
        longitude: longitude || 0
      })
    });
    
    const data = await response.json();
    console.log('Plant.id response received, suggestions:', data.suggestions?.length || 0);
    res.json(data);
  } catch (error) {
    console.error('Plant ID error:', error);
    res.status(500).json({ error: 'Identification failed: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`PlantasMon API running on port ${PORT}`);
});
```
  </action>
  <verify>
    <automated>grep -l "/api/identify" backend/index.js</automated>
  </verify>
  <done>Backend endpoint /api/identify implemented</done>
</task>

<task type="auto">
  <name>Task 3: Create environment configuration</name>
  <files>backend/.env</files>
  <action>
Create backend/.env file:

```
PLANT_API_KEY=VQiCcflXT7Q71IyD0qsr40SlBoyvxBwuPZEawXVXK2MlqeJwL
PORT=3000
```

Also create backend/.env.example (without real key):
```
PLANT_API_KEY=your_api_key_here
PORT=3000
```
  </action>
  <verify>
    <automated>test -f backend/.env && echo "exists"</automated>
  </verify>
  <done>.env files created</done>
</task>

<task type="auto">
  <name>Task 4: Create Render blueprint</name>
  <files>render.yaml</files>
  <action>
Create render.yaml in project root:

```yaml
# render.yaml
services:
  - type: web
    name: plantasmon-api
    env: node
    region: ohio
    plan: free
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: PLANT_API_KEY
        sync: false
      - key: NODE_ENV
        value: production
```

This tells Render to deploy only the backend/ folder.
  </action>
  <verify>
    <automated>test -f render.yaml && grep -l "rootDir: backend" render.yaml</automated>
  </verify>
  <done>Render blueprint configured</done>
</task>

</tasks>

<verification>
- [ ] backend/package.json exists with dependencies
- [ ] backend/index.js has /api/identify endpoint
- [ ] backend/.env has PLANT_API_KEY
- [ ] render.yaml configures backend deployment

</verification>

<success_criteria>
Backend can receive image, call Plant.id API, and return results
</success_criteria>