'use client';

import { listAccounts, type OperatorAccount } from '../../../lib/api';
import { Column, OperatorListing } from './OperatorListing';
import { onOrDash, titleCase } from './formats';
import { StateChip } from '../StateChip';

/**
 * Module scope on purpose: the listing takes `load` as a dependency, and a function rebuilt on
 * every render would refetch on every render.
 */
const load = listAccounts;

const COLUMNS: readonly Column<OperatorAccount>[] = [
  { key: 'email', head: 'Email', cell: (row) => row.email, wrap: true },
  { key: 'name', head: 'Name', cell: (row) => row.displayName || '—' },
  { key: 'role', head: 'Access', cell: (row) => titleCase(row.globalRole) },
  {
    key: 'state',
    head: 'State',
    // Two facts in one column, because an operator is asking one question — can this person get in?
    // A closed account answers it, and whether the address was ever confirmed answers it otherwise.
    cell: (row) =>
      row.deletedAt ? (
        <StateChip label={`Closed ${onOrDash(row.deletedAt)}`} tone="stopped" />
      ) : row.emailVerified ? (
        <StateChip label="Verified" tone="live" />
      ) : (
        <StateChip label="Unverified" tone="waiting" />
      )
  },
  { key: 'created', head: 'Joined', cell: (row) => onOrDash(row.createdAt) }
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
