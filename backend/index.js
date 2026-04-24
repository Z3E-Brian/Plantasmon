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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PlantasMon API running on port ${PORT}`);
  console.log(`Accepting connections from any IP`);
});