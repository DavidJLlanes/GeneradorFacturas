export interface StorageUsage {
  usedBytes: number;
  quotaBytes: number;
}

// Espacio que ocupa lo guardado en este navegador (aproximado), o `null` si no se puede saber.
export async function storageUsage(): Promise<StorageUsage | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return null;
  const { usage, quota } = await navigator.storage.estimate();
  if (usage === undefined || quota === undefined) return null;
  return { usedBytes: usage, quotaBytes: quota };
}

// Pide al navegador que no borre lo guardado cuando falte espacio. Devuelve si lo concede.
export async function requestPersistence(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return false;
  return navigator.storage.persist();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}
