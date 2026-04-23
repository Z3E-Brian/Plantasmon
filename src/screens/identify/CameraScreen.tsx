import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { CameraView, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { useCamera } from "@/src/hooks/useCamera";
import { styles } from "./CameraScreen.styles";

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lastTouchDistance = useRef<number | null>(null);
  const zoomRef = useRef(0);
  
  const {
    cameraRef,
    onCameraReady,
    isPermissionGranted,
    isCameraReady,
    isLoadingPermissions,
    facing,
    flashMode,
    zoom,
    requestPermissions,
    takePhoto,
    toggleFacing,
    toggleFlash,
    setZoom,
    saveToGallery,
    error,
  } = useCamera({ requestOnMount: true });

  const [isCapturing, setIsCapturing] = useState(false);

  // Zoom max real para camara (1.0x typically)
const MAX_ZOOM = 1.0;
const ZOOM_STEP = 0.1;
const PINCH_SENSITIVITY = 0.08;

const handleTouchMove = (e: any) => {
    const touches = e.nativeEvent.touches;
    if (touches.length === 2) {
      const t0 = touches[0];
      const t1 = touches[1];
      const dx = t1.pageX - t0.pageX;
      const dy = t1.pageY - t0.pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (lastTouchDistance.current !== null) {
        const delta = distance - lastTouchDistance.current;
        if (Math.abs(delta) > 5) {
          const zoomDelta = delta > 0 ? PINCH_SENSITIVITY : -PINCH_SENSITIVITY;
          const currentZoom = zoomRef.current + zoomDelta;
          const newZoom = Math.max(ZOOM_STEP, Math.min(MAX_ZOOM, currentZoom));
          zoomRef.current = newZoom;
          setZoom(newZoom);
        }
      }
      lastTouchDistance.current = distance;
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      const photo = await takePhoto({ quality: 0.85 });
      if (photo) {
        Alert.alert(
          "Foto tomada",
          "Que deseas hacer?",
          [
            { text: "Identificar", onPress: () => router.push({ pathname: "/identify", params: { photoUri: photo.uri } }) },
            { text: "Guardar", onPress: async () => { await saveToGallery(photo.uri); Alert.alert("Listo", "Guardada en galeria"); } },
            { text: "Descartar", style: "cancel" },
          ]
        );
      }
    } catch { Alert.alert("Error", "No se pudo capturar"); } 
    finally { setIsCapturing(false); }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets[0]) {
      router.push({ pathname: "/identify", params: { photoUri: result.assets[0].uri } });
    }
  };

  const handleClose = () => router.back();

  const getFlashIcon = () => {
    if (flashMode === "on") return "flash";
    if (flashMode === "auto") return "flash";
    return "flash-outline";
  };

  const getFlashColor = () => {
    if (flashMode === "on") return "#fbbf24";
    if (flashMode === "auto") return "#fbbf24";
    return "#fff";
  };

  const getFlashLabel = () => {
    if (flashMode === "on") return "ON";
    if (flashMode === "auto") return "A";
    return "OFF";
  };

  if (isLoadingPermissions) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#52b788" />
      </View>
    );
  }

  if (!isPermissionGranted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionIcon}>
          <Ionicons name="leaf" size={40} color="#52b788" />
        </View>
        <Text style={styles.permissionTitle}>Permiso de camara</Text>
        <Text style={styles.permissionText}>Se necesita acceso a la camara{'\n'}para identificar plantas.</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermissions}>
          <Text style={styles.permissionBtnText}>Permitir</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClose} style={{ marginTop: 20 }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View 
      style={styles.container}
      onTouchStart={(e) => {
        if (e.nativeEvent.touches.length === 2) {
          const t = e.nativeEvent.touches;
          const d = Math.sqrt(Math.pow(t[1].pageX - t[0].pageX, 2) + Math.pow(t[1].pageY - t[0].pageY, 2));
          lastTouchDistance.current = d;
          zoomRef.current = Math.max(ZOOM_STEP, zoom);
        }
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={facing} 
        flash={flashMode} 
        zoom={zoom} 
        onCameraReady={onCameraReady}
      />
      
      {!isCameraReady && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#52b788" />
        </View>
      )}
      
      {/* Top bar */}
      {isCameraReady && (
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.flashBtn} onPress={toggleFlash}>
            <View style={{ alignItems: "center" }}>
              <Ionicons name={getFlashIcon()} size={20} color={getFlashColor()} />
              <Text style={{ color: getFlashColor(), fontSize: 9, marginTop: 2 }}>{getFlashLabel()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Zoom slider - left side */}
      {isCameraReady && (
        <View style={styles.zoomContainer}>
          <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoom(Math.min(MAX_ZOOM, zoom + ZOOM_STEP))}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.zoomBar}>
            <View style={[styles.zoomFill, { height: `${(zoom / MAX_ZOOM) * 100}%` }]} />
          </View>
          
          <Text style={styles.zoomValue}>{zoom.toFixed(1)}x</Text>
          
          <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoom(Math.max(ZOOM_STEP, zoom - ZOOM_STEP))}>
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom bar */}
      {isCameraReady && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={styles.galleryBtn} onPress={handleGallery}>
            <Ionicons name="images-outline" size={26} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureBtnOuter} onPress={handleCapture} disabled={isCapturing}>
            {isCapturing ? (
              <ActivityIndicator color="#52b788" />
            ) : (
              <View style={styles.captureBtn_inner} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.switchCamBtn} onPress={toggleFacing}>
            <Ionicons name="camera-reverse-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View style={styles.errorToast}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}