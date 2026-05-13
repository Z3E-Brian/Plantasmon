import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';
import { getSyncQueueCount } from '@/src/services/offlineStorage';

type BannerState = 'hidden' | 'offline' | 'syncing' | 'error';

interface Props {
  onRetry?: () => void;
}

export function SyncStatusIndicator({ onRetry }: Props) {
  const { isConnected } = useNetworkStatus();
  const [banner, setBanner] = useState<BannerState>('hidden');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isConnected) {
      getSyncQueueCount().then(setPendingCount);
      setBanner('offline');
    } else if (banner === 'offline') {
      setBanner('syncing');
      const timer = setTimeout(() => setBanner('hidden'), 2000);
      return () => clearTimeout(timer);
    } else {
      setBanner('hidden');
    }
  }, [isConnected]);

  if (banner === 'hidden') return null;

  return (
    <View
      style={[
        styles.container,
        banner === 'offline' && styles.offline,
        banner === 'syncing' && styles.syncing,
        banner === 'error' && styles.error,
      ]}
    >
      {banner === 'offline' && (
        <>
          <Ionicons name="cloud-offline" size={18} color="#92400e" />
          <Text style={styles.offlineText}>
            Sin conexión · {pendingCount} cambio{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''}
          </Text>
        </>
      )}
      {banner === 'syncing' && (
        <>
          <ActivityIndicator size="small" color="#1e40af" />
          <Text style={styles.syncingText}>Sincronizando...</Text>
        </>
      )}
      {banner === 'error' && (
        <>
          <Ionicons name="alert-circle" size={18} color="#991b1b" />
          <Text style={styles.errorText}>Error al sincronizar</Text>
          {onRetry && (
            <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  offline: {
    backgroundColor: '#fef3c7',
  },
  syncing: {
    backgroundColor: '#dbeafe',
  },
  error: {
    backgroundColor: '#fee2e2',
  },
  offlineText: {
    color: '#92400e',
    fontSize: 14,
  },
  syncingText: {
    color: '#1e40af',
    fontSize: 14,
    marginLeft: 6,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    flex: 1,
  },
  retryBtn: {
    backgroundColor: '#991b1b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
