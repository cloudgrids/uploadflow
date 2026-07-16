import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Toast } from '../components/Toast';

const TOASTER_Z_INDEX = '2147483647';

export class Toaster {
  private root: Root | null = null;
  private container: HTMLDivElement | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, tone: 'success' | 'error' | 'warning' | 'info' = 'success', duration = 3000): void {
    this.close();

    this.container = document.createElement('div');
    this.container.dataset.uploadflowToaster = 'true';
    Object.assign(this.container.style, {
      position: 'fixed',
      inset: '0',
      zIndex: TOASTER_Z_INDEX,
      pointerEvents: 'none',
      isolation: 'isolate'
    });

    const overlayRoot = document.getElementById('uploadflow-overlay-root')?.shadowRoot;
    (overlayRoot ?? document.body).appendChild(this.container);

    this.root = createRoot(this.container);
    this.root.render(
      createElement(Toast, {
        message,
        tone
      })
    );

    this.closeTimer = setTimeout(() => this.close(), Math.max(0, duration));
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  sw(message: string, showSuccess: boolean, duration = 3000): void {
    this.show(message, showSuccess ? 'success' : 'warning', duration);
  }

  error(message: string, duration = 3000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 3000): void {
    this.show(message, 'warning', duration);
  }

  close(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.root?.unmount();
    this.root = null;
    this.container?.remove();
    this.container = null;
  }
}

export const toast = new Toaster();
