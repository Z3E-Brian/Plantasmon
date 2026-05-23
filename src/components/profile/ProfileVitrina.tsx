import { useThemedStyles } from "@/src/styles/themedStyles";
import { useAppTheme } from "@/src/constants/designSystem";
import { Alert, Pressable, Text, View } from "react-native";
import type { ObtenibleDefinition, RarityTier } from "@/src/services/obteniblesService";

// ── Types ───────────────────────────────────────────────────────
export interface ObtenibleDisplay {
  definition: ObtenibleDefinition;
  obtained: boolean;
}

// ── Rarity colors ───────────────────────────────────────────────
const RARITY_COLORS: Record<RarityTier, string> = {
  comun: "#9CA3AF",      // gray
  raro: "#3B82F6",       // blue
  epico: "#8B5CF6",      // purple
  legendario: "#F59E0B", // gold/amber
};

const RARITY_LABELS: Record<RarityTier, string> = {
  comun: "Común",
  raro: "Raro",
  epico: "Épico",
  legendario: "Legendario",
};

// ── Component ───────────────────────────────────────────────────
export function ProfileVitrina({
  items,
  obtainedCount,
  totalCount,
}: {
  items: ObtenibleDisplay[];
  obtainedCount: number;
  totalCount: number;
}) {
  const { theme, styles } = useThemedStyles("profileVitrina");

  const handleItemPress = (item: ObtenibleDisplay) => {
    Alert.alert(
      item.definition.name,
      `${item.definition.description}\n\nRareza: ${RARITY_LABELS[item.definition.rarity]}\n${item.obtained ? "✅ Obtenido" : "🔒 No obtenido"}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Vitrina</Text>
        <Text style={styles.headerCount}>
          {obtainedCount}/{totalCount} obtenidos
        </Text>
      </View>

      {/* Empty state */}
      {items.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Próximamente...</Text>
        </View>
      )}

      {/* Grid */}
      <View style={styles.grid}>
        {items.map((item) => (
          <Pressable
            key={item.definition.id}
            onPress={() => handleItemPress(item)}
            style={[
              styles.itemCard,
              item.obtained ? styles.itemCardObtained : styles.itemCardLocked,
              item.obtained && {
                borderColor: RARITY_COLORS[item.definition.rarity],
              },
            ]}
          >
            {/* Emoji icon */}
            <Text style={styles.itemIcon}>{item.definition.icon}</Text>

            {/* Name */}
            <Text
              style={[
                styles.itemName,
                {
                  color: item.obtained
                    ? theme.colors.textPrimary
                    : theme.colors.textTertiary,
                },
              ]}
              numberOfLines={2}
            >
              {item.definition.name}
            </Text>

            {/* Lock overlay for unobtained */}
            {!item.obtained && (
              <View style={styles.lockOverlay}>
                <Text style={styles.lockText}>🔒</Text>
              </View>
            )}

            {/* Rarity dot */}
            <View
              style={[
                styles.rarityDot,
                { backgroundColor: RARITY_COLORS[item.definition.rarity] },
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
