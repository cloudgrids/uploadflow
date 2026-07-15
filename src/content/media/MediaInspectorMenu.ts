import type { MediaElement } from './Media';
import type { MediaSourceResolver } from './MediaSourceResolver';

export type MediaDownloadHandler = (
  url: string,
  media: MediaElement,
  button: HTMLButtonElement,
  status: HTMLParagraphElement
) => void;
export type MediaSaveHandler = MediaDownloadHandler;

export class MediaInspectorMenu {
  private readonly layer: HTMLDivElement;
  private readonly sourceResolver: MediaSourceResolver;
  private readonly onDownload: MediaDownloadHandler;
  private readonly onSave: MediaSaveHandler;
  private element: HTMLDivElement | null = null;

  constructor(
    layer: HTMLDivElement,
    sourceResolver: MediaSourceResolver,
    onDownload: MediaDownloadHandler,
    onSave: MediaSaveHandler
  ) {
    this.layer = layer;
    this.sourceResolver = sourceResolver;
    this.onDownload = onDownload;
    this.onSave = onSave;
  }

  open(media: MediaElement, anchor: HTMLButtonElement): void {
    this.close();
    const url = this.sourceResolver.urlFor(media);
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

    const status = document.createElement('p');
    status.className = 'download-status';
    menu.appendChild(status);

    const actions = document.createElement('div');
    actions.className = 'actions';
    if (url) this.addUrlActions(actions, url, media, status);

    const close = this.actionButton('Close');
    close.addEventListener('click', () => this.close());
    actions.appendChild(close);
    menu.appendChild(actions);

    this.layer.appendChild(menu);
    this.element = menu;
    this.position(anchor, menu);
  }

  close(): void {
    this.element?.remove();
    this.element = null;
  }

  isHovered(): boolean {
    return Boolean(this.element?.matches(':hover'));
  }

  private addUrlActions(
    actions: HTMLDivElement,
    url: string,
    media: MediaElement,
    status: HTMLParagraphElement
  ): void {
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
    download.addEventListener('click', () => this.onDownload(url, media, download, status));
    actions.appendChild(download);

    const save = this.actionButton('Save URL');
    save.addEventListener('click', () => this.onSave(url, media, save, status));
    actions.appendChild(save);
  }

  private actionButton(label: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'action';
    button.textContent = label;
    return button;
  }

  private position(anchor: HTMLButtonElement, menu: HTMLDivElement): void {
    const buttonRect = anchor.getBoundingClientRect();
    const menuWidth = Math.min(340, window.innerWidth - 24);
    const menuHeight = menu.getBoundingClientRect().height;
    menu.style.left = `${Math.max(12, Math.min(window.innerWidth - menuWidth - 12, buttonRect.right - menuWidth))}px`;
    menu.style.top = `${Math.max(12, Math.min(window.innerHeight - menuHeight - 12, buttonRect.bottom + 8))}px`;
  }
}
