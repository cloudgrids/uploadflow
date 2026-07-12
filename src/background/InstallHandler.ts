import type { ConfigService } from '../services/ConfigService';
import type { StatsService } from '../services/StatsService';
import type { StorageService } from '../services/StorageService';

export class InstallHandler {
  private readonly storage: StorageService;
  private readonly config: ConfigService;
  private readonly stats: StatsService;

  constructor(storage: StorageService, config: ConfigService, stats: StatsService) {
    this.storage = storage;
    this.config = config;
    this.stats = stats;
  }

  private runtime(): typeof chrome.runtime {
    return chrome.runtime;
  }

  register(): void {
    this.runtime().onInstalled.addListener(() => void this.initialize());
  }

  async initialize(): Promise<void> {
    const state = await this.storage.get<{ isEnabled?: boolean; stats?: unknown }>(['isEnabled', 'stats']);

    const tasks: Promise<void>[] = [this.config.initializeDefaults()];

    if (state.isEnabled === undefined) tasks.push(this.storage.set({ isEnabled: true }));
    if (state.stats === undefined) tasks.push(this.stats.reset());

    await Promise.all(tasks);
  }
}
