import { getSyncQueue, clearSyncQueueItem } from './offlineStorage';
import NetInfo from '@react-native-community/netinfo';

let isSyncing = false;
let listeners: Array<(status: SyncStatus) => void> = [];

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

interface SyncProgress {
  current: number;
  total: number;
  status: SyncStatus;
}

let progress: SyncProgress = { current: 0, total: 0, status: 'idle' };

export function onSyncStatusChange(cb: (status: SyncStatus) => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function notify(status: SyncStatus) {
  progress.status = status;
  listeners.forEach((cb) => cb(status));
}

export async function processSyncQueue(apiUrl: string): Promise<void> {
  if (isSyncing) return;

  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    notify('offline');
    return;
  }

  isSyncing = true;
  notify('syncing');
  const queue = await getSyncQueue();
  progress.total = queue.length;
  progress.current = 0;

  for (const item of queue) {
    try {
      await fetch(`${apiUrl}${item.endpoint}`, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: item.data,
      });
      await clearSyncQueueItem(item.id);
      progress.current++;
    } catch {
      notify('error');
      isSyncing = false;
      return;
    }
  }

  isSyncing = false;
  notify('idle');
}

export function setupAutoSync(apiUrl: string): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      processSyncQueue(apiUrl);
    }
  });
  return unsubscribe;
}
