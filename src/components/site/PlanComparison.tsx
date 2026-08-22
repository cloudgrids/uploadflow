import { plans, type Plan, type PlanFeature, type PlanId } from './plansContent';

/**
 * Every tier side by side, so "what is different between these" can be read across a row.
 *
 * ## It states nothing the deck does not
 *
 * A comparison grid usually multiplies the claims a site makes: a cell has to be filled for every
 * feature in every tier, and each of those is a new assertion to keep true. This one adds none.
 *
 * Tiers are cumulative — `plansContent.ts` says so itself, with Platinum's "Everything in Gold" —
 * so a feature offered at a tier is offered at every tier above it. Every cell is therefore
 * *derived* from the tier its row already sits in, not authored. Nothing here can drift from the
 * deck, because there is nothing here to keep in step: change `plansContent.ts` and this follows.
 *
 * ## Two things the data needs before it is a grid
 *
 * "Everything in Gold" is a rollup line rather than a feature, and would read as nonsense as a row —
 * the grid says that structurally instead. And a `soon` entry stays `soon` in the tiers that would
 * carry it: a tick there would quietly upgrade a hedge into a promise.
 */
const ORDER: readonly PlanId[] = ['free', 'silver', 'gold', 'platinum'];

/** A line that summarises other rows rather than naming a capability. */
const ROLLUP = /^everything in /i;

interface Row {
  title: string;
  copy: string;
  /** The lowest tier that offers it; every tier above offers it too. */
  from: PlanId;
  state: PlanFeature['state'];
}

function rowsFrom(source: readonly Plan[]): Row[] {
  return source.flatMap((plan) =>
    plan.features
      .filter((feature) => !ROLLUP.test(feature.title))
      .map((feature) => ({ title: feature.title, copy: feature.copy, from: plan.id, state: feature.state }))
  );
}

function includedIn(row: Row, tier: PlanId): boolean {
  return ORDER.indexOf(tier) >= ORDER.indexOf(row.from);
}

/** Never blank: an empty cell reads as "unknown" rather than "not included". */
function Cell({ row, tier }: { row: Row; tier: PlanId }) {
  if (!includedIn(row, tier)) {
    return (
      <td className="uf-compare-cell" data-state="no">
        <span aria-hidden="true">&ndash;</span>
        <span className="uf-sr">Not included</span>
      </td>
    );
  }

  if (row.state === 'soon') {
    return (
      <td className="uf-compare-cell" data-state="soon">
        <span aria-hidden="true">Soon</span>
        <span className="uf-sr">Coming soon</span>
      </td>
    );
  }

  return (
    <td className="uf-compare-cell" data-state="yes">
      <span aria-hidden="true">&#10003;</span>
      <span className="uf-sr">Included</span>
    </td>
  );
}

export function PlanComparison() {
  const rows = rowsFrom(plans);
  const named = new Map(plans.map((plan) => [plan.id, plan.name]));

  return (
    <div className="uf-compare-wrap">
      <table className="uf-compare">
        <caption className="uf-sr">Which tier each capability starts at. Every tier includes everything in the tiers below it.</caption>
        <thead>
          <tr>
            <th scope="col">Capability</th>
            {/*
              The narrow answer. Below the width four columns need, the row still answers the
              question the page exists for — where does this start — without a sideways scroll and
              without collapsing back into one card per tier, each of which gives up the comparison.
            */}
            <th scope="col" className="uf-compare-from">
              From
            </th>
            {ORDER.map((tier) => (
              <th key={tier} scope="col" className="uf-compare-tier">
                {named.get(tier)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.title}>
              <th scope="row">
                <b>{row.title}</b>
                <span>{row.copy}</span>
              </th>
              <td className="uf-compare-from">
                {named.get(row.from)}
                {row.state === 'soon' ? <span className="uf-compare-soon"> · soon</span> : null}
              </td>
              {ORDER.map((tier) => (
                <Cell key={tier} row={row} tier={tier} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
