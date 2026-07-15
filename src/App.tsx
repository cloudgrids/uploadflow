import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { Downloads } from './components/Downloads';
import Tabs from './components/Tabs';
import { UploadFlowIcon } from './lib/icons';
import { SandBox } from './sandbox/SandBox';
import { availableTools } from './sandbox/file-tools';
import { ConfigService } from './services/ConfigService';
import { MessageService } from './services/MessageService';
import { storageService } from './services/StorageService';
import { Settings } from './settings/Settings';
import { UploadFlowSettings, type UploadFlowSettingsTab } from './settings/UploadFlowSettings';
import type { RecentFile, SandboxFile, Stats } from './types/Common';
import type { StatsSnapshot } from './types/Message';

export type AppTabs = 'files' | UploadFlowSettingsTab | 'downloads' | 'settings';
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
  const isOverlay = Boolean(initialSettings && onComplete && onCancel);
  const [activeTab, setActiveTab] = useState<AppTabs>('files');
  const [activeTool, setActiveTool] = useState<UploadFlowSettingsTab>((initialSettings ?? defaultSettings).generalSettings.defaultTab);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [settings, setSettings] = useState<UploadFlowSettings>(initialSettings ?? defaultSettings);
  const [, setRecentFiles] = useState<RecentFile[]>([]);
  const [sandboxFiles, setSandboxFiles] = useState<SandboxFile[]>(() => toSandboxFiles(initialFiles));
  const [editingFile, setEditingFile] = useState<SandboxFile | null>(null);

  useEffect(() => {
    if (!isOverlay) {
      Promise.all([
        storageService.get<{ stats?: Stats; recentFiles?: RecentFile[] }>(['stats', 'recentFiles']),
        configService.getConfig()
      ]).then(([stored, config]) => {
        if (stored.stats) setStats(stored.stats);
        if (stored.recentFiles) setRecentFiles(stored.recentFiles);
        setSettings(config);
      });
      return;
    }

    void messageService
      .send<StatsSnapshot>({ type: 'GET_STATS' })
      .then((snapshot) => {
        setStats(snapshot.stats);
        setRecentFiles(snapshot.recentFiles);
      })
      .catch(() => undefined);
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

  const handleResetStats = async () => {
    const response = await messageService.send<{ success: boolean; error?: string }>({ type: 'RESET_STATS' });
    if (!response.success) throw new Error(response.error ?? 'Failed to reset statistics');

    setStats(defaultStats);
    setRecentFiles([]);
  };

  const handleTabChange = (tab: AppTabs) => {
    setActiveTab(tab);
    if (tab === 'files') {
      setEditingFile(null);
      return;
    }
    if (tab === 'settings' || tab === 'downloads') return;

    setActiveTool(tab);
    const currentSource = editingFile?.optimizedFile ?? editingFile?.file;
    if (editingFile && currentSource && availableTools(currentSource).includes(tab)) return;

    const compatibleFile = sandboxFiles.find((item) => availableTools(item.optimizedFile ?? item.file).includes(tab));
    setEditingFile(compatibleFile ?? null);
  };

  const handleToolChange = (tool: UploadFlowSettingsTab) => {
    setActiveTool(tool);
    setActiveTab(tool);
  };

  const workspaceCopy: Record<AppTabs, { eyebrow: string; title: string }> = {
    files: {
      eyebrow: sandboxFiles.length ? `${sandboxFiles.length} ${sandboxFiles.length === 1 ? 'file' : 'files'} intercepted` : 'Private file queue',
      title: sandboxFiles.length ? 'Review before upload' : 'Prepare files before upload'
    },
    image: { eyebrow: 'Image workspace', title: 'Optimize for the web' },
    redaction: { eyebrow: 'Privacy workspace', title: 'Redact private data' },
    watermark: { eyebrow: 'Brand workspace', title: 'Apply a watermark' },
    upscale: { eyebrow: 'Resolution workspace', title: 'Upscale an image' },
    downloads: { eyebrow: 'Browser-managed transfers', title: 'Download activity' },
    settings: { eyebrow: 'Workspace preferences', title: 'Settings' }
  };
  const heading = workspaceCopy[activeTab];
  const reduction = stats.totalOriginalBytes ? Math.round((stats.bytesSaved / stats.totalOriginalBytes) * 100) : 0;

  return (
    <div
      className={`uploadflow-workspace app-shell mx-auto flex w-full min-w-0 flex-col overflow-hidden border border-white/15 bg-[#101416] font-sans text-white antialiased shadow-2xl selection:bg-[#eefb7a] selection:text-[#101416] ${
        isOverlay
          ? 'h-[calc(100vh-2rem)] max-w-6xl rounded-[26px]'
          : 'h-150 rounded-none border-0'
      }`}
    >
      <AppHeader />

      <div className="flex min-h-0 min-w-0 flex-1">
        <aside className="flex w-35.5 shrink-0 flex-col border-r border-white/10 p-3 sm:w-43.5 sm:p-4">
          <div className="mb-5 flex items-center gap-2 px-2 pt-1">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-[#101416]"><UploadFlowIcon /></span>
            <div className="min-w-0">
              <strong className="block truncate text-[11px] font-black uppercase italic">UploadFlow</strong>
              <span className="mt-0.5 hidden text-[7px] font-bold uppercase tracking-[.15em] text-white/25 sm:block">Private toolkit</span>
            </div>
          </div>
          <Tabs activeTab={activeTab} onChange={handleTabChange} />

          <div className="mt-auto hidden rounded-2xl bg-[#eefb7a] p-3 text-[#101416] sm:block">
            <span className="font-mono text-[7px] uppercase tracking-[.16em] opacity-45">Total reduction</span>
            <strong className="mt-2 block text-2xl font-black tracking-tighter">−{reduction}%</strong>
            <span className="mt-1 block text-[7px] font-black uppercase">{stats.totalFiles} files processed</span>
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-end justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <p className="truncate text-[8px] font-black uppercase tracking-[.2em] text-emerald-400">{heading.eyebrow}</p>
              <h1 className="mt-1 truncate text-lg leading-tight text-white sm:text-2xl">{heading.title}</h1>
            </div>
            <span className="hidden shrink-0 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[8px] text-white/30 sm:block">
              {isOverlay ? window.location.hostname || 'webpage' : 'extension popup'}
            </span>
          </div>

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            {activeTab !== 'settings' && activeTab !== 'downloads' && (
              <SandBox
                editingFile={editingFile}
                sandboxFiles={sandboxFiles}
                setEditingFile={setEditingFile}
                setSandboxFiles={setSandboxFiles}
                onOptimization={logOptimization}
                config={settings}
                activeTool={activeTool}
                onActiveToolChange={handleToolChange}
              />
            )}
            {activeTab === 'downloads' && <Downloads />}
            {activeTab === 'settings' && <Settings onUpdate={updateSettings} settings={settings} onResetStats={handleResetStats} />}
          </main>

          <footer className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-6">
            <span className="hidden text-[8px] font-bold uppercase tracking-[.16em] text-white/25 sm:flex sm:items-center sm:gap-2"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Originals stay untouched</span>
            {isOverlay ? (
              <div className="ml-auto flex items-center gap-2">
                <button type="button" onClick={onCancel} className="cursor-pointer rounded-xl px-3 py-2 text-[9px] font-bold uppercase text-white/35 transition hover:bg-red-500/10 hover:text-red-300">Cancel</button>
                <button type="button" onClick={() => onComplete?.(sandboxFiles.map((item) => item.optimizedFile ?? item.file))} className="cursor-pointer rounded-xl bg-white px-4 py-2.5 text-[9px] font-black uppercase text-[#101416] transition hover:bg-[#eefb7a]">Continue with {sandboxFiles.length} {sandboxFiles.length === 1 ? 'file' : 'files'}</button>
              </div>
            ) : (
              <span className="ml-auto text-[8px] font-bold uppercase tracking-[.14em] text-white/20">UploadFlow v1.0</span>
            )}
          </footer>
        </section>
      </div>
    </div>
  );
}
