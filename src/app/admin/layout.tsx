import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { OperatorShell } from '../../components/site/operator/OperatorShell';

export const metadata: Metadata = {
  title: 'Operations | UploadFlow',
  description: 'Operational tools for the people who run UploadFlow.',
  // Not a page for visitors, and not one to have indexed. This is tidiness, not access control —
  // the API is what refuses, and it refuses a search engine exactly as it refuses anybody else.
  robots: { index: false, follow: false }
};

/**
 * The operator area, assembled from slots rather than from conditionals.
 *
 * Each rank's tools live in their own route slot, and the shell renders the slots that rank has
 * earned. The point is that a control added to the billing tools cannot appear on a support
 * screen by being put inside the wrong branch of an `if` — there is no branch to get wrong, only a
 * folder to put the file in.
 *
 * **This is layout, not security.** All the slots are part of the same client build and anybody can
 * read them; what stops a support account seeing billing is that the API refuses the billing calls.
 * The slots keep the screens honest, not the data.
 */
export default function AdminLayout({
  children,
  people,
  billing
}: {
  children: ReactNode;
  people: ReactNode;
  billing: ReactNode;
}) {
  return (
    <OperatorShell people={people} billing={billing}>
      {children}
    </OperatorShell>
  );
}
