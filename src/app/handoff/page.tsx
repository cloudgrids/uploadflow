import type { Metadata } from 'next';
import { HandoffPage } from '../../components/handoff/HandoffPage';

export const metadata: Metadata = {
  title: 'UploadFlow Handoff — Pair your phone',
  description: 'Pair a phone with UploadFlow using a temporary encrypted session.'
};

export default function Page() {
  return <HandoffPage />;
}
