import { useEffect, useState } from 'react';
import { redactSensitiveData } from '../lib/redact';
import type { RedactionSettings } from '../settings/UploadFlowSettings';
import type { FileTransformer } from '../types/Common';
import { formatBytes } from '../utils/helpers';

interface TextEditorProps {
  file: File;
  onSave: (updatedFile: File) => void;
  onCancel: () => void;
  config: RedactionSettings;
  onApplyAll?: (transform: FileTransformer) => void;
}

interface RedactRules {
  email: boolean;
  phone: boolean;
  creditCard: boolean;
  ip: boolean;
}

export default function TextEditor({ file, onSave, onCancel, config, onApplyAll }: TextEditorProps) {
  const [text, setText] = useState<string>('');
  const [newName, setNewName] = useState<string>(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
  const [extension] = useState<string>(file.name.substring(file.name.lastIndexOf('.') + 1) || 'txt');
  const [redactRules, setRedactRules] = useState<RedactRules>({
    email: config.redactEmail,
    phone: config.redactPhone,
    creditCard: config.redactCard,
    ip: config.redactIP
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [redactedSummary, setRedactedSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setText(e.target.result);
        setError(null);
      } else setError('Could not read file content');

      setLoading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };
    reader.readAsText(file);
  }, [file]);

  const handleRedact = () => {
    const { redactedText, matchesCount } = redactSensitiveData(text, redactRules);
    setText(redactedText);

    if (matchesCount > 0) setRedactedSummary(`Success: Redacted ${matchesCount} sensitive item(s).`);
    else setRedactedSummary('No sensitive data patterns matched the selected rules.');

    setTimeout(() => setRedactedSummary(null), 5000);
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: file.type || 'text/plain' });
    const finalFile = new File([blob], `${newName}.${extension}`, {
      type: file.type || 'text/plain',
      lastModified: Date.now()
    });
    onSave(finalFile);
  };

  const redactFile = async (input: File): Promise<File> => {
    const content = await input.text();
    const { redactedText } = redactSensitiveData(content, redactRules);
    return new File([redactedText], input.name, { type: input.type || 'text/plain', lastModified: Date.now() });
  };

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[.025] p-4 text-left">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200/10 pb-3">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <svg className="h-5 w-5 text-[#eefb7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Edit & Redact Text
        </h3>
        <span className="text-xs text-slate-400 font-mono select-none">Size: {formatBytes(file.size)}</span>
      </div>

      {error && <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}

      {redactedSummary && (
        <div
          className={`p-3 text-xs border rounded-lg ${
            redactedSummary.startsWith('Success')
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}
        >
          {redactedSummary}
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-2 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300">File Content</label>
          <div className="relative bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden flex-1 min-h-55 flex">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#eefb7a] border-t-transparent"></div>
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-full min-h-55 w-full min-w-0 max-w-full resize-y bg-transparent p-3 font-mono text-xs text-slate-300 focus:outline-none"
                placeholder="File contents will load here..."
              />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4 bg-slate-950/30 p-3 rounded-xl border border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">File Name</label>
            <div className="flex rounded-xl border border-white/10 bg-black/20 transition-colors focus-within:border-[#eefb7a]/60">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="min-w-0 w-full bg-transparent px-3 py-1.5 text-sm text-slate-200 focus:outline-none"
              />
              <span className="flex items-center pr-3 text-xs text-slate-500 font-mono">.{extension}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-semibold text-slate-300">PII Redaction Scan</label>
            <div className="flex flex-col gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50">
              {Object.keys(redactRules).map((ruleKey) => {
                const key = ruleKey as keyof typeof redactRules;
                const labels = {
                  email: 'Email Addresses',
                  phone: 'Phone Numbers',
                  creditCard: 'Credit Cards',
                  ip: 'IP Addresses'
                };
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={redactRules[key]}
                      onChange={(e) => setRedactRules((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-3.5 w-3.5 rounded border-white/15 bg-black/30 text-[#eefb7a] focus:ring-[#eefb7a]"
                    />
                    {labels[key]}
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleRedact}
              disabled={loading || !Object.values(redactRules).some(Boolean)}
              className="mt-1 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#eefb7a]/25 bg-[#eefb7a]/5 px-3 py-2 text-[9px] font-black uppercase tracking-wide text-[#eefb7a] transition-all hover:bg-[#eefb7a]/10"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Scan & Redact
            </button>
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
            onClick={() => onApplyAll(redactFile)}
            disabled={loading || !Object.values(redactRules).some(Boolean)}
            className="cursor-pointer rounded-xl border border-[#eefb7a]/25 bg-[#eefb7a]/5 px-4 py-2 text-[9px] font-black uppercase tracking-wide text-[#eefb7a] hover:bg-[#eefb7a]/10 disabled:opacity-50"
          >
            Apply to all
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="cursor-pointer rounded-xl bg-white px-4 py-2 text-[9px] font-black uppercase tracking-wide text-[#101416] transition-all hover:bg-[#eefb7a]"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}
