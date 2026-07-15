import type { ConfigService } from '../services/ConfigService';
import type { StatsService } from '../services/StatsService';
import type { StorageService } from '../services/StorageService';
import type { ExtensionMessage } from '../types/Message';
import type { DownloadSnapshot, UploadFlowDownload } from '../types/Message';

type SendResponse = (response?: unknown) => void;
const DOWNLOAD_IDS_KEY = 'uploadflowDownloadIds';

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
      case 'START_DOWNLOAD':
        response = this.startDownload(message.payload.url, message.payload.filename);
        break;
      case 'GET_DOWNLOADS':
        response = this.getDownloads();
        break;
      case 'PAUSE_DOWNLOAD':
        response = this.controlDownload(message.payload.id, 'pause');
        break;
      case 'RESUME_DOWNLOAD':
        response = this.controlDownload(message.payload.id, 'resume');
        break;
      case 'CANCEL_DOWNLOAD':
        response = this.controlDownload(message.payload.id, 'cancel');
        break;
      case 'SHOW_DOWNLOAD':
        response = this.showDownload(message.payload.id);
        break;
      case 'CLEAR_DOWNLOADS':
        response = this.clearDownloads();
        break;
      default:
        return false;
    }

    void response.then(sendResponse).catch((error: unknown) => {
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown background error' });
    });
    return true;
  }

  private async startDownload(url: string, filename?: string): Promise<{ success: true; id: number }> {
    const id = await new Promise<number>((resolve, reject) => {
      chrome.downloads.download({ url, filename, saveAs: false }, (downloadId) => {
        const error = chrome.runtime.lastError;
        if (error || downloadId === undefined) {
          reject(new Error(error?.message ?? 'Chrome could not start the download'));
          return;
        }
        resolve(downloadId);
      });
    });

    const { uploadflowDownloadIds = [] } = await this.storage.get<{ uploadflowDownloadIds?: number[] }>([DOWNLOAD_IDS_KEY]);
    const ids = [id, ...uploadflowDownloadIds.filter((storedId) => storedId !== id)].slice(0, 100);
    await this.storage.set({ [DOWNLOAD_IDS_KEY]: ids });
    return { success: true, id };
  }

  private async getDownloads(): Promise<DownloadSnapshot> {
    const { uploadflowDownloadIds = [] } = await this.storage.get<{ uploadflowDownloadIds?: number[] }>([DOWNLOAD_IDS_KEY]);
    const results = await Promise.all(uploadflowDownloadIds.map((id) => this.findDownload(id)));
    return { downloads: results.filter((item): item is UploadFlowDownload => item !== null) };
  }

  private findDownload(id: number): Promise<UploadFlowDownload | null> {
    return new Promise((resolve) => {
      chrome.downloads.search({ id }, (items) => {
        if (chrome.runtime.lastError || !items[0]) {
          resolve(null);
          return;
        }
        const item = items[0];
        resolve({
          id: item.id,
          url: item.finalUrl || item.url,
          filename: item.filename.split(/[\\/]/).pop() || 'download',
          state: item.state,
          paused: item.paused,
          canResume: item.canResume,
          bytesReceived: item.bytesReceived,
          totalBytes: item.totalBytes,
          startTime: item.startTime,
          error: item.error
        });
      });
    });
  }

  private async controlDownload(
    id: number,
    action: 'pause' | 'resume' | 'cancel'
  ): Promise<{ success: true }> {
    await this.assertTrackedDownload(id);
    await new Promise<void>((resolve, reject) => {
      chrome.downloads[action](id, () => {
        const error = chrome.runtime.lastError;
        if (error) reject(new Error(error.message));
        else resolve();
      });
    });
    return { success: true };
  }

  private async showDownload(id: number): Promise<{ success: true }> {
    await this.assertTrackedDownload(id);
    chrome.downloads.show(id);
    return { success: true };
  }

  private async clearDownloads(): Promise<{ success: true }> {
    const snapshot = await this.getDownloads();
    const activeIds = snapshot.downloads
      .filter((item) => item.state === 'in_progress')
      .map((item) => item.id);
    await this.storage.set({ [DOWNLOAD_IDS_KEY]: activeIds });
    return { success: true };
  }

  private async assertTrackedDownload(id: number): Promise<void> {
    const { uploadflowDownloadIds = [] } = await this.storage.get<{ uploadflowDownloadIds?: number[] }>([DOWNLOAD_IDS_KEY]);
    if (!uploadflowDownloadIds.includes(id)) throw new Error('Download is not managed by UploadFlow');
  }
}
