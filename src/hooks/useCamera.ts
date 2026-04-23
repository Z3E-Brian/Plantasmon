import { useRef, useState, useCallback, useEffect } from 'react';
import { CameraView, CameraType, FlashMode } from 'expo-camera';
import CameraService from '@/src/services/cameraService';
import type { PhotoResult, CaptureOptions } from '@/src/services/cameraService';
import PermissionService from '@/src/services/permissionService';
import type { AppPermissions } from '@/src/services/permissionService';

interface UseCameraOptions {
  requestOnMount?: boolean;
}

interface UseCameraReturn {
  cameraRef: React.RefObject<CameraView | null>;
  onCameraReady: () => void;
  permissions: AppPermissions | null;
  isPermissionGranted: boolean;
  isCameraReady: boolean;
  isLoadingPermissions: boolean;
  facing: CameraType;
  flashMode: FlashMode;
  zoom: number;
  requestPermissions: () => Promise<void>;
  takePhoto: (options?: CaptureOptions) => Promise<PhotoResult | null>;
  toggleFacing: () => void;
  toggleFlash: () => void;
  setZoom: (z: number) => void;
  saveToGallery: (uri: string) => Promise<void>;
  lastPhoto: PhotoResult | null;
  error: string | null;
}

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const { requestOnMount = true } = options;

  const cameraRef = useRef<CameraView | null>(null);

  const [permissions, setPermissions] = useState<AppPermissions | null>(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [zoomLevel, setZoomLevel] = useState(0.1);
  const [lastPhoto, setLastPhoto] = useState<PhotoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Solo necesita permiso de cámara (media library es opcional para guardar)
  const isPermissionGranted =
    permissions !== null &&
    PermissionService.isGranted(permissions.camera);

  const requestPermissions = useCallback(async () => {
    setIsLoadingPermissions(true);
    setError(null);
    try {
      const result = await PermissionService.requestAllPermissions();
      setPermissions(result);
    } catch (err) {
      console.error('[useCamera] Permission error:', err);
      setError('Error al solicitar permisos');
    } finally {
      setIsLoadingPermissions(false);
    }
  }, []);

  // Timeout fallback: mark camera ready after 3s
  useEffect(() => {
    if (!isCameraReady && permissions && PermissionService.isGranted(permissions.camera)) {
      const timer = setTimeout(() => {
        if (!isCameraReady) {
          console.log('[useCamera] Timeout: forcing camera ready');
          setIsCameraReady(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [permissions, isCameraReady]);

  useEffect(() => {
    if (requestOnMount) {
      requestPermissions();
    }
  }, [requestOnMount, requestPermissions]);

  const takePhoto = useCallback(
    async (options: CaptureOptions = {}): Promise<PhotoResult | null> => {
      setError(null);
      if (!cameraRef.current) {
        setError('La cámara no está lista');
        return null;
      }
      try {
        const photo = await CameraService.takePhoto(cameraRef as React.RefObject<CameraView>, options);
        setLastPhoto(photo);
        return photo;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al capturar foto';
        setError(message);
        return null;
      }
    },
    []
  );

  const toggleFacing = useCallback(() => {
    setFacing((prev) => CameraService.toggleFacing(prev));
  }, []);

  const toggleFlash = useCallback(() => {
    setFlashMode((prev) => CameraService.cycleFlashMode(prev));
  }, []);

  const setZoom = useCallback((z: number) => {
    setZoomLevel(z);
  }, []);

  const saveToGallery = useCallback(async (uri: string) => {
    setError(null);
    try {
      await CameraService.saveToGallery(uri);
    } catch {
      setError('Error al guardar en galería');
    }
  }, []);

  const onCameraReady = useCallback(() => {
    console.log('[useCamera] Camera ready!');
    setIsCameraReady(true);
  }, []);

  return {
    cameraRef,
    onCameraReady,
    permissions,
    isPermissionGranted,
    isCameraReady,
    isLoadingPermissions,
    facing,
    flashMode,
    zoom: zoomLevel,
    requestPermissions,
    takePhoto,
    toggleFacing,
    toggleFlash,
    setZoom,
    saveToGallery,
    lastPhoto,
    error,
  };
}