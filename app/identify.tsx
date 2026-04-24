import ScreenWrapper from "@/src/components/screenWrapper/ScreenWrapper"
import { useThemedStyles } from "@/src/styles/themedStyles"
import { identifyPlant, PlantIdentificationResult } from "@/src/services/plantIdService"
import { useState, useEffect } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Identify() {
  const insets = useSafeAreaInsets()
  const { theme, styles: s } = useThemedStyles("identify")
  const router = useRouter()
  const { photoUri } = useLocalSearchParams()

  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<PlantIdentificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (photoUri) {
      runIdentification()
    } else {
      setLoading(false)
    }
  }, [])

  const runIdentification = async () => {
    if (!photoUri) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const identification = await identifyPlant(photoUri as string)
      setResult(identification)
    } catch (err: any) {
      console.error('Identification error:', err)
      setError(err.message || 'Error al identificar la planta')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCollection = () => {
    if (!result) return
    Alert.alert(
      '¡Agregar a colección!',
      `${result.commonName} fue identificada con ${result.confidence}% de confianza.`,
      [{ text: 'OK' }]
    )
  }

  const handleRetry = () => {
    setResult(null)
    setError(null)
    router.back()
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={[
          s.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.title}>📷 Identificar</Text>

        {photoUri && (
          <Image source={{ uri: photoUri as string }} style={{ width: '100%', height: 300, borderRadius: 12 }} />
        )}

        {loading && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 12 }}>Identificando planta...</Text>
          </View>
        )}

        {error && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: 'red' }}>❌ {error}</Text>
            <TouchableOpacity 
              style={{ backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, marginTop: 12 }}
              onPress={handleRetry}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {result && !loading && (
          <View style={{ marginTop: 20 }}>
            <View style={{ backgroundColor: '#52b788', padding: 12, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {result.confidence}% confianza
              </Text>
            </View>
            
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
              {result.commonName}
            </Text>
            <Text style={{ fontSize: 16, fontStyle: 'italic', textAlign: 'center', color: '#666' }}>
              {result.scientificName}
            </Text>

            {result.waterSchedule && (
              <View style={{ marginTop: 16, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>💧 Riego</Text>
                <Text>{result.waterSchedule}</Text>
              </View>
            )}

            {result.sunlight && (
              <View style={{ marginTop: 12, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>☀️ Luz</Text>
                <Text>{result.sunlight}</Text>
              </View>
            )}

            <TouchableOpacity
              style={{ backgroundColor: '#52b788', padding: 16, borderRadius: 8, marginTop: 20 }}
              onPress={handleAddToCollection}
              disabled={adding}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>
                🌿 Agregar a mi colección
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ padding: 16, marginTop: 12 }}
              onPress={handleRetry}
            >
              <Text style={{ color: theme.colors.primary, textAlign: 'center' }}>
                Identificar otra planta
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!photoUri && !loading && (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Text>Tomá una foto de una planta para identificarla</Text>
            <TouchableOpacity 
              style={{ backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, marginTop: 16 }}
              onPress={() => router.back()}
            >
              <Text style={{ color: '#fff' }}>Volver</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  )
}