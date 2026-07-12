import type { UploadFlowSettings } from '../settings/UploadFlowSettings';
import type { RecentFile } from './File';
import type { Stats } from './Stats';

export interface ExtensionConfig {
  settings: UploadFlowSettings;
}

export type ExtensionMessage =
  | { type: 'GET_CONFIG' }
  | { type: 'LOG_OPTIMIZATION'; payload: Omit<RecentFile, 'timestamp'> }
  | { type: 'GET_STATS' }
  | { type: 'RESET_STATS' }
  | { type: 'DELETE_STAT'; payload: { id: string } };

export interface StatsSnapshot {
  stats: Stats;
  recentFiles: RecentFile[];
}
