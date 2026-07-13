import { toast } from '../utils/Toaster';
import type { UploadFlowSettings } from './UploadFlowSettings';

interface UpscaleSettingsProps {
  settings: UploadFlowSettings;
  onUpdate: (updatedSettings: UploadFlowSettings) => void;
}

const upscaleFactors = [
  { value: 2, label: '2x' },
  { value: 4, label: '4x' }
];

export const UpscaleSettings: React.FC<UpscaleSettingsProps> = ({ settings, onUpdate }) => {
  const us = settings.upscaleSettings;

  const updateUpscaleSettings = (updated: Partial<UploadFlowSettings['upscaleSettings']>) => {
    onUpdate({
      ...settings,
      upscaleSettings: { ...us, ...updated }
    });
  };

  const handleUpscaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const value = parseInt(event.target.value, 10);
      updateUpscaleSettings({ upscaleFactor: isNaN(value) ? 2 : Math.max(2, Math.min(4, value)) });
      toast.success(`Upscale factor set to ${value}`);
    } catch {
      toast.error('Invalid upscale factor. Please enter a number between 2 and 4.');
    }
  };

  const toggleUpscaling = (enabled: boolean) => {
    updateUpscaleSettings({ enableUpscaling: enabled });
    toast.sw(`Upscaling ${enabled ? 'enabled' : 'disabled'}`, enabled);
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xs text-slate-950 dark:text-white">Upscaling</h3>
          <p className="mt-1 text-[10px] text-slate-500">Configure the default upscaling settings for your images.</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>{us.enableUpscaling ? 'Enabled' : 'Disabled'}</span>
          <input
            type="checkbox"
            checked={us.enableUpscaling}
            onChange={(event) => toggleUpscaling(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-purple-500"
          />
        </label>
      </div>

      <fieldset disabled={!us.enableUpscaling} className="flex flex-col gap-3.5 disabled:opacity-50">
        <label className="text-xs flex flex-row justify-between font-medium text-slate-700 dark:text-slate-300">
          <div className="flex flex-col gap-1">
            Default Upscale Factor
            <span className="block text-[10px] text-slate-500">Choose the default upscaling factor for images.</span>
          </div>
          <select
            value={us.upscaleFactor}
            onChange={(event) => handleUpscaleChange(event)}
            className="mt-1.5 cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            {upscaleFactors.map((factor) => (
              <option key={factor.value} value={factor.value}>
                {factor.label}
              </option>
            ))}
          </select>
        </label>
      </fieldset>
    </div>
  );
};
