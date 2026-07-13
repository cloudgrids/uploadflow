import { useState } from 'react';

interface PickedFileHandle {
  name: string;
  getFile: () => Promise<File>;
}

interface FilePickerWindow extends Window {
  showOpenFilePicker?: (options?: { multiple?: boolean }) => Promise<PickedFileHandle[]>;
}

interface TestLog {
  id: number;
  source: string;
  detail: string;
  status: 'success' | 'error' | 'info';
}

const tests = [
  '<input> change',
  'Drag & Drop',
  'Paste',
  'showOpenFilePicker',
  'FileSystemFileHandle.getFile',
  'navigator.clipboard.read',
  'fetch',
  'XMLHttpRequest.send'
] as const;

function summarizeFiles(files: File[]): string {
  if (!files.length) return 'No files received';
  return files.map((file) => `${file.name} (${file.type || 'unknown'}, ${file.size} bytes)`).join(', ');
}

export function InterceptorTestPage() {
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [fileHandle, setFileHandle] = useState<PickedFileHandle | null>(null);
  const [networkFile, setNetworkFile] = useState<File | null>(null);

  const addLog = (source: string, detail: string, status: TestLog['status'] = 'success') => {
    setLogs((current) => [{ id: Date.now() + Math.random(), source, detail, status }, ...current].slice(0, 30));
  };

  const chooseWithFilePicker = async () => {
    const picker = (window as FilePickerWindow).showOpenFilePicker;
    if (!picker) {
      addLog('showOpenFilePicker', 'This browser does not support the File System Access picker.', 'error');
      return;
    }

    try {
      const [handle] = await picker({ multiple: false });
      if (!handle) return;
      setFileHandle(handle);
      addLog('showOpenFilePicker', `Handle selected: ${handle.name}`);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : String(reason);
      addLog('showOpenFilePicker', message, message.toLowerCase().includes('abort') ? 'info' : 'error');
    }
  };

  const readFileHandle = async () => {
    if (!fileHandle) {
      addLog('FileSystemFileHandle.getFile', 'Select a handle with showOpenFilePicker first.', 'info');
      return;
    }

    try {
      addLog('FileSystemFileHandle.getFile', summarizeFiles([await fileHandle.getFile()]));
    } catch (reason) {
      addLog('FileSystemFileHandle.getFile', reason instanceof Error ? reason.message : String(reason), 'error');
    }
  };

  const readClipboard = async () => {
    if (!navigator.clipboard?.read) {
      addLog('navigator.clipboard.read', 'Clipboard read is unavailable in this browser or context.', 'error');
      return;
    }

    try {
      const items = await navigator.clipboard.read();
      const blobs = await Promise.all(items.flatMap((item) => item.types.map((type) => item.getType(type))));
      const detail = blobs.length
        ? blobs.map((blob) => `${blob.type || 'unknown'} (${blob.size} bytes)`).join(', ')
        : 'Clipboard returned no file-like data';
      addLog('navigator.clipboard.read', detail, blobs.length ? 'success' : 'info');
    } catch (reason) {
      addLog('navigator.clipboard.read', reason instanceof Error ? reason.message : String(reason), 'error');
    }
  };

  const sendWithFetch = async () => {
    if (!networkFile) {
      addLog('fetch', 'Choose a network-test file first.', 'info');
      return;
    }

    const body = new FormData();
    body.append('file', networkFile);

    try {
      const response = await fetch('/api/test-upload', { method: 'POST', body });
      addLog('fetch', `Completed with HTTP ${response.status}: ${networkFile.name}`);
    } catch (reason) {
      addLog('fetch', reason instanceof Error ? reason.message : String(reason), 'error');
    }
  };

  const sendWithXhr = () => {
    if (!networkFile) {
      addLog('XMLHttpRequest.send', 'Choose a network-test file first.', 'info');
      return;
    }

    const body = new FormData();
    body.append('file', networkFile);
    const request = new XMLHttpRequest();
    request.open('POST', '/api/test-upload');
    request.onload = () => addLog('XMLHttpRequest.send', `Completed with HTTP ${request.status}: ${networkFile.name}`);
    request.onerror = () => addLog('XMLHttpRequest.send', 'The XHR request failed.', 'error');
    request.send(body);
  };

  const cardClass = 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5';
  const primaryButton = 'cursor-pointer rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-950';

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-8 text-slate-900 dark:text-slate-100 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5 dark:border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">UploadFlow diagnostics</span>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">File interception test page</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Load the unpacked extension, open <code className="rounded bg-slate-200 px-1.5 py-0.5 dark:bg-white/10">/test</code>, and use each control to verify its real browser API path.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
          {tests.length} test surfaces ready
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className={cardClass}>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">1. &lt;input&gt; change</h2>
          <p className="mt-1 text-xs text-slate-500">Choose one or more files through a standard file input.</p>
          <input
            type="file"
            multiple
            onChange={(event) => addLog(tests[0], summarizeFiles(Array.from(event.target.files ?? [])))}
            className="mt-4 block w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </article>

        <article className={cardClass}>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">2. Drag & Drop</h2>
          <p className="mt-1 text-xs text-slate-500">Drop files from the desktop into this target.</p>
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addLog(tests[1], summarizeFiles(Array.from(event.dataTransfer.files)));
            }}
            className="mt-4 flex min-h-28 items-center justify-center rounded-xl border-2 border-dashed border-purple-400/50 bg-purple-500/5 p-4 text-center text-xs font-semibold text-purple-600 dark:text-purple-300"
          >
            Drop one or more files here
          </div>
        </article>

        <article className={cardClass}>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">3. Paste</h2>
          <p className="mt-1 text-xs text-slate-500">Copy an image/file, focus this target, and paste.</p>
          <div
            contentEditable
            suppressContentEditableWarning
            tabIndex={0}
            onPaste={(event) => addLog(tests[2], summarizeFiles(Array.from(event.clipboardData.files)))}
            className="mt-4 min-h-28 rounded-xl border border-slate-300 bg-slate-50 p-4 text-xs text-slate-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-950"
          >
            Click here, then press Ctrl+V or Cmd+V.
          </div>
        </article>

        <article className={cardClass}>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">4–5. File System Access</h2>
          <p className="mt-1 text-xs text-slate-500">Test picker invocation and handle reading as separate calls.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => void chooseWithFilePicker()} className={primaryButton}>Call showOpenFilePicker</button>
            <button type="button" onClick={() => void readFileHandle()} className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold dark:border-slate-700">Call handle.getFile</button>
          </div>
          <p className="mt-3 truncate font-mono text-[10px] text-slate-500">Current handle: {fileHandle?.name ?? 'none'}</p>
        </article>

        <article className={cardClass}>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">6. navigator.clipboard.read</h2>
          <p className="mt-1 text-xs text-slate-500">Read image or file data from the system clipboard.</p>
          <button type="button" onClick={() => void readClipboard()} className={`mt-4 ${primaryButton}`}>Read clipboard</button>
        </article>

        <article className={cardClass}>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">7–8. Network uploads</h2>
          <p className="mt-1 text-xs text-slate-500">Select a file, then POST it with fetch or XMLHttpRequest.</p>
          <input
            type="file"
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null;
              setNetworkFile(selected);
              addLog('Network file', selected ? summarizeFiles([selected]) : 'Selection cleared', selected ? 'success' : 'info');
            }}
            className="mt-4 block w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-950"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => void sendWithFetch()} className="cursor-pointer rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-500">Send with fetch</button>
            <button type="button" onClick={sendWithXhr} className="cursor-pointer rounded-lg border border-purple-500/40 px-3 py-2 text-xs font-bold text-purple-600 dark:text-purple-300">Send with XHR</button>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-slate-950 p-5 text-slate-200 shadow-sm dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-white">Event results</h2>
          <button type="button" onClick={() => setLogs([])} className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-white">Clear log</button>
        </div>
        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {logs.length ? logs.map((log) => (
            <div key={log.id} className="grid gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs sm:grid-cols-[13rem_1fr]">
              <span className={log.status === 'error' ? 'font-bold text-red-400' : log.status === 'info' ? 'font-bold text-amber-300' : 'font-bold text-emerald-400'}>{log.source}</span>
              <span className="break-all font-mono text-slate-300">{log.detail}</span>
            </div>
          )) : <p className="text-xs text-slate-500">No events recorded yet.</p>}
        </div>
      </section>
    </main>
  );
}
