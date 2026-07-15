export const PAGE_INTERCEPTOR_SOURCE = 'uploadflow-page-interceptor';

export type PageInterceptorKind = 'file-input' | 'clipboard-read' | 'fetch-send' | 'xhr-send' | 'file-handle-get-file';

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
  cancelled: boolean;
}

export interface PageInterceptorState {
  source: typeof PAGE_INTERCEPTOR_SOURCE;
  type: 'STATE';
  enabled: boolean;
}

export interface PageMediaInspectionState {
  source: typeof PAGE_INTERCEPTOR_SOURCE;
  type: 'MEDIA_INSPECTION_STATE';
  enabled: boolean;
}

export interface PageMediaSources {
  source: typeof PAGE_INTERCEPTOR_SOURCE;
  type: 'MEDIA_SOURCES';
  urls: string[];
}
