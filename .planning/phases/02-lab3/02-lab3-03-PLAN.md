---
phase: 02-lab3
plan: 03
type: execute
wave: 3
depends_on: [02-lab3-01, 02-lab3-02]
files_modified:
  - src/components/SyncStatusIndicator.tsx
  - app/_layout.tsx
  - src/services/syncService.ts
autonomous: true
requirements:
  - Module analysis for offline capability
  - Sync indicators UI
---

<objective>
Add sync indicators, network status detection, and module analysis for offline capability.
</objective>

<tasks>

<task type="auto">
  <name>Task 1: Create network status hook</name>
  <files>src/hooks/useNetworkStatus.ts</files>
  <action>
Create hook to detect network status:

```typescript
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, isInternetReachable };
}
```

Note: May need to install @react-native-community/netinfo if not already present.
  </action>
  <verify>
    <automated>ls -la src/hooks/useNetworkStatus.ts</automated>
  </verify>
  <done>Network status hook created</done>
</task>

<task type="auto">
  <name>Task 2: Create sync service</name>
  <files>src/services/syncService.ts</files>
  <action>
Create sync service that processes queue when online:

```typescript
import { addToSyncQueue, getSyncQueue, clearSyncQueueItem } from './offlineStorage';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

let isSyncing = false;

export async function processSyncQueue(apiUrl: string) {
  if (isSyncing) return;
  
  const { isConnected } = useNetworkStatus();
  if (!isConnected) return;

  isSyncing = true;
  const queue = await getSyncQueue();

  for (const item of queue) {
    try {
      await fetch(`${apiUrl}${item.endpoint}`, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: item.data
      });
      
      await clearSyncQueueItem(item.id);
      console.log(`Synced: ${item.action}`);
    } catch (error) {
      console.error(`Sync failed for ${item.action}:`, error);
    }
  }

  isSyncing = false;
}

// Auto-sync when network becomes available
export function setupAutoSync(apiUrl: string) {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      processSyncQueue(apiUrl);
    }
  });
}
```
  </action>
  <verify>
    <automated>grep -l "processSyncQueue" src/services/syncService.ts</automated>
  </verify>
  <done>Sync service created</done>
</task>

<task type="auto">
  <name>Task 3: Create sync status indicator UI</name>
  <files>src/components/SyncStatusIndicator.tsx</files>
  <action>
Create SyncStatusIndicator component:

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Ionicons } from '@expo/vector-icons';

export function SyncStatusIndicator() {
  const { isConnected } = useNetworkStatus();

  if (isConnected) {
    return (
      <View style={styles.container}>
        <Ionicons name="cloud-done" size={20} color="#52b788" />
        <Text style={styles.text}>Sincronizado</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerOffline}>
      <Ionicons name="cloud-offline" size={20} color="#fbbf24" />
      <Text style={styles.textOffline}>Sin conexión</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#52b78820',
    borderRadius: 8,
  },
  containerOffline: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fbbf2420',
    borderRadius: 8,
  },
  text: {
    marginLeft: 8,
    color: '#52b788',
    fontSize: 14,
  },
  textOffline: {
    marginLeft: 8,
    color: '#fbbf24',
    fontSize: 14,
  },
});
```
  </action>
  <verify>
    <automated>grep -l "SyncStatusIndicator" src/components/</automated>
  </verify>
  <done>Sync indicator UI created</done>
</task>

<task type="auto">
  <name>Task 4: Create module analysis document</name>
  <files>docs/offline-modules.md</files>
  <action>
Create documentation of which modules work offline:

| Módulo | Funciona Offline | Justificación |
|--------|-----------------|---------------|
| Home Dashboard | Parcial | Muestra cache de datos previos |
| Perfil | No | Requiere datos del servidor |
| Colección de Plantas | Sí (lectura) | Datos en SQLite local |
| Agregar Planta | Cola | Se guarda local, synca después |
| Identificación | No | Requiere API externa |
| Cámara | Parcial | Captura local, pero identificación necesita red |

This analysis is required for the lab assignment documentation.
  </action>
  <verify>
    <automated>ls docs/offline-modules.md</automated>
  </verify>
  <done>Module analysis created</done>
</task>

</tasks>

<verification>
- [ ] Network status detection works
- [ ] Sync indicator shows correct status
- [ ] Sync queue processes when online
- [ ] Module analysis documented

</verification>

<success_criteria>
App shows sync status and modules work correctly in offline mode
</success_criteria>