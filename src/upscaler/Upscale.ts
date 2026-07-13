import { toast } from '../utils/Toaster';
import { UpscaleApi } from './UpscaleApi';
import type { UpscaleInput, UpscaleOutput } from './UpscaleContracts';
import { UpscalerCoordinators } from './UpscalerCoordinators';

export class Upscale {
  private readonly upscaleApi = new UpscaleApi();
  private readonly taskCoordinators: UpscalerCoordinators;

  constructor() {
    this.taskCoordinators = new UpscalerCoordinators(this.upscaleApi);
  }

  public async upscale(params: UpscaleInput[]): Promise<UpscaleOutput[]> {
    toast.info(`Starting upscaling for ${params.length} files...`);

    try {
      return await this.taskCoordinators.taskCoordinator(params);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Upscaling failed: ${message}`);
      return [];
    } finally {
      toast.success(`Upscaling process completed`);
    }
  }
}

export const upscaleInstance = new Upscale();
