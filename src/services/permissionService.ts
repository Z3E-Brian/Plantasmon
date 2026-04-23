import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface AppPermissions {
  camera: PermissionStatus;
  mediaLibrary: PermissionStatus;
}

const normalizeStatus = (granted: boolean, status: string): PermissionStatus => {
  if (granted) return 'granted';
  if (status === 'undetermined') return 'undetermined';
  return 'denied';
};

const PermissionService = {
  async requestCameraPermission(): Promise<PermissionStatus> {
    const { granted, status } = await Camera.requestCameraPermissionsAsync();
    return normalizeStatus(granted, status);
  },

  async requestMediaLibraryPermission(): Promise<PermissionStatus> {
    // Skip in Expo Go - not supported
    // Use development build for full support
    console.log('[PermissionService] Skipping media library permission in Expo Go');
    return 'denied';
  },

  async checkAllPermissions(): Promise<AppPermissions> {
    const [camera] = await Promise.all([
      Camera.getCameraPermissionsAsync(),
    ]);

    return {
      camera: normalizeStatus(camera.granted, camera.status),
      mediaLibrary: 'denied',
    };
  },

  async requestAllPermissions(): Promise<AppPermissions> {
    const camera = await PermissionService.requestCameraPermission();
    const mediaLibrary = await PermissionService.requestMediaLibraryPermission();

    return { camera, mediaLibrary };
  },

  isGranted: (status: PermissionStatus): boolean => status === 'granted',
};

export default PermissionService;