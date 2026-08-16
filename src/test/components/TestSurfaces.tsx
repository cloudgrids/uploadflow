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
    <div className="uf-stack-6">
      <span className="uf-eyebrow uf-mono">/{number}</span>
      <h3>{title}</h3>
      <p className="uf-small">{description}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, methods }: { eyebrow: string; title: string; methods: string }) {
  return (
    <div className="uf-stack-6">
      <span className="uf-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <span className="uf-small uf-mono">{methods}</span>
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
    <div className="uf-stack-l">
      <div className="uf-stack">
        <SectionHeading eyebrow="Everyday uploads" title="Choose, drop, or paste" methods="INPUT · DROP · PASTE" />
        <div className="uf-test-grid">
          <article className={surfaceClass}>
            <SurfaceHeader number="01" title="Input change" description="Choose one or more files through a standard HTML file input." />
            <label className={primaryButtonClass} style={{ width: '100%' }}>
              <input
                type="file"
                multiple
                className="sr-only"
                style={{ display: 'none' }}
                onChange={(event) => addLog(TEST_METHODS[0], summarizeFiles(Array.from(event.target.files ?? [])))}
              />
              Choose files
            </label>
          </article>

          <article className={surfaceClass}>
            <SurfaceHeader number="02" title="Drag & drop" description="Drop files from the desktop into a native DataTransfer target." />
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                addLog(TEST_METHODS[1], summarizeFiles(Array.from(event.dataTransfer.files)));
              }}
              className="uf-drop"
            >
              Drop files here
            </div>
          </article>

          <article className={surfaceClass}>
            <SurfaceHeader number="03" title="Paste" description="Focus the target and paste copied image or file data." />
            <div
              contentEditable
              suppressContentEditableWarning
              tabIndex={0}
              onPaste={(event) => addLog(TEST_METHODS[2], summarizeFiles(Array.from(event.clipboardData.files)))}
              className="uf-drop"
            >
              Click here, then press Ctrl+V or Cmd+V.
            </div>
          </article>
        </div>
      </div>

      <div className="uf-stack">
        <SectionHeading eyebrow="Browser tools" title="Picker and clipboard" methods="PICKER · HANDLE · CLIPBOARD" />
        <div className="uf-grid uf-grid-2">
          <article className={surfaceClass}>
            <SurfaceHeader
              number="04–05"
              title="File System Access"
              description="Invoke the picker and read the returned handle as two distinct interception paths."
            />
            <div className="uf-cta-row">
              <button type="button" onClick={() => void chooseWithFilePicker()} className={primaryButtonClass}>
                Select handle
              </button>
              <button type="button" onClick={() => void readFileHandle()} className={secondaryButtonClass}>
                Read file
              </button>
            </div>
            <p className="uf-small uf-mono">handle: {fileHandleName ?? 'none selected'}</p>
          </article>

          <article className={surfaceClass}>
            <SurfaceHeader number="06" title="Clipboard read" description="Request file-like data from the async Clipboard API." />
            <div className="uf-cta-row">
              <button type="button" onClick={() => void readClipboard()} className={primaryButtonClass}>
                Read clipboard
              </button>
            </div>
          </article>
        </div>
      </div>

      <div className="uf-stack">
        <SectionHeading eyebrow="Site upload requests" title="Send to the webpage" methods="FETCH · XHR" />
        <article className={surfaceClass}>
          <SurfaceHeader
            number="07–08"
            title="Webpage upload"
            description="Choose once, then send the same file through two common webpage upload methods."
          />
          <label className="uf-drop" style={{ cursor: 'pointer' }}>
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;
                setNetworkFile(selected);
                addLog('Upload file', selected ? summarizeFiles([selected]) : 'Selection cleared', selected ? 'success' : 'info');
              }}
            />
            <strong style={{ display: 'block', color: 'var(--uf-text)' }}>{networkFile?.name ?? 'Choose an upload file'}</strong>
            <span className="uf-small uf-mono">{networkFile ? formatBytes(networkFile.size) : 'No file selected'}</span>
          </label>
          <div className="uf-cta-row">
            <button type="button" onClick={() => void sendWithFetch()} className={primaryButtonClass}>
              Send fetch
            </button>
            <button type="button" onClick={sendWithXhr} className={secondaryButtonClass}>
              Send XHR
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

export function EventConsole({ logs, onClear }: { logs: TestLog[]; onClear: () => void }) {
  return (
    <section className="uf-wrap uf-section">
      <div className="uf-stack">
        <div className="uf-row-top">
          <div className="uf-stack-6">
            <span className="uf-eyebrow">Live output</span>
            <h2>Event console</h2>
          </div>
          <button type="button" onClick={onClear} className={secondaryButtonClass}>
            Clear console
          </button>
        </div>

        <div className="uf-card uf-log">
          {logs.length ? (
            logs.map((log) => (
              <div key={log.id} className="uf-log-row" data-status={log.status}>
                <span className="uf-log-src">
                  {log.source} <span className="uf-mono">· {log.timestamp}</span>
                </span>
                <span className="uf-log-detail">{log.detail}</span>
              </div>
            ))
          ) : (
            <p className="uf-small">Waiting for your first action…</p>
          )}
        </div>
      </div>
    </section>
  );
}
