import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'plantasmon_cache';
const QUEUE_KEY = 'plantasmon_offline_queue';

interface PlantData {
  id: string;
  [key: string]: any;
}

interface SyncOperation {
  id: string;
  action: string;
  plantId: string;
  endpoint: string;
  method: string;
  data?: string;
  timestamp: number;
}

export async function savePlantLocal(plant: PlantData): Promise<void> {
  const cached = await getLocalPlants();
  const idx = cached.findIndex((p) => p.id === plant.id);
  if (idx >= 0) {
    cached[idx] = plant;
  } else {
    cached.push(plant);
  }
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cached));
}

export async function getLocalPlants(): Promise<PlantData[]> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addToSyncQueue(op: Omit<SyncOperation, 'id' | 'timestamp'>): Promise<void> {
  const queue = await getSyncQueue();
  queue.push({ ...op, id: `${Date.now()}-${Math.random()}`, timestamp: Date.now() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function getSyncQueue(): Promise<SyncOperation[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearSyncQueueItem(id: string): Promise<void> {
  const queue = await getSyncQueue();
  const updated = queue.filter((item) => item.id !== id);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
}

export async function getSyncQueueCount(): Promise<number> {
  const queue = await getSyncQueue();
  return queue.length;
}

export async function clearSyncQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY);
}

export async function hasLocalPlant(plantId: string): Promise<boolean> {
  const plants = await getLocalPlants();
  return plants.some((p: PlantData) => p.id === plantId);
}
