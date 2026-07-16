import { useMemo, useState } from 'react';
import { UploadFlowIcon } from '../lib/icons';
import { formatBytes } from '../utils/helpers';

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
  timestamp: string;
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
  return files.map((file) => `${file.name} · ${file.type || 'unknown'} · ${formatBytes(file.size)}`).join(', ');
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SurfaceHeader({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div>
      <span className="font-mono text-[8px] text-[#eefb7a]">/{number}</span>
      <h3 className="mt-3 text-lg text-white">{title}</h3>
      <p className="mt-1.5 text-[10px] leading-4 text-white/35">{description}</p>
    </div>
  );
}

export function InterceptorTestPage() {
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [fileHandle, setFileHandle] = useState<PickedFileHandle | null>(null);
  const [networkFile, setNetworkFile] = useState<File | null>(null);

  const latestResults = useMemo(() => {
    const results = new Map<string, TestLog['status']>();
    logs.forEach((log) => {
      if (!results.has(log.source)) results.set(log.source, log.status);
    });
    return results;
  }, [logs]);
  const passed = tests.filter((test) => latestResults.get(test) === 'success').length;

  const addLog = (source: string, detail: string, status: TestLog['status'] = 'success') => {
    setLogs((current) => [
      { id: Date.now() + Math.random(), source, detail, status, timestamp: new Date().toLocaleTimeString() },
      ...current
    ].slice(0, 40));
  };

  const chooseWithFilePicker = async () => {
    const picker = (window as FilePickerWindow).showOpenFilePicker;
    if (!picker) {
      addLog('showOpenFilePicker', 'The File System Access picker is unavailable in this browser.', 'error');
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
        ? blobs.map((blob) => `${blob.type || 'unknown'} · ${formatBytes(blob.size)}`).join(', ')
        : 'Clipboard returned no file-like data';
      addLog('navigator.clipboard.read', detail, blobs.length ? 'success' : 'info');
    } catch (reason) {
      addLog('navigator.clipboard.read', reason instanceof Error ? reason.message : String(reason), 'error');
    }
  };

  const sendWithFetch = async () => {
    if (!networkFile) {
      addLog('fetch', 'Choose an upload file first.', 'info');
      return;
    }
    const body = new FormData();
    body.append('file', networkFile);
    try {
      const response = await fetch('/api/test-upload', { method: 'POST', body });
      addLog('fetch', `HTTP ${response.status} · ${networkFile.name}`, response.ok ? 'success' : 'error');
    } catch (reason) {
      addLog('fetch', reason instanceof Error ? reason.message : String(reason), 'error');
    }
  };

  const sendWithXhr = () => {
    if (!networkFile) {
      addLog('XMLHttpRequest.send', 'Choose an upload file first.', 'info');
      return;
    }
    const body = new FormData();
    body.append('file', networkFile);
    const request = new XMLHttpRequest();
    request.open('POST', '/api/test-upload');
    request.onload = () => addLog('XMLHttpRequest.send', `HTTP ${request.status} · ${networkFile.name}`, request.status >= 200 && request.status < 300 ? 'success' : 'error');
    request.onerror = () => addLog('XMLHttpRequest.send', 'The XHR request failed.', 'error');
    request.send(body);
  };

  const surfaceClass = 'relative overflow-hidden border-b border-r border-white/10 bg-white/[.02] p-5 transition hover:bg-white/[.035] sm:p-6';
  const buttonClass = 'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-[9px] font-black uppercase tracking-[.08em] text-[#101416] transition hover:bg-[#eefb7a]';
  const secondaryButton = 'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-white/12 px-4 text-[9px] font-bold uppercase tracking-[.08em] text-white/55 transition hover:border-white/30 hover:bg-white/5 hover:text-white';

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#0b0d0f] text-white selection:bg-[#eefb7a] selection:text-[#0b0d0f]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0d0f]/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="/" className="flex items-center gap-3 text-white no-underline" aria-label="Return to UploadFlow home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#101416]"><UploadFlowIcon /></span>
            <span><strong className="block text-[15px] font-black uppercase italic leading-none">UploadFlow</strong><small className="mt-1 block text-[8px] font-bold uppercase tracking-[.2em] text-white/35">Live demo</small></span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[8px] font-bold uppercase tracking-[.14em] text-emerald-300 sm:flex"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{tests.length} ways to try</span>
            <a href="/" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[9px] font-black uppercase tracking-[.08em] text-white/65 transition hover:bg-white hover:text-[#101416]">Back home <ArrowIcon /></a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(52,211,153,.1),transparent_28%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <div className="relative mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_360px] lg:items-end lg:px-12">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#eefb7a]">Interactive preview · real browser actions</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3.5rem,7vw,7rem)] leading-[.84] tracking-[-.065em]">See UploadFlow<br /><span className="text-[#eefb7a]">in action.</span></h1>
              <p className="mt-7 max-w-2xl text-sm leading-6 text-white/45 sm:text-base sm:leading-7">Try the different ways files reach a webpage and see how UploadFlow gives you a private review step before upload.</p>
            </div>
            <div className="rounded-[24px] border border-white/12 bg-[#121618] p-5 shadow-2xl">
              <div className="flex items-end justify-between"><div><span className="font-mono text-[8px] uppercase tracking-widest text-white/30">Demo progress</span><strong className="mt-2 block text-4xl tracking-[-.06em]">{passed}/{tests.length}</strong></div><span className="mb-1 text-[9px] font-bold uppercase text-emerald-300">Completed</span></div>
              <div className="mt-5 grid grid-cols-8 gap-1.5">
                {tests.map((test) => <span key={test} title={test} className={`h-1.5 rounded-full ${latestResults.get(test) === 'success' ? 'bg-emerald-400' : latestResults.get(test) === 'error' ? 'bg-red-400' : latestResults.get(test) === 'info' ? 'bg-amber-300' : 'bg-white/10'}`} />)}
              </div>
              <div className="mt-5 flex gap-3 rounded-2xl border border-[#eefb7a]/25 bg-[#eefb7a]/10 p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eefb7a] text-[11px] font-black text-[#101416]" aria-hidden="true">!</span>
                <div>
                  <strong className="block text-[10px] font-black uppercase tracking-[.12em] text-[#eefb7a]">Before you start</strong>
                  <p className="mt-1.5 text-xs font-medium leading-5 text-white/75 sm:text-[13px]">Open the installed UploadFlow extension, keep upload interception enabled, then try each upload method below.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[220px_1fr] lg:px-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/30">Upload methods</p>
            <div className="mt-4 border-t border-white/10">
              {tests.map((test, index) => {
                const result = latestResults.get(test);
                return (
                  <div key={test} className="flex items-center gap-3 border-b border-white/10 py-3 text-[9px]">
                    <span className={`grid h-5 w-5 place-items-center rounded-full font-mono text-[7px] ${result === 'success' ? 'bg-emerald-400 text-[#101416]' : result === 'error' ? 'bg-red-400 text-[#101416]' : result === 'info' ? 'bg-amber-300 text-[#101416]' : 'border border-white/15 text-white/25'}`}>{result === 'success' ? '✓' : String(index + 1).padStart(2, '0')}</span>
                    <span className={result ? 'text-white/70' : 'text-white/30'}>{test}</span>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex items-end justify-between"><div><p className="text-[8px] font-black uppercase tracking-[.2em] text-emerald-400">Everyday uploads</p><h2 className="mt-2 text-3xl">Choose, drop, or paste</h2></div><span className="font-mono text-[8px] text-white/25">INPUT · DROP · PASTE</span></div>
            <div className="grid border-l border-t border-white/10 md:grid-cols-3">
              <article className={surfaceClass}>
                <SurfaceHeader number="01" title="Input change" description="Choose one or more files through a standard HTML file input." />
                <label className={`${buttonClass} mt-8 w-full`}><input type="file" multiple className="sr-only" onChange={(event) => addLog(tests[0], summarizeFiles(Array.from(event.target.files ?? [])))} />Choose files</label>
              </article>
              <article className={surfaceClass}>
                <SurfaceHeader number="02" title="Drag & drop" description="Drop files from the desktop into a native DataTransfer target." />
                <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addLog(tests[1], summarizeFiles(Array.from(event.dataTransfer.files))); }} className="mt-8 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-[#eefb7a]/35 bg-[#eefb7a]/5 p-4 text-center text-[9px] font-bold uppercase tracking-wider text-[#eefb7a]">Drop files here</div>
              </article>
              <article className={surfaceClass}>
                <SurfaceHeader number="03" title="Paste" description="Focus the target and paste copied image or file data." />
                <div contentEditable suppressContentEditableWarning tabIndex={0} onPaste={(event) => addLog(tests[2], summarizeFiles(Array.from(event.clipboardData.files)))} className="mt-8 min-h-24 rounded-xl border border-white/12 bg-black/20 p-4 text-[9px] leading-4 text-white/30 outline-none transition focus:border-[#eefb7a]/50 focus:text-white/60">Click here, then press Ctrl+V or Cmd+V.</div>
              </article>
            </div>

            <div className="mb-5 mt-14 flex items-end justify-between"><div><p className="text-[8px] font-black uppercase tracking-[.2em] text-emerald-400">Browser tools</p><h2 className="mt-2 text-3xl">Picker and clipboard</h2></div><span className="font-mono text-[8px] text-white/25">PICKER · HANDLE · CLIPBOARD</span></div>
            <div className="grid border-l border-t border-white/10 md:grid-cols-2">
              <article className={surfaceClass}>
                <SurfaceHeader number="04–05" title="File System Access" description="Invoke the picker and read the returned handle as two distinct interception paths." />
                <div className="mt-8 flex flex-wrap gap-2"><button type="button" onClick={() => void chooseWithFilePicker()} className={buttonClass}>Select handle</button><button type="button" onClick={() => void readFileHandle()} className={secondaryButton}>Read file</button></div>
                <p className="mt-4 truncate rounded-lg bg-black/20 px-3 py-2 font-mono text-[8px] text-white/30">handle: {fileHandle?.name ?? 'none selected'}</p>
              </article>
              <article className={surfaceClass}>
                <SurfaceHeader number="06" title="Clipboard read" description="Request file-like data from the async Clipboard API." />
                <button type="button" onClick={() => void readClipboard()} className={`${buttonClass} mt-8`}>Read clipboard</button>
              </article>
            </div>

            <div className="mb-5 mt-14 flex items-end justify-between"><div><p className="text-[8px] font-black uppercase tracking-[.2em] text-emerald-400">Site upload requests</p><h2 className="mt-2 text-3xl">Send to the webpage</h2></div><span className="font-mono text-[8px] text-white/25">FETCH · XHR</span></div>
            <article className="border border-white/10 bg-white/[.02] p-5 sm:p-6">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                <div><SurfaceHeader number="07–08" title="Webpage upload" description="Choose once, then send the same file through two common webpage upload methods." /><label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-black/20 p-4 transition hover:border-[#eefb7a]/40"><input type="file" className="sr-only" onChange={(event) => { const selected = event.target.files?.[0] ?? null; setNetworkFile(selected); addLog('Upload file', selected ? summarizeFiles([selected]) : 'Selection cleared', selected ? 'success' : 'info'); }} /><span className="min-w-0"><strong className="block truncate text-[10px] text-white/70">{networkFile?.name ?? 'Choose an upload file'}</strong><small className="mt-1 block font-mono text-[8px] text-white/25">{networkFile ? formatBytes(networkFile.size) : 'No file selected'}</small></span><span className="rounded-lg bg-white px-3 py-2 text-[8px] font-black uppercase text-[#101416]">Browse</span></label></div>
                <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void sendWithFetch()} className={buttonClass}>Send fetch</button><button type="button" onClick={sendWithXhr} className={secondaryButton}>Send XHR</button></div>
              </div>
            </article>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#101416]">
          <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12">
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[8px] font-black uppercase tracking-[.2em] text-[#eefb7a]">Live output</p><h2 className="mt-2 text-3xl">Event console</h2></div><button type="button" onClick={() => setLogs([])} className={secondaryButton}>Clear console</button></div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#080a0b] font-mono">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3"><span className="h-2 w-2 rounded-full bg-[#ff6b5e]" /><span className="h-2 w-2 rounded-full bg-[#f4c95d]" /><span className="h-2 w-2 rounded-full bg-[#58c477]" /><span className="ml-2 text-[8px] uppercase tracking-widest text-white/20">uploadflow events</span></div>
              <div className="max-h-96 min-h-48 overflow-y-auto p-3 sm:p-4">
                {logs.length ? logs.map((log) => (
                  <div key={log.id} className="grid gap-1 border-b border-white/5 px-2 py-3 text-[9px] sm:grid-cols-[72px_210px_1fr]">
                    <span className="text-white/20">{log.timestamp}</span><span className={log.status === 'error' ? 'text-red-400' : log.status === 'info' ? 'text-amber-300' : 'text-emerald-400'}>{log.source}</span><span className="break-all text-white/45">{log.detail}</span>
                  </div>
                )) : <div className="flex min-h-40 items-center justify-center text-[9px] uppercase tracking-[.16em] text-white/20">Waiting for your first action…</div>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
