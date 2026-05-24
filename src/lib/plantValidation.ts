export type PlantValidationInput = {
  commonName: string
  scientificName: string
  wateringDays: number
  sunlight: "low" | "partial" | "full"
}

export type PlantValidationResult = {
  valid: boolean
  errors: string[]
}

export function validatePlantData(input: PlantValidationInput): PlantValidationResult {
  const errors: string[] = []

  if (!input.commonName.trim() || input.commonName.trim().length < 2) {
    errors.push("El nombre común debe tener al menos 2 caracteres")
  }
  if (!input.scientificName.trim() || input.scientificName.trim().length < 3) {
    errors.push("El nombre científico debe tener al menos 3 caracteres")
  }
  if (!Number.isFinite(input.wateringDays) || input.wateringDays < 1 || input.wateringDays > 30) {
    errors.push("El riego debe estar entre 1 y 30 días")
  }
  if (!["low", "partial", "full"].includes(input.sunlight)) {
    errors.push("La luz debe ser low, partial o full")
  }

  return { valid: errors.length === 0, errors }
}
