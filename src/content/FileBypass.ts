interface BypassDragEvent extends DragEvent {
  _ufBypass?: boolean;
}

export class FileBypass {
  static isBypassDrop(event: DragEvent): boolean {
    return Boolean((event as BypassDragEvent)._ufBypass);
  }

  static input(input: HTMLInputElement, files: File[]): void {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
    input.dataset.ufProcessed = 'true';
    input.dispatchEvent(new Event('change', { bubbles: true }));
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
}
