export interface RecentFile {
  name: string;
  type: string;
  originalSize: number;
  newSize: number;
  timestamp: number;
  id: string;
}

export interface SandboxFile {
  id: string;
  file: File;
  optimizedFile: File | null;
}

export type FileTransformer = (file: File) => Promise<File>;
