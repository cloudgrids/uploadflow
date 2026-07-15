import { DeleteIcon } from '../lib/icons';
import type { UploadFlowSettings } from '../settings/UploadFlowSettings';
import type { RecentFile, Stats } from '../types/Common';
import { formatBytes } from '../utils/helpers';
import { Panel, SectionHeading } from './ui';

interface DashboardProps {
  recentFiles: Array<RecentFile>;
  stats: Stats;
  onResetStat: (id: string) => void;
  settings: UploadFlowSettings;
}

export const Dashboard: React.FC<DashboardProps> = ({ recentFiles, stats, onResetStat, settings }) => {
  const totalSavedPercent = stats.totalOriginalBytes ? Math.round((stats.bytesSaved / stats.totalOriginalBytes) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="grid grid-cols-3 gap-2.5">
        {[
          ['Files processed', stats.totalFiles],
          ['Space saved', formatBytes(stats.bytesSaved, 1)],
          ['Reduction', `${totalSavedPercent}%`]
        ].map(([label, value], index) => (
          <Panel key={label} className="p-3.5 flex flex-col gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
            <span
              className={`text-xl font-black tracking-tight ${index === 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-950 dark:text-white'}`}
            >
              {value}
            </span>
          </Panel>
        ))}
      </div>

      {!settings.generalSettings.enableUploadFlow && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300/90 flex gap-2.5 items-start">
          <svg className="w-5 h-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>
            UploadFlow is paused. Webpage file input selection events will bypass optimization rules. Sandbox manual mode remains active.
          </p>
        </div>
      )}

      <Panel className="flex-1 flex flex-col p-4 min-h-55">
        <SectionHeading eyebrow="History" title="Recent activity" />
        {recentFiles.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-8">
            <svg className="w-8 h-8 text-slate-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>No optimizations recorded yet.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-65 overflow-y-auto pr-1">
            {recentFiles.map((item, idx) => {
              const saved = item.originalSize - item.newSize;
              const savedPercent = Math.round((saved / item.originalSize) * 100);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs dark:bg-slate-900/60 dark:border-slate-800/40"
                >
                  <div className="flex flex-col min-w-0 flex-1 pr-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatBytes(item.originalSize)} &rarr; {formatBytes(item.newSize)}
                    </span>
                  </div>
                  <span
                    className={`font-semibold font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      savedPercent > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {savedPercent > 0 ? `-${savedPercent}%` : '0%'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onResetStat(item.id)}
                    className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
};
