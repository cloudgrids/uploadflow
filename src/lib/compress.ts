export function compressImage(file: File, quality: number, format: string, targetWidth?: number, targetHeight?: number): Promise<File> {
  return new Promise((res, rej) => {
    const img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return rej(new Error('Could not get canvas context!'));

      let width = img.naturalWidth;
      let height = img.naturalHeight;

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

      ctx.drawImage(img, 0, 0, width, height);

      let extension = 'jpg';
      if (format === 'image/png') extension = 'png';
      else if (format === 'image/webp') extension = 'webp';

      const filename = file.name.substring(0, file.name.lastIndexOf('.'));
      const outputFileName = `${filename}_optimized.${extension}`;

      canvas.toBlob(
        (blob) => {
          if (!blob) return rej(new Error('Canvas toBlob failed!'));

          const compressedFile = new File([blob], outputFileName, { type: format, lastModified: Date.now() });
          res(compressedFile);
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      rej(new Error('Failed to load image!'));
    };
  });
}

export function compressImageAtScale(file: File, quality: number, format: string, scalePercent: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      const width = Math.round(image.naturalWidth * (scalePercent / 100));
      const height = Math.round(image.naturalHeight * (scalePercent / 100));
      void compressImage(file, quality, format, width, height).then(resolve).catch(reject);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    image.src = url;
  });
}
