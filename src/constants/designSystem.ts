import { ColorSchemeName, useColorScheme } from "react-native";
import { COLORS } from "./theme";

type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  primaryForeground: string;
  secondary: string;
  secondarySoft: string;
  secondaryForeground: string;
  border: string;
  chip: string;
  success: string;
}

interface ThemeTypography {
  display: string;
  heading: string;
  body: string;
}

interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface ThemeRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
}

const sharedTypography: ThemeTypography = {
  display: "System",
  heading: "System",
  body: "System"
};

const sharedSpacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
};

const sharedRadius: ThemeRadius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 28,
  full: 999,
};

// Tema claro
const lightColors: ThemeColors = {
  background: "#F5F3ED",
  surface: "#FFFFFF",
  surfaceMuted: "#d3c79c",
  textPrimary: "#1D3426",
  textSecondary: "#667A6A",
  textTertiary: "#424f3e",
  primary: COLORS.primary,
  primaryStrong: "#2E5739",
  primarySoft: "#D9E7D8",
  primaryForeground: "#FFFFFF",
  secondary: "#C9A468",
  secondarySoft: "#E9D9BC",
  secondaryForeground: "#1D3426",
  border: "#ceaea0",
  chip: "#c0dba3",
  success: "#6A9A62"
};

// Tema oscuro
const darkColors: ThemeColors = {
  background: COLORS.background,
  surface: "#1A241D",
  surfaceMuted: "#233026",
  textPrimary: COLORS.foreground,
  textSecondary: "#BECCBE",
  textTertiary: "#95A796",
  primary: COLORS.primary,
  primaryStrong: "#6DA875",
  primarySoft: "#2A3A2E",
  primaryForeground: "#0D1F12",
  secondary: "#D8B980",
  secondarySoft: "#4C4029",
  secondaryForeground: "#0D1F12",
  border: "#324337",
  chip: "#293629",
  success: "#89C283"
};

const themes: Record<ThemeMode, AppTheme> = {
  light: {
    mode: "light",
    colors: lightColors,
    typography: sharedTypography,
    spacing: sharedSpacing,
    radius: sharedRadius,
  },
  dark: {
    mode: "dark",
    colors: darkColors,
    typography: sharedTypography,
    spacing: sharedSpacing,
    radius: sharedRadius,
  },
};

export function getAppTheme(mode: ColorSchemeName): AppTheme {
  if (mode === "dark") {
    return themes.dark;
  }
  return themes.light;
}

export function useAppTheme(): AppTheme {
  const mode = useColorScheme();
  return getAppTheme(mode);
}