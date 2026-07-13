export const PAGE_INTERCEPTOR_SOURCE = 'uploadflow-page-interceptor';

export type PageInterceptorKind = 'clipboard-read' | 'xhr-send' | 'file-picker' | 'file-handle-get-file';

export interface PageInterceptorRequest {
  source: typeof PAGE_INTERCEPTOR_SOURCE;
  type: 'REQUEST';
  id: string;
  kind: PageInterceptorKind;
  files: File[];
}

export interface PageInterceptorResponse {
  source: typeof PAGE_INTERCEPTOR_SOURCE;
  type: 'RESPONSE';
  id: string;
  files: File[];
}

export interface PageInterceptorReady {
  source: typeof PAGE_INTERCEPTOR_SOURCE;
  type: 'READY';
}
