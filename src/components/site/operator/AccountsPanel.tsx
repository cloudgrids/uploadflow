'use client';

import { listAccounts, type OperatorAccount } from '../../../lib/api';
import { Column, OperatorListing } from './OperatorListing';
import { onOrDash } from './formats';

/**
 * Module scope on purpose: the listing takes `load` as a dependency, and a function rebuilt on
 * every render would refetch on every render.
 */
const load = listAccounts;

const COLUMNS: readonly Column<OperatorAccount>[] = [
  { key: 'email', head: 'Email', cell: (row) => row.email, wrap: true },
  { key: 'name', head: 'Name', cell: (row) => row.displayName || '—' },
  { key: 'role', head: 'Access', cell: (row) => row.globalRole },
  { key: 'verified', head: 'Verified', cell: (row) => (row.emailVerified ? 'Yes' : 'No') },
  { key: 'created', head: 'Joined', cell: (row) => onOrDash(row.createdAt) },
  { key: 'closed', head: 'Closed', cell: (row) => onOrDash(row.deletedAt) }
];

export function AccountsPanel() {
  return (
    <OperatorListing
      title="Accounts"
      note="Everyone with an account, newest first. Closed accounts are listed rather than hidden, because “this person says they cannot sign in” is usually answered by one."
      searchHint="Search by email address"
      columns={COLUMNS}
      rowKey={(row) => row.id}
      load={load}
    />
  );
}
