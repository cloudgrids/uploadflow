/* eslint-disable no-useless-assignment */
import { toast } from '../utils/Toaster';

export class UpscaleApi {
  private readonly serverUrl = (import.meta.env.VITE_SERVER_URL || 'https://uploadflow-vercel.app').replace(/\/$/, '');

  private readonly defaultFormValues = {
    chunk: '0',
    chunks: '1',
    preview: '1',
    pdfinfo: '0',
    pdfforms: '0',
    pdfresetforms: '0',
    v: 'web.0'
  } as const;

  public async initializeSession() {
    const result = await fetch(`${this.serverUrl}/api/upscale`);

    if (!result.ok) throw new Error(`Failed to initialize upscale session through UploadFlow server (${result.status}).`);

    const text = await result.text();

    const configMatch = text.match(/var ilovepdfConfig\s*=\s*(\{.*?\});/);
    let config = {
      servers: [] as Array<string>,
      site: 'iloveimg',
      taskId: '',
      workerServer: '',
      token: ''
    };

    if (configMatch) {
      try {
        config = JSON.parse(configMatch[1]);
      } catch {
        toast.warning('Could not parse config JSON directly, using regex fallbacks.');
      }
    }

    const taskIdMatch = text.match(/ilovepdfConfig\.taskId\s*=\s*['"]([^'"]*)['"]/);
    const taskId = taskIdMatch ? taskIdMatch[1] : null;

    if (!taskId) throw new Error('Failed to find taskId in the webpage HTML.');

    let workerServer = '';
    const servers = config?.servers || [];
    const site = config?.site || 'iloveimg';
    const token = config?.token || '';

    if (servers?.length) {
      const selectedServer = servers[Math.floor(Math.random() * servers.length)];
      if (selectedServer.includes('.com')) workerServer = `https://${selectedServer.replace(/^\/\/|^https?:\/\//, '')}`;
      else workerServer = `https://${selectedServer}.${site}.com`;
    } else workerServer = 'https://api11g.iloveimg.com';

    return { taskId, workerServer, token: `Bearer ${token}` };
  }

  public async uploadImage(file: File, taskId: string, workerServer: string, accessToken: string) {
    const formValues = {
      name: file.name,
      task: taskId,
      file: file,
      ...this.defaultFormValues
    };

    const uploadForm = new FormData();
    for (const [key, value] of Object.entries(formValues)) {
      uploadForm.append(key, value);
    }

    const uploadResponse = await fetch(`${workerServer}/v1/upload`, {
      method: 'POST',
      headers: { Authorization: accessToken },
      body: uploadForm
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
    }

    const uploadResult = await uploadResponse.json();
    const serverFileName = uploadResult?.server_filename;

    if (!serverFileName) throw new Error('Upload response did not contain server_filename');

    return serverFileName;
  }

  public async upScaleImage(
    filename: string,
    type: string,
    taskId: string,
    workerServer: string,
    serverFileName: string,
    accessToken: string,
    upscaleFactor: number
  ): Promise<File> {
    const upscaleForm = new FormData();
    upscaleForm.append('task', taskId);
    upscaleForm.append('server_filename', serverFileName ?? '');
    upscaleForm.append('scale', String(upscaleFactor));

    const upscaleResponse = await fetch(`${workerServer}/v1/upscale`, {
      method: 'POST',
      headers: { Authorization: accessToken },
      body: upscaleForm
    });

    if (!upscaleResponse.ok) {
      const errorText = await upscaleResponse.text();
      throw new Error(`Upscaling failed with status ${upscaleResponse.status}: ${JSON.parse(errorText)?.error?.message} -> ${filename}`);
    }

    const blob = await upscaleResponse.blob();
    const buffer = await blob.arrayBuffer();
    return new File([buffer], filename, { type });
  }
}
