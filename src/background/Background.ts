import { ConfigService } from '../services/ConfigService';
import { StatsService } from '../services/StatsService';
import { storageService } from '../services/StorageService';
import { InstallHandler } from './InstallHandler';
import { MessageRouter } from './MessageRouter';
import { UrlFileFetchService } from './UrlFileFetchService';

export class Background {
  initialize(): void {
    const config = new ConfigService(storageService);
    const stats = new StatsService(storageService);

    new InstallHandler(storageService, config, stats).register();
    new MessageRouter(config, stats, storageService).register();
    new UrlFileFetchService().register();
  }
}
