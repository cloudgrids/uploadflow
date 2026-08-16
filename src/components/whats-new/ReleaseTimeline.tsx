import { changeKinds, releases, type ChangeKind, type Release } from './content';

const kindChip: Record<ChangeKind, string> = {
  added: 'uf-chip-ok',
  changed: 'uf-chip-beta',
  fixed: 'uf-chip'
};

export function ReleaseTimeline() {
  return (
    <ol className="uf-rel" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {releases.map((release) => (
        <ReleaseEntry key={release.version} release={release} />
      ))}
    </ol>
  );
}

function ReleaseEntry({ release }: { release: Release }) {
  const inDevelopment = release.state === 'development';
  const grouped = (Object.keys(changeKinds) as ChangeKind[])
    .map((kind) => ({ kind, entries: release.changes.filter((change) => change.kind === kind) }))
    .filter((group) => group.entries.length > 0);

  return (
    <li className="uf-rel-item" data-current={inDevelopment}>
      <article className="uf-card uf-stack">
        <div className="uf-rel-head">
          <span className="uf-rel-ver">{release.version}</span>
          <span className={`uf-chip ${inDevelopment ? 'uf-chip-live' : 'uf-chip-ok'}`}>
            {inDevelopment ? 'In development' : 'Shipped'}
          </span>
          <span className="uf-rel-date uf-mono">{release.date}</span>
        </div>

        <h3>{release.headline}</h3>
        <p className="uf-small">{release.summary}</p>

        {grouped.map((group) => (
          <section key={group.kind} className="uf-stack-6">
            <div className="uf-change-top">
              <span className={`uf-chip ${kindChip[group.kind]}`}>{changeKinds[group.kind].label}</span>
              <span className="uf-rel-date">
                {group.entries.length} {group.entries.length === 1 ? 'change' : 'changes'}
              </span>
            </div>
            <div>
              {group.entries.map((change) => (
                <div key={change.title} className="uf-change">
                  <h4>{change.title}</h4>
                  <p>{change.copy}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </article>
    </li>
  );
}
