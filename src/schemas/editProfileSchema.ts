import { z } from "zod";

export const PLANT_LOCATIONS = [
  { value: "ventana", label: "🪟 Ventana" },
  { value: "cochera", label: "🚗 Cochera" },
  { value: "patio", label: "🌳 Patio" },
  { value: "patio_pilas", label: "🪣 Patio de pilas" },
  { value: "otro", label: "✏️ Otro" },
] as const;

export const PLANT_PERSONALITIES = [
  { value: "resistente", label: "💪 Resistente" },
  { value: "delicada", label: "🌸 Delicada" },
  { value: "dramatica", label: "🎭 Dramática" },
  { value: "independiente", label: "😎 Independiente" },
] as const;

export type PlantLocationValue = typeof PLANT_LOCATIONS[number]["value"];
export type PlantPersonalityValue = typeof PLANT_PERSONALITIES[number]["value"];

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(40, "El nombre no puede superar 40 caracteres"),
  bio: z
    .string()
    .max(150, "La bio no puede superar 150 caracteres")
    .optional(),
  location: z
    .string()
    .max(60, "La ubicación no puede superar 60 caracteres")
    .optional(),
  plantNickname: z
    .string()
    .max(40, "El apodo no puede superar 40 caracteres")
    .optional(),
  plantNotes: z
    .string()
    .max(200, "Las notas no pueden superar 200 caracteres")
    .optional(),
  plantLocation: z
    .string()
    .max(80, "La ubicación no puede superar 80 caracteres")
    .optional(),
  plantPersonality: z
    .string()
    .optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
