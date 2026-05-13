# Análisis de Módulos Offline — PlantasMon

## Metodología

Se evaluó cada módulo de la aplicación según su capacidad de funcionar sin conexión a internet, considerando el tipo de operación (lectura/escritura/API externa) y el impacto en la experiencia de usuario.

## Resultados

| Módulo | Tipo | Offline | Justificación |
|--------|------|---------|---------------|
| Colección de Plantas | Lectura | Sí | Cacheada en AsyncStorage (`plantasmon_cache`). Disponible sin red. |
| Detalle / Editar Planta | Escritura | Sí (sync) | Cambios se guardan en cola (`plantasmon_offline_queue`) y se sincronizan al recuperar conexión. |
| Planta Compañera | Lectura/Escritura | Sí | Siempre disponible; cambios se sincronizan después. |
| Recordatorios / Calendario | Local | Sí | Notificaciones locales con `expo-notifications`. Sin dependencia de red. |
| Home / Dashboard | Lectura | Parcial | Muestra datos del cache local; no se actualiza hasta recuperar red. |
| Perfil de Usuario | Lectura | Parcial | Datos básicos en cache local; ediciones pendientes de sync. |
| Identificación con IA | API externa | No | Requiere PlantNet API. Sin red se bloquea con mensaje al usuario. |
| Auth — Login/Registro | Red | No | Requiere Firebase Auth. Token se mantiene local si ya inició sesión. |

## Estrategia de Almacenamiento

- **AsyncStorage** como capa de cache y cola de sincronización
- Cache: `plantasmon_cache` — colección de plantas serializada
- Cola: `plantasmon_offline_queue` — operaciones pendientes de sync
- No se requiere SQLite ni MMKV para el volumen actual de datos

## Indicadores UI

| Estado | Color | Mensaje |
|--------|-------|---------|
| Offline | Amber | "Sin conexión · N cambios pendientes" |
| Sincronizando | Azul | "Sincronizando..." con barra de progreso |
| Error | Rojo | "Error al sincronizar" + botón Reintentar |
| Pendiente en tarjeta | — | Icono ⬆ en plantas con cambios sin sync |
