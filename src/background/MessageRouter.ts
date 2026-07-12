import type { ConfigService } from '../services/ConfigService';
import type { StatsService } from '../services/StatsService';
import type { StorageService } from '../services/StorageService';
import type { ExtensionMessage } from '../types/Message';

type SendResponse = (response?: unknown) => void;

export class MessageRouter {
  private readonly config: ConfigService;
  private readonly stats: StatsService;
  private readonly storage: StorageService;

  constructor(config: ConfigService, stats: StatsService, storage: StorageService) {
    this.config = config;
    this.stats = stats;
    this.storage = storage;
  }

  register(): void {
    chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => this.handle(message, sendResponse));
  }

  private handle(message: ExtensionMessage, sendResponse: SendResponse): boolean {
    let response: Promise<unknown>;

    switch (message.type) {
      case 'GET_CONFIG':
        response = Promise.all([this.storage.get<{ isEnabled?: boolean }>(['isEnabled']), this.config.getConfig()]).then(
          ([state, settings]) => ({ isEnabled: state.isEnabled ?? true, settings })
        );
        break;
      case 'LOG_OPTIMIZATION':
        response = this.stats.logOptimization(message.payload);
        break;
      case 'GET_STATS':
        response = this.stats.getStats();
        break;
      case 'RESET_STATS':
        response = this.stats.reset().then(() => ({ success: true }));
        break;
      case 'DELETE_STAT':
        response = this.stats.deleteStat(message.payload.id);
        break;
      default:
        return false;
    }

    void response.then(sendResponse).catch((error: unknown) => {
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown background error' });
    });
    return true;
  }
}
