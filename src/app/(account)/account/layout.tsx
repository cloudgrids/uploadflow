import type { ReactNode } from 'react';

/**
 * The account page, plus whatever else this account turns out to have.
 *
 * Both slots render whatever the layout does with them — that is how parallel routes work, and it
 * is why the operator slot must decide for itself whether it has anything to say rather than
 * relying on this layout to leave it out. It renders no data on the server, so there is nothing in
 * the response to withhold.
 */
export default function AccountRouteLayout({ children, operator }: { children: ReactNode; operator: ReactNode }) {
  return (
    <>
      {children}
      {operator}
    </>
  );
}
