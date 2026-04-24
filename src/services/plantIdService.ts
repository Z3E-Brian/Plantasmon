const API_URL = 'http://192.168.1.16:3000';

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
    throw new Error('Identification failed');
  }

  const data = await response.json();
  
  if (data.suggestions && data.suggestions.length > 0) {
    const suggestion = data.suggestions[0];
    return {
      id: suggestion.id,
      commonName: suggestion.plant_details?.common_names?.value?.[0] || suggestion.plant_name,
      scientificName: suggestion.plant_name,
      confidence: Math.round((suggestion.probability || 0) * 100),
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