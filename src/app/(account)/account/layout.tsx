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
      {/* The same horizontal wrap the page's own sections use. Without it the slot sat flush to the
          column's edges while everything above it was inset, so an operator saw one card wider than
          the other and no reason for it. `:empty` hides the section for everybody else, since a slot
          that renders nothing should not leave padding behind. */}
      <section className="uf-wrap uf-account-slot">{operator}</section>
    </>
  );
}
