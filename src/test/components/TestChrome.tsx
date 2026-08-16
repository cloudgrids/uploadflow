import { TEST_METHODS, type TestStatus } from '../interceptorTestTypes';

const statusChip = (result?: TestStatus) =>
  result === 'success' ? 'uf-chip-ok' : result === 'error' ? 'uf-chip-exp' : result === 'info' ? 'uf-chip-beta' : 'uf-chip';

export function TestHero({ passed, results }: { passed: number; results: Map<string, TestStatus> }) {
  return (
    <section className="uf-wrap uf-page-hero">
      <div className="uf-page-hero-in">
        <div className="uf-stack-6">
          <span className="uf-eyebrow">Interactive preview · real browser actions</span>
          <h1>
            See UploadFlow <span className="uf-hl">in action.</span>
          </h1>
          <p className="uf-lede">
            Try the different ways files reach a webpage and see how UploadFlow gives you a private review step before upload.
          </p>
        </div>

        <div className="uf-page-hero-aside">
          <div className="uf-card uf-stack">
            <div className="uf-row-top">
              <span className="uf-eyebrow uf-eyebrow-dim">Demo progress</span>
              <span className="uf-chip uf-chip-ok">
                {passed}/{TEST_METHODS.length} completed
              </span>
            </div>
            <div className="uf-meter" role="img" aria-label={`${passed} of ${TEST_METHODS.length} methods exercised`}>
              {TEST_METHODS.map((test) => (
                <span key={test} title={test} data-status={results.get(test) ?? 'idle'} />
              ))}
            </div>
            <p className="uf-limit">
              <b>Before you start.</b> Open the installed UploadFlow extension and keep upload interception enabled, then try each method
              below.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestMethodSidebar({ results }: { results: Map<string, TestStatus> }) {
  return (
    <aside className="uf-stack-6">
      <span className="uf-eyebrow uf-eyebrow-dim">Upload methods</span>
      <div>
        {TEST_METHODS.map((test, index) => {
          const result = results.get(test);
          return (
            <div key={test} className="uf-row">
              <div className="uf-row-main">
                <span className="uf-small" style={result ? { color: 'var(--uf-text-2)' } : undefined}>
                  <span className="uf-mono">{String(index + 1).padStart(2, '0')}</span> {test}
                </span>
              </div>
              <span className={`uf-chip ${statusChip(result)}`}>{result ?? 'untried'}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
