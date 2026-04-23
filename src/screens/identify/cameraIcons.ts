export const CAMERA_ICONS = {
  // Close
  close: '⊗',
  
  // Flash
  flashOff: '⚡',
  flashOn: '⚡',
  flashAuto: '⚡',
  
  // Camera switch
  switch: '↻',
  
  // Zoom
  zoomIn: '+',
  zoomOut: '-',
  
  // Capture
  capture: '⚫',
  
  // Profile
  profile: '👤',
  
  // Gallery
  gallery: '🖼',
  
  // Settings
  settings: '⚙',
};

export const CAMERA_LABELS = {
  close: 'Cerrar',
  flash: 'Flash',
  switch: 'Cambiar',
  zoom: 'Zoom',
  capture: 'Capturar',
  profile: 'Perfil',
  gallery: 'Galeria',
};

export const useCameraIcons = () => {
  return { CAMERA_ICONS, CAMERA_LABELS };
};