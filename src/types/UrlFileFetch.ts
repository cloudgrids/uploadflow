export const URL_FILE_FETCH_PORT = 'uploadflow-url-file-fetch';

export type UrlFileFetchRequest = { type: 'fetch'; url: string };

export type UrlFileFetchMessage =
  | { type: 'meta'; contentType: string; filename?: string; totalBytes: number }
  | { type: 'chunk'; data: string; receivedBytes: number }
  | { type: 'complete' }
  | { type: 'error'; message: string };

export interface FetchedUrlFile {
  blob: Blob;
  filename?: string;
}
