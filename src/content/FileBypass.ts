interface BypassDragEvent extends DragEvent {
  _ufBypass?: boolean;
}

interface BypassClipboardEvent extends ClipboardEvent {
  _ufBypass?: boolean;
}

interface BypassInputEvent extends Event {
  _ufBypass?: boolean;
}

export class FileBypass {
  static isBypassDrop(event: DragEvent): boolean {
    return Boolean((event as BypassDragEvent)._ufBypass);
  }

  static isBypassPaste(event: ClipboardEvent): boolean {
    return Boolean((event as BypassClipboardEvent)._ufBypass);
  }

  static isBypassInput(event: Event): boolean {
    return Boolean((event as BypassInputEvent)._ufBypass);
  }

  static consumeProcessedInput(input: HTMLInputElement): boolean {
    const remainingEvents = Number(input.dataset.ufProcessed || 0);
    if (remainingEvents <= 0) return false;

    if (remainingEvents === 1) delete input.dataset.ufProcessed;
    else input.dataset.ufProcessed = String(remainingEvents - 1);
    return true;
  }

  static input(input: HTMLInputElement, files: File[]): void {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
    input.dataset.ufProcessed = '2';

    for (const type of ['input', 'change']) {
      const event = new Event(type, { bubbles: true }) as BypassInputEvent;
      event._ufBypass = true;
      input.dispatchEvent(event);
    }
  }

  static drop(originalEvent: DragEvent, files: File[], target: EventTarget): void {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));

    const event = new DragEvent('drop', {
      bubbles: originalEvent.bubbles,
      cancelable: originalEvent.cancelable,
      dataTransfer
    }) as BypassDragEvent;

    event._ufBypass = true;
    target.dispatchEvent(event);
  }

  static paste(originalEvent: ClipboardEvent, files: File[], target: EventTarget): void {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));

    const event = new ClipboardEvent('paste', {
      bubbles: originalEvent.bubbles,
      cancelable: originalEvent.cancelable,
      clipboardData: dataTransfer
    }) as BypassClipboardEvent;

    event._ufBypass = true;
    target.dispatchEvent(event);
  }
}
