import { validatePlantData } from "@/src/lib/plantValidation"

describe("validatePlantData", () => {
  it("acepta datos válidos", () => {
    const result = validatePlantData({
      commonName: "Monstera",
      scientificName: "Monstera deliciosa",
      wateringDays: 7,
      sunlight: "partial",
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("reporta errores cuando hay datos inválidos", () => {
    const result = validatePlantData({
      commonName: "",
      scientificName: "A",
      wateringDays: 0,
      sunlight: "shade" as any,
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "El nombre común debe tener al menos 2 caracteres",
        "El nombre científico debe tener al menos 3 caracteres",
        "El riego debe estar entre 1 y 30 días",
        "La luz debe ser low, partial o full",
      ])
    )
  })
})
