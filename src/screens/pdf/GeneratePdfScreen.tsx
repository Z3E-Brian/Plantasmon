import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { generateAppProgressPdf, sharePdf } from "@/src/services/pdfExportService";

export default function GeneratePdfScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  // NOTE: Replace with actual EAS build URL once available.
  // See 10-03-SUMMARY.md — run: eas build --platform android --profile preview
  const buildUrl =
    "Build pending — run eas build --platform android --profile preview";

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const uri = await generateAppProgressPdf({
        projectName: "PlantasMon",
        version: "1.0.0",
        date: today,
        buildUrl,
        sections: [
          {
            title: "Resumen del Proyecto",
            content:
              "PlantasMon es una aplicación companion para el cuidado de plantas. Permite identificar plantas mediante IA, llevar un registro de cuidados, completar misiones y logros, y chatear con otros usuarios en tiempo real.",
          },
          {
            title: "Funcionalidades Implementadas",
            content:
              "• Autenticación (email + Google OAuth)\n• Identificación de plantas con IA (Pl@ntNet)\n• Catálogo de plantas con búsqueda\n• Misiones diarias y semanales con recompensas\n• Sistema de logros (25+ logros)\n• Objetos cosméticos obtenibles\n• Calendario de cuidado de plantas\n• Feed de actividad en perfil\n• Chat en tiempo real con WebSockets",
          },
          {
            title: "Chat en Tiempo Real",
            content:
              "Nuevo módulo de chat integrado con backend FastAPI en Render. Soporta mensajes grupales y directos con WebSockets, subida de archivos multimedia a Cloudinary, cifrado de extremo a extremo con TweetNaCl, y mensajes temporales auto-destructivos.",
          },
        ],
      });

      setPdfUri(uri);
      Alert.alert("PDF Generado", "El reporte de progreso se ha generado exitosamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el PDF. Intenta de nuevo.");
      console.error("PDF generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!pdfUri) return;
    try {
      await sharePdf(pdfUri);
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir el PDF.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F5F3ED" }}>
      <View style={{ padding: 24, paddingTop: insets.top + 16 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#1D3426",
            marginBottom: 4,
          }}
        >
          Reporte de Progreso
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#667A6A",
            marginBottom: 24,
          }}
        >
          Genera un PDF con el avance actual de PlantasMon
        </Text>

        {/* Info card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "#ceaea0",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#1D3426",
              marginBottom: 12,
            }}
          >
            📋 Información del Proyecto
          </Text>
          {([
            ["Proyecto", "PlantasMon"],
            ["Versión", "1.0.0"],
            ["Plataforma", "Android"],
            ["Framework", "Expo SDK 54"],
            ["Backend Chat", "FastAPI + WebSockets"],
            [
              "Build URL",
              buildUrl.length > 50
                ? buildUrl.substring(0, 50) + "..."
                : buildUrl,
            ],
          ] as [string, string][]).map(([label, value]) => (
            <View
              key={label}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 6,
                borderBottomWidth: 1,
                borderBottomColor: "#F5F3ED",
              }}
            >
              <Text style={{ fontSize: 13, color: "#667A6A" }}>{label}</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#1D3426",
                  flex: 1,
                  textAlign: "right",
                }}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>

        {/* Generate button */}
        <Pressable
          onPress={handleGenerate}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#95A796" : "#2E5739",
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              📄 Generar PDF
            </Text>
          )}
        </Pressable>

        {/* Share button */}
        {pdfUri && (
          <Pressable
            onPress={handleShare}
            style={{
              backgroundColor: "#C9A468",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              📤 Compartir PDF
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}
