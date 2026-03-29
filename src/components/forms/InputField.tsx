import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { COLORS } from "@/src/constants/theme";

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function InputField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  multiline = false,
  numberOfLines = 1,
}: InputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[
              styles.input,
              multiline && styles.multiline,
              !!error && styles.inputError,
              !editable && styles.inputDisabled,
            ]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.mutedForeground}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value ?? ""}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            editable={editable}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
          />
          {error && (
            <Text style={styles.errorText}>{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.foreground,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.foreground,
    fontSize: 15,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: COLORS.destructive,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: COLORS.destructive,
    fontSize: 12,
    marginTop: 4,
  },
});
