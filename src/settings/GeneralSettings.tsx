import { toast } from '../utils/Toaster';
import type { FilePickerMode, UploadFlowSettings, UploadFlowSettingsTab } from './UploadFlowSettings';

interface GeneralSettingsProps {
  settings: UploadFlowSettings;
  onUpdate: (updatedSettings: UploadFlowSettings) => void;
  onResetStats: () => Promise<void>;
}

const editorTabs = ['image', 'redact', 'watermark'] as const;

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onUpdate, onResetStats }) => {
  const gs = settings.generalSettings;

  const updateGeneralSettings = (updated: Partial<UploadFlowSettings['generalSettings']>) => {
    onUpdate({
      ...settings,
      generalSettings: { ...gs, ...updated }
    });
  };

  const handleDeleteHistory = async () => {
    try {
      await onResetStats();
      toast.success('Upload history deleted.');
    } catch {
      toast.error('Could not delete upload history.');
    }
  };

  const toggleUploadFlowMode = (enabled: boolean) => {
    try {
      updateGeneralSettings({ enableUploadFlow: enabled });
      toast.sw(`Upload interception ${enabled ? 'enabled' : 'disabled'}.`, enabled);
    } catch {
      toast.error('Could not update upload interception setting.');
    }
  };

  const toggleInspectMode = (enabled: boolean) => {
    try {
      updateGeneralSettings({ enableInspectMode: enabled });
      toast.sw(`Inspect mode ${enabled ? 'enabled' : 'disabled'}.`, enabled);
    } catch {
      toast.error('Could not update inspect mode setting.');
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xs text-slate-950 dark:text-white">General Settings</h3>
          <p className="mt-1 text-[10px] text-slate-500">Configure general settings for the upload flow.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="flex items-center flex-row justify-between gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <div className="flex flex-col gap-1">
            Intercept Uploads
            <span className="text-[10px] text-slate-500">Enable or disable the upload interception feature.</span>
          </div>
          <input
            type="checkbox"
            checked={gs.enableUploadFlow}
            onChange={(event) => toggleUploadFlowMode(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-purple-500"
          />
        </label>
      </div>

      <label className="flex flex-row justify-between gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
        <div className="flex flex-col gap-1">
          File Input Picker
          <span className="block text-[10px] text-slate-500">Choose what opens when a website requests a file.</span>
        </div>
        <select
          value={gs.filePickerMode ?? 'url'}
          onChange={(event) => updateGeneralSettings({ filePickerMode: event.target.value as FilePickerMode })}
          className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="url">UploadFlow URL picker</option>
          <option value="native">Native file picker</option>
        </select>
      </label>

      <div className="flex flex-col gap-2.5">
        <label className="flex items-center flex-row justify-between gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <div className="flex flex-col gap-1">
            Inspect Mode
            <span className="text-[10px] text-slate-500">Show download actions over webpage images, videos, and audio.</span>
          </div>
          <input
            type="checkbox"
            checked={gs.enableInspectMode}
            onChange={(event) => toggleInspectMode(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-purple-500"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="flex items-center flex-row justify-between gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <div className="flex flex-col gap-1">
            Delete History
            <span className="text-[10px] text-slate-500">Delete all uploaded files and their metadata.</span>
          </div>
          <button
            type="button"
            onClick={handleDeleteHistory}
            className="cursor-pointer rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </label>
      </div>
      <label className="text-xs flex flex-row justify-between font-medium text-slate-700 dark:text-slate-300">
        <div className="flex flex-col gap-1">
          Default Editor Tab
          <span className="block text-[10px] text-slate-500">Choose which tab should be active by default when the editor opens.</span>
        </div>
        <select
          value={gs.defaultTab}
          onChange={(event) => updateGeneralSettings({ defaultTab: event.target.value as UploadFlowSettingsTab })}
          className="mt-1.5 cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          {editorTabs.map((tab) => (
            <option key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
