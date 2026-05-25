# PlantasMon — Bitácora de Avance

**Milestone:** v1.0
**Fecha:** Mayo 2026
**Autor:** Brian Z.
**Curso:** Desarrollo de Aplicaciones Móviles
**Repositorio:** [GitHub — main branch](https://github.com/bzelenka/PlantasMon)

> **Para exportar a PDF:** Abrir este archivo en VS Code → Ctrl+Shift+P → "Markdown: Export to PDF".
> O usar línea de comandos: `npx md-to-pdf BITACORA.md`
> Las capturas de pantalla deben estar en la carpeta `screenshots/` al mismo nivel que este archivo.

---

## Tabla de Contenido

1. [Resumen Ejecutivo](#3-resumen-ejecutivo)
2. [Bitácora por Módulo](#4-bitácora-por-módulo)
   - 2.1 [Autenticación (Auth)](#module-1-autenticación-auth)
   - 2.2 [Home Dashboard](#module-2-home-dashboard)
   - 2.3 [Lab3 — API + Sincronización](#module-3-lab3--api--sincronización)
   - 2.4 [Explore](#module-4-explore)
   - 2.5 [Journal](#module-5-journal)
   - 2.6 [Profile](#module-6-profile)
   - 2.7 [Achievements & Rewards](#module-7-achievements--rewards-funcionalidad-propia)
   - 2.8 [Missions & Rewards](#module-8-missions--rewards)
   - 2.9 [Popups (Informative Boxes)](#module-9-popups-informative-boxes)
   - 2.10 [Activity Feed](#module-10-activity-feed)
   - 2.11 [Calendar](#module-11-calendar)
3. [Módulos Nuevos Agregados](#5-módulos-nuevos-agregados)
4. [Funcionalidad Propia — Achievements/Rewards](#6-funcionalidad-propia--achievementsrewards)
5. [Investigación de Testing/QA](#7-investigación-de-testingqa)
6. [Pruebas Implementadas](#8-pruebas-implementadas)
7. [Repositorio](#9-repositorio)
8. [Conclusiones](#10-conclusiones)

---

## 3. Resumen Ejecutivo

PlantasMon es una aplicación móvil de cuidado de plantas desarrollada con **React Native / Expo SDK 54** que permite a los usuarios identificar plantas mediante la API de Pl@ntNet, llevar un registro de su colección, y ganar logros y recompensas a través de un sistema de gamificación. El backend utiliza **Firebase Firestore** para almacenamiento de datos y **Firebase Auth** para autenticación. La aplicación está desplegada localmente en Expo Go y el servidor API en **Render**.

El milestone v1.0 abarca **9 fases** de desarrollo a lo largo de aproximadamente 2 meses, desde la autenticación básica hasta un sistema completo de actividades, calendario, misiones, logros y popups informativos. Se implementaron **6 suites de pruebas** con **30 pruebas unitarias y de componente** que pasan al 100%, cubriendo validación de datos, servicios de actividad, detección de misiones y renderizado de pantallas críticas.

La aplicación está estructurada en capas: una capa de servicios (`authService.ts`, `missionService.ts`, `activityService.ts`, `userAchievementsService.ts`) que abstrae la lógica de negocio y acceso a Firestore; una capa de hooks (`useAuth`, `useMissionProgress`, `useActivityFeed`, `usePopupDismissal`) que conecta servicios con componentes; y una capa de presentación con pantallas (Home, Explore, Journal, Profile, Calendar, Auth) y componentes reutilizables (StatsBar, ActivityFeed, DailyMissions, InfoBottomSheet, CelebrationSheet). El enrutamiento es file-based mediante expo-router.

La **funcionalidad propia** del proyecto es el sistema de **Achievements (Logros) y Rewards (Recompensas)**, un sistema de gamificación personalizado con 25 logros categorizados en 5 grupos, 30 objetos obtenibles con niveles de rareza (común, raro, épico, legendario), y un sistema de misiones diarias/semanales con recompensas en XP. Este sistema no era un requisito directo del laboratorio, sino una adición propia para mejorar la experiencia de usuario y fomentar el uso consistente de la aplicación mediante mecánicas de juego.

En cuanto a la infraestructura de pruebas, se evaluaron tres herramientas (Jest+RTL, Detox, Maestro) y se seleccionó Jest + React Native Testing Library por su facilidad de setup en Expo, velocidad de ejecución en Node.js, y la madurez de su ecosistema. Las 30 pruebas cubren: validación de datos de plantas, formato de tiempo relativo en español, parseo defensivo de fechas, mapeo de tipos de eventos, renderizado del login con validación de formulario, renderizado del calendario con estados de carga/vacío/leyenda, lógica de grace period en misiones, y detección de progreso en misiones.

### Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Framework | Expo SDK 54 + React Native 0.81 | Desarrollo multiplataforma iOS/Android |
| Autenticación | Firebase Auth | Email/password + Google OAuth |
| Base de datos | Firebase Firestore | Almacenamiento de usuarios, plantas, actividades, logros |
| API Externa | Pl@ntNet API | Identificación de plantas por imagen |
| Servidor API | Node.js / Express (Render) | Proxy para Pl@ntNet API |
| Offline | AsyncStorage | Caché local + cola de sincronización |
| Testing | Jest + React Native Testing Library | Pruebas unitarias y de componente |
| Navegación | expo-router (file-based) | Enrutamiento declarativo |
| Calendario | react-native-calendars | Visualización de eventos por día |
| Iconos | @expo/vector-icons | Iconografía de la interfaz |

---

## 4. Bitácora por Módulo

---

### Module 1: Autenticación (Auth) — Phase 1

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 1 - Auth Foundation | 100% | Login email/password con Firebase Auth (D-01) | Google OAuth required credential exchange fix | `authService.ts` |
| | | Google OAuth con expo-auth-session (D-02) | Register screen needed after initial login | `useAuth.ts` hook |
| | | Auth persistence con onAuthStateChanged (D-03) | Hardcoded u_001 IDs en Home/Profile | `RegisterScreen` |
| | | Dynamic user ID migration (D-04) | | `loginScreen` |

**Captura de pantalla:** `screenshots/auth-login.png` — Login screen con campos email/password
**Captura de pantalla:** `screenshots/auth-register.png` — Register screen

---

### Module 2: Home Dashboard — Phases 1, 4, 7, 9

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 1 - Auth Foundation | 60% base | Personalized dashboard per user ID | Hardcoded u_001 fijo (migrado en dynamic ID) | `HomeScreen.tsx` |
| 4 - Stats Bar | +20% | StatsBar con account age, photos today, watering streak, last ID | PlantOfTheDay diferido (sin endpoint listo) | `StatsBar.tsx` |
| 7 - Missions | +10% | Misiones diarias/semanales en Home | | `DailyMissions.tsx` |
| 9 - Timeline | +10% | Timeline de actividad real desde Firestore | | `HomeTimeline.tsx` |
| **Total** | **100%** | | | |

**Captura de pantalla:** `screenshots/home-dashboard.png` — Home screen con stats bar + missions + timeline
**Captura de pantalla:** `screenshots/home-missions.png` — Sección de misiones diarias y semanales

---

### Module 3: Lab3 — API + Sincronización — Phase 2

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 2 - Lab3 | 100% | Pl@ntNet API para identificación de plantas | API desplegada en Render (cloud hosting) | API server (Node/Express) |
| | | Offline support con local storage + sync queue | Offline fallback en identify screen | `plantNetService.ts` |
| | | Module analysis para capacidad offline | | `offlineStorage.ts` |
| | | | | `syncQueue.ts` |

**Captura de pantalla:** `screenshots/identify-plant.png` — Plant identification screen con resultados

---

### Module 4: Explore — Phase 3

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 3 - Missing Screens | 100% | Search bar + cuadrícula de 2 columnas desde Firestore | Búsqueda client-side (case-insensitive) | `ExploreScreen.tsx` |
| | | Tapping card navega a /plant/{id} | | Catalog service |

**Captura de pantalla:** `screenshots/explore-grid.png` — Explore screen con cuadrícula de plantas
**Captura de pantalla:** `screenshots/explore-search.png` — Explore screen con búsqueda activa

---

### Module 5: Journal — Phase 3

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 3 - Missing Screens | 100% | Dashboard basado en cards con plantas analizadas | Reutilizó DailyMissions + UserProgress | `JournalScreen.tsx` |
| | | Secciones de misiones, progreso y logros | Pull-to-refresh en Explore y Journal | |

**Captura de pantalla:** `screenshots/journal-dashboard.png` — Journal screen con cards informativas

---

### Module 6: Profile — Phases 1, 4, 9

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 1 - Auth Foundation | 50% | Edit profile functionality | Real data wiring needed | `UserProfile.tsx` |
| 4 - Achievements | +30% | Achievement display con locked/unlocked | Achievements seeded en Firestore | `AchievementList.tsx` |
| 9 - Activity | +20% | Activity feed real desde Firestore | Mock ACTIVITIES reemplazados | `useActivityFeed.ts` |
| **Total** | **100%** | | | |

**Captura de pantalla:** `screenshots/profile-achievements.png` — Achievements tab mostrando locked/unlocked
**Captura de pantalla:** `screenshots/profile-vitrina.png` — Profile vitrina showcase (obtenibles, Phase 7)
**Captura de pantalla:** `screenshots/profile-activity.png` — Activity tab con datos reales de Firestore

---

### Module 7: Achievements & Rewards (Funcionalidad Propia) — Phase 4

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 4 - Achievements | 100% | 25 achievements seeded en Firestore | Client-side unlock logic | `userAchievementsService.ts` |
| | | XP rewards al desbloquear logros | Rewards system para achievements | Achievement definitions |
| | | Estados visuales locked/unlocked en Profile | | |
| | | rewardItemId para futuros item grants (ACH-05) | | |

**Nota:** Este es el módulo de **funcionalidad propia** — ver sección dedicada más abajo.

---

### Module 8: Missions & Rewards — Phase 7

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 7 - Missions | 100% | Rotación diaria (5) + semanal (2) de misiones | Rotación basada en seed determinística | `missionService.ts` |
| | | 25 misiones diarias + 10 semanales definidas | Progress tracking multi-etapa | `useMissionProgress.ts` |
| | | Flujo tap-to-claim con recompensa XP | Grace period para misiones no reclamadas | `WeeklyMissions.tsx` |
| | | Detección de completitud basada en eventos | Objetos obtenibles (30 items, rareza por niveles) | Obtenibles system |
| | | Profile vitrina para items obtenidos | | Profile vitrina |

**Captura de pantalla:** `screenshots/missions-daily.png` — Misiones diarias en Home screen
**Captura de pantalla:** `screenshots/missions-claim.png` — Flujo de reclamo con animación XP

---

### Module 9: Popups (Informative Boxes) — Phase 8

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 8 - Popups | 100% | Popups tipo bottom-sheet (InfoBottomSheet) | Persistencia de dismiss por usuario | `usePopupDismissal.ts` |
| | | Popups de celebración en unlocks | Lógica de detección de primer uso | `InfoBottomSheet.tsx` |
| | | Iconos de info on demand | | `CelebrationSheet.tsx` |

**Captura de pantalla:** `screenshots/popup-info.png` — Info bottom sheet informativo
**Captura de pantalla:** `screenshots/popup-celebration.png` — Celebration popup al desbloquear logro

---

### Module 10: Activity Feed — Phase 9

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 9 - Activity | 100% | Subcolección Firestore `users/{uid}/activities` | Dependencia circular con require() | `activityService.ts` |
| | | 4 tipos de evento: water, identify, achievement, mission | Firestore Timestamp a Date parsing | `useActivityFeed.ts` |
| | | Formato de tiempo relativo en español | | |

---

### Module 11: Calendar — Phase 9

| Fase | % Avance | Decisiones Clave | Problemas Encontrados | Módulos Nuevos |
|------|----------|------------------|----------------------|-----------------|
| 9 - Calendar | 100% | react-native-calendars con multi-dot markers | Colores de dot por tipo de evento | `CalendarScreen.tsx` |
| | | 4 colores: water (azul), identify (verde), achievement (oro), mission (púrpura) | Locale español para meses/días | |
| | | Day tap muestra lista de eventos via ActivityFeed | | |

**Captura de pantalla:** `screenshots/calendar-view.png` — Calendar screen con dots de colores y eventos

---

## 5. Módulos Nuevos Agregados

Lista consolidada de todos los módulos creados durante el milestone v1.0:

**Auth:**
- `authService.ts` — Servicio de autenticación Firebase
- `useAuth.ts` — Hook de estado de autenticación
- `RegisterScreen.tsx` — Pantalla de registro
- `loginScreen.tsx` — Pantalla de inicio de sesión

**Servicios:**
- `activityService.ts` — Servicio de actividades (Firestore subcollection)
- `missionService.ts` — Servicio de misiones con rotación determinística
- `userAchievementsService.ts` — Servicio de logros con detección de unlocks
- `userPlantsService.ts` — Servicio de plantas del usuario
- `plantNetService.ts` — Servicio de integración Pl@ntNet API
- `offlineStorage.ts` — Almacenamiento offline con AsyncStorage
- `syncQueue.ts` — Cola de sincronización para operaciones offline

**Pantallas:**
- `ExploreScreen.tsx` — Catálogo de plantas con búsqueda
- `JournalScreen.tsx` — Dashboard de cuidado de plantas
- `CalendarScreen.tsx` — Calendario de actividades con dots de colores

**Componentes:**
- `StatsBar.tsx` — Barra de estadísticas del Home
- `HomeTimeline.tsx` — Timeline de actividad en Home
- `ActivityFeed.tsx` — Feed de actividad reciente
- `DailyMissions.tsx` — Misiones diarias
- `WeeklyMissions.tsx` — Misiones semanales
- `InfoBottomSheet.tsx` — Popup informativo tipo bottom sheet
- `CelebrationSheet.tsx` — Popup de celebración
- `AchievementList.tsx` — Lista de logros
- `ProfileVitrina.tsx` — Vitrina de objetos obtenibles

**Hooks:**
- `useActivityFeed.ts` — Hook para obtener actividades
- `useMissionProgress.ts` — Hook para progreso de misiones
- `usePopupDismissal.ts` — Hook para persistencia de dismiss

**Infraestructura:**
- API server (Node/Express desplegado en Render)
- Suite de pruebas Jest + React Native Testing Library (6 suites, 30 tests)

---

## 6. Funcionalidad Propia — Achievements/Rewards

El sistema de **Achievements (Logros) y Rewards (Recompensas)** constituye la funcionalidad propia del proyecto — un sistema de gamificación personalizado que va más allá de los requisitos básicos del laboratorio. Fue diseñado e implementado desde cero como un valor agregado para mejorar la retención de usuarios y hacer el cuidado de plantas más entretenido mediante mecánicas de juego.

### Justificación como Funcionalidad Propia

Mientras que los laboratorios requerían funcionalidades estándar como autenticación, identificación de plantas y un perfil de usuario, el sistema de logros y recompensas fue una adición propia que requirió:

1. **Diseño de arquitectura:** Definir el modelo de datos en Firestore (colección `achievements`, subcolección `users/{uid}/achievements`), el esquema de progreso, y el flujo de detección de desbloqueo.
2. **Definición de contenido:** Crear 25 logros con nombres, descripciones, iconos y requisitos específicos en español, más 30 objetos obtenibles con nombres, descripciones y niveles de rareza.
3. **Lógica de negocio:** Implementar detección client-side de completitud después de cada acción relevante, actualización de progreso en Firestore, y concesión de recompensas XP.
4. **UI/UX:** Diseñar componentes visuales para mostrar progreso, estados locked/unlocked, animaciones de celebración, y una vitrina de objetos obtenibles.
5. **Integración transversal:** Conectar el sistema con Profile, Missions, Activity Feed y Popups para una experiencia cohesiva.

### Arquitectura Detallada

**Modelo de datos en Firestore:**

```
achievements/                          ← Colección de definiciones de logros
  { achievementId }:
    id: string
    title: string                      ← "Identifica 5 plantas"
    description: string                ← "Identifica 5 plantas diferentes usando la cámara"
    icon: string                       ← Nombre del icono (MaterialCommunityIcons)
    category: "milestone" | "streak" | "age" | "weekly" | "social"
    requirement: {
      type: "identifications" | "waterings" | "missions" | "days_active"
      count: number                    ← Meta requerida (ej. 5 identificaciones)
    }
    xpReward: number                   ← XP otorgado al desbloquear
    stages?: { count: number; label: string }[]  ← Etapas intermedias opcionales
    rewardItemId?: string              ← Para futuros grants de objetos (ACH-05)

users/{uid}/achievements/              ← Subcolección de progreso por usuario
  { achievementId }:
    current: number                    ← Progreso actual
    unlockedAt?: Timestamp             ← Fecha de desbloqueo
    claimed: boolean                   ← Recompensa reclamada
```

**Flujo de detección de desbloqueo:**
1. Usuario realiza acción (identificar planta, regar, completar misión)
2. `checkAndUnlockAchievements(userId, actionType)` se ejecuta
3. Obtiene todas las definiciones de logros de Firestore
4. Obtiene el progreso actual del usuario
5. Para cada logro matching el tipo de acción: incrementa contador, verifica si alcanzó la meta
6. Si se desbloqueó: registra timestamp, otorga XP, registra evento en Activity Feed, muestra CelebrationSheet

### Categorías de Logros (25 total)

| Categoría | Cantidad | Descripción | Ejemplos |
|-----------|----------|-------------|----------|
| **Milestone** | 8 | Hitos por cantidad de plantas identificadas | Identifica 1, 5, 10, 25, 50, 100 plantas |
| **Streak** | 5 | Racha de días consecutivos activos | 3, 7, 14, 30, 100 días de racha |
| **Account Age** | 4 | Antigüedad de la cuenta | 7 días, 30 días, 100 días, 1 año |
| **Weekly Active** | 5 | Completitud semanal | 1, 4, 8, 12, 24 semanas completas |
| **Social** | 3 | Interacciones sociales (futuro) | Compartir identificaciones, referir amigos |

### Sistema de Recompensas

**XP:** Actualmente los logros otorgan puntos de experiencia que se acumulan en el perfil del usuario. Los valores de XP varían según la dificultad del logro (50 XP para logros simples, hasta 500 XP para logros de larga duración como "1 año de membrecía").

**Objetos (futuro):** El campo `rewardItemId` está definido en la arquitectura (ACH-05) pero la concesión automática de objetos al completar logros está pendiente para una fase futura. Actualmente los objetos obtenibles (30 items con rareza común/raro/épico/legendario) se obtienen mediante el sistema de misiones.

### Diseño Visual

El diseño visual de los logros sigue estos principios:
- **Progress bars** circulares o lineares que muestran el avance hacia la meta
- **Lock icons** (icono de candado) sobrepuestos en tono gris para logros no ganados
- **Checkmark** verde + efecto de brillo para logros desbloqueados
- **Animación de celebración** (`CelebrationSheet.tsx`) al obtener un nuevo logro, con confeti y mensaje personalizado
- **Categorización visual** por colores: milestone (verde), streak (naranja), age (azul), weekly (púrpura)
- **Tarjetas** con icono grande, título y descripción en diseño tipo coleccionable

### Integración

El sistema se integra transversalmente con múltiples módulos de la app:

| Módulo | Integración | Archivos Clave |
|--------|------------|----------------|
| **Profile** | Lista de logros con filtro locked/unlocked | `AchievementList.tsx`, `UserProfile.tsx` |
| **Home Dashboard** | Resumen de progreso en StatsBar | `HomeScreen.tsx`, `StatsBar.tsx` |
| **Missions** | Logro semanal "Completa todas las misiones" | `missionService.ts`, `WeeklyMissions.tsx` |
| **Activity Feed** | Evento "achievement" registrado al desbloquear | `activityService.ts`, `useActivityFeed.ts` |
| **Popups** | CelebrationSheet en desbloqueos | `CelebrationSheet.tsx`, `useAchievementUnlock.ts` |
| **Calendar** | Marcador dorado en días con logro desbloqueado | `CalendarScreen.tsx` |

### Lecciones Aprendidas

- La detección client-side de logros funciona bien pero requiere consistencia en los nombres de eventos entre servicios
- Las definiciones de logros en Firestore permiten añadir nuevos logros sin actualizar la app (cambio server-side)
- El sistema de etapas múltiples (ej. "Identifica 5/10/25 plantas") es más motivante que logros únicos
- La integración con CelebrationSheet mejora significativamente la experiencia de usuario al recibir retroalimentación inmediata

---

## 7. Investigación de Testing/QA

### 7.1 Herramientas Comparadas

| Herramienta | Tipo | Setup en Expo | Velocidad | Comunidad | Cobertura |
|-------------|------|---------------|-----------|-----------|-----------|
| **Jest + React Native Testing Library** | Unit + Component | ✅ Fácil (jest-expo preset) | ⚡ Rápida | Grande, madura | Lógica + UI con mocks |
| **Detox** | E2E | ❌ Complejo (requiere iOS/Android build) | 🐢 Lenta | Mediana | Flujo completo real |
| **Maestro** | E2E | ⚠️ Medio (requiere app build) | ⚡ Rápida | Creciente | Flujo completo real |

### 7.2 Criterios de Evaluación

- **Facilidad de setup en Expo:** Jest+RTL gana — el preset `jest-expo` es configuración de una línea
- **Velocidad de ejecución:** Jest+RTL corre en Node.js (sin dispositivo) = más rápida
- **Tipo de pruebas necesarias:** Tests Unit + Component son suficientes para el alcance actual
- **Aprendizaje y recursos:** Comunidad más grande, más tutoriales, Jest es estándar de la industria
- **Cobertura de mock:** Jest permite mockear Firebase, react-native-calendars, expo-router y otros módulos nativos fácilmente

### 7.3 Conclusión

- **Recomendación:** Jest + React Native Testing Library
- **Justificación:** Setup fácil en Expo, ejecución rápida, cobertura suficiente para el alcance del milestone actual
- **E2E:** Investigado pero NO implementado — recomendado para futuros milestones cuando la app sea más estable
- **Setup:** Preset `jest-expo` con alias `@/` mapeado vía `moduleNameMapper`, `@testing-library/jest-native` para matchers personalizados

### 7.5 Implementación de Mock Patterns

Para aislar los tests de componentes de las dependencias nativas y de Firebase, se utilizaron tres patrones de mock establecidos:

**Patrón 1 — Firebase Mock (servicios):**
```typescript
jest.mock("@/src/config/firebase", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(), getDoc: jest.fn(), setDoc: jest.fn(),
  collection: jest.fn(), query: jest.fn(), orderBy: jest.fn(),
  Timestamp: { now: () => ({ toDate: () => new Date() }) },
  serverTimestamp: jest.fn(),
}));
```

**Patrón 2 — Módulos Nativos Mock (componentes):**
```typescript
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: ({ children }: any) => children,
}));
```

**Patrón 3 — Mock Variables Compartidas (servicios mockeables):**
```typescript
const mockGetUserActivities = jest.fn();
jest.mock("@/src/services/activityService", () => ({
  getUserActivities: (...args: any[]) => mockGetUserActivities(...args),
}));
```

Estos patrones fueron usados consistentemente en las 6 suites de pruebas, permitiendo que todos los tests corran en Node.js sin necesidad de un dispositivo físico o emulador. La clave del éxito fue definir todas las variables mock antes de los `jest.mock()` calls (que son hoisted por el transform de Babel).

### 7.4 Configuración de Jest

```typescript
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|@react-native-community|expo(nent)?|expo-router|@expo(nent)?|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|expo-modules-core)/)"
  ]
}
```

---

## 8. Pruebas Implementadas

### 8.1 Test Unitario 1 — Validación de Planta

- **Archivo:** `src/lib/__tests__/plantValidation.test.ts`
- **Propósito:** Validar que `validatePlantData()` acepta datos correctos y rechaza datos inválidos con mensajes en español
- **Código:**

```typescript
describe("validatePlantData", () => {
  it("acepta datos válidos", () => {
    const result = validatePlantData({
      commonName: "Monstera",
      scientificName: "Monstera deliciosa",
      wateringDays: 7,
      sunlight: "partial",
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("reporta errores cuando hay datos inválidos", () => {
    const result = validatePlantData({
      commonName: "",
      scientificName: "A",
      wateringDays: 0,
      sunlight: "shade" as any,
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "El nombre común debe tener al menos 2 caracteres",
        "El nombre científico debe tener al menos 3 caracteres",
        "El riego debe estar entre 1 y 30 días",
        "La luz debe ser low, partial o full",
      ])
    )
  })
})
```

- **Resultado:** ✅ PASA — 2 tests, 0 failures
- **Captura de terminal:** `screenshots/test-plant-validation.png`

---

### 8.2 Test Unitario 2 — Activity Service Helpers

- **Archivo:** `src/services/__tests__/activityService.test.ts`
- **Propósito:** Probar funciones puras: `formatRelativeTime` (formato español), `safeParseDate` (manejo de null/undefined/Timestamp/Date), `toActivityData` (mapeo de tipos)
- **Código (casos clave):**

```typescript
// formatRelativeTime — 7 casos
it("devuelve 'Ahora' cuando la fecha es el mismo instante", () => { ... })
it("devuelve 'Hace 5 min' cuando pasaron 5 minutos", () => { ... })
it("devuelve 'Hace 1 h' cuando pasó 1 hora", () => { ... })
it("devuelve 'Hace 2 días' cuando pasaron 2 días", () => { ... })
it("devuelve fecha formateada (dd/mm/yyyy) cuando pasaron 7+ días", () => { ... })

// safeParseDate — 6 casos
it("devuelve el mismo Date cuando recibe un Date", () => { ... })
it("devuelve la fecha actual cuando recibe null", () => { ... })
it("devuelve la fecha del Timestamp cuando recibe un objeto con toDate()", () => { ... })
it("parsea un string ISO a Date", () => { ... })

// toActivityData — 4 casos
it("mapea un evento 'identify' correctamente", () => { ... })
it("mapea un evento 'mission' como 'achievement'", () => { ... })
it("mapea evento 'water' como 'water' (sin mapeo especial)", () => { ... })
it("mapea evento 'achievement' como 'achievement' (sin mapeo)", () => { ... })
```

- **Resultado:** ✅ PASA — 17 tests, 0 failures
  - `formatRelativeTime`: 7 tests
  - `safeParseDate`: 6 tests
  - `toActivityData`: 4 tests
- **Captura de terminal:** `screenshots/test-activity-service.png`

---

### 8.3 Test de Componente 1 — LoginScreen

- **Archivo:** `src/screens/auth/__tests__/loginScreen.test.tsx`
- **Propósito:** Verificar que presionar "Entrar" con formulario vacío muestra el mensaje de error "Por favor completa todos los campos."
- **Código:**

```typescript
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: ({ children }: any) => children,
}))
jest.mock("expo-auth-session/providers/google", () => ({
  useIdTokenAuthRequest: () => [null, null, jest.fn()],
}))
jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: { credential: jest.fn() },
  signInWithCredential: jest.fn(),
}))
jest.mock("@/src/config/firebase", () => ({ auth: {} }))
jest.mock("@/src/services/authService", () => ({
  login: jest.fn(),
  resetPassword: jest.fn(),
}))

describe("LoginScreen", () => {
  it("muestra error cuando el formulario está vacío", () => {
    const { getByText, queryByText } = render(<LoginScreen />)
    expect(queryByText("Por favor completa todos los campos.")).toBeNull()
    fireEvent.press(getByText("Entrar"))
    expect(getByText("Por favor completa todos los campos.")).toBeTruthy()
  })
})
```

- **Resultado:** ✅ PASA — 1 test, 0 failures
- **Captura de terminal:** `screenshots/test-login-screen.png`

---

### 8.4 Test de Componente 2 — CalendarScreen

- **Archivo:** `src/screens/calendar/__tests__/CalendarScreen.test.tsx`
- **Propósito:** Verificar renderizado del calendario: título en español, leyenda de colores, estado vacío, indicador de carga
- **Código (casos clave):**

```typescript
it("muestra indicador de carga al iniciar", () => { ... })
it("muestra calendario y mensaje vacío cuando no hay actividades", async () => { ... })
it("muestra leyenda de colores en español", async () => { ... })
it("muestra el título en español", () => { ... })
```

- **Resultado:** ✅ PASA — 4 tests, 0 failures
- **Captura de terminal:** `screenshots/test-calendar-screen.png`

---

### 8.5 Tests Adicionales (fases posteriores)

**missionService.test.ts** — Prueba de grace period (2 tests):
- Verifica que `assignDailyMissions` registra `assignedDate` en nuevas entradas
- Verifica que `getExpiredMissions` solo retorna misiones completadas+no reclamadas del día anterior
- Resultado: ✅ PASA

**useMissionProgress.test.ts** — Prueba de hook de progreso de misiones (4 tests):
- Exporta `reportMissionProgress` como función async standalone
- Obtiene misiones del usuario y actualiza progreso
- Maneja errores gracefulmente sin lanzar excepciones
- Hook `useMissionProgress` retorna `reportProgress` que comparte lógica con standalone
- Resultado: ✅ PASA

---

### 8.6 Resultado General de Tests

Ejecutado el 24 de Mayo 2026:

```
Test Suites: 6 passed, 6 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        8.668 s
Ran all test suites.
```

| Test Suite | Tipo | Tests | Estado |
|-----------|------|-------|--------|
| plantValidation.test.ts | Unit | 2 | ✅ PASA |
| activityService.test.ts | Unit | 17 | ✅ PASA |
| loginScreen.test.tsx | Component | 1 | ✅ PASA |
| CalendarScreen.test.tsx | Component | 4 | ✅ PASA |
| missionService.test.ts | Unit | 2 | ✅ PASA |
| useMissionProgress.test.ts | Hook | 4 | ✅ PASA |
| **Total** | | **30** | **✅ TODOS PASAN** |

**Captura de terminal general:** `screenshots/test-all-passing.png` — Terminal mostrando todas las suites aprobadas

```
PASS src/lib/__tests__/plantValidation.test.ts
PASS src/services/__tests__/activityService.test.ts
PASS src/services/__tests__/missionService.test.ts
PASS src/hooks/__tests__/useMissionProgress.test.ts
PASS src/screens/auth/__tests__/loginScreen.test.tsx
PASS src/screens/calendar/__tests__/CalendarScreen.test.tsx

Test Suites: 6 passed, 6 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        8.668 s
```

---

## 9. Repositorio

- **URL:** [https://github.com/bzelenka/PlantasMon](https://github.com/bzelenka/PlantasMon)
- **Branch:** main
- **Último commit:** `7e12cc7` — docs(05-binnacle-test-and-qa-clase-asincronica-pdf): complete 05-02 component test plan

Para generar el PDF final:
```bash
# Opción 1: VS Code → Ctrl+Shift+P → "Markdown: Export to PDF"
# Opción 2: Línea de comandos con md-to-pdf
npx md-to-pdf BITACORA.md
```

> **Nota:** Las capturas de pantalla referenciadas en este documento deben estar en la carpeta `screenshots/` al mismo nivel que BITACORA.md. Las capturas se generan desde la app en Expo Go y desde la terminal de pruebas.

---

## 10. Conclusiones

El desarrollo del milestone v1.0 de PlantasMon a través de 9 fases ha demostrado la viabilidad de construir una aplicación completa de cuidado de plantas con React Native/Expo, integrando servicios de Firebase (Auth, Firestore) y una API externa de identificación de plantas (Pl@ntNet).

**Logros principales:**
- Sistema completo de autenticación con email/password y registro de usuarios
- Identificación de plantas mediante API con soporte offline
- Catálogo de plantas explorable con búsqueda y pantalla de journal
- Dashboard personalizado con estadísticas, misiones y timeline de actividad
- **Funcionalidad propia:** Sistema de gamificación con 25 logros, sistema de misiones diarias/semanales, 30 objetos obtenibles con niveles de rareza, y popups de celebración
- Calendario de actividades con marcadores por color
- **Infraestructura de testing:** 6 suites de pruebas con 30 tests pasando al 100%

**Desafíos encontrados:**
- Google OAuth requirió un fix de credential exchange
- Migración de IDs hardcoded (u_001) a IDs dinámicos de Firebase Auth
- Sincronización offline con cola de operaciones
- Dependencia circular en `activityService` resuelta con patrón require()
- Parseo de Firestore Timestamp a Date para el activity feed

**Recomendaciones para v2:**
- **Push notifications** para recordatorios de riego y cuidado de plantas
- **E2E testing** con Detox o Maestro para flujos completos (app más estable)
- **Diagnóstico de enfermedades** de plantas mediante la API
- **Widgets** para el home screen del dispositivo
- **Modo offline completo** con Firebase Firestore offline persistence

La infraestructura de pruebas (Jest + React Native Testing Library) está sólidamente establecida con 30 tests que cubren validación de datos, servicios de actividad, lógica de misiones, y renderizado de pantallas críticas. Esto proporciona una base confiable para el desarrollo futuro y la refactorización segura del código existente.

---

*Documento generado el 24 de Mayo de 2026 para el milestone v1.0 de PlantasMon.*
