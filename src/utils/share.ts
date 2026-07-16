export const SHARE_URL = 'https://uploadflow.cloudgrids.tech/';
export const SHARE_TITLE = 'UploadFlow — Private Upload Toolkit';
export const SHARE_TEXT = 'Optimize and protect files privately before they reach the web.';

export async function copyShareUrl(): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(SHARE_URL);
    return;
  }

  const input = document.createElement('textarea');
  input.value = SHARE_URL;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  if (!copied) throw new Error('Copy command was rejected');
}

export async function shareUploadFlow(): Promise<'shared' | 'copied' | 'cancelled'> {
  if (!navigator.share) {
    await copyShareUrl();
    return 'copied';
  }

  try {
    await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL });
    return 'shared';
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === 'AbortError') return 'cancelled';
    throw reason;
  }
}
