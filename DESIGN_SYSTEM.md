# 🌿 PlantasMon - Design System

## Índice

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tokens de Diseño](#tokens-de-diseño)
4. [Sistema de Temas](#sistema-de-temas)
5. [Componentes y Estilos](#componentes-y-estilos)
6. [Guía de Implementación](#guía-de-implementación)
7. [Mejores Prácticas](#mejores-prácticas)

---

## Introducción

El Design System de PlantasMon es un sistema de diseño completo y escalable construido para React Native/Expo. Proporciona un conjunto coherente de tokens de diseño, componentes reutilizables y patrones de implementación que garantizan consistencia visual en toda la aplicación.

### Características Principales

- ✅ **Tema claro y oscuro** con cambio automático
- ✅ **Type-safe** con TypeScript
- ✅ **Escalable** y fácil de mantener
- ✅ **Sistema de estilos centralizados** con hooks personalizados
- ✅ **Tokens de diseño consistentes**

---

## Arquitectura del Sistema

El Design System está estructurado en tres capas principales:

```
src/
├── constants/
│   ├── designSystem.ts  → Tema principal, tipos y hooks
│   └── theme.ts         → Colores base, temas decorativos
├── styles/
│   └── themedStyles.ts  → Estilos por componente
└── components/
    └── ui/              → Componentes base reutilizables
```

### Flujo de Implementación

```
designSystem.ts (Tokens) → themedStyles.ts (Estilos) → Componentes (UI)
```

---

## Tokens de Diseño

### AppTheme Interface

La interfaz `AppTheme` define la estructura completa del sistema de diseño:

```typescript
interface AppTheme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
}
```

### 1. Colores (ThemeColors)

#### Modo Claro (Light)

```typescript
{
  background: '#F5F3ED',      // Fondo principal
  surface: '#FFFFFF',         // Superficie de cards
  surfaceMuted: '#d3c79c',    // Superficie secundaria
  textPrimary: '#1D3426',     // Texto principal
  textSecondary: '#667A6A',   // Texto secundario
  textTertiary: '#424f3e',    // Texto terciario
  primary: '#40916c',         // Color principal (verde)
  primaryStrong: '#2E5739',   // Verde más oscuro
  primarySoft: '#D9E7D8',     // Verde suave
  primaryForeground: '#FFFFFF',
  secondary: '#C9A468',       // Color secundario (dorado)
  secondarySoft: '#E9D9BC',
  secondaryForeground: '#1D3426',
  border: '#ceaea0',          // Bordes
  chip: '#c0dba3',           // Tags/chips
  success: '#6A9A62'         // Feedback positivo
}
```

#### Modo Oscuro (Dark)

```typescript
{
  background: '#0d3320',      // Fondo principal oscuro
  surface: '#1A241D',         // Superficie de cards
  surfaceMuted: '#233026',    // Superficie secundaria
  textPrimary: '#e8f5e9',     // Texto principal claro
  textSecondary: '#BECCBE',   // Texto secundario
  textTertiary: '#95A796',    // Texto terciario
  primary: '#40916c',         // Verde (consistente)
  primaryStrong: '#6DA875',   // Verde más claro en dark
  primarySoft: '#2A3A2E',     // Verde oscuro
  primaryForeground: '#0D1F12',
  secondary: '#D8B980',       // Dorado más claro
  secondarySoft: '#4C4029',
  secondaryForeground: '#0D1F12',
  border: '#324337',
  chip: '#293629',
  success: '#89C283'
}
```

### 2. Espaciado (Spacing)

Sistema de espaciado consistente para márgenes, padding y gaps:

```typescript
{
  xs: 4,   // Extra pequeño
  sm: 8,   // Pequeño
  md: 12,  // Mediano
  lg: 18,  // Grande
  xl: 24   // Extra grande
}
```

**Uso recomendado:**
- `xs`: Espaciado interno mínimo
- `sm`: Gaps pequeños, padding de chips
- `md`: Padding estándar de cards, márgenes entre elementos
- `lg`: Separación entre secciones
- `xl`: Márgenes externos grandes

### 3. Radius (Border Radius)

Sistema de bordes redondeados:

```typescript
{
  sm: 10,   // Botones pequeños, chips
  md: 16,   // Cards, inputs
  lg: 24,   // Modals, grandes cards
  xl: 28,   // Elementos destacados
  full: 999 // Elementos circulares
}
```

### 4. Tipografía (Typography)

```typescript
{
  display: 'System',  // Títulos principales
  heading: 'System',  // Subtítulos
  body: 'System'      // Texto general
}
```

> **Nota:** Actualmente usa fuentes del sistema. Se puede extender con fuentes personalizadas.

---

## Sistema de Temas

### Temas Principales

#### Hook: `useAppTheme()`

Detecta automáticamente el tema del dispositivo y retorna el `AppTheme` correspondiente:

```typescript
import { useAppTheme } from '@/src/constants/designSystem';

function MyComponent() {
  const theme = useAppTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.textPrimary }}>
        Hola Mundo
      </Text>
    </View>
  );
}
```

#### Función: `getAppTheme(mode)`

Para obtener un tema específico sin hooks:

```typescript
import { getAppTheme } from '@/src/constants/designSystem';

const lightTheme = getAppTheme('light');
const darkTheme = getAppTheme('dark');
```

### Temas Decorativos

Además del tema principal, el sistema incluye temas decorativos para personalización del usuario:

#### FLAG_THEMES

Temas de bandera/insignia para elementos de gamificación:

```typescript
[
  { name: "Forest", colors: ["#1a472a", "#2d6a4f", "#40916c", "#52b788"] },
  { name: "Autumn", colors: ["#6b2e0f", "#bc6c25", "#dda15e", "#fefae0"] },
  { name: "Bloom", colors: ["#7b2d8e", "#a855f7", "#d946ef", "#f0abfc"] },
  { name: "Ocean", colors: ["#0c4a6e", "#0284c7", "#38bdf8", "#7dd3fc"] }
]
```

#### BG_THEMES

Temas de fondo con patrones:

```typescript
[
  {
    name: "Deep Forest",
    colors: ["#0d3320", "#0a1f14", "#06120d"],
    pattern: "leaf",
    patternColor: "#1a472a"
  },
  {
    name: "Midnight",
    colors: ["#091a2a", "#060e18"],
    pattern: "stars",
    patternColor: "#1a3a5c"
  }
  // ... más temas
]
```

#### TIER_COLORS

Sistema de colores para rareza/logros:

```typescript
{
  rare: { 
    bg: "rgba(59, 130, 246, 0.15)", 
    text: "#60a5fa", 
    border: "rgba(59, 130, 246, 0.3)" 
  },
  epic: { 
    bg: "rgba(168, 85, 247, 0.15)", 
    text: "#c084fc", 
    border: "rgba(168, 85, 247, 0.3)" 
  },
  legendary: { 
    bg: "rgba(245, 158, 11, 0.15)", 
    text: "#fbbf24", 
    border: "rgba(245, 158, 11, 0.3)" 
  },
  mythic: { 
    bg: "rgba(244, 63, 94, 0.15)", 
    text: "#fb7185", 
    border: "rgba(244, 63, 94, 0.3)" 
  }
}
```

---

## Componentes y Estilos

### Sistema de Estilos Centralizados

El archivo `themedStyles.ts` proporciona estilos pre-construidos para cada componente con soporte de temas.

#### Componentes Disponibles

```typescript
type ComponentName =
  | "achievements"
  | "activityFeed"
  | "bottomNav"
  | "plantCollection"
  | "profileAbout"
  | "homeScreen"
  | "homeHeader"
  | "plantOfTheDay"
  | "lastIdentified"
  | "userProgress"
  | "dailyMissions"
  | "recentAchievement"
  | "tipCard";
```

#### Hook: `useThemedStyles()`

Retorna estilos y tema para un componente específico:

```typescript
import { useThemedStyles } from '@/src/styles/themedStyles';

function UserProgress() {
  const { styles, theme } = useThemedStyles('userProgress');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Progreso</Text>
      {/* El estilo se adapta automáticamente al tema */}
    </View>
  );
}
```

### Ejemplo: Estilos de UserProgress

```typescript
export const createUserProgressStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.md
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textPrimary
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center'
    }
  });
```

---

## Guía de Implementación

### 1. Crear un Nuevo Componente

#### Paso 1: Definir los estilos en `themedStyles.ts`

```typescript
// Al final del archivo, antes de stylesByComponent
export const createMyNewComponentStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
    }
  });
```

#### Paso 2: Agregar al registro de estilos

```typescript
// En stylesByComponent
const stylesByComponent = {
  // ...estilos existentes
  myNewComponent: {
    light: createMyNewComponentStyles(themes.light),
    dark: createMyNewComponentStyles(themes.dark),
  },
} as const;
```

#### Paso 3: Actualizar el tipo ComponentName

```typescript
type ComponentName =
  | "achievements"
  | "activityFeed"
  // ...otros
  | "myNewComponent";  // ← Agregar aquí
```

#### Paso 4: Actualizar el tipo StylesForComponent

```typescript
type StylesForComponent<T extends ComponentName> = ReturnType<
  T extends "achievements"
    ? typeof createAchievementsStyles
    : // ...otros
    T extends "myNewComponent"
    ? typeof createMyNewComponentStyles
    : never
>;
```

#### Paso 5: Implementar el componente

```typescript
import { View, Text } from 'react-native';
import { useThemedStyles } from '@/src/styles/themedStyles';

export function MyNewComponent() {
  const { styles, theme } = useThemedStyles('myNewComponent');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Título</Text>
      <Text style={styles.description}>Descripción</Text>
    </View>
  );
}
```

### 2. Usar Componentes UI Base

#### Ejemplo: Button Component

```typescript
import { Button } from '@/src/components/ui/button';

<Button 
  variant="default"  // o 'destructive', 'outline', 'secondary', 'ghost', 'link'
  size="default"     // o 'sm', 'lg', 'icon'
  onPress={handlePress}
>
  Click Me
</Button>
```

**Variantes disponibles:**
- `default`: Botón principal con color primary
- `destructive`: Botón rojo para acciones destructivas
- `outline`: Botón con borde y fondo transparente
- `secondary`: Botón con color secondary
- `ghost`: Botón transparente sin borde
- `link`: Botón estilo enlace con subrayado

**Tamaños disponibles:**
- `sm`: Pequeño
- `default`: Estándar
- `lg`: Grande
- `icon`: Para iconos (cuadrado)

### 3. Estilos Dinámicos

Cuando necesites estilos que no están en el sistema centralizado:

```typescript
import { useAppTheme } from '@/src/constants/designSystem';
import { StyleSheet } from 'react-native';

function DynamicComponent({ isActive }) {
  const theme = useAppTheme();
  
  return (
    <View style={[
      styles.base,
      { 
        backgroundColor: isActive 
          ? theme.colors.primary 
          : theme.colors.surface 
      }
    ]}>
      {/* contenido */}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
    borderRadius: 12,
  }
});
```

### 4. Responsive Design

Para estilos responsivos, usa `Dimensions`:

```typescript
import { Dimensions, StyleSheet } from 'react-native';

export const createMyComponentStyles = (theme: AppTheme) => {
  const { width } = Dimensions.get('window');
  const CARD_WIDTH = (width - 52) / 2;
  
  return StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
    }
  });
};
```

---

## Mejores Prácticas

### ✅ DO - Hacer

1. **Siempre usar tokens del Design System**
   ```typescript
   // ✅ Correcto
   padding: theme.spacing.md
   
   // ❌ Incorrecto
   padding: 12
   ```

2. **Usar hooks para acceder al tema**
   ```typescript
   // ✅ Correcto
   const theme = useAppTheme();
   const { styles, theme } = useThemedStyles('myComponent');
   
   // ❌ Incorrecto
   import { COLORS } from '@/src/constants/theme';
   backgroundColor: COLORS.primary  // No se adapta al tema
   ```

3. **Crear estilos centralizados para componentes reutilizables**
   ```typescript
   // ✅ Correcto
   export const createMyComponentStyles = (theme: AppTheme) => 
     StyleSheet.create({ ... });
   
   // ❌ Incorrecto
   const styles = StyleSheet.create({ 
     container: { backgroundColor: '#FFFFFF' }  // Hardcoded
   });
   ```

4. **Nombrar colores por su función, no por su apariencia**
   ```typescript
   // ✅ Correcto
   color: theme.colors.textPrimary
   
   // ❌ Incorrecto
   color: theme.colors.darkGreen
   ```

5. **Mantener consistencia en espaciado**
   ```typescript
   // ✅ Correcto
   gap: theme.spacing.md,
   marginBottom: theme.spacing.lg
   
   // ❌ Incorrecto
   gap: 15,
   marginBottom: 20
   ```

### ❌ DON'T - No Hacer

1. **No hardcodear colores**
   ```typescript
   // ❌ Evitar
   backgroundColor: '#40916c'
   
   // ✅ Usar
   backgroundColor: theme.colors.primary
   ```

2. **No duplicar definiciones de estilos**
   ```typescript
   // ❌ Evitar
   // En ComponentA.tsx
   const styles = { card: { padding: 12, borderRadius: 16 } }
   // En ComponentB.tsx
   const styles = { card: { padding: 12, borderRadius: 16 } }
   
   // ✅ Crear estilo centralizado y reutilizar
   ```

3. **No ignorar el modo oscuro**
   ```typescript
   // ❌ Evitar
   <Text style={{ color: '#000000' }}>  // Invisible en dark mode
   
   // ✅ Usar
   <Text style={{ color: theme.colors.textPrimary }}>
   ```

4. **No mezclar diferentes sistemas de espaciado**
   ```typescript
   // ❌ Evitar
   padding: 12,
   margin: 15,
   gap: 18
   
   // ✅ Usar tokens consistentes
   padding: theme.spacing.md,
   margin: theme.spacing.md,
   gap: theme.spacing.lg
   ```

### Patrones Recomendados

#### Componente con Estilos Centralizados

```typescript
import { View, Text } from 'react-native';
import { useThemedStyles } from '@/src/styles/themedStyles';

export function MyComponent({ title, description }) {
  const { styles, theme } = useThemedStyles('myComponent');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}
```

#### Componente con Estilos Dinámicos

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/src/constants/designSystem';

export function DynamicCard({ isHighlighted }) {
  const theme = useAppTheme();
  
  return (
    <View style={[
      styles.card,
      { 
        backgroundColor: theme.colors.surface,
        borderColor: isHighlighted 
          ? theme.colors.primary 
          : theme.colors.border,
        borderWidth: isHighlighted ? 2 : 1,
      }
    ]}>
      <Text style={{ color: theme.colors.textPrimary }}>
        Contenido
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
  }
});
```

#### Composición de Componentes

```typescript
import { View } from 'react-native';
import { useAppTheme } from '@/src/constants/designSystem';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

export function ActionCard({ title, status, onPress }) {
  const theme = useAppTheme();
  
  return (
    <View style={{ 
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm
    }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{ 
          fontSize: 16, 
          fontWeight: '700',
          color: theme.colors.textPrimary 
        }}>
          {title}
        </Text>
        <Badge variant="default">{status}</Badge>
      </View>
      
      <Button 
        variant="outline" 
        size="sm" 
        onPress={onPress}
      >
        Ver más
      </Button>
    </View>
  );
}
```

---

## Mantenimiento y Extensión

### Agregar un Nuevo Color

1. Actualizar `ThemeColors` interface en `designSystem.ts`
2. Agregar el color a `lightColors` y `darkColors`
3. Documentar el uso del nuevo color

### Agregar un Nuevo Token de Espaciado

1. Actualizar `ThemeSpacing` interface
2. Agregar el valor a `sharedSpacing`
3. Usar consistentemente en componentes

### Modificar un Color Existente

1. Identificar el token en `lightColors` o `darkColors`
2. Modificar el valor hexadecimal
3. Verificar impacto en toda la app (los cambios son automáticos)

---

## Recursos Adicionales

### Archivos Principales

- **[designSystem.ts](src/constants/designSystem.ts)**: Definición del tema y tokens
- **[theme.ts](src/constants/theme.ts)**: Colores base y temas decorativos
- **[themedStyles.ts](src/styles/themedStyles.ts)**: Estilos centralizados por componente
- **[components/ui/](src/components/ui/)**: Componentes base reutilizables

### Flujo de Trabajo Típico

```
1. Diseño → 2. Tokens → 3. Estilos → 4. Componentes → 5. Pantallas
```

1. **Diseño**: Crear mockups con colores/espaciado consistente
2. **Tokens**: Verificar que los tokens necesarios existan
3. **Estilos**: Crear función `create*Styles` si el componente es reutilizable
4. **Componentes**: Implementar usando `useThemedStyles` o `useAppTheme`
5. **Pantallas**: Componer pantallas usando componentes

---

## Conclusión

Este Design System proporciona una base sólida para construir interfaces consistentes y mantenibles en PlantasMon. Al seguir los patrones establecidos y las mejores prácticas, garantizamos:

- ✅ **Consistencia visual** en toda la aplicación
- ✅ **Soporte completo** para modo claro y oscuro
- ✅ **Type safety** con TypeScript
- ✅ **Fácil mantenimiento** con estilos centralizados
- ✅ **Escalabilidad** para futuros componentes

Para cualquier duda o sugerencia sobre el Design System, consulta el código fuente o contacta al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Marzo 2026  
**Mantenido por:** Equipo PlantasMon
