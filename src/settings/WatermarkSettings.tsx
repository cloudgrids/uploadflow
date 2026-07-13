import { toast } from '../utils/Toaster';
import type { UploadFlowSettings } from './UploadFlowSettings';

interface WatermarkSettingsProps {
  settings: UploadFlowSettings;
  onUpdate: (updatedSettings: UploadFlowSettings) => void;
}

const positions = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'center', label: 'Center' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' }
];

const fonts = ['Arial', 'Georgia', 'Verdana', 'monospace'];

function colorInputValue(fillStyle: string): string {
  return /^#[0-9a-f]{6}$/i.test(fillStyle) ? fillStyle : '#ffffff';
}

export const WatermarkSettings: React.FC<WatermarkSettingsProps> = ({ settings, onUpdate }) => {
  const ws = settings.watermarkSettings;

  const updateWatermarkSettings = (updated: Partial<UploadFlowSettings['watermarkSettings']>) => {
    onUpdate({
      ...settings,
      watermarkSettings: { ...ws, ...updated }
    });
  };

  const toggleWatermark = (enabled: boolean) => {
    try {
      updateWatermarkSettings({ enableWatermark: enabled });
      toast.sw(`Image watermark ${enabled ? 'enabled' : 'disabled'}.`, enabled);
    } catch {
      toast.error('Could not update image watermark setting.');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xs text-slate-950 dark:text-white">Watermark</h3>
          <p className="mt-1 text-[10px] text-slate-500">Set the default text and placement used by the watermark editor.</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>{ws.enableWatermark ? 'Enabled' : 'Disabled'}</span>
          <input
            type="checkbox"
            checked={ws.enableWatermark}
            onChange={(event) => toggleWatermark(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-purple-500"
          />
        </label>
      </div>

      <fieldset disabled={!ws.enableWatermark} className="flex flex-col gap-3.5 disabled:opacity-50">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Watermark text
          <textarea
            value={ws.text}
            onChange={(event) => updateWatermarkSettings({ text: event.target.value })}
            maxLength={120}
            placeholder="UploadFlow"
            className="mt-1.5 w-full min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Position
            <select
              value={typeof ws.position === 'string' ? ws.position : 'center'}
              onChange={(event) => updateWatermarkSettings({ position: event.target.value })}
              className="mt-1.5 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              {positions.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Font
            <select
              value={ws.font}
              onChange={(event) => updateWatermarkSettings({ font: event.target.value })}
              className="mt-1.5 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font === 'monospace' ? 'Monospace' : font}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="watermark-font-size" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Font size
            </label>
            <span className="font-mono text-xs font-semibold text-purple-400">{ws.fontSize}px</span>
          </div>
          <input
            id="watermark-font-size"
            type="range"
            min="12"
            max="120"
            value={ws.fontSize}
            onChange={(event) => updateWatermarkSettings({ fontSize: Number(event.target.value) })}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-purple-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Alignment
            <select
              value={ws.textAlign}
              onChange={(event) => updateWatermarkSettings({ textAlign: event.target.value as CanvasTextAlign })}
              className="mt-1.5 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>

          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Baseline
            <select
              value={ws.textBaseline}
              onChange={(event) => updateWatermarkSettings({ textBaseline: event.target.value as CanvasTextBaseline })}
              className="mt-1.5 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </label>

          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Color
            <input
              type="color"
              value={colorInputValue(ws.fillStyle)}
              onChange={(event) => updateWatermarkSettings({ fillStyle: event.target.value })}
              className="mt-1.5 h-8 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-800 dark:bg-slate-950"
            />
          </label>
        </div>
      </fieldset>
    </div>
  );
};
