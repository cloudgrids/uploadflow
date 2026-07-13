function canvasToFile(canvas: HTMLCanvasElement, fileName: string, format: string, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed!'));
          return;
        }

        resolve(new File([blob], fileName, { type: format, lastModified: Date.now() }));
      },
      format,
      quality
    );
  });
}

export async function compressImage(
  file: File,
  quality: number,
  format: string,
  targetWidth?: number,
  targetHeight?: number
): Promise<File> {
  let image: ImageBitmap;

  try {
    image = await createImageBitmap(file);
  } catch {
    throw new Error('Failed to load image!');
  }

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context!');

    let width = image.width;
    let height = image.height;

    if (targetWidth && targetHeight) {
      width = targetWidth;
      height = targetHeight;
    } else if (targetWidth) {
      const ratio = targetWidth / width;
      width = targetWidth;
      height = Math.round(height * ratio);
    } else if (targetHeight) {
      const ratio = targetHeight / height;
      height = targetHeight;
      width = Math.round(width * ratio);
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    let extension = 'jpg';
    if (format === 'image/png') extension = 'png';
    else if (format === 'image/webp') extension = 'webp';

    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    return await canvasToFile(canvas, `${baseName}_optimized.${extension}`, format, quality);
  } finally {
    image.close();
  }
}

export async function compressImageAtScale(file: File, quality: number, format: string, scalePercent: number): Promise<File> {
  let image: ImageBitmap;

  try {
    image = await createImageBitmap(file);
  } catch {
    throw new Error('Failed to load image');
  }

  const width = Math.round(image.width * (scalePercent / 100));
  const height = Math.round(image.height * (scalePercent / 100));
  image.close();

  return compressImage(file, quality, format, width, height);
}
