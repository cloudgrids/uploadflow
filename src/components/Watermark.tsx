import { useCallback, useEffect, useState } from 'react';
import { useFullscreen } from '../hooks/useFullscreen';
import { watermark } from '../lib/watermark';
import { WatermarkSettings } from '../settings/UploadFlowSettings';
import type { FileTransformer } from '../types/Common';
import { formatBytes } from '../utils/helpers';
import { FullscreenButton } from './FullscreenButton';
import { ObjectUrlImage } from './ObjectUrlImage';

interface WatermarkProps {
  file: File;
  onSave: (updatedFile: File) => void;
  onCancel: () => void;
  config?: WatermarkSettings;
  onApplyAll?: (transform: FileTransformer) => void;
}

const positions = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'center', label: 'Center' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' }
];

function inputColor(value: string | undefined): string {
  return value && /^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff';
}

export function Watermark({ file, onSave, onCancel, config, onApplyAll }: WatermarkProps) {
  const [text, setText] = useState<string>(config?.text || 'UploadFlow');
  const [position, setPosition] = useState<string | { x: number; y: number }>(config?.position || 'bottom-right');
  const [font, setFont] = useState<string>(config?.font || 'Arial');
  const [alignment, setAlignment] = useState<string>(config?.textAlign || 'center');
  const [baseline, setBaseline] = useState<string>(config?.textBaseline || 'middle');
  const [fontSize, setFontSize] = useState<number>(config?.fontSize || 32);
  const [fillStyle, setFillStyle] = useState<string>(inputColor(config?.fillStyle));
  const [output, setOutput] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { elementRef: previewRef, isFullscreen, toggleFullscreen } = useFullscreen<HTMLDivElement>();

  const handleFullscreen = () => {
    void toggleFullscreen().catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : 'Fullscreen mode is not available.');
    });
  };

  const currentOptions = useCallback(
    () =>
      new WatermarkSettings(
        true,
        text,
        position,
        font,
        fontSize,
        config?.textAlign || 'center',
        config?.textBaseline || 'middle',
        fillStyle
      ),
    [config?.textAlign, config?.textBaseline, fillStyle, font, fontSize, position, text]
  );

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      const options = currentOptions();

      watermark(file, options)
        .then((watermarkedFile) => {
          if (cancelled) return;
          setOutput(watermarkedFile);
          setError(null);
        })
        .catch((reason: unknown) => {
          if (!cancelled) setError(reason instanceof Error ? reason.message : 'Failed to apply watermark');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [currentOptions, file, text]);

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[.025] p-4 text-left">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200/10 pb-3">
        <div>
          <h3 className="m-0 text-base font-semibold text-slate-100">Add Watermark</h3>
          <p className="mt-1 text-[10px] text-slate-500">Preview and position a text watermark before saving.</p>
        </div>
        <span className="font-mono text-xs text-slate-400">{formatBytes(file.size)}</span>
      </div>

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">{error}</div>}

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3.5">
          <label className="text-xs font-semibold text-slate-300">
            Watermark text
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={120}
              className="mt-1.5 min-h-5 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-normal text-white/75 outline-none focus:border-[#eefb7a]/60"
              placeholder="Enter watermark text"
            />
          </label>

          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-300">Position</span>
            <select
              value={position as string}
              onChange={(event) => setPosition(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 px-2.5 py-2 text-xs text-white/65 outline-none focus:border-[#eefb7a]/60"
            >
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-300">
              Font
              <select
                value={font}
                onChange={(event) => setFont(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 px-2.5 py-2 text-xs text-white/65 outline-none focus:border-[#eefb7a]/60"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="monospace">Monospace</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-300">
              Color
              <input
                type="color"
                value={fillStyle}
                onChange={(event) => setFillStyle(event.target.value)}
                className="mt-1.5 h-9 w-full cursor-pointer rounded-xl border border-white/10 bg-black/20 p-1"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-300">
              Alignment
              <select
                value={alignment}
                onChange={(event) => setAlignment(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 px-2.5 py-2 text-xs text-white/65 outline-none focus:border-[#eefb7a]/60"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="end">End</option>
                <option value="start">Start</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-300">
              Baseline
              <select
                value={baseline}
                onChange={(event) => setBaseline(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/20 px-2.5 py-2 text-xs text-white/65 outline-none focus:border-[#eefb7a]/60"
              >
                <option value="top">Top</option>
                <option value="ideographic">Ideographic</option>
                <option value="bottom">Bottom</option>
                <option value="alphabetic">Alphabetic</option>
                <option value="hanging">Hanging</option>
                <option value="middle">Middle</option>
              </select>
            </label>
          </div>

          <label className="text-xs font-semibold text-slate-300">
            <span className="flex justify-between">
              Font size <span className="font-mono text-[#eefb7a]">{fontSize}px</span>
            </span>
            <input
              type="range"
              min="12"
              max="120"
              value={fontSize}
              onChange={(event) => setFontSize(Number(event.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#eefb7a]"
            />
          </label>
        </div>

        <div
          ref={previewRef}
          className={`relative flex min-w-0 items-center justify-center overflow-hidden border border-slate-800 bg-slate-950 p-3 ${
            isFullscreen ? 'h-screen w-screen p-6' : 'min-h-64 rounded-xl bg-slate-950/50'
          }`}
        >
          <FullscreenButton isFullscreen={isFullscreen} onClick={handleFullscreen} className="absolute right-2 top-2 z-20" />
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/60 text-xs text-slate-300">
              Updating preview…
            </div>
          )}
          {output ? (
            <ObjectUrlImage
              file={output}
              alt="Watermark preview"
              className={isFullscreen ? 'max-h-full max-w-full object-contain' : 'max-h-72 max-w-full object-contain'}
            />
          ) : (
            <span className="text-xs text-slate-500">Preparing image preview…</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200/10 pt-3.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          Cancel
        </button>
        {onApplyAll && (
          <button
            type="button"
            onClick={() => onApplyAll((input) => watermark(input, currentOptions()))}
            disabled={loading || !text.trim()}
            className="rounded-xl border border-[#eefb7a]/25 bg-[#eefb7a]/5 px-4 py-2 text-[9px] font-black uppercase tracking-wide text-[#eefb7a] hover:bg-[#eefb7a]/10 disabled:opacity-50"
          >
            Apply to all
          </button>
        )}
        <button
          type="button"
          onClick={() => output && onSave(output)}
          disabled={!output || loading || !text.trim()}
          className="rounded-xl bg-white px-4 py-2 text-[9px] font-black uppercase tracking-wide text-[#101416] hover:bg-[#eefb7a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Apply Watermark
        </button>
      </div>
    </div>
  );
}
