import type { WatermarkSettings } from '../settings/UploadFlowSettings';

const setPosition = (position: string | { x: number; y: number }, canvas: HTMLCanvasElement, padding: number) => {
  let x = canvas.width / 2;
  let y = canvas.height / 2;

  if (typeof position === 'string') {
    switch (position) {
      case 'top-left':
        x = padding;
        y = padding;
        break;
      case 'top-right':
        x = canvas.width - padding;
        y = padding;
        break;
      case 'bottom-left':
        x = padding;
        y = canvas.height - padding;
        break;
      case 'bottom-right':
        x = canvas.width - padding;
        y = canvas.height - padding;
        break;
      case 'center':
      default:
        break;
    }
  } else if (typeof position === 'object') {
    x = position.x;
    y = position.y;
  }

  return { x, y };
};

const getBlockTop = (
  position: WatermarkSettings['position'],
  anchorY: number,
  totalHeight: number,
  textBaseline: CanvasTextBaseline
): number => {
  if (typeof position === 'string') {
    if (position.startsWith('top')) return anchorY;
    if (position.startsWith('bottom')) return anchorY - totalHeight;
    return anchorY - totalHeight / 2;
  }

  if (textBaseline === 'top' || textBaseline === 'hanging') return anchorY;
  if (textBaseline === 'bottom' || textBaseline === 'ideographic' || textBaseline === 'alphabetic') {
    return anchorY - totalHeight;
  }
  return anchorY - totalHeight / 2;
};

const drawCanvas = (img: HTMLImageElement, options: WatermarkSettings) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  ctx.font = `${options.fontSize}px ${options.font}`;
  ctx.fillStyle = options.fillStyle;
  ctx.textAlign = options.textAlign;
  ctx.textBaseline = 'top';

  const padding = Math.max(12, Math.round(options.fontSize * 0.75));
  const { x, y } = setPosition(options.position, canvas, padding);

  if (typeof options.position === 'string') {
    ctx.textAlign = options.position.endsWith('left') ? 'left' : options.position.endsWith('right') ? 'right' : options.textAlign;
  }

  const lines = options.text.replace(/\r\n?/g, '\n').split('\n');
  const lineHeight = options.fontSize * 1.2;
  const totalHeight = options.fontSize + Math.max(0, lines.length - 1) * lineHeight;
  let lineY = getBlockTop(options.position, y, totalHeight, options.textBaseline);

  for (const line of lines) {
    ctx.fillText(line, x, lineY);
    lineY += lineHeight;
  }

  return canvas;
};

export const watermark = (file: File, options: WatermarkSettings): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      let canvas: HTMLCanvasElement;
      try {
        canvas = drawCanvas(img, options);
      } catch (error) {
        reject(error);
        return;
      }

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas toBlob failed!'));

        const watermarkedFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
        resolve(watermarkedFile);
      }, file.type);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
  });
};
