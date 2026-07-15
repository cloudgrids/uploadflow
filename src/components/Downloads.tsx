import { useCallback, useEffect, useState } from 'react';
import { MessageService } from '../services/MessageService';
import type { DownloadSnapshot, ExtensionMessage, UploadFlowDownload } from '../types/Message';
import { formatBytes } from '../utils/helpers';

const messageService = new MessageService();

function progress(item: UploadFlowDownload): number {
  if (item.state === 'complete') return 100;
  if (item.totalBytes <= 0) return 0;
  return Math.min(100, Math.round((item.bytesReceived / item.totalBytes) * 100));
}

function sourceHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'download source';
  }
}

export function Downloads() {
  const [downloads, setDownloads] = useState<UploadFlowDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const snapshot = await messageService.send<DownloadSnapshot>({ type: 'GET_DOWNLOADS' });
      setDownloads(Array.isArray(snapshot.downloads) ? snapshot.downloads : []);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load downloads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 1_000);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const control = async (message: ExtensionMessage) => {
    try {
      const response = await messageService.send<{ success: boolean; error?: string }>(message);
      if (!response.success) throw new Error(response.error ?? 'Download action failed');
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Download action failed');
    }
  };

  const clearFinished = async () => {
    await control({ type: 'CLEAR_DOWNLOADS' });
  };

  return (
    <div className="flex min-h-full flex-col gap-3 animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[9px] uppercase tracking-[.14em] text-white/30">Managed by Chrome · continues when UploadFlow closes</p>
        {downloads.some((item) => item.state !== 'in_progress') && (
          <button type="button" onClick={() => void clearFinished()} className="cursor-pointer text-[9px] font-bold uppercase text-white/35 transition hover:text-white">Clear finished</button>
        )}
      </div>

      {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-[10px] text-red-300">{error}</div>}

      {!loading && downloads.length === 0 ? (
        <div className="flex min-h-52 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/2.5 p-6 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-xl text-white/55">↓</span>
          <h3 className="mt-4 text-sm text-white">No UploadFlow downloads yet</h3>
          <p className="mt-1 max-w-xs text-[10px] leading-4 text-white/30">Use the download action shown while hovering over media on a webpage.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {downloads.map((item) => {
            const percent = progress(item);
            const isActive = item.state === 'in_progress';
            return (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-white/2.5 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[11px] normal-case text-white/85">{item.filename}</h3>
                    <p className="mt-1 truncate font-mono text-[8px] text-white/30">{sourceHost(item.url)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-black uppercase tracking-wider ${item.state === 'complete' ? 'bg-emerald-400/10 text-emerald-300' : item.state === 'interrupted' ? 'bg-red-400/10 text-red-300' : 'bg-[#eefb7a]/10 text-[#eefb7a]'}`}>
                    {item.paused ? 'Paused' : item.state.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#eefb7a] transition-[width] duration-300" style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-[8px] text-white/30">
                    {formatBytes(Math.max(0, item.bytesReceived))}{item.totalBytes > 0 ? ` / ${formatBytes(item.totalBytes)}` : ''} · {percent}%
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isActive && !item.paused && (
                      <button type="button" onClick={() => void control({ type: 'PAUSE_DOWNLOAD', payload: { id: item.id } })} className="cursor-pointer rounded-lg border border-white/10 px-2.5 py-1.5 text-[8px] font-bold uppercase text-white/50 hover:bg-white/5 hover:text-white">Pause</button>
                    )}
                    {((isActive && item.paused) || (item.state === 'interrupted' && item.canResume)) && (
                      <button type="button" onClick={() => void control({ type: 'RESUME_DOWNLOAD', payload: { id: item.id } })} className="cursor-pointer rounded-lg bg-white px-2.5 py-1.5 text-[8px] font-black uppercase text-[#101416] hover:bg-[#eefb7a]">Resume</button>
                    )}
                    {isActive && (
                      <button type="button" onClick={() => void control({ type: 'CANCEL_DOWNLOAD', payload: { id: item.id } })} className="cursor-pointer rounded-lg px-2 py-1.5 text-[8px] font-bold uppercase text-red-300/65 hover:bg-red-500/10 hover:text-red-300">Cancel</button>
                    )}
                    {item.state === 'complete' && (
                      <button type="button" onClick={() => void control({ type: 'SHOW_DOWNLOAD', payload: { id: item.id } })} className="cursor-pointer rounded-lg border border-white/10 px-2.5 py-1.5 text-[8px] font-bold uppercase text-white/50 hover:bg-white/5 hover:text-white">Show file</button>
                    )}
                  </div>
                </div>
                {item.error && <p className="mt-2 text-[8px] text-red-300/70">{item.error}</p>}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
