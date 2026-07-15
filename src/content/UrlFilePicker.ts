import type { MessageService } from '../services/MessageService';
import type { UrlFileRecord } from '../types/Message';
import { FileBypass } from './FileBypass';
import type { InterceptionState } from './InterceptionState';

const MAX_URL_FILES = 20;

export class UrlFilePicker {
  private readonly messageService: MessageService;
  private readonly interceptionState: InterceptionState;
  private readonly nativePickerBypass = new WeakSet<HTMLInputElement>();
  private host: HTMLDivElement | null = null;
  private input: HTMLInputElement | null = null;
  private records: UrlFileRecord[] = [];

  constructor(messageService: MessageService, interceptionState: InterceptionState) {
    this.messageService = messageService;
    this.interceptionState = interceptionState;
  }

  register(): void {
    window.addEventListener('click', this.handleClick, true);
    window.addEventListener('keydown', this.handleKeyDown, true);
  }

  unregister(): void {
    window.removeEventListener('click', this.handleClick, true);
    window.removeEventListener('keydown', this.handleKeyDown, true);
    this.close();
  }

  private readonly handleClick = (event: MouseEvent): void => {
    const input = this.fileInputFromEvent(event);
    if (!input || input.disabled) return;
    if (this.nativePickerBypass.delete(input)) return;
    if (!this.interceptionState.enabled) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    this.open(input);
  };

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.host) this.close();
  };

  private fileInputFromEvent(event: MouseEvent): HTMLInputElement | null {
    for (const node of event.composedPath()) {
      if (node instanceof HTMLInputElement && node.type === 'file') return node;
      if (node instanceof HTMLLabelElement && node.control instanceof HTMLInputElement && node.control.type === 'file') {
        return node.control;
      }
    }
    return null;
  }

  private open(input: HTMLInputElement): void {
    this.close();
    this.input = input;
    const host = document.createElement('div');
    host.id = 'uploadflow-url-file-picker';
    Object.assign(host.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(0,0,0,.68)'
    });
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        * { box-sizing: border-box; }
        .panel { width: min(520px, calc(100vw - 28px)); max-height: min(680px, calc(100vh - 28px)); overflow: auto; border: 1px solid rgba(255,255,255,.16); border-radius: 22px; background: #101416; color: #fff; box-shadow: 0 24px 80px rgba(0,0,0,.55); font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 20px; border-bottom: 1px solid rgba(255,255,255,.1); }
        .eyebrow { margin: 0 0 6px; color: #34d399; font-size: 9px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        h2 { margin: 0; font-size: 24px; font-style: italic; text-transform: uppercase; }
        button { border: 0; cursor: pointer; font: inherit; }
        .close { width: 32px; height: 32px; border-radius: 9px; background: rgba(255,255,255,.07); color: rgba(255,255,255,.65); }
        .body { padding: 20px; }
        form { display: flex; gap: 8px; }
        input { min-width: 0; flex: 1; height: 42px; border: 1px solid rgba(255,255,255,.14); border-radius: 11px; background: #0b0e0f; color: #fff; padding: 0 12px; outline: none; font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; }
        input:focus { border-color: rgba(238,251,122,.65); }
        .primary { min-height: 42px; border-radius: 11px; background: #eefb7a; color: #101416; padding: 0 15px; font-size: 10px; font-weight: 900; text-transform: uppercase; }
        .secondary { width: 100%; min-height: 40px; margin-top: 10px; border: 1px solid rgba(255,255,255,.12); border-radius: 11px; background: rgba(255,255,255,.05); color: rgba(255,255,255,.75); font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .status { min-height: 18px; margin: 10px 0 0; color: rgba(255,255,255,.42); font-size: 10px; line-height: 1.5; }
        .status.error { color: #fca5a5; }
        .saved-head { display: flex; justify-content: space-between; margin-top: 22px; padding-bottom: 9px; border-bottom: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.35); font-size: 9px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .list { display: grid; gap: 7px; margin-top: 10px; }
        .item { display: grid; grid-template-columns: minmax(0,1fr) auto auto; align-items: center; gap: 7px; border: 1px solid rgba(255,255,255,.09); border-radius: 12px; padding: 10px; background: rgba(255,255,255,.025); }
        .name,.url { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .name { color: rgba(255,255,255,.82); font-size: 11px; font-weight: 750; }
        .url { margin-top: 3px; color: rgba(255,255,255,.28); font: 8px ui-monospace, SFMono-Regular, Menlo, monospace; }
        .use,.remove { min-height: 30px; border-radius: 8px; padding: 0 10px; font-size: 9px; font-weight: 850; text-transform: uppercase; }
        .use { background: #fff; color: #101416; }
        .remove { background: transparent; color: rgba(252,165,165,.65); }
        .empty { padding: 24px 10px; text-align: center; color: rgba(255,255,255,.28); font-size: 10px; }
      </style>
      <section class="panel" role="dialog" aria-modal="true" aria-labelledby="uf-url-title">
        <header><div><p class="eyebrow">Remote file library</p><h2 id="uf-url-title">Upload from URL</h2></div><button class="close" type="button" aria-label="Close">×</button></header>
        <div class="body">
          <form><input type="url" required placeholder="https://example.com/file.jpg" aria-label="File URL"><button class="primary" type="submit">Fetch & use</button></form>
          <button class="secondary" type="button">Choose from computer</button>
          <p class="status">Only the URL is saved. File bytes are fetched when you use it.</p>
          <div class="saved-head"><span>Saved URLs</span><span class="count">0 / ${MAX_URL_FILES}</span></div>
          <div class="list"></div>
        </div>
      </section>`;

    root.querySelector<HTMLButtonElement>('.close')?.addEventListener('click', () => this.close());
    root.querySelector<HTMLButtonElement>('.secondary')?.addEventListener('click', () => this.openNativePicker());
    root.querySelector<HTMLFormElement>('form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const url = root.querySelector<HTMLInputElement>('input')?.value ?? '';
      void this.fetchAndUse(url);
    });
    host.addEventListener('click', (event) => {
      const clickedPanel = event.composedPath().some(
        (node) => node instanceof Element && node.classList.contains('panel')
      );
      if (!clickedPanel) this.close();
    });
    document.documentElement.appendChild(host);
    this.host = host;
    root.querySelector<HTMLInputElement>('input')?.focus();
    void this.loadRecords();
  }

  private async loadRecords(): Promise<void> {
    try {
      const response = await this.messageService.send<{ files: UrlFileRecord[] }>({ type: 'GET_URL_FILES' });
      this.records = Array.isArray(response.files) ? response.files.slice(0, MAX_URL_FILES) : [];
      this.renderRecords();
    } catch (error) {
      this.setStatus(error instanceof Error ? error.message : 'Could not load saved URLs', true);
    }
  }

  private renderRecords(): void {
    const root = this.host?.shadowRoot;
    const list = root?.querySelector<HTMLDivElement>('.list');
    const count = root?.querySelector<HTMLElement>('.count');
    if (!list || !count) return;
    count.textContent = `${this.records.length} / ${MAX_URL_FILES}`;
    list.replaceChildren();
    if (!this.records.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No saved URLs yet.';
      list.appendChild(empty);
      return;
    }

    this.records.forEach((record) => {
      const item = document.createElement('div');
      item.className = 'item';
      const copy = document.createElement('div');
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = record.name;
      const url = document.createElement('span');
      url.className = 'url';
      url.textContent = record.url;
      copy.append(name, url);
      const use = document.createElement('button');
      use.type = 'button';
      use.className = 'use';
      use.textContent = 'Use';
      use.addEventListener('click', () => void this.fetchAndUse(record.url, record.name));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => void this.removeRecord(record.id));
      item.append(copy, use, remove);
      list.appendChild(item);
    });
  }

  private async fetchAndUse(value: string, preferredName?: string): Promise<void> {
    const input = this.input;
    const picker = this.host;
    if (!input || !picker) return;
    let url: URL;
    try {
      url = new URL(value.trim());
      if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error();
    } catch {
      this.setStatus('Enter a valid HTTP or HTTPS file URL.', true);
      return;
    }

    this.setStatus('Fetching the file…');
    try {
      const response = await fetch(url.href, { credentials: 'include' });
      if (!response.ok) throw new Error(`The URL returned HTTP ${response.status}`);
      const blob = await response.blob();
      if (this.host !== picker || this.input !== input || !input.isConnected) return;
      const name = preferredName || this.nameFromResponse(response, url);
      const file = new File([blob], name, { type: blob.type || 'application/octet-stream', lastModified: Date.now() });
      if (!this.acceptsFile(input, file)) throw new Error(`This input does not accept ${file.name}`);
      const saved = await this.messageService.send<{ files: UrlFileRecord[] }>({
        type: 'SAVE_URL_FILE',
        payload: { url: url.href, name }
      });
      this.records = saved.files;
      FileBypass.input(input, [file]);
      this.close();
    } catch (error) {
      const message = error instanceof TypeError
        ? 'The site blocked this cross-origin fetch. Try a URL that allows browser access.'
        : error instanceof Error ? error.message : 'Could not fetch this file.';
      this.setStatus(message, true);
    }
  }

  private nameFromResponse(response: Response, url: URL): string {
    const disposition = response.headers.get('content-disposition');
    const encoded = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
    const plain = disposition?.match(/filename="?([^";]+)"?/i)?.[1];
    const pathName = url.pathname.split('/').filter(Boolean).pop();
    const name = encoded ? decodeURIComponent(encoded) : plain || (pathName ? decodeURIComponent(pathName) : 'remote-file');
    return name.replace(/[<>:"/\\|?*]/g, '_');
  }

  private acceptsFile(input: HTMLInputElement, file: File): boolean {
    const rules = input.accept.split(',').map((rule) => rule.trim().toLowerCase()).filter(Boolean);
    if (!rules.length) return true;
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    return rules.some((rule) => {
      if (rule.startsWith('.')) return name.endsWith(rule);
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
  }

  private async removeRecord(id: string): Promise<void> {
    try {
      const response = await this.messageService.send<{ files: UrlFileRecord[] }>({
        type: 'DELETE_URL_FILE',
        payload: { id }
      });
      this.records = response.files;
      this.renderRecords();
    } catch (error) {
      this.setStatus(error instanceof Error ? error.message : 'Could not remove this URL', true);
    }
  }

  private openNativePicker(): void {
    const input = this.input;
    if (!input) return;
    this.nativePickerBypass.add(input);
    this.close();
    input.click();
  }

  private setStatus(message: string, error = false): void {
    const status = this.host?.shadowRoot?.querySelector<HTMLElement>('.status');
    if (!status) return;
    status.className = `status${error ? ' error' : ''}`;
    status.textContent = message;
  }

  private close(): void {
    this.host?.remove();
    this.host = null;
    this.input = null;
  }
}
