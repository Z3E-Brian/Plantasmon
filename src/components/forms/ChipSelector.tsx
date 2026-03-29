import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "@/src/constants/theme";

interface ChipOption {
  value: string;
  label: string;
}

interface ChipSelectorProps {
  options: readonly ChipOption[];
  value: string;
  onChange: (value: string) => void;
  showCustomInput?: boolean;          // muestra campo libre si value === "otro"
  customInputPlaceholder?: string;
  customValue?: string;
  onCustomChange?: (text: string) => void;
  label?: string;
}

export function ChipSelector({
  options,
  value,
  onChange,
  showCustomInput = false,
  customInputPlaceholder = "Escribí aquí...",
  customValue = "",
  onCustomChange,
  label,
}: ChipSelectorProps) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {showCustomInput && value === "otro" && (
        <TextInput
          style={styles.customInput}
          placeholder={customInputPlaceholder}
          placeholderTextColor={COLORS.mutedForeground}
          value={customValue}
          onChangeText={onCustomChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.mutedForeground,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.mutedForeground,
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: COLORS.primaryForeground,
    fontWeight: "700",
  },
  customInput: {
    marginTop: 10,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.foreground,
    fontSize: 14,
  },
});
