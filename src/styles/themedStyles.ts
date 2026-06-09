import { AppTheme, getAppTheme, useAppTheme } from "@/src/constants/designSystem";
import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/theme";

// ==================== ACHIEVEMENTS ====================
export const createAchievementsStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {},
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    headerText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.textTertiary,
    },
    categoryDivider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.sm,
    },
    categoryDividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    categoryDividerText: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.colors.textTertiary,
      marginHorizontal: 8,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    badge: {
      width: "31%",
      alignItems: "center",
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 3,
      position: "relative",
    },
    badgeEarned: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary + "30",
    },
    badgeLocked: {
      backgroundColor: theme.colors.surfaceMuted,
      borderColor: theme.colors.border,
      color: theme.colors.textTertiary,
      opacity: 0.4,
    },
    badgeIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
    },
    badgeName: {
      fontSize: 9,
      fontWeight: "700",
      textAlign: "center",
      lineHeight: 12,
      letterSpacing: 0.3,
      color: theme.colors.textPrimary,
    },
    earnedBadge: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    earnedBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.colors.primaryForeground,
    },
    progressBarContainer: {
      width: "100%",
      height: 3,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 2,
      marginTop: 4,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
  });

// ==================== ACTIVITY FEED ====================
export const createActivityFeedStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: "relative",
      paddingTop: 20,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -12,
    },
    timelineLine: {
      position: "absolute",
      left: 20,
      top: 0,
      bottom: 0,
      width: 1,
      backgroundColor: theme.colors.border,
    },
    item: {
      flexDirection: "row",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    dotContainer: {
      zIndex: 10,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
      paddingTop: 2,
    },
    title: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    description: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      lineHeight: 18,
      marginTop: 2,
    },
    time: {
      fontSize: 10,
      color: theme.colors.textTertiary,
      fontWeight: "600",
      marginTop: 4,
    },
  });

// ==================== BOTTOM NAV ====================
export const createBottomNavStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.mode === "dark" 
        ? "rgba(10, 10, 10, 0.95)" 
        : "rgba(255, 255, 255, 0.98)",
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      zIndex: 1000,
      elevation: 10,
      shadowColor: theme.mode === "dark" ? "#000" : "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: theme.mode === "dark" ? 0.3 : 0.08,
      shadowRadius: 8,
    },
    navRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingTop: 6,
    },
    navItem: {
      alignItems: "center",
      paddingVertical: 4,
      minWidth: 56,
    },
    navItemCenter: {
      marginTop: -20,
    },
    centerButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 4,
      borderColor: theme.colors.background,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    navLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.colors.textTertiary,
      marginTop: 4,
    },
    navLabelActive: {
      color: theme.colors.primary,
    },
    navLabelCenter: {
      marginTop: 6,
      color: theme.colors.textPrimary,
    },
  });

// ==================== PLANT COLLECTION ====================
export const createPlantCollectionStyles = (theme: AppTheme) => {
  const { width } = Dimensions.get("window")
  const CARD_WIDTH = (width - 52) / 2
  
  return StyleSheet.create({
    container: {},
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    filters: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    filterButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
      borderColor: theme.colors.primary,
    },
    filterText: {
      fontSize: 13,
      fontWeight: "800",
      color: theme.colors.textSecondary,
    },
    filterTextActive: {
      color: "#FFFFFF",
    },
    row: {
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    card: {
      width: CARD_WIDTH,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardImageContainer: {
      height: 112,
      position: "relative",
      backgroundColor: theme.colors.primarySoft,
    },
    cardImage: {
      width: "100%",
      height: "100%",
    },
    favoriteButton: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.4)",
      alignItems: "center",
      justifyContent: "center",
    },
    healthTag: {
      position: "absolute",
      bottom: 6,
      left: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
    },
    healthText: {
      fontSize: 9,
      fontWeight: "700",
      textTransform: "capitalize",
    },
    cardInfo: {
      padding: 10,
    },
    cardName: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    cardScientific: {
      fontSize: 10,
      fontStyle: "italic",
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    careRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: theme.spacing.sm,
    },
    careIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    waterDrops: {
      flexDirection: "row",
      gap: 2,
    },
    daysOwned: {
      fontSize: 9,
      fontWeight: "600",
      color: theme.colors.textTertiary,
    },
    empty: {
      alignItems: "center",
      paddingVertical: 48,
    },
    emptyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    emptySubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  })
}

// ==================== PROFILE ABOUT ====================
export const createProfileAboutStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: theme.spacing.xl,
      marginTop: -12,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: 13,
      fontWeight: "800",
      color: theme.colors.textPrimary,
      letterSpacing: 1,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    editText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    bio: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.textSecondary,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.colors.chip,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 6,
      borderRadius: theme.radius.md,
    },
    chipText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    chipEmoji: {
      fontSize: 12,
      opacity: theme.mode === "light" ? 0.8 : 1,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 20,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    statCard: {
      width: "47%",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    statEmoji: {
      fontSize: 16,
      opacity: theme.mode === "light" ? 0.9 : 1,
    },
    statInfo: {
      flex: 1,
    },
    statTitle: {
      fontSize: 9,
      fontWeight: "700",
      color: theme.colors.textTertiary,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    statValue: {
      fontSize: 14,
      fontWeight: "800",
      color: theme.colors.textPrimary,
      marginTop: 2,
    },
    statSubtitle: {
      fontSize: 10,
      color: theme.colors.textTertiary,
      marginTop: 2,
    },
  });

// ==================== HOME SCREEN ====================
export const createHomeScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 70,
    },
  });

// ==================== HOME HEADER ====================
export const createHomeHeaderStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: theme.spacing.md,
    },
    greeting: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    statsRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
    },
  });

// ==================== PLANT OF THE DAY ====================
export const createPlantOfTheDayStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: theme.colors.surface,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    header: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.primarySoft,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary + "30",
    },
    headerBadge: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.primary,
      letterSpacing: 1,
    },
    image: {
      width: "100%",
      height: 240,
    },
    content: {
      padding: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    scientificName: {
      fontSize: 16,
      fontStyle: "italic",
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    factBox: {
      backgroundColor: theme.colors.primarySoft,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    factTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    factText: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.textSecondary,
    },
  });

// ==================== LAST IDENTIFIED ====================
export const createLastIdentifiedStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.md,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    time: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    chevron: {
      fontSize: 24,
      color: theme.colors.textSecondary,
    },
  });

// ==================== USER PROGRESS ====================
export const createUserProgressStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    progressText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.sm,
    },
  });

// ==================== DAILY MISSIONS ====================
export const createDailyMissionsStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
    },
    missionsList: {
      gap: theme.spacing.md,
    },
    missionItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    missionIcon: {
      fontSize: 20,
      width: 24,
    },
    missionText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    missionComplete: {
      textDecorationLine: "line-through",
      color: theme.colors.textSecondary,
    },
  });

// ==================== RECENT ACHIEVEMENT ====================
export const createRecentAchievementStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
    },
    badge: {
      fontSize: 48,
    },
    info: {
      flex: 1,
    },
    label: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    name: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
  });

// ==================== TIP CARD ====================
export const createTipCardStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    icon: {
      fontSize: 24,
    },
    content: {
      flex: 1,
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },
    bold: {
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
  });

// ==================== IDENTIFY SCREEN ====================
export const createIdentifyStyles = (theme: AppTheme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: 20,
    },
    devBadge: {
      backgroundColor: theme.colors.primarySoft,
      borderRadius: theme.radius.sm,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.colors.primary + "40",
      marginBottom: 20,
      alignSelf: "flex-start",
    },
    devBadgeText: {
      color: theme.colors.primary,
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: 28,
      fontWeight: "900",
      marginBottom: 6,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 24,
    },
    label: {
      color: theme.colors.textTertiary,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
      marginTop: 16,
    },
    shortcuts: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 4,
    },
    shortcut: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.sm,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    shortcutSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
    },
    shortcutText: {
      color: theme.colors.textPrimary,
      fontSize: 12,
      fontWeight: "600",
    },
    shortcutTextSelected: {
      color: theme.colors.primary,
    },
    shortcutId: {
      color: theme.colors.textTertiary,
      fontSize: 10,
      marginTop: 2,
    },
    idRow: {
      flexDirection: "row",
      gap: 8,
    },
    idInput: {
      flex: 1,
    },
    checkBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
      paddingHorizontal: 14,
      paddingVertical: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    checkBtnDisabled: {
      opacity: 0.5,
    },
    checkBtnText: {
      color: theme.colors.primaryForeground,
      fontSize: 13,
      fontWeight: "700",
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: theme.colors.textPrimary,
      fontSize: 14,
    },
    inputError: {
      borderColor: COLORS.destructive,
    },
    textarea: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    errorText: {
      color: COLORS.destructive,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 2,
    },
    preview: {
      fontSize: 13,
      marginTop: 6,
      marginLeft: 2,
      fontWeight: "500",
    },
    previewOk: {
      color: theme.colors.success,
    },
    previewErr: {
      color: COLORS.destructive,
    },
    submitBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 28,
    },
    submitBtnDisabled: {
      opacity: 0.5,
    },
    submitBtnText: {
      color: theme.colors.primaryForeground,
      fontSize: 16,
      fontWeight: "700",
    },
    hint: {
      color: theme.colors.textTertiary,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 20,
      textAlign: "center",
    },
    hintBold: {
      fontWeight: "700",
      color: theme.colors.textSecondary,
    },
  });

// ==================== EXPLORE SCREEN ====================
export const createExploreScreenStyles = (theme: AppTheme) => {
  const { width } = Dimensions.get("window")
  const CARD_WIDTH = (width - 52) / 2

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      marginHorizontal: 20,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 14,
      color: theme.colors.textPrimary,
    },
    clearButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    clearButtonText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    flatList: {
      paddingHorizontal: 20,
      paddingBottom: 70,
    },
    row: {
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    card: {
      width: CARD_WIDTH,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardImageContainer: {
      height: 112,
      position: "relative",
      backgroundColor: theme.colors.primarySoft,
    },
    cardImage: {
      width: "100%",
      height: "100%",
    },
    rarityBadge: {
      position: "absolute",
      top: 6,
      right: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
    },
    rarityText: {
      fontSize: 9,
      fontWeight: "700",
    },
    healthTag: {
      position: "absolute",
      bottom: 6,
      left: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
    },
    healthText: {
      fontSize: 9,
      fontWeight: "700",
      textTransform: "capitalize",
    },
    cardInfo: {
      padding: 10,
    },
    cardName: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    cardScientific: {
      fontSize: 10,
      fontStyle: "italic",
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    careRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: theme.spacing.sm,
    },
    careIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    waterDrops: {
      flexDirection: "row",
      gap: 2,
    },
    daysOwned: {
      fontSize: 9,
      fontWeight: "600",
      color: theme.colors.textTertiary,
    },
    empty: {
      alignItems: "center",
      paddingVertical: 48,
    },
    emptyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    emptySubtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    skeletonCard: {
      width: CARD_WIDTH,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.md,
      opacity: 0.5,
      height: 200,
    },
    skeletonImage: {
      height: 112,
      backgroundColor: theme.colors.surfaceMuted,
      borderTopLeftRadius: theme.radius.md,
      borderTopRightRadius: theme.radius.md,
    },
    skeletonText: {
      height: 12,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.sm,
      marginTop: 8,
      marginHorizontal: 10,
    },
  })
}

// ==================== JOURNAL SCREEN ====================
export const createJournalScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 70,
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    card: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    countBadge: {
      backgroundColor: theme.colors.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    countBadgeText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    plantRowItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    plantRowImage: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.primarySoft,
    },
    plantRowName: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    plantRowChevron: {
      fontSize: 18,
      color: theme.colors.textSecondary,
    },
    footerLink: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primary,
      marginTop: theme.spacing.sm,
    },
    achievementCard: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    achievementContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
    },
    achievementIcon: {
      width: 48,
      height: 48,
      fontSize: 48,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    achievementName: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    skeletonCard: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      height: 120,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.md,
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    emptyBody: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.sm,
    },
    errorCard: {
      marginHorizontal: 20,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: COLORS.destructive,
    },
    errorText: {
      fontSize: 14,
      color: COLORS.destructive,
      marginBottom: theme.spacing.sm,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      alignSelf: "flex-start",
    },
    retryText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primaryForeground,
    },
  });

// ==================== STATS BAR ====================
export const createStatsBarStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingBottom: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
    },
    statIcon: {
      fontSize: 18,
      marginBottom: 2,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.colors.textPrimary,
    },
    statLabel: {
      fontSize: 9,
      fontWeight: "600",
      color: theme.colors.textTertiary,
      textAlign: "center",
      marginTop: 2,
    },
    skeleton: {
      flex: 1,
      height: 68,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.md,
      opacity: 0.5,
    },
  });

// ==================== CHAT SCREEN ====================
export const createChatScreenStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    joinContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      gap: 16,
    },
    joinTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    joinInput: {
      width: "100%",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: 14,
      fontSize: 16,
      color: theme.colors.textPrimary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    joinButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: 14,
      paddingHorizontal: 32,
    },
    joinButtonText: {
      color: theme.colors.primaryForeground,
      fontSize: 16,
      fontWeight: "700",
    },
    messagesList: {
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 8,
    },
    statusBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.surfaceMuted,
      gap: 8,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    onlineCount: {
      fontSize: 12,
      color: theme.colors.textTertiary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textTertiary,
      textAlign: "center",
    },
    errorText: {
      fontSize: 14,
      color: COLORS.destructive,
      textAlign: "center",
    },
  });

// ==================== CHAT BUBBLE ====================
export const createChatBubbleStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginVertical: 4,
      maxWidth: "80%",
      paddingHorizontal: 4,
    },
    ownContainer: {
      alignSelf: "flex-end",
    },
    otherContainer: {
      alignSelf: "flex-start",
    },
    bubble: {
      padding: 12,
      borderRadius: theme.radius.md,
    },
    ownBubble: {
      backgroundColor: theme.colors.primary,
      borderBottomRightRadius: 4,
    },
    otherBubble: {
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    senderName: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.textTertiary,
      marginBottom: 2,
    },
    ownSenderName: {
      color: theme.colors.primaryForeground,
      opacity: 0.8,
    },
    messageText: {
      fontSize: 15,
      color: theme.colors.textPrimary,
    },
    ownMessageText: {
      color: theme.colors.primaryForeground,
    },
    timestamp: {
      fontSize: 10,
      color: theme.colors.textTertiary,
      marginTop: 4,
      alignSelf: "flex-end",
    },
  });

// ==================== CHAT INPUT ====================
export const createChatInputStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 15,
      color: theme.colors.textPrimary,
      maxHeight: 80,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    sendButtonText: {
      fontSize: 18,
      color: theme.colors.primaryForeground,
    },
  });

// ==================== PROFILE VITRINA ====================
export const createProfileVitrinaStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {},
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    headerCount: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.textTertiary,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    itemCard: {
      width: "31%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      borderWidth: 2,
      position: "relative",
    },
    itemCardObtained: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary + "30",
    },
    itemCardLocked: {
      backgroundColor: theme.colors.surfaceMuted,
      borderColor: theme.colors.border,
      opacity: 0.4,
    },
    itemIcon: {
      fontSize: 28,
      marginBottom: 2,
    },
    itemName: {
      fontSize: 9,
      fontWeight: "700",
      textAlign: "center",
      lineHeight: 11,
      color: theme.colors.textPrimary,
    },
    lockOverlay: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "rgba(0,0,0,0.3)",
      alignItems: "center",
      justifyContent: "center",
    },
    lockText: {
      fontSize: 9,
      color: "#FFF",
      fontWeight: "700",
    },
    rarityDot: {
      position: "absolute",
      bottom: 4,
      right: 4,
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 32,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textTertiary,
      fontWeight: "600",
    },
  });

// ==================== HOOK CENTRALIZADO ====================
const stylesByComponent = {
  achievements: {
    light: createAchievementsStyles(getAppTheme("light")),
    dark: createAchievementsStyles(getAppTheme("dark")),
  },
  activityFeed: {
    light: createActivityFeedStyles(getAppTheme("light")),
    dark: createActivityFeedStyles(getAppTheme("dark")),
  },
  bottomNav: {
    light: createBottomNavStyles(getAppTheme("light")),
    dark: createBottomNavStyles(getAppTheme("dark")),
  },
  plantCollection: {
    light: createPlantCollectionStyles(getAppTheme("light")),
    dark: createPlantCollectionStyles(getAppTheme("dark")),
  },
  profileAbout: {
    light: createProfileAboutStyles(getAppTheme("light")),
    dark: createProfileAboutStyles(getAppTheme("dark")),
  },
  homeScreen: {
    light: createHomeScreenStyles(getAppTheme("light")),
    dark: createHomeScreenStyles(getAppTheme("dark")),
  },
  homeHeader: {
    light: createHomeHeaderStyles(getAppTheme("light")),
    dark: createHomeHeaderStyles(getAppTheme("dark")),
  },
  statsBar: {
    light: createStatsBarStyles(getAppTheme("light")),
    dark: createStatsBarStyles(getAppTheme("dark")),
  },
  plantOfTheDay: {
    light: createPlantOfTheDayStyles(getAppTheme("light")),
    dark: createPlantOfTheDayStyles(getAppTheme("dark")),
  },
  lastIdentified: {
    light: createLastIdentifiedStyles(getAppTheme("light")),
    dark: createLastIdentifiedStyles(getAppTheme("dark")),
  },
  userProgress: {
    light: createUserProgressStyles(getAppTheme("light")),
    dark: createUserProgressStyles(getAppTheme("dark")),
  },
  dailyMissions: {
    light: createDailyMissionsStyles(getAppTheme("light")),
    dark: createDailyMissionsStyles(getAppTheme("dark")),
  },
  weeklyMissions: {
    light: createDailyMissionsStyles(getAppTheme("light")),
    dark: createDailyMissionsStyles(getAppTheme("dark")),
  },
  recentAchievement: {
    light: createRecentAchievementStyles(getAppTheme("light")),
    dark: createRecentAchievementStyles(getAppTheme("dark")),
  },
  tipCard: {
    light: createTipCardStyles(getAppTheme("light")),
    dark: createTipCardStyles(getAppTheme("dark")),
  },
  identify: {
    light: createIdentifyStyles(getAppTheme("light")),
    dark: createIdentifyStyles(getAppTheme("dark")),
  },
  exploreScreen: {
    light: createExploreScreenStyles(getAppTheme("light")),
    dark: createExploreScreenStyles(getAppTheme("dark")),
  },
  journalScreen: {
    light: createJournalScreenStyles(getAppTheme("light")),
    dark: createJournalScreenStyles(getAppTheme("dark")),
  },
  profileVitrina: {
    light: createProfileVitrinaStyles(getAppTheme("light")),
    dark: createProfileVitrinaStyles(getAppTheme("dark")),
  },
  chatScreen: {
    light: createChatScreenStyles(getAppTheme("light")),
    dark: createChatScreenStyles(getAppTheme("dark")),
  },
  chatBubble: {
    light: createChatBubbleStyles(getAppTheme("light")),
    dark: createChatBubbleStyles(getAppTheme("dark")),
  },
  chatInput: {
    light: createChatInputStyles(getAppTheme("light")),
    dark: createChatInputStyles(getAppTheme("dark")),
  },
} as const;

type ComponentName = keyof typeof stylesByComponent;
type StylesForComponent<T extends ComponentName> = ReturnType<
  T extends "achievements"
    ? typeof createAchievementsStyles
    : T extends "activityFeed"
    ? typeof createActivityFeedStyles
    : T extends "bottomNav"
    ? typeof createBottomNavStyles
    : T extends "plantCollection"
    ? typeof createPlantCollectionStyles
    : T extends "profileAbout"
    ? typeof createProfileAboutStyles
    : T extends "homeScreen"
    ? typeof createHomeScreenStyles
    : T extends "homeHeader"
    ? typeof createHomeHeaderStyles
    : T extends "statsBar"
    ? typeof createStatsBarStyles
    : T extends "plantOfTheDay"
    ? typeof createPlantOfTheDayStyles
    : T extends "lastIdentified"
    ? typeof createLastIdentifiedStyles
    : T extends "userProgress"
    ? typeof createUserProgressStyles
    : T extends "dailyMissions"
    ? typeof createDailyMissionsStyles
    : T extends "weeklyMissions"
    ? typeof createDailyMissionsStyles
    : T extends "recentAchievement"
    ? typeof createRecentAchievementStyles
    : T extends "tipCard"
    ? typeof createTipCardStyles
    : T extends "identify"
    ? typeof createIdentifyStyles
    : T extends "exploreScreen"
    ? typeof createExploreScreenStyles
    : T extends "journalScreen"
    ? typeof createJournalScreenStyles
    : T extends "profileVitrina"
    ? typeof createProfileVitrinaStyles
    : T extends "chatScreen"
    ? typeof createChatScreenStyles
    : T extends "chatBubble"
    ? typeof createChatBubbleStyles
    : T extends "chatInput"
    ? typeof createChatInputStyles
    : never
>;

export function useThemedStyles<T extends ComponentName>(componentName: T): {
  theme: AppTheme;
  styles: StylesForComponent<T>;
} {
  const theme = useAppTheme();
  return {
    theme,
    styles: stylesByComponent[componentName][theme.mode] as StylesForComponent<T>,
  };
}
