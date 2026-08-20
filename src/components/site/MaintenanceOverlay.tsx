import type { ReactNode } from 'react';

/**
 * Covers a region of the page that is on display but not yet operable.
 *
 * The plan surfaces are the case this exists for: the tiers and prices are real and worth showing,
 * but subscribing is not configured, so every control underneath would fail or do nothing.
 *
 * The content stays rendered rather than being swapped for a placeholder, because a visitor asking
 * "what does this cost" still deserves an answer while the checkout behind it is being wired up.
 *
 * `inert` is applied server-side here, which is the opposite of the rule the plan deck follows. The
 * deck must not be inert before hydration, because without JavaScript there would be no way to swipe
 * a hidden card back into view. This region has no such recovery: the controls are non-functional in
 * every case, JavaScript or not, so making them unreachable in the served HTML is the honest state
 * rather than a degradation. `inert` also removes the subtree from the accessibility tree and takes
 * its focusable children out of the tab order, which is why there is no separate `aria-hidden` or
 * `tabIndex` handling — one attribute covers all three.
 */
export function MaintenanceOverlay({
  title,
  children,
  note
}: {
  title: string;
  children: ReactNode;
  /** One line under the title. Say when it returns if that is known, not that it is "temporary". */
  note: string;
}) {
  return (
    <div className="uf-maint">
      <div className="uf-maint-body" inert>
        {children}
      </div>
      <div className="uf-maint-veil" aria-hidden="true" />
      <div className="uf-maint-panel" role="status">
        <span className="uf-chip uf-chip-beta">Maintenance</span>
        <h3 className="uf-maint-title">{title}</h3>
        <p className="uf-small">{note}</p>
      </div>
    </div>
  );
}
