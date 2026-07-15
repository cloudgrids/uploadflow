import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import {
  PAGE_INTERCEPTOR_SOURCE,
  type PageMediaInspectionState,
  type PageMediaSources
} from '../types/PageInterceptor';

type MediaElement = HTMLImageElement | HTMLVideoElement | HTMLAudioElement;

const MEDIA_SELECTOR = 'img, video, audio';
const INSPECTOR_Z_INDEX = '2147483645';

export class InterceptionController {
  private readonly messageService: MessageService;
  private enabled = false;
  private host: HTMLDivElement | null = null;
  private layer: HTMLDivElement | null = null;
  private menu: HTMLDivElement | null = null;
  private observer: MutationObserver | null = null;
  private controls = new Map<MediaElement, HTMLButtonElement>();
  private positionFrame: number | null = null;
  private activeMedia: MediaElement | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private capturedMediaSources: string[][] = [];
  private refreshVersion = 0;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  register(): void {
    chrome.storage.onChanged.addListener(this.handleStorageChange);
    window.addEventListener('message', this.handlePageMessage);
    document.addEventListener('pointerover', this.handlePointerOver, true);
    document.addEventListener('pointerout', this.handlePointerOut, true);
    window.addEventListener('scroll', this.handleViewportChange, true);
    window.addEventListener('resize', this.handleViewportChange);
    void this.refresh();
  }

  unregister(): void {
    chrome.storage.onChanged.removeListener(this.handleStorageChange);
    window.removeEventListener('message', this.handlePageMessage);
    document.removeEventListener('pointerover', this.handlePointerOver, true);
    document.removeEventListener('pointerout', this.handlePointerOut, true);
    window.removeEventListener('scroll', this.handleViewportChange, true);
    window.removeEventListener('resize', this.handleViewportChange);
    this.disable();
  }

  private readonly handleStorageChange = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string
  ): void => {
    if (areaName !== 'local' || (!('settings' in changes) && !('isEnabled' in changes))) return;

    const nextSettings = changes.settings?.newValue as ExtensionConfig['settings'] | undefined;
    const inspectDisabled = nextSettings?.generalSettings?.enableInspectMode === false;
    const extensionDisabled = changes.isEnabled?.newValue === false;

    if (inspectDisabled || extensionDisabled) {
      this.refreshVersion += 1;
      this.disable();
      return;
    }

    void this.refresh();
  };

  private async refresh(): Promise<void> {
    const version = ++this.refreshVersion;
    try {
      const config = await this.messageService.send<ExtensionConfig>({ type: 'GET_CONFIG' });
      if (version !== this.refreshVersion) return;
      const shouldEnable = (config.isEnabled ?? true) && Boolean(config.settings?.generalSettings?.enableInspectMode);
      if (shouldEnable) this.enable();
      else this.disable();
    } catch {
      if (version !== this.refreshVersion) return;
      this.disable();
    }
  }

  private enable(): void {
    if (this.enabled) {
      this.scan(document);
      return;
    }

    this.enabled = true;
    this.updatePageMediaInspection(true);
    this.mount();
    this.scan(document);
    this.observer = new MutationObserver(this.handleMutations);
    this.observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });
  }

  private disable(): void {
    this.enabled = false;
    this.updatePageMediaInspection(false);
    this.observer?.disconnect();
    this.observer = null;
    if (this.positionFrame !== null) cancelAnimationFrame(this.positionFrame);
    this.positionFrame = null;
    this.clearHideTimer();
    this.activeMedia = null;
    this.controls.clear();
    this.menu = null;
    this.host?.remove();
    this.host = null;
    this.layer = null;
    this.capturedMediaSources = [];
  }

  private updatePageMediaInspection(enabled: boolean): void {
    const state: PageMediaInspectionState = {
      source: PAGE_INTERCEPTOR_SOURCE,
      type: 'MEDIA_INSPECTION_STATE',
      enabled
    };
    window.postMessage(state, '*');
  }

  private readonly handlePageMessage = (event: MessageEvent<unknown>): void => {
    if (event.source !== window || !event.data || typeof event.data !== 'object') return;
    const message = event.data as Partial<PageMediaSources>;
    if (
      message.source !== PAGE_INTERCEPTOR_SOURCE ||
      message.type !== 'MEDIA_SOURCES' ||
      !Array.isArray(message.urls)
    ) {
      return;
    }

    const urls = message.urls.filter((url): url is string => typeof url === 'string');
    if (!urls.length) return;
    this.capturedMediaSources.push(urls);
    this.capturedMediaSources = this.capturedMediaSources.slice(-20);
  };

  private mount(): void {
    this.host = document.createElement('div');
    this.host.id = 'uploadflow-media-inspector-root';
    Object.assign(this.host.style, {
      position: 'fixed',
      inset: '0',
      zIndex: INSPECTOR_Z_INDEX,
      pointerEvents: 'none',
      isolation: 'isolate'
    });

    const shadowRoot = this.host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; }
      .layer { position: fixed; inset: 0; pointer-events: none; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      .media-action { position: fixed; width: 28px; height: 28px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.22); border-radius: 8px; background: #171717; color: #fff; box-shadow: 0 4px 18px rgba(0,0,0,.32); cursor: pointer; visibility: hidden; opacity: 0; pointer-events: none; font-size: 16px; font-weight: 800; line-height: 1; transition: opacity .12s ease, transform .15s ease, background .15s ease; }
      .media-action.visible { visibility: visible; opacity: 1; pointer-events: auto; }
      .media-action:hover { transform: translateY(-1px); background: #292929; }
      .media-action:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
      .menu { position: fixed; width: min(340px, calc(100vw - 24px)); padding: 12px; border: 1px solid rgba(255,255,255,.14); border-radius: 12px; background: #171717; color: #fff; box-shadow: 0 18px 50px rgba(0,0,0,.42); pointer-events: auto; }
      .menu-title { margin: 0; font-size: 11px; font-weight: 850; font-style: italic; text-transform: uppercase; letter-spacing: -.01em; }
      .url { margin-top: 8px; padding: 8px; border-radius: 7px; background: rgba(255,255,255,.07); color: #a3a3a3; font: 10px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; max-height: 76px; overflow: auto; }
      .actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
      .action { display: inline-flex; align-items: center; justify-content: center; min-height: 30px; padding: 0 10px; border: 1px solid rgba(255,255,255,.14); border-radius: 7px; background: rgba(255,255,255,.07); color: #fff; text-decoration: none; cursor: pointer; font: 700 10px/1 Inter, ui-sans-serif, system-ui, sans-serif; }
      .action:hover { background: rgba(255,255,255,.14); }
      .action.primary { border-color: #fff; background: #fff; color: #171717; }
      .unavailable { color: #fbbf24; }
    `;
    shadowRoot.appendChild(style);

    this.layer = document.createElement('div');
    this.layer.className = 'layer';
    shadowRoot.appendChild(this.layer);
    document.documentElement.appendChild(this.host);
  }

  private readonly handleMutations = (mutations: MutationRecord[]): void => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        this.scan(mutation.target);
        continue;
      }
      mutation.addedNodes.forEach((node) => this.scan(node));
    }

    for (const [media, button] of this.controls) {
      if (!media.isConnected) {
        if (media === this.activeMedia) this.clearActiveMedia();
        button.remove();
        this.controls.delete(media);
      }
    }
    this.schedulePositions();
  };

  private scan(root: Node): void {
    if (!this.enabled || !this.layer) return;
    if (this.isMedia(root)) this.addControl(root);
    if (root instanceof Element || root instanceof Document) {
      root.querySelectorAll<MediaElement>(MEDIA_SELECTOR).forEach((media) => this.addControl(media));
    }
    this.schedulePositions();
  }

  private addControl(media: MediaElement): void {
    if (this.controls.has(media) || media.closest('#uploadflow-overlay-root')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-action';
    button.textContent = '↓';
    button.title = 'Open UploadFlow media options';
    button.setAttribute('aria-label', 'Open media download options');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.openMenu(media, button);
    });
    button.addEventListener('pointerenter', () => this.clearHideTimer());
    button.addEventListener('pointerleave', () => this.scheduleHide(media));
    this.layer?.appendChild(button);
    this.controls.set(media, button);
  }

  private readonly schedulePositions = (): void => {
    if (this.positionFrame !== null) return;
    this.positionFrame = requestAnimationFrame(() => {
      this.positionFrame = null;
      this.updatePositions();
    });
  };

  private readonly handleViewportChange = (): void => {
    this.clearActiveMedia();
    this.closeMenu();
    this.schedulePositions();
  };

  private readonly handlePointerOver = (event: PointerEvent): void => {
    const media = this.mediaFromPointerEvent(event);
    if (!media) return;
    this.showForMedia(media);
  };

  private readonly handlePointerOut = (event: PointerEvent): void => {
    const media = this.mediaFromPointerEvent(event);
    if (!media || media !== this.activeMedia) return;

    const related = event.relatedTarget;
    if (
      related instanceof Node &&
      (media.contains(related) ||
        (related instanceof Element && related.contains(media)) ||
        this.host?.contains(related))
    ) {
      return;
    }
    this.scheduleHide(media);
  };

  private mediaFromPointerEvent(event: PointerEvent): MediaElement | null {
    const target = event.target;
    if (!(target instanceof Element)) return null;

    const directMedia = target.closest<MediaElement>(MEDIA_SELECTOR);
    if (directMedia && this.controls.has(directMedia)) return directMedia;

    // Some sites draw their hover/click surface with a wrapper's ::after pseudo
    // element. The wrapper becomes the event target even though an image or video
    // is visibly underneath it, so inspect its media descendants at the pointer.
    let container: Element | null = target;
    for (let depth = 0; container && depth < 5; depth += 1, container = container.parentElement) {
      if (container === document.body || container === document.documentElement) break;

      const media = Array.from(container.querySelectorAll<MediaElement>(MEDIA_SELECTOR))
        .reverse()
        .find((candidate) => this.controls.has(candidate) && this.containsPoint(candidate, event.clientX, event.clientY));
      if (media) return media;
    }

    return null;
  }

  private containsPoint(media: MediaElement, x: number, y: number): boolean {
    const rect = media.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  private showForMedia(media: MediaElement): void {
    this.clearHideTimer();
    if (this.activeMedia !== media) {
      this.closeMenu();
      this.clearActiveMedia();
    }
    this.activeMedia = media;
    this.controls.get(media)?.classList.add('visible');
    this.schedulePositions();
  }

  private scheduleHide(media: MediaElement): void {
    this.clearHideTimer();
    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      if (media.matches(':hover') || this.menu?.matches(':hover')) return;
      this.clearActiveMedia();
    }, 100);
  }

  private clearHideTimer(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = null;
  }

  private clearActiveMedia(): void {
    if (this.activeMedia) this.controls.get(this.activeMedia)?.classList.remove('visible');
    this.activeMedia = null;
  }

  private updatePositions(): void {
    for (const [media, button] of this.controls) {
      const rect = media.getBoundingClientRect();
      const visible =
        media.isConnected &&
        rect.width >= 32 &&
        rect.height >= 24 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth;

      if (media !== this.activeMedia) {
        button.classList.remove('visible');
        continue;
      }
      if (!visible) {
        this.clearActiveMedia();
        this.closeMenu();
        continue;
      }
      button.style.top = `${Math.max(6, rect.top + 8)}px`;
      button.style.left = `${Math.min(window.innerWidth - 34, Math.max(6, rect.right - 36))}px`;
    }
  }

  private openMenu(media: MediaElement, button: HTMLButtonElement): void {
    this.menu?.remove();
    if (!this.layer) return;

    const url = this.mediaUrl(media);
    const menu = document.createElement('div');
    menu.className = 'menu';

    const title = document.createElement('p');
    title.className = 'menu-title';
    title.textContent = `${media.tagName.toLowerCase()} source`;
    menu.appendChild(title);

    const urlView = document.createElement('div');
    urlView.className = `url${url ? '' : ' unavailable'}`;
    urlView.textContent = url || 'No downloadable URL is currently available for this media.';
    menu.appendChild(urlView);

    const actions = document.createElement('div');
    actions.className = 'actions';

    if (url) {
      const copy = this.actionButton('Copy URL');
      copy.addEventListener('click', () => {
        void navigator.clipboard.writeText(url).then(() => {
          copy.textContent = 'Copied';
        });
      });
      actions.appendChild(copy);

      const open = document.createElement('a');
      open.className = 'action';
      open.href = url;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.textContent = 'Open URL';
      actions.appendChild(open);

      const download = this.actionButton('Download');
      download.classList.add('primary');
      download.addEventListener('click', () => {
        void this.downloadMedia(url, media, download);
      });
      actions.appendChild(download);
    }

    const close = this.actionButton('Close');
    close.addEventListener('click', () => this.closeMenu());
    actions.appendChild(close);
    menu.appendChild(actions);

    this.layer.appendChild(menu);
    this.menu = menu;

    const buttonRect = button.getBoundingClientRect();
    const menuWidth = Math.min(340, window.innerWidth - 24);
    menu.style.left = `${Math.max(12, Math.min(window.innerWidth - menuWidth - 12, buttonRect.right - menuWidth))}px`;
    menu.style.top = `${Math.min(window.innerHeight - 190, buttonRect.bottom + 8)}px`;
  }

  private closeMenu(): void {
    this.menu?.remove();
    this.menu = null;
  }

  private actionButton(label: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'action';
    button.textContent = label;
    return button;
  }

  private async downloadMedia(
    url: string,
    media: MediaElement,
    button: HTMLButtonElement
  ): Promise<void> {
    const originalLabel = button.textContent ?? 'Download';
    button.disabled = true;
    button.textContent = 'Downloading…';

    try {
      const response = await this.messageService.send<{ success: boolean; id?: number; error?: string }>({
        type: 'START_DOWNLOAD',
        payload: { url, filename: this.downloadName(url, media) }
      });
      if (!response.success) throw new Error(response.error ?? 'Chrome could not start the download');
      button.textContent = 'Added to downloads';
    } catch (error) {
      console.error('[UploadFlow] Unable to start Chrome download:', error);
      button.textContent = 'Download failed';
      button.title = 'Chrome could not start this download.';
    } finally {
      button.disabled = false;
      setTimeout(() => {
        if (!button.isConnected) return;
        button.textContent = originalLabel;
        button.title = '';
      }, 2_000);
    }
  }

  private mediaUrl(media: MediaElement): string | null {
    const raw =
      media.currentSrc ||
      media.getAttribute('src') ||
      media.querySelector<HTMLSourceElement>('source[src]')?.src ||
      (media instanceof HTMLImageElement ? media.src : '');
    if (!raw) return null;
    if (raw.startsWith('blob:') && media instanceof HTMLVideoElement) {
      return this.capturedSourceFor(media);
    }
    try {
      return new URL(raw, document.baseURI).href;
    } catch {
      return raw;
    }
  }

  private capturedSourceFor(media: HTMLVideoElement): string | null {
    const posterIds = this.mediaIds(media.poster);
    let bestUrl: string | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    this.capturedMediaSources.forEach((batch, batchIndex) => {
      batch.forEach((url) => {
        const isDirectVideo = /\.(mp4|webm)(?:\?|$)/i.test(url);
        const sharedId = this.mediaIds(url).some((id) => posterIds.includes(id));
        const dimensions = url.match(/\/(\d{2,4})x(\d{2,4})\//);
        const pixels = dimensions ? Number(dimensions[1]) * Number(dimensions[2]) : 0;
        const score = (sharedId ? 1_000_000_000 : 0) + (isDirectVideo ? 10_000_000 : 0) + pixels + batchIndex;
        if (score > bestScore) {
          bestScore = score;
          bestUrl = url;
        }
      });
    });

    return bestUrl;
  }

  private mediaIds(url: string): string[] {
    return url.match(/\d{6,}/g) ?? [];
  }

  private downloadName(url: string, media: MediaElement): string {
    try {
      const name = new URL(url).pathname.split('/').filter(Boolean).pop();
      if (name) {
        const decoded = decodeURIComponent(name);
        const safeName = Array.from(decoded.replace(/[<>:"/\\|?*]/g, '_'))
          .map((character) => (character.charCodeAt(0) < 32 ? '_' : character))
          .join('')
          .replace(/^\.+/, '');
        if (safeName) return safeName;
      }
    } catch {
      // Fall back to a stable generic filename below.
    }
    return `uploadflow-${media.tagName.toLowerCase()}`;
  }

  private isMedia(node: Node): node is MediaElement {
    return node instanceof HTMLImageElement || node instanceof HTMLVideoElement || node instanceof HTMLAudioElement;
  }
}
