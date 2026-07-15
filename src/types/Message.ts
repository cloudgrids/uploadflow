import type { UploadFlowSettings } from '../settings/UploadFlowSettings';
import type { RecentFile, Stats } from './Common';

export interface ExtensionConfig {
  isEnabled?: boolean;
  settings: UploadFlowSettings;
}

export type ExtensionMessage =
  | { type: 'GET_CONFIG' }
  | { type: 'LOG_OPTIMIZATION'; payload: Omit<RecentFile, 'timestamp'> }
  | { type: 'GET_STATS' }
  | { type: 'RESET_STATS' }
  | { type: 'DELETE_STAT'; payload: { id: string } }
  | { type: 'START_DOWNLOAD'; payload: { url: string; filename?: string } }
  | { type: 'GET_DOWNLOADS' }
  | { type: 'PAUSE_DOWNLOAD'; payload: { id: number } }
  | { type: 'RESUME_DOWNLOAD'; payload: { id: number } }
  | { type: 'CANCEL_DOWNLOAD'; payload: { id: number } }
  | { type: 'SHOW_DOWNLOAD'; payload: { id: number } }
  | { type: 'CLEAR_DOWNLOADS' };

export interface StatsSnapshot {
  stats: Stats;
  recentFiles: RecentFile[];
}

export interface UploadFlowDownload {
  id: number;
  url: string;
  filename: string;
  state: 'in_progress' | 'interrupted' | 'complete';
  paused: boolean;
  canResume: boolean;
  bytesReceived: number;
  totalBytes: number;
  startTime: string;
  error?: string;
}

export interface DownloadSnapshot {
  downloads: UploadFlowDownload[];
}
