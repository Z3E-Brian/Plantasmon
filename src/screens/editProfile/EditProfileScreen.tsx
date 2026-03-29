import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { InputField } from "@/src/components/forms/InputField";
import { ChipSelector } from "@/src/components/forms/ChipSelector";
import { db } from "@/src/config/firebase";
import { COLORS } from "@/src/constants/theme";
import {
  EditProfileFormData,
  editProfileSchema,
  PLANT_LOCATIONS,
  PLANT_PERSONALITIES,
} from "@/src/schemas/editProfileSchema";
import { updateUserPlant, setCompanionPlant } from "@/src/services/userPlantsService";
import { CURRENT_USER_ID, getUserProfile, updateUserBio } from "@/src/services/userService";

interface PlantInfo {
  id: string; commonName: string; scientificName: string; difficulty: string;
  wateringDays: number; nickname: string; notes: string;
  lastWatered: string | null; lastWeeded: string | null;
  favorite: boolean; isCompanion: boolean; location: string; personality: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "Sin registrar";
  return new Date(iso).toLocaleDateString("es-CR", { day: "2-digit", month: "long", year: "numeric" });
}

function difficultyLabel(d: string): string {
  return ({ easy: "Fácil", medium: "Moderada", hard: "Difícil" } as Record<string,string>)[d] ?? d;
}

export default function EditProfileScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [loading, setLoading]               = useState(true);
  const [saving,  setSaving]                = useState(false);
  const [allPlants, setAllPlants]           = useState<PlantInfo[]>([]);
  const [companion, setCompanion]           = useState<PlantInfo | null>(null);
  const [customLocation, setCustomLocation] = useState("");
  const [markingWater, setMarkingWater]     = useState(false);
  const [markingWeed,  setMarkingWeed]      = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",       // ← solo valida al salir del campo, no al abrir
    defaultValues: {
      name: "", bio: "", location: "",
      plantNickname: "", plantNotes: "",
      plantLocation: "", plantPersonality: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [user, userSnap] = await Promise.all([
          getUserProfile(),
          getDoc(doc(db, "users", CURRENT_USER_ID)),
        ]);
        if (!user) return;

        const rawUserPlants: any[] =
          userSnap.data()?.subcollections?.userPlants ??
          userSnap.data()?.userPlants ?? [];

        const plantInfos: PlantInfo[] = (
          await Promise.all(
            rawUserPlants.map(async (raw: any) => {
              const snap = await getDoc(doc(db, "plants", raw.id));
              if (!snap.exists()) return null;
              const pd = snap.data();
              return {
                id: raw.id, commonName: pd?.commonName ?? "", scientificName: pd?.scientificName ?? "",
                difficulty: pd?.difficulty ?? "", wateringDays: pd?.wateringDays ?? 0,
                nickname: raw.nickname ?? "", notes: raw.notes ?? "",
                lastWatered: raw.lastWatered ?? null, lastWeeded: raw.lastWeeded ?? null,
                favorite: raw.favorite ?? false, isCompanion: raw.isCompanion ?? false,
                location: raw.location ?? "", personality: raw.personality ?? "",
              } as PlantInfo;
            })
          )
        ).filter(Boolean) as PlantInfo[];

        setAllPlants(plantInfos);
        const currentCompanion = plantInfos.find((p) => p.isCompanion) ?? plantInfos[0] ?? null;
        setCompanion(currentCompanion);

        const predefined = PLANT_LOCATIONS.map((l) => l.value);
        const saved      = currentCompanion?.location ?? "";
        const isCustom   = saved !== "" && !predefined.includes(saved as any);
        if (isCustom) setCustomLocation(saved);

        reset({
          name: user.name ?? "", bio: user.bio ?? "", location: user.location ?? "",
          plantNickname: currentCompanion?.nickname ?? "",
          plantNotes: currentCompanion?.notes ?? "",
          plantLocation: isCustom ? "otro" : saved,
          plantPersonality: currentCompanion?.personality ?? "",
        });
      } catch {
        Toast.show({ type: "error", text1: "Error al cargar", text2: "No se pudieron obtener los datos.", position: "top" });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelectCompanion = (plant: PlantInfo) => {
    setCompanion(plant);
    const predefined = PLANT_LOCATIONS.map((l) => l.value);
    const isCustom   = plant.location !== "" && !predefined.includes(plant.location as any);
    if (isCustom) setCustomLocation(plant.location);
    setValue("plantNickname",    plant.nickname);
    setValue("plantNotes",       plant.notes);
    setValue("plantLocation",    isCustom ? "otro" : plant.location);
    setValue("plantPersonality", plant.personality);
  };

  const onSubmit = async (data: EditProfileFormData) => {
    setSaving(true);
    try {
      await updateUserBio(CURRENT_USER_ID, { bio: data.bio, location: data.location });
      await updateDoc(doc(db, "users", CURRENT_USER_ID), { displayName: data.name });
      if (companion) {
        const finalLocation = data.plantLocation === "otro" ? customLocation : data.plantLocation ?? "";
        await updateUserPlant(companion.id, {
          nickname: data.plantNickname, notes: data.plantNotes,
          location: finalLocation, personality: data.plantPersonality,
        });
        if (!companion.isCompanion) await setCompanionPlant(companion.id);
      }
      Toast.show({ type: "success", text1: "¡Perfil actualizado!", text2: "Los cambios se guardaron correctamente.", position: "top", visibilityTime: 3000 });
      setTimeout(() => router.back(), 1500);
    } catch {
      Toast.show({ type: "error", text1: "Error al guardar", text2: "Ocurrió un problema. Intenta de nuevo.", position: "top", visibilityTime: 4000 });
    } finally { setSaving(false); }
  };

  const handleMarkWatered = async () => {
    if (!companion) return;
    setMarkingWater(true);
    try {
      const now = new Date().toISOString();
      await updateUserPlant(companion.id, { lastWatered: now });
      setCompanion((p) => p ? { ...p, lastWatered: now } : p);
      Toast.show({ type: "success", text1: "💧 ¡Regada!", text2: "Se registró el riego de hoy.", position: "top", visibilityTime: 2500 });
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "No se pudo registrar el riego.", position: "top" });
    } finally { setMarkingWater(false); }
  };

  const handleMarkWeeded = async () => {
    if (!companion) return;
    setMarkingWeed(true);
    try {
      const now = new Date().toISOString();
      await updateUserPlant(companion.id, { lastWeeded: now });
      setCompanion((p) => p ? { ...p, lastWeeded: now } : p);
      Toast.show({ type: "success", text1: "🌱 ¡Deshierbada!", text2: "Se registró el deshierbe.", position: "top", visibilityTime: 2500 });
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "No se pudo registrar el deshierbe.", position: "top" });
    } finally { setMarkingWeed(false); }
  };

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={s.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={s.title}>Editar Perfil</Text>
      </View>

      <Text style={s.sectionTitle}>Información personal</Text>
      <InputField name="name"     control={control} label="Nombre"    placeholder="Tu nombre visible" />
      <InputField name="bio"      control={control} label="Bio"       placeholder="Cuéntanos sobre ti..." multiline numberOfLines={3} />
      <InputField name="location" control={control} label="Ubicación" placeholder="Ciudad, País" />

      {allPlants.length > 0 && (
        <>
          <Text style={s.sectionTitle}>🌿 Planta compañera</Text>

          {allPlants.length > 1 && (
            <View style={s.companionSelector}>
              <Text style={s.companionSelectorLabel}>¿Cuál es tu compañera?</Text>
              <View style={s.companionRow}>
                {allPlants.map((plant) => {
                  const sel = companion?.id === plant.id;
                  return (
                    <TouchableOpacity
                      key={plant.id}
                      style={[s.companionChip, sel && s.companionChipSelected]}
                      onPress={() => handleSelectCompanion(plant)}
                      activeOpacity={0.75}
                    >
                      <Text style={s.companionChipEmoji}>🪴</Text>
                      <Text style={[s.companionChipText, sel && s.companionChipTextSelected]}>
                        {plant.nickname || plant.commonName}
                      </Text>
                      {sel && (
                        <View style={s.companionBadge}>
                          <Text style={s.companionBadgeText}>★</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {companion && (
            <>
              <View style={s.plantCard}>
                <Text style={s.plantName}>{companion.commonName}</Text>
                <Text style={s.plantScientific}>{companion.scientificName}</Text>
                <View style={s.plantTags}>
                  <View style={s.tag}><Text style={s.tagText}>🎯 {difficultyLabel(companion.difficulty)}</Text></View>
                  <View style={s.tag}><Text style={s.tagText}>💧 Regar cada {companion.wateringDays} días</Text></View>
                </View>
              </View>

              <InputField name="plantNickname" control={control} label="Apodo"            placeholder="Dale un apodo especial..." />
              <InputField name="plantNotes"    control={control} label="Notas personales" placeholder="Observaciones..." multiline numberOfLines={3} />

              <Controller
                control={control} name="plantLocation"
                render={({ field: { value, onChange } }) => (
                  <ChipSelector label="📍 Ubicación" options={PLANT_LOCATIONS} value={value ?? ""} onChange={onChange}
                    showCustomInput customInputPlaceholder="¿Dónde está tu planta?" customValue={customLocation} onCustomChange={setCustomLocation} />
                )}
              />
              <Controller
                control={control} name="plantPersonality"
                render={({ field: { value, onChange } }) => (
                  <ChipSelector label="✨ Personalidad" options={PLANT_PERSONALITIES} value={value ?? ""} onChange={onChange} />
                )}
              />

              <Text style={s.actionLabel}>Acciones rápidas</Text>
              <View style={s.actionRow}>
                <View style={s.actionInfo}>
                  <Text style={s.actionTitle}>💧 Última vez regada</Text>
                  <Text style={s.actionDate}>{formatDate(companion.lastWatered)}</Text>
                </View>
                <Pressable style={[s.actionBtn, markingWater && s.actionBtnDisabled]} onPress={handleMarkWatered} disabled={markingWater}>
                  {markingWater ? <ActivityIndicator size="small" color={COLORS.primaryForeground} /> : <Text style={s.actionBtnText}>Marcar hoy</Text>}
                </Pressable>
              </View>
              <View style={s.actionRow}>
                <View style={s.actionInfo}>
                  <Text style={s.actionTitle}>🌱 Última vez deshierbada</Text>
                  <Text style={s.actionDate}>{formatDate(companion.lastWeeded)}</Text>
                </View>
                <Pressable style={[s.actionBtn, markingWeed && s.actionBtnDisabled]} onPress={handleMarkWeeded} disabled={markingWeed}>
                  {markingWeed ? <ActivityIndicator size="small" color={COLORS.primaryForeground} /> : <Text style={s.actionBtnText}>Marcar hoy</Text>}
                </Pressable>
              </View>
            </>
          )}
        </>
      )}

      <TouchableOpacity
        style={[s.saveBtn, saving && s.saveBtnDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={saving}
      >
        {saving ? <ActivityIndicator color={COLORS.primaryForeground} /> : <Text style={s.saveBtnText}>Guardar cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  content:     { padding: 20, paddingBottom: 80, paddingTop: 0 },
  centered:    { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background, gap: 12 },
  loadingText: { color: COLORS.mutedForeground, fontSize: 14 },
  header:      { flexDirection: "row", alignItems: "center", marginBottom: 28, gap: 12 },
  backBtn:     { padding: 4 },
  backText:    { color: COLORS.primary, fontSize: 15 },
  title:       { color: COLORS.foreground, fontSize: 22, fontWeight: "bold" },
  sectionTitle: { color: COLORS.mutedForeground, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  companionSelector:         { marginBottom: 16 },
  companionSelectorLabel:    { color: COLORS.mutedForeground, fontSize: 13, fontWeight: "600", marginBottom: 10 },
  companionRow:              { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  companionChip:             { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border },
  companionChipSelected:     { borderColor: COLORS.primary, backgroundColor: COLORS.primary + "18" },
  companionChipEmoji:        { fontSize: 16 },
  companionChipText:         { color: COLORS.mutedForeground, fontSize: 13, fontWeight: "500" },
  companionChipTextSelected: { color: COLORS.primary, fontWeight: "700" },
  companionBadge:            { backgroundColor: COLORS.primary, borderRadius: 10, width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  companionBadgeText:        { color: COLORS.primaryForeground, fontSize: 10, fontWeight: "700" },
  plantCard:       { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  plantName:       { color: COLORS.foreground, fontSize: 16, fontWeight: "700", marginBottom: 2 },
  plantScientific: { color: COLORS.mutedForeground, fontSize: 13, fontStyle: "italic", marginBottom: 10 },
  plantTags:       { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  tag:             { backgroundColor: COLORS.secondary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText:         { color: COLORS.secondaryForeground, fontSize: 12 },
  actionLabel:       { color: COLORS.mutedForeground, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 4 },
  actionRow:         { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  actionInfo:        { flex: 1, gap: 3 },
  actionTitle:       { color: COLORS.foreground, fontSize: 14, fontWeight: "600" },
  actionDate:        { color: COLORS.mutedForeground, fontSize: 12 },
  actionBtn:         { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, minWidth: 90, alignItems: "center" },
  actionBtnDisabled: { opacity: 0.5 },
  actionBtnText:     { color: COLORS.primaryForeground, fontSize: 13, fontWeight: "600" },
  saveBtn:           { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 24 },
  saveBtnDisabled:   { opacity: 0.5 },
  saveBtnText:       { color: COLORS.primaryForeground, fontSize: 16, fontWeight: "700" },
});
