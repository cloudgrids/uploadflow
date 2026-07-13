import {
  PAGE_INTERCEPTOR_SOURCE,
  type PageInterceptorKind,
  type PageInterceptorReady,
  type PageInterceptorRequest,
  type PageInterceptorResponse
} from '../types/PageInterceptor';

let bridgeReady = false;

window.addEventListener('message', (event: MessageEvent<unknown>) => {
  if (event.source !== window || !event.data || typeof event.data !== 'object') return;
  const message = event.data as Partial<PageInterceptorReady>;
  if (message.source === PAGE_INTERCEPTOR_SOURCE && message.type === 'READY') bridgeReady = true;
});

function interceptFiles(kind: PageInterceptorKind, files: File[]): Promise<File[]> {
  if (!bridgeReady || !files.length) return Promise.resolve(files);

  const id = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const request: PageInterceptorRequest = {
    source: PAGE_INTERCEPTOR_SOURCE,
    type: 'REQUEST',
    id,
    kind,
    files
  };

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      resolve(files);
    }, 300_000);

    const handleResponse = (event: MessageEvent<unknown>) => {
      if (event.source !== window || !event.data || typeof event.data !== 'object') return;
      const response = event.data as Partial<PageInterceptorResponse>;
      if (response.source !== PAGE_INTERCEPTOR_SOURCE || response.type !== 'RESPONSE' || response.id !== id) return;

      window.clearTimeout(timeout);
      window.removeEventListener('message', handleResponse);
      resolve(Array.isArray(response.files) ? response.files : files);
    };

    window.addEventListener('message', handleResponse);
    window.postMessage(request, '*');
  });
}

function registerClipboardReadInterceptor(): void {
  const clipboard = navigator.clipboard;
  if (!clipboard || typeof clipboard.read !== 'function' || typeof ClipboardItem === 'undefined') return;

  const originalRead = clipboard.read.bind(clipboard);

  clipboard.read = async (...args) => {
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
    const modifiedFiles = await interceptFiles('clipboard-read', imageFiles);
    const modifiedItems = modifiedFiles.map((file) => new ClipboardItem({ [file.type || 'application/octet-stream']: file }));
    return [...passthroughItems, ...modifiedItems];
  };
}

function registerXhrInterceptor(): void {
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null): void {
    if (!(body instanceof FormData) || !bridgeReady) {
      originalSend.call(this, body);
      return;
    }

    const entries: Array<[string, FormDataEntryValue]> = [];
    const files: File[] = [];
    body.forEach((value, key) => {
      entries.push([key, value]);
      if (value instanceof File) files.push(value);
    });

    if (!files.length) {
      originalSend.call(this, body);
      return;
    }

    void interceptFiles('xhr-send', files).then((modifiedFiles) => {
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

function registerFilePickerInterceptor(): void {
  if (typeof FileSystemFileHandle === 'undefined') return;
  const originalGetFile = FileSystemFileHandle.prototype.getFile;
  const modifiedFilesByHandle = new WeakMap<FileSystemFileHandle, File>();

  type ShowOpenFilePicker = (options?: { multiple?: boolean }) => Promise<FileSystemFileHandle[]>;
  const pickerWindow = window as Window & { showOpenFilePicker?: ShowOpenFilePicker };
  const originalPicker = pickerWindow.showOpenFilePicker?.bind(window);

  if (originalPicker) {
    pickerWindow.showOpenFilePicker = async (...args: Parameters<ShowOpenFilePicker>) => {
      const handles = await originalPicker(...args);
      if (!bridgeReady || !handles.length) return handles;

      const files = await Promise.all(handles.map((handle) => originalGetFile.call(handle)));
      const modifiedFiles = await interceptFiles('file-picker', files);
      handles.forEach((handle, index) => modifiedFilesByHandle.set(handle, modifiedFiles[index] ?? files[index]));
      return handles;
    };
  }

  FileSystemFileHandle.prototype.getFile = async function (): Promise<File> {
    const pickerResult = modifiedFilesByHandle.get(this);
    if (pickerResult) return pickerResult;

    const file = await originalGetFile.call(this);
    const [modifiedFile] = await interceptFiles('file-handle-get-file', [file]);
    return modifiedFile ?? file;
  };
}

registerClipboardReadInterceptor();
registerXhrInterceptor();
registerFilePickerInterceptor();
