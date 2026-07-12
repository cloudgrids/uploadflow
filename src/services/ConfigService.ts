import { UploadFlowSettings } from '../settings/UploadFlowSettings';
import type { StorageService } from './StorageService';

export class ConfigService {
  private readonly storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  public async getConfig(): Promise<UploadFlowSettings> {
    const { settings } = await this.storageService.get<{ settings?: UploadFlowSettings }>(['settings']);
    const defaults = new UploadFlowSettings();

    if (!settings) return defaults;

    return new UploadFlowSettings(
      { ...defaults.imageSettings, ...settings.imageSettings },
      { ...defaults.redactionSettings, ...settings.redactionSettings },
      { ...defaults.upscaleSettings, ...settings.upscaleSettings },
      { ...defaults.watermarkSettings, ...settings.watermarkSettings },
      { ...defaults.generalSettings, ...settings.generalSettings }
    );
  }

  public async saveConfig(config: UploadFlowSettings): Promise<void> {
    await this.storageService.set({ settings: config });
  }

  public async initializeDefaults(): Promise<void> {
    const { settings } = await this.storageService.get<{ settings?: UploadFlowSettings }>(['settings']);

    if (!settings) await this.saveConfig(new UploadFlowSettings());
  }
}
