import { COLORS } from "@/src/constants/theme"
import { Dimensions, StyleSheet } from "react-native"
const { width } = Dimensions.get("window")
    
const CARD_WIDTH = (width - 52) / 2

const styles = StyleSheet.create({
  container: {},
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "800",
  },
  filterTextActive: {
    color: COLORS.primaryForeground,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(22, 61, 40, 0.8)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardImageContainer: {
    height: 112,
    position: "relative",
    backgroundColor: "rgba(22, 61, 40, 0.5)",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
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
    color: COLORS.foreground,
  },
  cardScientific: {
    fontSize: 10,
    fontStyle: "italic",
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  careRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  careIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  waterDrops: {
    flexDirection: "row",
    gap: 2,
  },
  daysOwned: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255,255,255,0.4)",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.foreground,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 4,
  },
})

export default styles