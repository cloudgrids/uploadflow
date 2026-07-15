import type { RecentFile, Stats } from '../types/Common';
import type { StatsSnapshot } from '../types/Message';
import type { StorageService } from './StorageService';

const emptyStats: Stats = { totalFiles: 0, bytesSaved: 0, totalOriginalBytes: 0 };

export class StatsService {
  private readonly storage: StorageService;

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  async logOptimization(file: Omit<RecentFile, 'timestamp'>): Promise<StatsSnapshot> {
    const { stats, recentFiles } = await this.getStats();

    const bytesSaved = Math.max(0, file.originalSize - file.newSize);
    const updatedStats = {
      totalFiles: stats.totalFiles + 1,
      bytesSaved: stats.bytesSaved + bytesSaved,
      totalOriginalBytes: stats.totalOriginalBytes + file.originalSize
    } satisfies Stats;

    const log = { ...file, timestamp: Date.now() } satisfies RecentFile;

    const updatedRecentFiles = [log, ...recentFiles].slice(0, 20);
    await this.storage.set({ stats: updatedStats, recentFiles: updatedRecentFiles });
    return { stats: updatedStats, recentFiles: updatedRecentFiles };
  }

  async getStats(): Promise<StatsSnapshot> {
    const result = await this.storage.get<{ stats?: Stats; recentFiles?: RecentFile[] }>(['stats', 'recentFiles']);
    return { stats: result.stats ?? emptyStats, recentFiles: result.recentFiles ?? [] };
  }

  async deleteStat(id: string): Promise<StatsSnapshot> {
    const { stats, recentFiles } = await this.getStats();
    const updatedRecentFiles = recentFiles.filter((file) => file.id !== id);
    await this.storage.set({ recentFiles: updatedRecentFiles });
    return { stats, recentFiles: updatedRecentFiles };
  }

  async reset(): Promise<void> {
    await this.storage.set({ stats: emptyStats, recentFiles: [] });
  }
}
