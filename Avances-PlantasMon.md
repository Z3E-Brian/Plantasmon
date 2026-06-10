# PlantasMon — Avances de la Aplicación

**Versión:** 1.0.0
**Fecha:** Junio 2026
**Plataforma:** Android
**Framework:** Expo SDK 54 + React Native

---

## 1. Resumen del Proyecto

PlantasMon es una aplicación companion para el cuidado de plantas desarrollada con React Native (Expo SDK 54). Permite identificar plantas mediante IA, llevar un registro de cuidados, completar misiones y obtener recompensas, y chatear con otros usuarios en tiempo real con cifrado de extremo a extremo.

El backend del chat está implementado con FastAPI y desplegado en Render.

---

## 2. Últimos Avances Implementados

A continuación se describen los cambios más relevantes desde la última entrega.

### 2.1 Chat en Tiempo Real con Cifrado E2E

Se integró un módulo de chat completo con:

- **Backend FastAPI** desplegado en Render con conexiones persistentes vía WebSocket
- **Reconexión automática** en caso de caída de conexión (hasta 5 intentos)
- **Soporte de mensajes grupales y privados (DM)** con subida de archivos multimedia a Cloudinary
- **Cifrado de extremo a extremo** usando TweetNaCl (curva elíptica curve25519-xsalsa20-poly1305)
  - Cada usuario genera un par de llaves localmente
  - La llave pública se registra en el servidor
  - Los mensajes se cifran y descifran exclusivamente en el dispositivo
  - El servidor solo almacena texto cifrado, nunca mensajes en texto plano
- **Botón flotante** (FAB) para acceso rápido al chat desde cualquier pantalla
- **Mensajes temporales** auto-destructivos

### 2.2 Lista de Chats (tipo WhatsApp)

- Nueva pantalla de conversaciones al abrir el chat
- Muestra **Chat grupal** como conversación principal
- Lista de **mensajes directos (DM)** con otros usuarios
- Vista de **usuarios en línea** en la parte superior para iniciar DM rápidamente
- **Nombre de usuario autocompletado** desde Firebase (sin necesidad de ingresar apodo manualmente)
- Sesión persistente: al volver a entrar no pide nombre otra vez

### 2.2 Navegación y UX

- El botón de Chat se movió de la barra de navegación inferior a un **botón flotante** (FAB) en la esquina inferior derecha
- El BottomNav se oculta automáticamente en pantallas de chat, cámara, login y registro
- Mejora en el manejo del teclado en la pantalla de chat (`KeyboardAvoidingView`)

### 2.3 Sistema de Misiones y Recompensas

- Misiones diarias (5 misiones/día) y semanales (2 misiones/semana) con rotación determinista
- Seguimiento de progreso multi-etapa (ej. "0/3 plantas identificadas")
- Detección basada en eventos (identificar, regar, compartir, escanear)
- Flujo de reclamo de recompensas con animación
- Período de gracia para misiones no reclamadas
- ~30 objetos cosméticos obtenibles con niveles de rareza
- Vitrina de perfil para mostrar objetos obtenidos

### 2.4 Cuadros de Información Pop-up

- Popups de primera vez al usar nuevas funcionalidades
- Popups de celebración al desbloquear logros y completar misiones
- Botones de información en pantallas de exploración
- Sistema de descarte de popups con persistencia

### 2.5 Calendario y Actividad en Perfil

- Pantalla de calendario con marcadores de eventos de cuidado
- Feed de actividad en perfil con datos reales de Firestore
- Línea de tiempo en la pantalla de inicio

### 2.6 Verificación contra Datos Hardcodeados

- Escaneo y corrección de patrones hardcodeados en toda la app
- Migración de configuración de Firebase a variables de entorno
- Limpieza de datos mock y estados vacíos

### 2.7 Eliminación de Funcionalidad de Exportación PDF

- Se eliminó la pantalla de generación de PDF y el servicio asociado de la aplicación
- La app ya no incluye funcionalidad de exportación de reportes en PDF

---

## 3. Backend

El backend del chat está operativo y disponible en:

- **URL:** `https://chat-backend-4nzg.onrender.com`
- **Documentación Swagger:** `https://chat-backend-4nzg.onrender.com/docs`
- **Health check:** `https://chat-backend-4nzg.onrender.com/health`

**Estado:** ✅ Operativo al momento de la revisión

**Tecnologías:**
- FastAPI (Python)
- WebSockets para mensajería en tiempo real
- JWT para autenticación
- Cloudinary para almacenamiento de imágenes
- Firebase Admin SDK

**Repositorio:** `https://github.com/JoshuaEA54/chat_backend`

---

## 4. Build Android (Preview)

El APK de preview se generó mediante EAS Build (Expo Application Services).

**Descargar APK:**
[https://expo.dev/artifacts/eas/bhvnxFh3HVHvLzLETYjPDb.apk](https://expo.dev/artifacts/eas/bhvnxFh3HVHvLzLETYjPDb.apk)

**Incluye todas las funcionalidades:** autenticación, identificación de plantas, misiones, logros, chat en tiempo real con cifrado E2E, calendario, y más.

---

## 5. Repositorio

El código fuente está disponible en GitHub:

[https://github.com/Z3E-Brian/Plantasmon](https://github.com/Z3E-Brian/Plantasmon)

---

*Documento generado el junio 2026 — PlantasMon v1.0.0*
