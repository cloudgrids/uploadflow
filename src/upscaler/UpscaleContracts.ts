export interface UpscaleInput {
  file: File;
  upscaleFactor?: number;
}

export interface UpscaleOutput extends UpscaleInput {
  status: 'pending' | 'completed' | 'failed';
  upscaledAt: string | null;
}
