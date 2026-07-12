import { useState } from 'react';
import ImageEditor from '../components/ImageEditor';
import TextEditor from '../components/TextEditor';
import { Watermark } from '../components/Watermark';
import { DeleteIcon, DownloadIcon, EditIcon, UploadIcon } from '../lib/icons';
import type { UploadFlowSettings, UploadFlowSettingsTab } from '../settings/UploadFlowSettings';
import type { FileTransformer, SandboxFile } from '../types/File';
import { formatBytes } from '../utils/helpers';
import { availableTools } from './file-tools';

interface SandBoxProps {
  sandboxFiles: Array<SandboxFile>;
  setSandboxFiles: React.Dispatch<React.SetStateAction<Array<SandboxFile>>>;
  editingFile: SandboxFile | null;
  onOptimization: (originalFile: File, optimizedFile: File, id: string) => void;
  setEditingFile: React.Dispatch<React.SetStateAction<SandboxFile | null>>;
  config: UploadFlowSettings;
}

export const SandBox: React.FC<SandBoxProps> = ({ sandboxFiles, onOptimization, setEditingFile, setSandboxFiles, editingFile, config }) => {
  const [activeTool, setActiveTool] = useState<UploadFlowSettingsTab>(config.generalSettings.defaultTab);
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
    setActiveTool(firstTool);
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
                onClick={() => setActiveTool(tool)}
                className={`min-w-max flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                  selectedTool === tool
                    ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`}
              >
                {tool === 'image' ? 'Image optimize' : tool === 'redaction' ? 'Text redact' : 'Watermark'}
              </button>
            ))}
          </div>

          {applyingToAll && (
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-xs text-purple-300">
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
                break;
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
                break;
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
            }
          })()}
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all hover:border-slate-950 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:hover:border-white dark:hover:bg-white/8"
            onClick={() => document.getElementById('sandbox-file-input')?.click()}
          >
            <input id="sandbox-file-input" type="file" multiple className="hidden" onChange={handleFileChange} />
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-white/10 dark:bg-white dark:text-slate-950 dark:shadow-none">
              <UploadIcon />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Drag files here to optimize</h3>
            <p className="text-xs text-slate-500 mt-1">Supports Images (PNG, JPG, WEBP) & Text (CSV, TXT, JSON, MD)</p>
          </div>

          {sandboxFiles.length > 0 && (
            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sandbox Queue</span>
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
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800/80 text-xs gap-3"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
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
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer"
                            title="Edit & Optimize"
                          >
                            <EditIcon />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadFile(item)}
                          className="cursor-pointer rounded-md border border-slate-300 bg-white p-1.5 text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                          title="Download Output"
                        >
                          <DownloadIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteSandboxFile(item.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-950/30 text-slate-500 hover:text-red-400 rounded-md transition-colors cursor-pointer"
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
