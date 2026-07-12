import type { UploadFlowSettingsTab } from '../settings/UploadFlowSettings';

export function availableTools(file: File): UploadFlowSettingsTab[] {
  if (file.type.startsWith('image/')) return ['image', 'watermark'];

  const name = file.name.toLowerCase();
  const isText = file.type.startsWith('text/') || ['.json', '.csv', '.md'].some((extension) => name.endsWith(extension));
  return isText ? ['redaction'] : [];
}
