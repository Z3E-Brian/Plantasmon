
import { COLORS } from "@/src/constants/theme";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "rgb(136, 99, 173)",
    },
    vignette: {
        zIndex: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    scrollView: {
        flex: 1,
        zIndex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    patternContainer: {
        opacity: 0.6,
    },
    patternRow: {
        flexDirection: "row",
    },
    contentSection: {
        width: "100%",
        // backgroundColor se aplica dinámicamente en el componente según el tema
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 24,
        paddingHorizontal: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(253, 20, 20, 0.1)",
    },
    dividerIcon: {
        marginHorizontal: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(255, 246, 246, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    tabsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tabsList: {
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    tabButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
    },
    tabButtonActive: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    tabText: {
        fontSize: 11,
        fontWeight: "700",
        color: "rgba(255,255,255,0.6)",
    },
    tabTextActive: {
        color: COLORS.primaryForeground,
    },
    tabContent: {
        marginTop: 20,
    },
})

export default styles