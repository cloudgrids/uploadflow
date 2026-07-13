import { toast } from '../utils/Toaster';
import type { UploadFlowSettings } from './UploadFlowSettings';

interface ImageSettingsProps {
  settings: UploadFlowSettings;
  onUpdate: (updatedSettings: UploadFlowSettings) => void;
}

export const ImageSettings: React.FC<ImageSettingsProps> = ({ settings, onUpdate }) => {
  const is = settings.imageSettings;
  const updateImageSettings = (updated: Partial<UploadFlowSettings['imageSettings']>) => {
    onUpdate({
      ...settings,
      imageSettings: { ...is, ...updated }
    });
  };

  const toggleAutoOptimize = (enabled: boolean) => {
    try {
      updateImageSettings({ enableAutoOptimize: enabled });
      toast.sw(`Auto-optimize images ${enabled ? 'enabled' : 'disabled'}.`, enabled);
    } catch {
      toast.error('Could not update auto-optimize setting.');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xs text-slate-950 dark:text-white">Auto-optimize Images</h3>
          <p className="mt-1 text-[10px] text-slate-500">Automatically optimize images for web use</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>{is.enableAutoOptimize ? 'Enabled' : 'Disabled'}</span>
          <input
            type="checkbox"
            checked={is.enableAutoOptimize}
            onChange={(event) => toggleAutoOptimize(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-purple-500"
          />
        </label>
      </div>
      <fieldset disabled={!is.enableAutoOptimize} className="flex flex-col gap-3.5 disabled:opacity-50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Default Convert Format</span>
          <select
            value={is.defaultFormat}
            onChange={(e) => updateImageSettings({ defaultFormat: e.target.value })}
            className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-2 py-1 rounded text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-purple-600"
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Default Image Quality</span>
            <span className="text-xs font-mono font-semibold text-purple-400">{Math.round(is.defaultQuality * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={is.defaultQuality}
            onChange={(e) => updateImageSettings({ defaultQuality: Number(e.target.value) })}
            className="w-full accent-purple-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
          />
        </div>
      </fieldset>
    </div>
  );
};
