import type { Metadata } from 'next';
import { InterceptorTestPage } from '../../test/InterceptorTestPage';

export const metadata: Metadata = {
  title: 'Upload Interception Test | UploadFlow',
  description: 'Try the browser upload methods supported by UploadFlow.'
};

export default function TestPage() {
  return <InterceptorTestPage />;
}
