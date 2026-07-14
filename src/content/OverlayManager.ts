import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from '../App';
import type { UploadFlowSettings } from '../settings/UploadFlowSettings';
import shadowStyles from '../index.css?inline';

const OVERLAY_Z_INDEX = '2147483646';
const CONTAINED_OVERLAY_EVENTS = [
  'keydown',
  'keypress',
  'keyup',
  'beforeinput',
  'input',
  'compositionstart',
  'compositionupdate',
  'compositionend',
  'copy',
  'cut',
  'paste',
  'focusin',
  'focusout'
] as const;

export interface OverlayOptions {
  files: File[];
  config: UploadFlowSettings;
  onComplete: (modifiedFiles: File[]) => void;
  onCancel: () => void;
}

export class OverlayManager {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;

  show({ files, config, onCancel, onComplete }: OverlayOptions): void {
    this.close();

    const mountPoint = this.mount();
    this.root = createRoot(mountPoint);
    this.root.render(
      createElement(App, {
        initialFiles: files,
        initialSettings: config,
        onComplete: (modifiedFiles: File[]) => {
          onComplete(modifiedFiles);
          this.close();
        },
        onCancel: () => {
          onCancel();
          this.close();
        }
      })
    );
  }

  close(): void {
    this.root?.unmount();
    this.root = null;
    this.container?.remove();
    this.container = null;
  }

  private mount(): HTMLDivElement {
    this.container = document.createElement('div');
    this.container.id = 'uploadflow-overlay-root';
    Object.assign(this.container.style, {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      zIndex: OVERLAY_Z_INDEX,
      pointerEvents: 'auto',
      isolation: 'isolate'
    });
    document.body.appendChild(this.container);

    const shadowRoot = this.container.attachShadow({ mode: 'open' });
    const containEvent = (event: Event) => event.stopPropagation();
    CONTAINED_OVERLAY_EVENTS.forEach((eventType) => shadowRoot.addEventListener(eventType, containEvent));

    const style = document.createElement('style');
    style.textContent = shadowStyles;
    shadowRoot.appendChild(style);

    const mountPoint = document.createElement('div');
    mountPoint.className =
      'fixed inset-0 w-full min-w-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-200 antialiased overflow-hidden selection:bg-slate-950/20';
    shadowRoot.appendChild(mountPoint);
    return mountPoint;
  }
}
