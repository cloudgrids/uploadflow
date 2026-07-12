import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { Dashboard } from './components/Dashboard';
import Tabs from './components/Tabs';
import { SandBox } from './sandbox/SandBox';
import { ConfigService } from './services/ConfigService';
import { MessageService } from './services/MessageService';
import { storageService } from './services/StorageService';
import { Settings } from './settings/Settings';
import { UploadFlowSettings } from './settings/UploadFlowSettings';
import type { RecentFile, SandboxFile } from './types/File';
import type { StatsSnapshot } from './types/Message';
import type { Stats } from './types/Stats';
import { toast } from './utils/Toaster';

export type AppTabs = 'dashboard' | 'sandbox' | 'settings';
const configService = new ConfigService(storageService);
const messageService = new MessageService();
const defaultSettings = new UploadFlowSettings();

const defaultStats = {
  totalFiles: 0,
  bytesSaved: 0,
  totalOriginalBytes: 0
} satisfies Stats;

interface AppProps {
  initialFiles?: File[];
  initialSettings?: UploadFlowSettings;
  onComplete?: (files: File[]) => void;
  onCancel?: () => void;
}

const toSandboxFiles = (files: File[]): SandboxFile[] =>
  files.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${index}`,
    file,
    optimizedFile: null
  }));

export default function App({ initialFiles = [], initialSettings, onComplete, onCancel }: AppProps) {
  const isOverlay = Boolean(onComplete && onCancel);
  const [activeTab, setActiveTab] = useState<AppTabs>(isOverlay ? 'sandbox' : 'dashboard');
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [settings, setSettings] = useState<UploadFlowSettings>(initialSettings ?? defaultSettings);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [sandboxFiles, setSandboxFiles] = useState<SandboxFile[]>(() => toSandboxFiles(initialFiles));
  const [editingFile, setEditingFile] = useState<SandboxFile | null>(null);

  useEffect(() => {
    if (isOverlay) return;

    Promise.all([
      storageService.get<{ settings?: UploadFlowSettings; stats?: Stats; recentFiles?: RecentFile[] }>([
        'settings',
        'stats',
        'recentFiles'
      ]),
      configService.getConfig()
    ]).then(([res, config]) => {
      if (res.settings) setSettings(res.settings);
      if (res.stats) setStats(res.stats);
      if (res.recentFiles) setRecentFiles(res.recentFiles);
      setSettings(config);
    });
  }, [isOverlay]);

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    if (!isOverlay) void configService.saveConfig(updatedSettings);
  };

  const logOptimization = (originalFile: File, optimizedFile: File, id: string) => {
    void messageService
      .send<StatsSnapshot>({
        type: 'LOG_OPTIMIZATION',
        payload: {
          name: originalFile.name,
          type: optimizedFile.type,
          originalSize: originalFile.size,
          newSize: optimizedFile.size,
          id
        }
      })
      .then((snapshot) => {
        setStats(snapshot.stats);
        setRecentFiles(snapshot.recentFiles);
      })
      .catch(() => undefined);
  };

  const handleResetStat = (id: string) => {
    try {
      setRecentFiles((prev) => prev.filter((file) => file.id !== id));
      void messageService.send({ type: 'DELETE_STAT', payload: { id } });
      toast.success('Upload history entry deleted.');
    } catch {
      toast.error('Could not delete upload history entry.');
    }
  };

  const handleResetStats = async () => {
    const response = await messageService.send<{ success: boolean; error?: string }>({ type: 'RESET_STATS' });
    if (!response.success) throw new Error(response.error ?? 'Failed to reset statistics');

    setStats(defaultStats);
    setRecentFiles([]);
  };

  return (
    <div
      className={`app-shell mx-auto flex w-full min-w-0 flex-col overflow-hidden px-5 py-4 font-sans text-slate-800 antialiased selection:bg-slate-950/20 dark:text-slate-100 ${
        isOverlay
          ? 'h-[calc(100vh-2rem)] max-w-4xl rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900'
          : 'min-h-150'
      }`}
    >
      <AppHeader />
      <Tabs activeTab={activeTab} onChange={(tab) => setActiveTab(tab as AppTabs)} />

      <main className={`mt-5 flex min-w-0 flex-1 flex-col ${isOverlay ? 'min-h-0 overflow-y-auto pr-1' : 'min-h-100'}`}>
        {activeTab === 'dashboard' && (
          <Dashboard recentFiles={recentFiles} stats={stats} settings={settings} onResetStat={handleResetStat} />
        )}
        {activeTab === 'sandbox' && (
          <SandBox
            editingFile={editingFile}
            sandboxFiles={sandboxFiles}
            setEditingFile={setEditingFile}
            setSandboxFiles={setSandboxFiles}
            onOptimization={logOptimization}
            config={settings}
          />
        )}
        {activeTab === 'settings' && <Settings onUpdate={updateSettings} settings={settings} onResetStats={handleResetStats} />}
      </main>

      {isOverlay && (
        <div className="mt-4 flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-900 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-red-900 hover:text-white"
          >
            Cancel Upload
          </button>
          <button
            type="button"
            onClick={() => onComplete?.(sandboxFiles.map((item) => item.optimizedFile ?? item.file))}
            className="cursor-pointer rounded-md bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Proceed to Upload
          </button>
        </div>
      )}

      <footer className="mt-4 flex shrink-0 items-center justify-between border-t border-slate-200 pt-3 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500 select-none dark:border-white/6 dark:text-slate-600">
        <span>UploadFlow v1.0</span>
        <span className="flex items-center gap-1.5">
          <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Local processing
        </span>
      </footer>
    </div>
  );
}
