const API_URL = 'https://plantasmon.onrender.com';

export interface PlantIdentificationResult {
  plantId: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  description?: string;
  careLevel?: string;
  careInstructions?: string;
  waterSchedule?: string;
  sunlight?: string;
  id?: string;
}

export async function identifyPlant(photoUri: string): Promise<PlantIdentificationResult> {
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

  if (!response.ok) {
    const errorText = await response.text();
    console.log("Detalle del error del servidor:", errorText);
    console.log("Status Code:", response.status);
    throw new Error(`Identification failed (${response.status})`);
  }

  const data = await response.json();
  const suggestions = extractSuggestions(data);

  if (suggestions.length > 0) {
    const suggestion = suggestions[0] as any;
    const scientificName =
      suggestion.plant_name ||
      suggestion.name ||
      suggestion.details?.scientific_name ||
      "Unknown";

    const commonName =
      suggestion.plant_details?.common_names?.value?.[0] ||
      suggestion.details?.common_names?.[0] ||
      scientificName;

    const probability =
      suggestion.probability ??
      suggestion.confidence ??
      0;

    return {
      plantId: String(suggestion.id || suggestion.entity_id || scientificName),
      commonName,
      scientificName,
      confidence: Math.round(Number(probability) * 100),
      description:
        suggestion.plant_details?.wiki_description?.value ||
        suggestion.details?.description?.value ||
        suggestion.details?.description,
      careLevel:
        suggestion.plant_details?.care_level?.value ||
        suggestion.details?.care?.level,
      careInstructions:
        suggestion.plant_details?.care_instructions?.value ||
        suggestion.details?.care?.instructions,
      waterSchedule:
        suggestion.plant_details?.water_schedule?.value ||
        suggestion.details?.care?.watering,
      sunlight:
        suggestion.plant_details?.sunlight?.value ||
        suggestion.details?.care?.sunlight,
    };
  }

  console.log("Plant.id response without suggestions:", JSON.stringify(data));
  
  throw new Error('No plant suggestions found');
}

function extractSuggestions(data: any): any[] {
  if (!data || typeof data !== 'object') return [];

  if (Array.isArray(data.suggestions)) return data.suggestions;

  if (Array.isArray(data.result?.classification?.suggestions)) {
    return data.result.classification.suggestions;
  }

  if (Array.isArray(data.classification?.suggestions)) {
    return data.classification.suggestions;
  }

  if (Array.isArray(data.output?.suggestions)) {
    return data.output.suggestions;
  }

  return [];
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
