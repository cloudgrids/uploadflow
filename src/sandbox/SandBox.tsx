import { useState } from 'react';
import ImageEditor from '../components/ImageEditor';
import TextEditor from '../components/TextEditor';
import { Upscale } from '../components/Upscale';
import { Watermark } from '../components/Watermark';
import { DeleteIcon, DownloadIcon, EditIcon, UploadIcon } from '../lib/icons';
import type { UploadFlowSettings, UploadFlowSettingsTab } from '../settings/UploadFlowSettings';
import type { FileTransformer, SandboxFile } from '../types/Common';
import { formatBytes } from '../utils/helpers';
import { availableTools } from './file-tools';

interface SandBoxProps {
  sandboxFiles: Array<SandboxFile>;
  setSandboxFiles: React.Dispatch<React.SetStateAction<Array<SandboxFile>>>;
  editingFile: SandboxFile | null;
  onOptimization: (originalFile: File, optimizedFile: File, id: string) => void;
  setEditingFile: React.Dispatch<React.SetStateAction<SandboxFile | null>>;
  config: UploadFlowSettings;
  activeTool: UploadFlowSettingsTab;
  onActiveToolChange: (tool: UploadFlowSettingsTab) => void;
}

export const SandBox: React.FC<SandBoxProps> = ({
  sandboxFiles,
  onOptimization,
  setEditingFile,
  setSandboxFiles,
  editingFile,
  config,
  activeTool,
  onActiveToolChange
}) => {
  const [applyingToAll, setApplyingToAll] = useState(false);

  const addFilesToSandbox = (filesList: File[]) => {
    const newSandboxFiles = filesList.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      optimizedFile: null
    }));
    setSandboxFiles((prev) => [...prev, ...newSandboxFiles]);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      addFilesToSandbox(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToSandbox(Array.from(e.target.files));
    }
  };

  const handleApplySandboxEdit = (id: string, updatedFile: File) => {
    const current = sandboxFiles.find((f) => f.id === id);
    if (!current) return;

    onOptimization(current.optimizedFile || current.file, updatedFile, id);

    setSandboxFiles((prev) => prev.map((f) => (f.id === id ? { ...f, optimizedFile: updatedFile } : f)));
    setEditingFile(null);
  };

  const handleDownloadFile = (sandboxFile: SandboxFile) => {
    const target = sandboxFile.optimizedFile || sandboxFile.file;
    const url = URL.createObjectURL(target);
    const a = document.createElement('a');
    a.href = url;
    a.download = target.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteSandboxFile = (id: string) => {
    setSandboxFiles((prev) => prev.filter((f) => f.id !== id));
    if (editingFile && editingFile.id === id) setEditingFile(null);
  };

  const activeEditingFile = sandboxFiles.find((f) => f.id === editingFile?.id);
  const tools = activeEditingFile ? availableTools(activeEditingFile.optimizedFile || activeEditingFile.file) : [];
  const selectedTool = tools.includes(activeTool) ? activeTool : tools[0];
  const editorFile = activeEditingFile ? activeEditingFile.optimizedFile || activeEditingFile.file : null;

  const openEditor = (item: SandboxFile) => {
    const firstTool = availableTools(item.optimizedFile || item.file)[0];
    if (!firstTool) return;
    onActiveToolChange(firstTool);
    setEditingFile(item);
  };

  const applyToAll = async (transform: FileTransformer) => {
    if (!selectedTool) return;
    setApplyingToAll(true);

    try {
      const compatibleFiles = sandboxFiles.filter((item) => availableTools(item.optimizedFile || item.file).includes(selectedTool));

      const results = await Promise.all(
        compatibleFiles.map(async (item) => {
          const source = item.optimizedFile || item.file;
          const output = await transform(source);
          onOptimization(source, output, item.id);
          return [item.id, output] as const;
        })
      );

      const outputs = new Map(results);

      setSandboxFiles((current) =>
        current.map((item) => {
          const output = outputs.get(item.id);
          return output ? { ...item, optimizedFile: output } : item;
        })
      );

      setEditingFile(null);
    } finally {
      setApplyingToAll(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 animate-fadeIn">
      {activeEditingFile && editorFile && selectedTool ? (
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40 p-1">
            {tools.map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => onActiveToolChange(tool)}
                className={`min-w-max flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                  selectedTool === tool
                    ? 'bg-white text-[#101416] shadow-sm'
                    : 'text-white/35 hover:bg-white/5 hover:text-white/75'
                }`}
              >
                {tool === 'image' ? 'Image optimize' : tool === 'redaction' ? 'Text redact' : tool === 'upscale' ? 'Upscale' : 'Watermark'}
              </button>
            ))}
          </div>

          {applyingToAll && (
            <div className="rounded-xl border border-[#eefb7a]/20 bg-[#eefb7a]/5 px-3 py-2 text-xs text-[#eefb7a]/80">
              Applying the current {selectedTool} options to compatible files…
            </div>
          )}

          {(() => {
            switch (selectedTool) {
              case 'image':
                if (config.imageSettings.enableAutoOptimize) {
                  return (
                    <ImageEditor
                      file={editorFile}
                      onSave={(file) => handleApplySandboxEdit(activeEditingFile.id, file)}
                      onCancel={() => setEditingFile(null)}
                      config={config.imageSettings}
                      onApplyAll={(transform) => void applyToAll(transform)}
                    />
                  );
                } else {
                  return (
                    <div className="text-sm text-yellow-400 text-center">
                      Image optimization is disabled in the settings. Please enable it to use this feature.
                    </div>
                  );
                }
              case 'redaction':
                if (config.redactionSettings.enableRedaction) {
                  return (
                    <TextEditor
                      file={editorFile}
                      onSave={(file) => handleApplySandboxEdit(activeEditingFile.id, file)}
                      onCancel={() => setEditingFile(null)}
                      config={config.redactionSettings}
                      onApplyAll={(transform) => void applyToAll(transform)}
                    />
                  );
                } else {
                  return (
                    <div className="text-sm text-yellow-400 text-center">
                      Text redaction is disabled in the settings. Please enable it to use this feature.
                    </div>
                  );
                }
              case 'watermark':
                if (config.watermarkSettings.enableWatermark) {
                  return (
                    <Watermark
                      file={editorFile}
                      onSave={(file) => handleApplySandboxEdit(activeEditingFile.id, file)}
                      onCancel={() => setEditingFile(null)}
                      config={config.watermarkSettings}
                      onApplyAll={(transform) => void applyToAll(transform)}
                    />
                  );
                } else {
                  return (
                    <div className="text-sm text-yellow-400 text-center">
                      Watermarking is disabled in the settings. Please enable it to use this feature.
                    </div>
                  );
                }
              case 'upscale':
                if (config.upscaleSettings.enableUpscaling) {
                  return (
                    <Upscale
                      key={activeEditingFile.id}
                      file={editorFile}
                      onSave={(file) => handleApplySandboxEdit(activeEditingFile.id, file)}
                      onCancel={() => setEditingFile(null)}
                      config={config.upscaleSettings}
                      onApplyAll={(transform) => void applyToAll(transform)}
                    />
                  );
                } else {
                  return (
                    <div className="text-center text-sm text-yellow-400">
                      Image upscaling is disabled in the settings. Please enable it to use this feature.
                    </div>
                  );
                }
            }
          })()}
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[.025] p-6 text-center transition-all hover:border-[#eefb7a]/60 hover:bg-white/[.045]"
            onClick={() => document.getElementById('sandbox-file-input')?.click()}
          >
            <input id="sandbox-file-input" type="file" multiple className="hidden" onChange={handleFileChange} />
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white text-[#101416] shadow-sm">
              <UploadIcon />
            </div>
            <h3 className="text-xs text-white">Drop another file</h3>
            <p className="mt-1 text-[10px] text-white/30">PNG, JPG, WEBP, TXT and supported media.</p>
          </div>

          {sandboxFiles.length > 0 && (
            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[.025] p-3 shadow-sm">
              <div className="mb-1 flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[9px] font-bold uppercase tracking-[.16em] text-emerald-400">{sandboxFiles.length} {sandboxFiles.length === 1 ? 'file' : 'files'} intercepted</span>
                <button
                  onClick={() => setSandboxFiles([])}
                  className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-55 overflow-y-auto pr-1">
                {sandboxFiles.map((item) => {
                  const isEditable = availableTools(item.optimizedFile || item.file).length > 0;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#171b1d] p-3 text-xs"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate font-semibold text-white/80">
                          {item.optimizedFile ? item.optimizedFile.name : item.file.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {formatBytes(item.file.size)} &rarr;
                          {item.optimizedFile && (
                            <span className="font-semibold text-emerald-500">{formatBytes(item.optimizedFile.size)}</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isEditable && (
                          <button
                            onClick={() => openEditor(item)}
                            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:bg-white hover:text-[#101416]"
                            title="Edit & Optimize"
                          >
                            <EditIcon />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadFile(item)}
                          className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:bg-white hover:text-[#101416]"
                          title="Download Output"
                        >
                          <DownloadIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteSandboxFile(item.id)}
                          className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-white/35 transition-colors hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
                          title="Remove File"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
