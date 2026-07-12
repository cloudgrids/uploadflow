import { toast } from '../utils/Toaster';
import type { RedactionSettings, UploadFlowSettings } from './UploadFlowSettings';

interface TextRedactSettingsProps {
  settings: UploadFlowSettings;
  onUpdate: (updatedSettings: UploadFlowSettings) => void;
}

export const TextRedactSettings: React.FC<TextRedactSettingsProps> = ({ settings, onUpdate }) => {
  const rs = settings.redactionSettings;

  const updateRedactionSettings = (updated: Partial<UploadFlowSettings['redactionSettings']>) => {
    onUpdate({
      ...settings,
      redactionSettings: { ...rs, ...updated }
    });
  };

  const toggleRedaction = (enabled: boolean) => {
    try {
      updateRedactionSettings({ enableRedaction: enabled });
      toast.sw(`Text redaction ${enabled ? 'enabled' : 'disabled'}.`, enabled);
    } catch {
      toast.error('Could not update text redaction setting.');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xs text-slate-950 dark:text-white">Text Redaction</h3>
          <p className="mt-1 text-[10px] text-slate-500">Automatically redact sensitive text from images.</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>{rs.enableRedaction ? 'Enabled' : 'Disabled'}</span>
          <input
            type="checkbox"
            checked={rs.enableRedaction}
            onChange={(event) => toggleRedaction(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-purple-500"
          />
        </label>
      </div>
      <div className="flex flex-col gap-2.5">
        {[
          { key: 'redactEmail', label: 'Redact Email Addresses', desc: 'Replaces user@domain.com patterns' },
          { key: 'redactPhone', label: 'Redact Phone Numbers', desc: 'Replaces US/international numeric digits patterns' },
          { key: 'redactCard', label: 'Redact Credit Cards', desc: 'Replaces Visa/Mastercard/Amex digit groups' },
          { key: 'redactIP', label: 'Redact IPv4 Addresses', desc: 'Replaces 127.0.0.1 style ip nodes' }
        ].map((item) => {
          const key = item.key as keyof RedactionSettings;
          return (
            <label key={key} className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rs[key]}
                onChange={(e) => updateRedactionSettings({ [key]: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500 w-4 h-4 mt-0.5 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                <span className="text-[10px] text-slate-500">{item.desc}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
