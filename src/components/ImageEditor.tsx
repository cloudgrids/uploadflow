import { useEffect, useMemo, useState } from 'react';
import { compressImage, compressImageAtScale } from '../lib/compress';
import type { ImageSettings } from '../settings/UploadFlowSettings';
import type { FileTransformer } from '../types/File';
import { formatBytes } from '../utils/helpers';

interface ImageEditorProps {
  file: File;
  onSave: (updatedFile: File) => void;
  onCancel: () => void;
  config: ImageSettings;
  onApplyAll?: (transform: FileTransformer) => void;
}

const FileTypeMap = {
  ['image/jpeg']: 'JPEG',
  ['image/png']: 'PNG',
  ['image/webp']: 'WebP'
};

export default function ImageEditor({ file, onSave, onCancel, config, onApplyAll }: ImageEditorProps) {
  const [quality, setQuality] = useState<number>(config.defaultQuality);
  const [format, setFormat] = useState<string>(config.defaultFormat in FileTypeMap ? config.defaultFormat : file.type);
  const [scale, setScale] = useState<number>(100);
  const [newName, setNewName] = useState<string>(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [optimizedFile, setOptimizedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const targetWidth = Math.round(originalWidth * (scale / 100));
  const targetHeight = Math.round(originalHeight * (scale / 100));

  const previewUrl = useMemo<string | null>(() => {
    if (!optimizedFile) return null;
    return URL.createObjectURL(optimizedFile);
  }, [optimizedFile]);

  useEffect(() => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setError('Failed to load image metadata');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [file]);

  useEffect(() => {
    if (targetWidth === 0 || targetHeight === 0) return;
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const output = await compressImage(file, quality, format, targetWidth, targetHeight);

        if (cancelled) return;

        setOptimizedFile(output);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to optimize image');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [file, quality, format, targetWidth, targetHeight]);

  useEffect(() => {
    if (!optimizedFile) return;
    return () => {
      URL.revokeObjectURL(previewUrl || '');
    };
  }, [optimizedFile, previewUrl]);

  const handleSave = () => {
    if (!optimizedFile) return;

    const extension = format.split('/')[1];
    const output = new File([optimizedFile], `${newName}.${extension}`, {
      type: optimizedFile.type,
      lastModified: Date.now()
    });

    onSave(output);
  };

  const currentWidth = targetWidth;
  const currentHeight = targetHeight;
  const savedBytes = file.size - (optimizedFile?.size || 0);
  const savePercent = Math.round((savedBytes / file.size) * 100);

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4 overflow-hidden rounded-xl border border-slate-200/10 bg-slate-900/40 p-4 text-left">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200/10 pb-3">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Optimize Image
        </h3>
        <span className="shrink-0 text-xs text-slate-400 font-mono select-none">Original: {formatBytes(file.size)}</span>
      </div>

      {error && <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">File Name</label>
            <div className="flex rounded-lg bg-slate-950/50 border border-slate-800 focus-within:border-purple-500 transition-colors">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="min-w-0 w-full bg-transparent px-3 py-1.5 text-sm text-slate-200 focus:outline-none"
              />
              <span className="flex items-center pr-3 text-xs text-slate-500 font-mono">.{format.split('/')[1]}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Output Format</label>
            <div className="grid grid-cols-3 gap-2">
              {['image/jpeg', 'image/png', 'image/webp'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-1.5 px-2.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    format === f
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                      : 'bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.split('/')[1].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Dimensions Scale</label>
              <span className="text-xs text-purple-400 font-semibold font-mono">{scale}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex flex-wrap justify-between gap-x-2 mt-1 text-[10px] text-slate-500 font-mono">
              <span>
                Original ({originalWidth}x{originalHeight})
              </span>
              <span>
                Target ({currentWidth}x{currentHeight})
              </span>
            </div>
          </div>

          {format !== 'image/png' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Compression Quality</label>
                <span className="text-xs text-purple-400 font-semibold font-mono">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                <span>Maximum Compress</span>
                <span>Best Quality</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-between bg-slate-950/40 border border-slate-800/80 rounded-xl p-3">
          <div className="relative flex items-center justify-center bg-slate-900/60 rounded-lg h-36 border border-slate-800 overflow-hidden group">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-400">Processing...</span>
              </div>
            ) : previewUrl ? (
              <>
                <img src={previewUrl} alt="Optimized preview" className="max-w-full max-h-full object-contain" />
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-slate-300 transition-opacity p-2 text-center pointer-events-none">
                  <p className="font-semibold">Optimized Preview</p>
                  <p className="font-mono mt-0.5">
                    {currentWidth} x {currentHeight} px
                  </p>
                </div>
              </>
            ) : (
              <span className="text-xs text-slate-500">Loading preview...</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40 text-center">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wide">New Size</span>
              <span className="text-sm font-semibold font-mono text-slate-200">
                {optimizedFile ? formatBytes(optimizedFile.size) : 'Calculating...'}
              </span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40 text-center">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Saved</span>
              <span className={`text-sm font-semibold font-mono ${savePercent >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {savePercent > 0 ? `${savePercent}%` : savePercent === 0 ? '0%' : 'n/a'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1 flex flex-wrap justify-end gap-2 border-t border-slate-200/10 pt-3.5">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        {onApplyAll && (
          <button
            type="button"
            onClick={() => onApplyAll((input) => compressImageAtScale(input, quality, format, scale))}
            disabled={loading}
            className="px-4 py-1.5 text-xs font-semibold text-purple-300 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 rounded-lg disabled:opacity-50 cursor-pointer"
          >
            Apply to all
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={loading || !optimizedFile}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}
