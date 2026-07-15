import type { MessageService } from '../services/MessageService';
import type { ExtensionConfig } from '../types/Message';
import { PAGE_INTERCEPTOR_SOURCE, type PageMediaInspectionState, type PageMediaSources } from '../types/PageInterceptor';
import { MEDIA_SELECTOR, type MediaElement, isMediaElement } from './media/Media';
import { mediaFromPointerEvent } from './media/MediaDetector';
import { MediaInspectorMenu } from './media/MediaInspectorMenu';
import { MEDIA_INSPECTOR_STYLES } from './media/MediaInspectorStyles';
import { MediaSourceResolver } from './media/MediaSourceResolver';

const INSPECTOR_Z_INDEX = '2147483647';

export class InterceptionController {
  private readonly messageService: MessageService;
  private enabled = false;
  private host: HTMLDivElement | null = null;
  private layer: HTMLDivElement | null = null;
  private menu: MediaInspectorMenu | null = null;
  private observer: MutationObserver | null = null;
  private observedRoots = new WeakSet<Node>();
  private controls = new Map<MediaElement, HTMLButtonElement>();
  private positionFrame: number | null = null;
  private activeMedia: MediaElement | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly sourceResolver = new MediaSourceResolver();
  private refreshVersion = 0;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  register(): void {
    chrome.storage.onChanged.addListener(this.handleStorageChange);
    window.addEventListener('message', this.handlePageMessage);
    window.addEventListener('pointerover', this.handlePointerOver, true);
    window.addEventListener('pointerout', this.handlePointerOut, true);
    window.addEventListener('scroll', this.handleViewportChange, true);
    window.addEventListener('resize', this.handleViewportChange);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    void this.refresh();
  }

  unregister(): void {
    chrome.storage.onChanged.removeListener(this.handleStorageChange);
    window.removeEventListener('message', this.handlePageMessage);
    window.removeEventListener('pointerover', this.handlePointerOver, true);
    window.removeEventListener('pointerout', this.handlePointerOut, true);
    window.removeEventListener('scroll', this.handleViewportChange, true);
    window.removeEventListener('resize', this.handleViewportChange);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    this.disable();
  }

  private readonly handleStorageChange = (changes: Record<string, chrome.storage.StorageChange>, areaName: string): void => {
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
    this.observer = new MutationObserver(this.handleMutations);
    this.observeRoot(document);
  }

  private disable(): void {
    this.enabled = false;
    this.updatePageMediaInspection(false);
    this.observer?.disconnect();
    this.observer = null;
    this.observedRoots = new WeakSet<Node>();
    if (this.positionFrame !== null) cancelAnimationFrame(this.positionFrame);
    this.positionFrame = null;
    this.clearHideTimer();
    this.activeMedia = null;
    this.controls.clear();
    this.menu?.close();
    this.menu = null;
    this.host?.remove();
    this.host = null;
    this.layer = null;
    this.sourceResolver.clear();
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
    if (message.source !== PAGE_INTERCEPTOR_SOURCE || message.type !== 'MEDIA_SOURCES' || !Array.isArray(message.urls)) {
      return;
    }

    const urls = message.urls.filter((url): url is string => typeof url === 'string');
    if (!urls.length) return;
    this.sourceResolver.capture(urls);
  };

  private mount(): void {
    this.host = document.createElement('div');
    this.host.id = 'uploadflow-media-inspector-root';
    Object.assign(this.host.style, {
      position: 'fixed',
      inset: '0',
      zIndex: INSPECTOR_Z_INDEX,
      pointerEvents: 'none',
      isolation: 'isolate',
      display: 'block',
      width: '100vw',
      height: '100vh'
    });

    const shadowRoot = this.host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = MEDIA_INSPECTOR_STYLES;
    shadowRoot.appendChild(style);

    this.layer = document.createElement('div');
    this.layer.className = 'layer';
    shadowRoot.appendChild(this.layer);
    this.menu = new MediaInspectorMenu(this.layer, this.sourceResolver, (url, media, button, status) => {
      void this.downloadMedia(url, media, button, status);
    });
    this.mountTarget().appendChild(this.host);
  }

  private mountTarget(): Element {
    return document.fullscreenElement ?? document.documentElement;
  }

  private ensureHostPlacement(): void {
    if (!this.host) return;
    const target = this.mountTarget();
    if (this.host.parentElement !== target) target.appendChild(this.host);
  }

  private readonly handleFullscreenChange = (): void => {
    this.ensureHostPlacement();
    this.closeMenu();
    this.schedulePositions();
  };

  private observeRoot(root: Document | ShadowRoot): void {
    if (!this.observer || this.observedRoots.has(root)) return;
    this.observedRoots.add(root);
    this.observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });
    this.scan(root);
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
    if (isMediaElement(root)) this.addControl(root);
    if (root instanceof Element || root instanceof Document || root instanceof ShadowRoot) {
      root.querySelectorAll<MediaElement>(MEDIA_SELECTOR).forEach((media) => this.addControl(media));
    }
    this.scanOpenShadowRoots(root);
    this.schedulePositions();
  }

  private scanOpenShadowRoots(root: Node): void {
    const elements: Element[] = [];
    if (root instanceof Element) elements.push(root);
    if (root instanceof Element || root instanceof Document || root instanceof ShadowRoot) {
      elements.push(...Array.from(root.querySelectorAll<Element>('*')));
    }

    elements.forEach((element) => {
      if (element.shadowRoot) this.observeRoot(element.shadowRoot);
    });
  }

  private addControl(media: MediaElement): void {
    if (this.controls.has(media) || media.closest('#uploadflow-overlay-root')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-action';
    button.textContent = '↓';
    button.title = 'Open UploadFlow media options';
    button.setAttribute('aria-label', 'Open media download options');
    button.addEventListener(
      'pointerdown',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.openMenu(media, button);
      },
      true
    );
    button.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Keyboard activation does not dispatch pointerdown.
        if (event.detail === 0) this.openMenu(media, button);
      },
      true
    );
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
      (media.contains(related) || (related instanceof Element && related.contains(media)) || this.host?.contains(related))
    ) {
      return;
    }
    this.scheduleHide(media);
  };

  private mediaFromPointerEvent(event: PointerEvent): MediaElement | null {
    return mediaFromPointerEvent(event, (media) => {
      this.addControl(media);
      return this.controls.has(media);
    });
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
      if (media.matches(':hover') || this.menu?.isHovered()) return;
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
    this.ensureHostPlacement();
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
    this.menu?.open(media, button);
  }

  private closeMenu(): void {
    this.menu?.close();
  }

  private async downloadMedia(
    url: string,
    media: MediaElement,
    button: HTMLButtonElement,
    status: HTMLParagraphElement
  ): Promise<void> {
    const originalLabel = button.textContent ?? 'Download';
    button.disabled = true;
    button.textContent = 'Downloading…';
    status.className = 'download-status';
    status.textContent = 'Asking Chrome to start the download…';

    try {
      const response = await this.messageService.send<{ success: boolean; id?: number; error?: string }>({
        type: 'START_DOWNLOAD',
        payload: { url, filename: this.sourceResolver.downloadName(url, media) }
      });
      if (!response.success) throw new Error(response.error ?? 'Chrome could not start the download');
      button.textContent = 'Added to downloads';
      status.className = 'download-status success';
      status.textContent = 'Chrome is managing this download.';
    } catch (error) {
      console.error('[UploadFlow] Unable to start Chrome download:', error);
      button.textContent = 'Download failed';
      const message = error instanceof Error ? error.message : 'Chrome could not start this download.';
      button.title = message;
      status.className = 'download-status error';
      status.textContent = message;
    } finally {
      button.disabled = false;
      setTimeout(() => {
        if (!button.isConnected) return;
        button.textContent = originalLabel;
        button.title = '';
      }, 2_000);
    }
  }
}
