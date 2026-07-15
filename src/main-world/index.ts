import {
  PAGE_INTERCEPTOR_SOURCE,
  type PageInterceptorKind,
  type PageMediaInspectionState,
  type PageMediaSources,
  type PageInterceptorState,
  type PageInterceptorRequest,
  type PageInterceptorResponse
} from '../types/PageInterceptor';

let bridgeReady = false;
let interceptionEnabled = false;
let mediaInspectionEnabled = false;
const processedFiles = new WeakSet<File>();
const userSelectedFiles = new WeakSet<File>();

interface FileInterceptionResult {
  files: File[];
  cancelled: boolean;
}

window.addEventListener('message', (event: MessageEvent<unknown>) => {
  if (event.source !== window || !event.data || typeof event.data !== 'object') return;
  const message = event.data as Partial<PageInterceptorState>;
  if (message.source === PAGE_INTERCEPTOR_SOURCE && message.type === 'STATE' && typeof message.enabled === 'boolean') {
    bridgeReady = true;
    interceptionEnabled = message.enabled;
  }
  const mediaState = event.data as Partial<PageMediaInspectionState>;
  if (
    mediaState.source === PAGE_INTERCEPTOR_SOURCE &&
    mediaState.type === 'MEDIA_INSPECTION_STATE' &&
    typeof mediaState.enabled === 'boolean'
  ) {
    mediaInspectionEnabled = mediaState.enabled;
  }
});

function captureXMediaSources(response: Response): void {
  if (!mediaInspectionEnabled || !/(^|\.)((x|twitter)\.com)$/.test(window.location.hostname)) return;
  if (!/\/(i\/api|graphql)\//.test(response.url)) return;
  if (!response.headers.get('content-type')?.includes('application/json')) return;

  void response
    .clone()
    .json()
    .then((body: unknown) => {
      const urls = new Set<string>();
      const pending: unknown[] = [body];
      let visited = 0;

      while (pending.length && visited < 50_000) {
        const value = pending.pop();
        visited += 1;
        if (typeof value === 'string') {
          if (/^https?:\/\/[^\s]+\.(mp4|webm|m3u8)(?:\?|$)/i.test(value)) urls.add(value);
        } else if (Array.isArray(value)) {
          pending.push(...value);
        } else if (value && typeof value === 'object') {
          pending.push(...Object.values(value as Record<string, unknown>));
        }
      }

      if (!urls.size) return;
      const message: PageMediaSources = {
        source: PAGE_INTERCEPTOR_SOURCE,
        type: 'MEDIA_SOURCES',
        urls: Array.from(urls)
      };
      window.postMessage(message, '*');
    })
    .catch(() => {
      // Ignore non-JSON and opaque responses; the page still receives its original response.
    });
}

function interceptFiles(kind: PageInterceptorKind, files: File[]): Promise<FileInterceptionResult> {
  if (!bridgeReady || !interceptionEnabled || !files.length) return Promise.resolve({ files, cancelled: false });

  const pendingFiles = files.filter((file) => !processedFiles.has(file));
  if (!pendingFiles.length) return Promise.resolve({ files, cancelled: false });

  const id = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const request: PageInterceptorRequest = {
    source: PAGE_INTERCEPTOR_SOURCE,
    type: 'REQUEST',
    id,
    kind,
    files: pendingFiles
  };

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      resolve({ files, cancelled: false });
    }, 300_000);

    const handleResponse = (event: MessageEvent<unknown>) => {
      if (event.source !== window || !event.data || typeof event.data !== 'object') return;
      const response = event.data as Partial<PageInterceptorResponse>;
      if (response.source !== PAGE_INTERCEPTOR_SOURCE || response.type !== 'RESPONSE' || response.id !== id) return;

      window.clearTimeout(timeout);
      window.removeEventListener('message', handleResponse);
      if (response.cancelled) {
        files.forEach((file) => processedFiles.add(file));
        resolve({ files, cancelled: true });
        return;
      }

      const interceptedFiles = Array.isArray(response.files) ? response.files : pendingFiles;
      let interceptedIndex = 0;
      const resolvedFiles = files.map((file) => {
        if (processedFiles.has(file)) return file;
        return interceptedFiles[interceptedIndex++] ?? file;
      });
      resolvedFiles.forEach((file) => processedFiles.add(file));
      resolve({ files: resolvedFiles, cancelled: false });
    };

    window.addEventListener('message', handleResponse);
    window.postMessage(request, '*');
  });
}

interface BypassFileInputEvent extends Event {
  _ufBypass?: boolean;
}

function registerFileInputInterceptor(): void {
  const pendingInputs = new WeakSet<HTMLInputElement>();

  const handleFileInput = (event: Event) => {
    const input = event.target;
    if (
      !bridgeReady ||
      !interceptionEnabled ||
      !event.isTrusted ||
      (event as BypassFileInputEvent)._ufBypass ||
      !(input instanceof HTMLInputElement) ||
      input.type !== 'file' ||
      !input.files?.length ||
      Number(input.dataset.ufProcessed || 0) > 0
    ) {
      return;
    }

    event.stopImmediatePropagation();
    event.preventDefault();
    if (pendingInputs.has(input)) return;

    pendingInputs.add(input);
    const originalFiles = Array.from(input.files);
    originalFiles.forEach((file) => userSelectedFiles.add(file));

    void interceptFiles('file-input', originalFiles).then(({ files: modifiedFiles, cancelled }) => {
      pendingInputs.delete(input);
      if (cancelled) {
        input.value = '';
        delete input.dataset.ufProcessed;
        return;
      }

      const dataTransfer = new DataTransfer();
      modifiedFiles.forEach((file) => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
      input.dataset.ufProcessed = '2';

      for (const type of ['input', 'change']) {
        const replayEvent = new Event(type, { bubbles: true }) as BypassFileInputEvent;
        replayEvent._ufBypass = true;
        input.dispatchEvent(replayEvent);
      }
    });
  };

  window.addEventListener('input', handleFileInput, true);
  window.addEventListener('change', handleFileInput, true);
}

function hasUserSelectedFile(files: File[]): boolean {
  return files.some((file) => userSelectedFiles.has(file) || processedFiles.has(file));
}

function registerClipboardReadInterceptor(): void {
  const clipboard = navigator.clipboard;
  if (!clipboard || typeof clipboard.read !== 'function' || typeof ClipboardItem === 'undefined') return;

  const originalRead = clipboard.read.bind(clipboard);

  clipboard.read = async (...args) => {
    if (!interceptionEnabled) return originalRead(...args);
    const items = await originalRead(...args);
    const imageFiles: File[] = [];
    const passthroughItems: ClipboardItem[] = [];

    for (const item of items) {
      const imageTypes = item.types.filter((type) => type.startsWith('image/'));
      if (!imageTypes.length) {
        passthroughItems.push(item);
        continue;
      }

      for (const type of imageTypes) {
        const blob = await item.getType(type);
        imageFiles.push(new File([blob], `clipboard-${Date.now()}.${type.split('/')[1] || 'bin'}`, { type }));
      }
    }

    if (!imageFiles.length) return items;
    const { files: modifiedFiles } = await interceptFiles('clipboard-read', imageFiles);
    const modifiedItems = modifiedFiles.map((file) => new ClipboardItem({ [file.type || 'application/octet-stream']: file }));
    return [...passthroughItems, ...modifiedItems];
  };
}

function registerXhrInterceptor(): void {
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null): void {
    if (!(body instanceof FormData) || !bridgeReady || !interceptionEnabled) {
      originalSend.call(this, body);
      return;
    }

    const entries: Array<[string, FormDataEntryValue]> = [];
    const files: File[] = [];
    body.forEach((value, key) => {
      entries.push([key, value]);
      if (value instanceof File) files.push(value);
    });

    if (!files.length || !hasUserSelectedFile(files)) {
      originalSend.call(this, body);
      return;
    }

    void interceptFiles('xhr-send', files).then(({ files: modifiedFiles }) => {
      const replacement = new FormData();
      let fileIndex = 0;

      for (const [key, value] of entries) {
        if (value instanceof File) {
          const file = modifiedFiles[fileIndex++] ?? value;
          replacement.append(key, file, file.name);
        } else replacement.append(key, value);
      }

      originalSend.call(this, replacement);
    });
  };
}

function registerFetchInterceptor(): void {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const body = init?.body;
    if (!(body instanceof FormData) || !bridgeReady || !interceptionEnabled) {
      const response = await originalFetch(input, init);
      captureXMediaSources(response);
      return response;
    }

    const entries: Array<[string, FormDataEntryValue]> = [];
    const files: File[] = [];
    body.forEach((value, key) => {
      entries.push([key, value]);
      if (value instanceof File) files.push(value);
    });

    if (!files.length || !hasUserSelectedFile(files)) {
      const response = await originalFetch(input, init);
      captureXMediaSources(response);
      return response;
    }
    const { files: modifiedFiles } = await interceptFiles('fetch-send', files);
    const replacement = new FormData();
    let fileIndex = 0;

    for (const [key, value] of entries) {
      if (value instanceof File) {
        const file = modifiedFiles[fileIndex++] ?? value;
        replacement.append(key, file, file.name);
      } else replacement.append(key, value);
    }

    const response = await originalFetch(input, { ...init, body: replacement });
    captureXMediaSources(response);
    return response;
  };
}

function registerFilePickerInterceptor(): void {
  if (typeof FileSystemFileHandle === 'undefined') return;
  const originalGetFile = FileSystemFileHandle.prototype.getFile;
  const selectedHandles = new WeakSet<FileSystemFileHandle>();
  const filesByHandle = new WeakMap<FileSystemFileHandle, Promise<File>>();

  type ShowOpenFilePicker = (options?: { multiple?: boolean }) => Promise<FileSystemFileHandle[]>;
  const pickerWindow = window as Window & { showOpenFilePicker?: ShowOpenFilePicker };
  const originalPicker = pickerWindow.showOpenFilePicker?.bind(window);

  if (originalPicker) {
    pickerWindow.showOpenFilePicker = async (...args: Parameters<ShowOpenFilePicker>) => {
      const handles = await originalPicker(...args);
      if (!interceptionEnabled) return handles;
      handles.forEach((handle) => selectedHandles.add(handle));
      return handles;
    };
  }

  FileSystemFileHandle.prototype.getFile = async function (): Promise<File> {
    if (!interceptionEnabled || !selectedHandles.has(this)) return originalGetFile.call(this);

    const existingFile = filesByHandle.get(this);
    if (existingFile) return existingFile;

    const interceptedFile = originalGetFile.call(this).then(async (file) => {
      const { files: modifiedFiles } = await interceptFiles('file-handle-get-file', [file]);
      return modifiedFiles[0] ?? file;
    });
    filesByHandle.set(this, interceptedFile);
    return interceptedFile;
  };
}

registerFileInputInterceptor();
registerClipboardReadInterceptor();
registerFetchInterceptor();
registerXhrInterceptor();
registerFilePickerInterceptor();
