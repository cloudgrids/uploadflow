import { FileBypass } from './FileBypass';

export class FileChangeInterceptor {
  register(): void {
    window.addEventListener('change', this.handleChange, true);
  }

  unregister(): void {
    window.removeEventListener('change', this.handleChange, true);
  }

  private readonly handleChange = (event: Event): void => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'file') return;

    if (FileBypass.consumeProcessedInput(input)) return;
    if (FileBypass.isBypassInput(event)) return;
    if (input.dataset.ufInputPending !== 'true') return;

    // The trusted `input` event already owns this selection. Block its native
    // follow-up `change`; FileBypass dispatches a fresh change after completion.
    event.stopImmediatePropagation();
    event.preventDefault();
  };
}
