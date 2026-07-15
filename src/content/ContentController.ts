import type { DragDropInterceptor } from './DragDropInterceptor';
import type { FileChangeInterceptor } from './FileChangeInterceptor';
import type { FileInputInterceptor } from './FileInputInterceptor';
import type { InterceptionState } from './InterceptionState';
import type { InterceptionController } from './InterceptionController';
import type { PageApiInterceptor } from './PageApiInterceptor';
import type { PasteInterceptor } from './PasteInterceptor';
import type { UrlFilePicker } from './UrlFilePicker';

export class ContentController {
  private invalidated = false;
  private readonly interceptionState: InterceptionState;
  private readonly inputInterceptor: FileInputInterceptor;
  private readonly changeInterceptor: FileChangeInterceptor;
  private readonly dropInterceptor: DragDropInterceptor;
  private readonly pasteInterceptor: PasteInterceptor;
  private readonly pageApiInterceptor: PageApiInterceptor;
  private readonly interceptionController: InterceptionController;
  private readonly urlFilePicker: UrlFilePicker;

  constructor(
    interceptionState: InterceptionState,
    inputInterceptor: FileInputInterceptor,
    changeInterceptor: FileChangeInterceptor,
    dropInterceptor: DragDropInterceptor,
    pasteInterceptor: PasteInterceptor,
    pageApiInterceptor: PageApiInterceptor,
    interceptionController: InterceptionController,
    urlFilePicker: UrlFilePicker
  ) {
    this.interceptionState = interceptionState;
    this.inputInterceptor = inputInterceptor;
    this.changeInterceptor = changeInterceptor;
    this.dropInterceptor = dropInterceptor;
    this.pasteInterceptor = pasteInterceptor;
    this.pageApiInterceptor = pageApiInterceptor;
    this.interceptionController = interceptionController;
    this.urlFilePicker = urlFilePicker;
  }

  initialize(): void {
    this.interceptionState.register();
    this.pageApiInterceptor.register();
    this.inputInterceptor.register();
    this.changeInterceptor.register();
    this.dropInterceptor.register();
    this.pasteInterceptor.register();
    this.interceptionController.register();
    this.urlFilePicker.register();
  }

  invalidate(): void {
    if (this.invalidated) return;
    this.invalidated = true;

    [
      () => this.urlFilePicker.unregister(),
      () => this.interceptionController.unregister(),
      () => this.pageApiInterceptor.unregister(),
      () => this.pasteInterceptor.unregister(),
      () => this.dropInterceptor.unregister(),
      () => this.changeInterceptor.unregister(),
      () => this.inputInterceptor.unregister(),
      () => this.interceptionState.unregister()
    ].forEach((unregister) => {
      try {
        unregister();
      } catch {
        // Extension APIs may already be unavailable; continue removing DOM listeners.
      }
    });

    this.showRefreshNotice();
  }

  private showRefreshNotice(): void {
    if (document.getElementById('uploadflow-refresh-notice')) return;
    const host = document.createElement('div');
    host.id = 'uploadflow-refresh-notice';
    Object.assign(host.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: '2147483647'
    });
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        .notice { width: min(360px, calc(100vw - 32px)); padding: 14px; border: 1px solid rgba(255,255,255,.16); border-radius: 12px; background: #171717; color: #fff; box-shadow: 0 16px 44px rgba(0,0,0,.38); font: 12px/1.45 Inter, ui-sans-serif, system-ui, sans-serif; }
        strong { display: block; margin-bottom: 4px; font-size: 13px; }
        p { margin: 0; color: #a3a3a3; }
        button { width: 100%; height: 34px; margin-top: 10px; border: 0; border-radius: 8px; background: #fff; color: #171717; cursor: pointer; font: 800 11px/1 Inter, ui-sans-serif, system-ui, sans-serif; }
      </style>
      <div class="notice" role="alert"><strong>UploadFlow was reloaded</strong><p>Refresh this page to reconnect the extension.</p><button type="button">Refresh page</button></div>
    `;
    root.querySelector('button')?.addEventListener('click', () => window.location.reload());
    document.documentElement.appendChild(host);
  }
}
