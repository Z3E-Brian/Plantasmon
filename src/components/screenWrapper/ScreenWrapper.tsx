import { SafeAreaView } from "react-native-safe-area-context"
import { useAppTheme } from "@/src/constants/designSystem"

export default function ScreenWrapper({
    children,
}: {
    children: React.ReactNode | React.ReactNode[]
}) {
    const theme = useAppTheme()
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            edges={["top", "left", "right"]}
        >
            {children}
        </SafeAreaView>
    )
}
