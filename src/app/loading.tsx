import { UploadFlowLoader } from '../components/site/UploadFlowLoader';

/**
 * Shown while a route segment resolves. Most pages here are prerendered, so
 * this rarely appears — it exists so a slow navigation shows the product's own
 * mark rather than a blank frame.
 */
export default function Loading() {
  return (
    <div className="uf">
      <div className="uf-inner">
        <div className="uf-wrap uf-loading-shell">
          <UploadFlowLoader size={56} label="Loading UploadFlow" />
          <p className="uf-small">Loading…</p>
        </div>
      </div>
    </div>
  );
}
