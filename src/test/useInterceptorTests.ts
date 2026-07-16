import { useMemo, useState } from 'react';
import { formatBytes } from '../utils/helpers';
import {
  TEST_METHODS,
  type FilePickerWindow,
  type PickedFileHandle,
  type TestLog,
  type TestStatus
} from './interceptorTestTypes';

export function summarizeFiles(files: File[]): string {
  if (!files.length) return 'No files received';
  return files.map((file) => `${file.name} · ${file.type || 'unknown'} · ${formatBytes(file.size)}`).join(', ');
}

export function useInterceptorTests() {
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [fileHandle, setFileHandle] = useState<PickedFileHandle | null>(null);
  const [networkFile, setNetworkFile] = useState<File | null>(null);

  const latestResults = useMemo(() => {
    const results = new Map<string, TestStatus>();
    logs.forEach((log) => {
      if (!results.has(log.source)) results.set(log.source, log.status);
    });
    return results;
  }, [logs]);

  const addLog = (source: string, detail: string, status: TestStatus = 'success') => {
    setLogs((current) => [
      { id: Date.now() + Math.random(), source, detail, status, timestamp: new Date().toLocaleTimeString() },
      ...current
    ].slice(0, 40));
  };

  const chooseWithFilePicker = async () => {
    const picker = (window as FilePickerWindow).showOpenFilePicker;
    if (!picker) {
      addLog(TEST_METHODS[3], 'The File System Access picker is unavailable in this browser.', 'error');
      return;
    }
    try {
      const [handle] = await picker({ multiple: false });
      if (!handle) return;
      setFileHandle(handle);
      addLog(TEST_METHODS[3], `Handle selected: ${handle.name}`);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : String(reason);
      addLog(TEST_METHODS[3], message, message.toLowerCase().includes('abort') ? 'info' : 'error');
    }
  };

  const readFileHandle = async () => {
    if (!fileHandle) {
      addLog(TEST_METHODS[4], 'Select a handle with showOpenFilePicker first.', 'info');
      return;
    }
    try {
      addLog(TEST_METHODS[4], summarizeFiles([await fileHandle.getFile()]));
    } catch (reason) {
      addLog(TEST_METHODS[4], reason instanceof Error ? reason.message : String(reason), 'error');
    }
  };

  const readClipboard = async () => {
    if (!navigator.clipboard?.read) {
      addLog(TEST_METHODS[5], 'Clipboard read is unavailable in this browser or context.', 'error');
      return;
    }
    try {
      const items = await navigator.clipboard.read();
      const blobs = await Promise.all(items.flatMap((item) => item.types.map((type) => item.getType(type))));
      const detail = blobs.length
        ? blobs.map((blob) => `${blob.type || 'unknown'} · ${formatBytes(blob.size)}`).join(', ')
        : 'Clipboard returned no file-like data';
      addLog(TEST_METHODS[5], detail, blobs.length ? 'success' : 'info');
    } catch (reason) {
      addLog(TEST_METHODS[5], reason instanceof Error ? reason.message : String(reason), 'error');
    }
  };

  const sendWithFetch = async () => {
    if (!networkFile) {
      addLog(TEST_METHODS[6], 'Choose an upload file first.', 'info');
      return;
    }
    const body = new FormData();
    body.append('file', networkFile);
    try {
      const response = await fetch('/api/test-upload', { method: 'POST', body });
      addLog(TEST_METHODS[6], `HTTP ${response.status} · ${networkFile.name}`, response.ok ? 'success' : 'error');
    } catch (reason) {
      addLog(TEST_METHODS[6], reason instanceof Error ? reason.message : String(reason), 'error');
    }
  };

  const sendWithXhr = () => {
    if (!networkFile) {
      addLog(TEST_METHODS[7], 'Choose an upload file first.', 'info');
      return;
    }
    const body = new FormData();
    body.append('file', networkFile);
    const request = new XMLHttpRequest();
    request.open('POST', '/api/test-upload');
    request.onload = () =>
      addLog(
        TEST_METHODS[7],
        `HTTP ${request.status} · ${networkFile.name}`,
        request.status >= 200 && request.status < 300 ? 'success' : 'error'
      );
    request.onerror = () => addLog(TEST_METHODS[7], 'The XHR request failed.', 'error');
    request.send(body);
  };

  return {
    logs,
    latestResults,
    passed: TEST_METHODS.filter((test) => latestResults.get(test) === 'success').length,
    fileHandle,
    networkFile,
    addLog,
    clearLogs: () => setLogs([]),
    chooseWithFilePicker,
    readFileHandle,
    readClipboard,
    setNetworkFile,
    sendWithFetch,
    sendWithXhr
  };
}
