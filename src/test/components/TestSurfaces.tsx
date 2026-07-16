import { formatBytes } from '../../utils/helpers';
import { TEST_METHODS, type TestLog, type TestStatus } from '../interceptorTestTypes';
import { primaryButtonClass, secondaryButtonClass, surfaceClass } from '../interceptorTestStyles';
import { summarizeFiles } from '../useInterceptorTests';

interface TestSurfacesProps {
  fileHandleName?: string;
  networkFile: File | null;
  addLog: (source: string, detail: string, status?: TestStatus) => void;
  setNetworkFile: (file: File | null) => void;
  chooseWithFilePicker: () => Promise<void>;
  readFileHandle: () => Promise<void>;
  readClipboard: () => Promise<void>;
  sendWithFetch: () => Promise<void>;
  sendWithXhr: () => void;
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

function SectionHeading({ eyebrow, title, methods }: { eyebrow: string; title: string; methods: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div><p className="text-[8px] font-black uppercase tracking-[.2em] text-emerald-400">{eyebrow}</p><h2 className="mt-2 text-3xl">{title}</h2></div>
      <span className="font-mono text-[8px] text-white/25">{methods}</span>
    </div>
  );
}

export function TestSurfaces({
  fileHandleName,
  networkFile,
  addLog,
  setNetworkFile,
  chooseWithFilePicker,
  readFileHandle,
  readClipboard,
  sendWithFetch,
  sendWithXhr
}: TestSurfacesProps) {
  return (
    <div className="min-w-0">
      <SectionHeading eyebrow="Everyday uploads" title="Choose, drop, or paste" methods="INPUT · DROP · PASTE" />
      <div className="grid border-l border-t border-white/10 md:grid-cols-3">
        <article className={surfaceClass}>
          <SurfaceHeader number="01" title="Input change" description="Choose one or more files through a standard HTML file input." />
          <label className={`${primaryButtonClass} mt-8 w-full`}><input type="file" multiple className="sr-only" onChange={(event) => addLog(TEST_METHODS[0], summarizeFiles(Array.from(event.target.files ?? [])))} />Choose files</label>
        </article>
        <article className={surfaceClass}>
          <SurfaceHeader number="02" title="Drag & drop" description="Drop files from the desktop into a native DataTransfer target." />
          <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addLog(TEST_METHODS[1], summarizeFiles(Array.from(event.dataTransfer.files))); }} className="mt-8 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-[#eefb7a]/35 bg-[#eefb7a]/5 p-4 text-center text-[9px] font-bold uppercase tracking-wider text-[#eefb7a]">Drop files here</div>
        </article>
        <article className={surfaceClass}>
          <SurfaceHeader number="03" title="Paste" description="Focus the target and paste copied image or file data." />
          <div contentEditable suppressContentEditableWarning tabIndex={0} onPaste={(event) => addLog(TEST_METHODS[2], summarizeFiles(Array.from(event.clipboardData.files)))} className="mt-8 min-h-24 rounded-xl border border-white/12 bg-black/20 p-4 text-[9px] leading-4 text-white/30 outline-none transition focus:border-[#eefb7a]/50 focus:text-white/60">Click here, then press Ctrl+V or Cmd+V.</div>
        </article>
      </div>

      <div className="mt-14"><SectionHeading eyebrow="Browser tools" title="Picker and clipboard" methods="PICKER · HANDLE · CLIPBOARD" /></div>
      <div className="grid border-l border-t border-white/10 md:grid-cols-2">
        <article className={surfaceClass}>
          <SurfaceHeader number="04–05" title="File System Access" description="Invoke the picker and read the returned handle as two distinct interception paths." />
          <div className="mt-8 flex flex-wrap gap-2"><button type="button" onClick={() => void chooseWithFilePicker()} className={primaryButtonClass}>Select handle</button><button type="button" onClick={() => void readFileHandle()} className={secondaryButtonClass}>Read file</button></div>
          <p className="mt-4 truncate rounded-lg bg-black/20 px-3 py-2 font-mono text-[8px] text-white/30">handle: {fileHandleName ?? 'none selected'}</p>
        </article>
        <article className={surfaceClass}>
          <SurfaceHeader number="06" title="Clipboard read" description="Request file-like data from the async Clipboard API." />
          <button type="button" onClick={() => void readClipboard()} className={`${primaryButtonClass} mt-8`}>Read clipboard</button>
        </article>
      </div>

      <div className="mt-14"><SectionHeading eyebrow="Site upload requests" title="Send to the webpage" methods="FETCH · XHR" /></div>
      <article className="border border-white/10 bg-white/2 p-5 sm:p-6">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <SurfaceHeader number="07–08" title="Webpage upload" description="Choose once, then send the same file through two common webpage upload methods." />
            <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-black/20 p-4 transition hover:border-[#eefb7a]/40">
              <input type="file" className="sr-only" onChange={(event) => { const selected = event.target.files?.[0] ?? null; setNetworkFile(selected); addLog('Upload file', selected ? summarizeFiles([selected]) : 'Selection cleared', selected ? 'success' : 'info'); }} />
              <span className="min-w-0"><strong className="block truncate text-[10px] text-white/70">{networkFile?.name ?? 'Choose an upload file'}</strong><small className="mt-1 block font-mono text-[8px] text-white/25">{networkFile ? formatBytes(networkFile.size) : 'No file selected'}</small></span>
              <span className="rounded-lg bg-white px-3 py-2 text-[8px] font-black uppercase text-[#101416]">Browse</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void sendWithFetch()} className={primaryButtonClass}>Send fetch</button><button type="button" onClick={sendWithXhr} className={secondaryButtonClass}>Send XHR</button></div>
        </div>
      </article>
    </div>
  );
}

export function EventConsole({ logs, onClear }: { logs: TestLog[]; onClear: () => void }) {
  return (
    <section className="border-t border-white/10 bg-[#101416]">
      <div className="mx-auto w-full max-w-360 px-5 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[8px] font-black uppercase tracking-[.2em] text-[#eefb7a]">Live output</p><h2 className="mt-2 text-3xl">Event console</h2></div><button type="button" onClick={onClear} className={secondaryButtonClass}>Clear console</button></div>
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
  );
}
