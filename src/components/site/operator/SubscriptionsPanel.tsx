'use client';

import { listSubscriptions, type OperatorSubscription } from '../../../lib/api';
import { Column, OperatorListing } from './OperatorListing';
import { onOrDash, titleCase } from './formats';

const load = listSubscriptions;

const COLUMNS: readonly Column<OperatorSubscription>[] = [
  { key: 'user', head: 'Account', cell: (row) => row.userId, wrap: true },
  { key: 'plan', head: 'Plan', cell: (row) => (row.plan ? titleCase(row.plan) : '—') },
  { key: 'status', head: 'Status', cell: (row) => titleCase(row.status) },
  { key: 'ends', head: 'Period ends', cell: (row) => onOrDash(row.currentPeriodEnd) },
  { key: 'cancelling', head: 'Cancelling', cell: (row) => (row.cancelAtPeriodEnd ? 'At period end' : '—') },
  { key: 'cancelled', head: 'Cancelled', cell: (row) => onOrDash(row.canceledAt) }
];

/**
 * Billing, which is the line support does not cross.
 *
 * No amounts anywhere, and that is not an omission. What a subscription costs is whatever the
 * billing provider's own record says, and a figure repeated here would be a second copy of it that
 * can disagree with the one the card was actually charged.
 */
export function SubscriptionsPanel() {
  return (
    <OperatorListing
      title="Subscriptions"
      note="Every subscription and where it stands. Amounts are not shown — the provider's own record is the one that was charged."
      searchHint="Search by account"
      columns={COLUMNS}
      rowKey={(row) => row.id}
      load={load}
    />
  );
}
