export function HeroExperience() {
  return (
    <div className="hero-experience" aria-label="UploadFlow product overview">
      <div className="hero-experience-topbar">
        <span className="hero-live-dot" />
        <span>Browser media context</span>
        <span className="hero-context-domain">destination.app</span>
      </div>

      <div className="hero-product-window">
        <img
          src="/features/product-overview-actual.png"
          alt="UploadFlow popup, editor, and side panel working together"
          width="2832"
          height="1530"
          className="hero-product-image"
        />
        <div className="hero-image-sheen" aria-hidden="true" />
      </div>

      <div className="hero-intelligence-card hero-intelligence-source">
        <span>Source remembered</span>
        <strong>cloudgrids.tech</strong>
        <small>Original + 3 prepared versions</small>
      </div>

      <div className="hero-intelligence-card hero-intelligence-match">
        <span>Destination match</span>
        <strong>Ready to deliver</strong>
        <small>Correct type · preset available</small>
      </div>

      <div className="hero-intelligence-card hero-intelligence-history">
        <span>Media memory</span>
        <strong>Used 6 times</strong>
        <small>Last delivered yesterday</small>
      </div>
    </div>
  );
}
