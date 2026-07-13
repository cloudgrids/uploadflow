import { toast } from '../utils/Toaster';
import { UpscaleApi } from './UpscaleApi';
import type { UpscaleInput, UpscaleOutput } from './UpscaleContracts';

export class UpscalerCoordinators {
  private readonly upscaleApi: UpscaleApi;

  constructor(upscaleApi: UpscaleApi) {
    this.upscaleApi = upscaleApi;
  }

  public async upscalerCoordinator(param: UpscaleInput): Promise<UpscaleOutput> {
    try {
      const { taskId, workerServer, token } = await this.upscaleApi.initializeSession();
      const serverFileName = await this.upscaleApi.uploadImage(param.file, taskId, workerServer, token);

      const upscaledFile = await this.upscaleApi.upScaleImage(
        param.file.name,
        param.file.type,
        taskId,
        workerServer,
        serverFileName,
        token,
        param.upscaleFactor ?? 4
      );

      return { file: upscaledFile, status: 'completed', upscaledAt: new Date().toISOString() };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Execution failed: ${message}`);
      return { file: param.file, status: 'failed', upscaledAt: null };
    }
  }

  // It works fine for files within a single directory, but it can create bottlenecks when the number of files is large, as it processes them sequentially.
  public async runSuperPipelinedCoordinatorForFiles(params: UpscaleInput[]): Promise<UpscaleOutput[]> {
    const concurrency = Math.min(10, Math.max(1, params.length));
    const results: UpscaleOutput[] = new Array(params.length);
    let nextIndex = 0;

    await Promise.all(
      Array.from({ length: concurrency }, async () => {
        while (nextIndex < params.length) {
          const index = nextIndex++;
          results[index] = await this.upscalerCoordinator(params[index]);
        }
      })
    );

    return results;
  }

  public async taskCoordinator(params: UpscaleInput[]): Promise<UpscaleOutput[]> {
    console.log(`\nFound ${params.length} files to process for upscaling.`);

    return await this.runSuperPipelinedCoordinatorForFiles(params);
  }
}
