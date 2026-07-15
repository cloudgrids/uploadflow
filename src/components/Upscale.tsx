import { useState } from 'react';
import { useFullscreen } from '../hooks/useFullscreen';
import type { UpscaleSettings } from '../settings/UploadFlowSettings';
import type { FileTransformer } from '../types/Common';
import { upscaleInstance } from '../upscaler';
import { formatBytes } from '../utils/helpers';
import { toast } from '../utils/Toaster';
import { FullscreenButton } from './FullscreenButton';
import { ObjectUrlImage } from './ObjectUrlImage';

interface UpscaleProps {
  file: File;
  onSave: (updatedFile: File) => void;
  onCancel: () => void;
  config?: UpscaleSettings;
  onApplyAll?: (transform: FileTransformer) => void;
}

export const Upscale: React.FC<UpscaleProps> = ({ file, onSave, onCancel, config, onApplyAll }) => {
  const [upscaleFactor, setUpscaleFactor] = useState<number>(config?.upscaleFactor ?? 2);
  const [isUpscaling, setIsUpscaling] = useState<boolean>(false);
  const [inputDim, setInputDim] = useState<{ width: number; height: number } | null>(null);
  const [outputDim, setOutputDim] = useState<{ width: number; height: number } | null>(null);
  const [upscaledFile, setUpscaledFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { elementRef: comparisonRef, isFullscreen, toggleFullscreen } = useFullscreen<HTMLDivElement>();

  const upscaleFile: FileTransformer = async (input) => {
    const [result] = await upscaleInstance.upscale([{ file: input, upscaleFactor }]);

    if (!result || result.status !== 'completed') throw new Error(`Could not upscale ${input.name}`);

    return result.file;
  };

  const handleUpscale = async () => {
    setIsUpscaling(true);
    setError(null);

    try {
      const output = await upscaleFile(file);
      setUpscaledFile(output);
      toast.success(`${file.name} was upscaled ${upscaleFactor}×.`);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Upscaling failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsUpscaling(false);
    }
  };

  const selectFactor = (factor: number) => {
    setUpscaleFactor(factor);
    setUpscaledFile(null);
    setError(null);
  };

  const handleFullscreen = () => {
    void toggleFullscreen().catch((reason: unknown) => {
      const message = reason instanceof Error ? reason.message : 'Fullscreen mode is not available.';
      setError(message);
      toast.error(message);
    });
  };

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[.025] p-4 text-left">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200/10 pb-3">
        <div>
          <h3 className="m-0 flex items-center gap-2 text-base font-semibold text-slate-100">
            <svg className="h-5 w-5 text-[#eefb7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7m0 0h-7m7 0v7M5 7v10a2 2 0 002 2h10" />
            </svg>
            AI Image Upscaler
          </h3>
          <p className="mt-1 text-[10px] text-slate-500">Increase image resolution while preserving the original file format.</p>
        </div>
        <span className="shrink-0 font-mono text-xs text-slate-400">Original: {formatBytes(file.size)}</span>
      </div>

      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">{error}</div>}

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300">Upscale factor</span>
              <span className="font-mono text-xs font-semibold text-[#eefb7a]">{upscaleFactor}× resolution</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[2, 4].map((factor) => (
                <button
                  key={factor}
                  type="button"
                  onClick={() => selectFactor(factor)}
                  disabled={isUpscaling}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    upscaleFactor === factor
                      ? 'border-[#eefb7a]/60 bg-[#eefb7a]/10 text-[#eefb7a] shadow-sm'
                      : 'border-white/10 bg-black/20 text-white/35 hover:border-white/25 hover:text-white/70'
                  }`}
                >
                  <span className="block text-sm font-semibold">{factor}×</span>
                  <span className="mt-0.5 block text-[10px] opacity-70">
                    {factor === 2 ? 'Balanced detail and speed' : 'Maximum resolution'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/30 p-3">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Output estimate</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-800/50 bg-slate-900/50 p-2.5">
                <span className="block text-[10px] text-slate-500">Width & height</span>
                <span className="mt-0.5 block font-mono text-sm font-semibold text-slate-200">{upscaleFactor}× each</span>
              </div>
              <div className="rounded-lg border border-slate-800/50 bg-slate-900/50 p-2.5">
                <span className="block text-[10px] text-slate-500">Total pixels</span>
                <span className="mt-0.5 block font-mono text-sm font-semibold text-slate-200">{upscaleFactor * upscaleFactor}×</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/15 bg-blue-500/5 px-3 py-2.5 text-[10px] leading-relaxed text-blue-300/80">
            Upscaling uploads this image to the configured processing service. Processing time depends on image size and the selected
            factor.
          </div>
        </div>

        <div
          ref={comparisonRef}
          className={`flex min-w-0 flex-col rounded-xl border border-slate-800/80 bg-slate-950 p-3 ${
            isFullscreen ? 'h-screen w-screen gap-4 overflow-auto p-5' : 'bg-slate-950/40'
          }`}
        >
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <span className="block text-xs font-semibold text-slate-200">Before and after</span>
              <span className="mt-0.5 block text-[10px] text-slate-500">Compare the original input with the generated result.</span>
            </div>
            <FullscreenButton isFullscreen={isFullscreen} onClick={handleFullscreen} />
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
            <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
              <div className={`relative flex items-center justify-center overflow-hidden p-2 ${isFullscreen ? 'min-h-80 flex-1' : 'h-56'}`}>
                <ObjectUrlImage file={file} alt="Original input" className="max-h-full max-w-full object-contain" onDimLoad={setInputDim} />
                <span className="absolute left-2 top-2 rounded-md border border-slate-700 bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-slate-300">
                  Original
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-800 px-3 py-2">
                <span className="truncate text-[10px] text-slate-500">{file.name}</span>
                <span className="truncate text-[10px] text-slate-500">
                  {inputDim ? `${inputDim.width} × ${inputDim.height}` : 'Dimensions not available'}
                </span>
                <span className="shrink-0 font-mono text-xs font-semibold text-slate-200">{formatBytes(file.size)}</span>
              </div>
            </div>

            <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60">
              <div className={`relative flex items-center justify-center overflow-hidden p-2 ${isFullscreen ? 'min-h-80 flex-1' : 'h-56'}`}>
                {upscaledFile ? (
                  <ObjectUrlImage
                    file={upscaledFile}
                    alt="Upscaled result"
                    className="max-h-full max-w-full object-contain"
                    onDimLoad={setOutputDim}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 px-4 text-center">
                    <svg className="h-7 w-7 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4-4 4 4 3-3 5 5M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-slate-500">Run the upscaler to generate the comparison.</span>
                  </div>
                )}
                {isUpscaling && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/85">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#eefb7a] border-t-transparent" />
                    <span className="text-xs font-medium text-slate-300">Upscaling image {upscaleFactor}×…</span>
                    <span className="text-[10px] text-slate-500">Keep this editor open while processing</span>
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                  Upscaled {upscaleFactor}×
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-800 px-3 py-2">
                <span className="text-[10px] tracking-tighter text-slate-500">
                  {outputDim ? `${outputDim.width} × ${outputDim.height}` : 'Dimensions not available'}
                </span>
                <span className="shrink-0 font-mono text-xs font-semibold text-emerald-400">
                  {upscaledFile ? formatBytes(upscaledFile.size) : 'Not generated'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1 flex flex-wrap justify-end gap-2 border-t border-slate-200/10 pt-3.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUpscaling}
          className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        {onApplyAll && (
          <button
            type="button"
            onClick={() => onApplyAll(upscaleFile)}
            disabled={isUpscaling}
            className="cursor-pointer rounded-xl border border-[#eefb7a]/25 bg-[#eefb7a]/5 px-4 py-2 text-[9px] font-black uppercase tracking-wide text-[#eefb7a] hover:bg-[#eefb7a]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Upscale all {upscaleFactor}×
          </button>
        )}
        {!upscaledFile ? (
          <button
            type="button"
            onClick={() => void handleUpscale()}
            disabled={isUpscaling}
            className="cursor-pointer rounded-xl bg-white px-4 py-2 text-[9px] font-black uppercase tracking-wide text-[#101416] transition-all hover:bg-[#eefb7a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpscaling ? 'Upscaling…' : `Upscale ${upscaleFactor}×`}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSave(upscaledFile)}
            className="cursor-pointer rounded-xl bg-white px-4 py-2 text-[9px] font-black uppercase tracking-wide text-[#101416] transition-all hover:bg-[#eefb7a]"
          >
            Apply Upscaled Image
          </button>
        )}
      </div>
    </div>
  );
};
