import { OperatorHandoff } from '../../../../components/site/OperatorHandoff';

/**
 * A slot rather than a branch inside the account page.
 *
 * What an operator sees here is content for a different audience that happens to appear on this
 * page, and keeping it in its own tree means it cannot grow into the account page by accident —
 * the same reason the operator area's own screens are slots.
 */
export default function OperatorSlot() {
  return <OperatorHandoff />;
}
