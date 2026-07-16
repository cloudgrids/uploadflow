export interface PickedFileHandle {
  name: string;
  getFile: () => Promise<File>;
}

export interface FilePickerWindow extends Window {
  showOpenFilePicker?: (options?: { multiple?: boolean }) => Promise<PickedFileHandle[]>;
}

export type TestStatus = 'success' | 'error' | 'info';

export interface TestLog {
  id: number;
  source: string;
  detail: string;
  status: TestStatus;
  timestamp: string;
}

export const TEST_METHODS = [
  '<input> change',
  'Drag & Drop',
  'Paste',
  'showOpenFilePicker',
  'FileSystemFileHandle.getFile',
  'navigator.clipboard.read',
  'fetch',
  'XMLHttpRequest.send'
] as const;

export type TestMethod = (typeof TEST_METHODS)[number];
