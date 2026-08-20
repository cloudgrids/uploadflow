import { UploadFlowIcon } from '../../lib/icons';
import { Clip } from './Clip';
import { Typewriter } from './Typewriter';
import { ThemeToggle } from './ThemeToggle';
import { compatibility, flow, heroChips, navigation, neverDoes, plans, remembers, storeUrl, surfaces, tools, transfers } from './content';
import { priceForPlanName } from './plansContent';
import { MaintenanceOverlay } from './MaintenanceOverlay';

const chipClass = { ok: 'uf-chip-ok', beta: 'uf-chip-beta', exp: 'uf-chip-exp', network: 'uf-chip-exp' } as const;

function Logo({ tagline }: { tagline: string }) {
  return (
    <a className="uf-logo" href="#top">
      <span className="uf-logo-tile" aria-hidden="true">
        <UploadFlowIcon />
      </span>
      <span className="uf-logo-name">
        <b>UploadFlow</b>
        <span>{tagline}</span>
      </span>
    </a>
  );
}

function StoreLink({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <a className={className} href={storeUrl} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function SiteLanding() {
  return (
    <div className="uf">
      <div className="uf-inner">
        <header className="uf-bar">
          <div className="uf-bar-in">
            <Logo tagline="Private toolkit" />
            <span className="uf-bar-spacer" />
            <nav aria-label="Main navigation">
              {navigation.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <ThemeToggle />
            <StoreLink className="uf-btn uf-btn-primary uf-btn-xs uf-cta-sm">Add to Chrome</StoreLink>
          </div>
        </header>

        <main id="top">
          {/* ---------------- hero ---------------- */}
          <section className="uf-wrap uf-hero">
            <div className="uf-hero-split">
              <div className="uf-stack">
                <span className="uf-chip uf-chip-live">Runs locally in your browser</span>
                <h1>
                  <Typewriter text="Move media between sites. Skip downloads." />
                </h1>
                <p className="uf-lede">
                  Capture media you&rsquo;re authorized to use on one webpage, prepare it privately, and send it straight into another
                  site&rsquo;s upload field — without leaving a permanent copy in Downloads.
                </p>
                <div className="uf-cta-row">
                  <StoreLink className="uf-btn uf-btn-primary">
                    Add to Chrome <span className="uf-arw">→</span>
                  </StoreLink>
                  <a className="uf-btn uf-btn-ghost" href="#how">
                    See the workflow
                  </a>
                </div>
                <div className="uf-chip-row">
                  {heroChips.map((chip) => (
                    <span key={chip} className="uf-chip uf-chip-ok">
                      {chip}
                    </span>
                  ))}
                  <span className="uf-chip">20-item shelf</span>
                </div>
              </div>
              <figure className="uf-shot">
                <div className="uf-shot-frame">
                  <Clip
                    src="/site/handoff.mp4"
                    poster="/site/handoff-poster.webp"
                    label="Screen recording: a watermark is applied inside UploadFlow, the file is marked ready for the destination, and it lands in ChatGPT's upload field"
                  />
                </div>
                <figcaption className="uf-shot-cap">
                  <span className="uf-chip uf-chip-ok">Real capture</span> Watermark → ready for destination → into ChatGPT
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ---------------- how ---------------- */}
          <section className="uf-wrap uf-section" id="how">
            <div className="uf-stack-l">
              <div className="uf-stack-6">
                <span className="uf-eyebrow">In plain English</span>
                <h2>A smart, private clipboard for media.</h2>
                <p className="uf-lede">
                  Browsers give you Download. Websites give you Upload. UploadFlow is the private workspace in between.
                </p>
              </div>
              <ol className="uf-flow">
                {flow.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    <p className="uf-small">{step.copy}</p>
                  </li>
                ))}
              </ol>
              <figure className="uf-shot">
                <div className="uf-shot-frame">
                  <Clip
                    src="/site/capture.mp4"
                    poster="/site/capture-poster.webp"
                    label="Screen recording: right-clicking an image on a search results page, choosing Add to UploadFlow, and the file appearing in the side-panel shelf ready to optimize"
                  />
                </div>
                <figcaption className="uf-shot-cap">
                  <span className="uf-chip uf-chip-ok">Real capture</span> Right-click → add to shelf → review before upload
                </figcaption>
              </figure>
              <div className="uf-card uf-card-flat">
                <p className="uf-small">
                  <b style={{ color: 'var(--uf-text-2)' }}>Why it fetches late:</b> the shelf holds a reference, so nothing is retrieved
                  until the moment a destination asks. An expired or access-controlled link will sit happily on the shelf and then fail at
                  handoff — that&rsquo;s the design, not a bug.
                </p>
              </div>
            </div>
          </section>

          {/* ---------------- surfaces ---------------- */}
          <section className="uf-wrap uf-section" id="surfaces">
            <div className="uf-stack-l">
              <div className="uf-stack-6">
                <span className="uf-eyebrow">Three surfaces, one shelf</span>
                <h2>Wherever the work is.</h2>
              </div>
              <div className="uf-split">
                <div className="uf-stack">
                  {surfaces.map((surface) => (
                    <div key={surface.title} className="uf-stack-6">
                      <h3>{surface.title}</h3>
                      <p className="uf-small">{surface.copy}</p>
                    </div>
                  ))}
                  <p className="uf-limit">
                    <b>Built for narrow.</b> The side panel can be dragged narrower than any phone, so every surface — and this page — is
                    designed from a 150&nbsp;px floor up.
                  </p>
                </div>
                <figure className="uf-shot">
                  <div className="uf-shot-frame">
                    <img
                      src="/site/sidepanel.webp"
                      alt="The UploadFlow side panel open beside a search results page, its Media Shelf holding a grid of captured images as a post bundle"
                      width={1500}
                      height={938}
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="uf-shot-cap">
                    <span className="uf-chip uf-chip-ok">Real capture</span> Side panel · the shelf beside your tabs
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          {/* ---------------- tools ---------------- */}
          <section className="uf-wrap uf-section" id="tools">
            <div className="uf-stack-l">
              <div className="uf-stack-6">
                <span className="uf-eyebrow">Preparation</span>
                <h2>Everything runs on your machine.</h2>
                <p className="uf-lede">
                  One exception, marked below. Every tool previews before it replaces your draft, and the original file is preserved
                  throughout.
                </p>
              </div>
              <div className="uf-grid uf-grid-2">
                {tools.map((tool) => (
                  <div key={tool.title} className="uf-card uf-stack">
                    <div className="uf-row-top">
                      <h3>{tool.title}</h3>
                      <span className="uf-chip-row">
                        <span className={`uf-chip ${tool.plan === 'Free' ? 'uf-chip-ok' : 'uf-chip-plan'}`}>{tool.plan}</span>
                        <span className={`uf-chip ${chipClass[tool.status]}`}>{tool.statusLabel}</span>
                      </span>
                    </div>
                    {tool.image ? (
                      <figure className="uf-shot">
                        <div className="uf-shot-frame">
                          <img src={tool.image} alt={tool.alt} width={1500} height={1120} loading="lazy" />
                        </div>
                      </figure>
                    ) : null}
                    <p className="uf-small">{tool.copy}</p>
                    {tool.limit ? (
                      <p className="uf-limit">
                        {tool.limit.lead ? <b>{tool.limit.lead}</b> : null} {tool.limit.text}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- privacy ---------------- */}
          <section className="uf-wrap uf-section" id="privacy">
            <div className="uf-stack-l">
              <div className="uf-stack-6">
                <span className="uf-eyebrow">The network boundary</span>
                <h2>Three things leave your browser.</h2>
                <p className="uf-lede">
                  Optimization, redaction, cropping, watermarking, background removal, bundle and pack assembly, ZIP building and video
                  processing all run locally. These are the only outbound transfers, and you start every one of them.
                </p>
              </div>
              <div className="uf-card">
                {transfers.map((transfer) => (
                  <div key={transfer.title} className="uf-row">
                    <div className="uf-row-main">
                      <h4>{transfer.title}</h4>
                      <p>{transfer.copy}</p>
                    </div>
                    <span className="uf-chip uf-mono">{transfer.target}</span>
                  </div>
                ))}
              </div>
              <div className="uf-grid uf-grid-2">
                <div className="uf-stack-6">
                  <h3>What it never does</h3>
                  <ul className="uf-dots uf-dots-no">
                    {neverDoes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="uf-stack-6">
                  <h3>What it remembers</h3>
                  <ul className="uf-dots">
                    {remembers.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- plans ---------------- */}
          <section className="uf-wrap uf-section" id="plans">
            <div className="uf-stack-l">
              <div className="uf-stack-6">
                <span className="uf-eyebrow">What&rsquo;s included</span>
                <h2>Free covers the whole journey.</h2>
                <p className="uf-lede">
                  Capture, shelf, full editor, and delivery into another site&rsquo;s upload field are free. Paid tiers start at $4 a
                  month and add preparation depth and repeatable delivery — they don&rsquo;t gate the core loop.
                </p>
              </div>
              <MaintenanceOverlay
                title="Plans aren't open for sign-up yet"
                note="These tiers are real, but subscribing isn't switched on. Free needs no account and works today."
              >
              <div className="uf-grid uf-grid-2">
                {plans.map((tier) => {
                  const price = priceForPlanName(tier.name);
                  return (
                  <div key={tier.name} className="uf-card uf-stack">
                    <div className="uf-row-top">
                      <h3>{tier.name}</h3>
                      <span className={`uf-chip ${price ? 'uf-chip-plan' : 'uf-chip-ok'}`}>
                        {price ? `$${price.monthly} a month` : 'Included'}
                      </span>
                    </div>
                    <p className="uf-small">{tier.summary}</p>
                    <ul className="uf-dots">
                      {tier.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    {price ? (
                      <p className="uf-small">
                        Or ${price.annual} a year &mdash; ${Math.round(price.annual / 12)} a month.
                      </p>
                    ) : null}
                  </div>
                  );
                })}
              </div>
              </MaintenanceOverlay>
              <p className="uf-limit">
                <b>Two tools are switched off in this release.</b> The media inspector and the automatic privacy scanner are being
                rebuilt — the inspector never appeared over a hovered image, and the scanner had no panel to open. Both return when they
                work; drawing redaction regions by hand is unaffected.
              </p>
            </div>
          </section>

          {/* ---------------- compatibility ---------------- */}
          <section className="uf-wrap uf-section" id="compat">
            <div className="uf-stack-l">
              <div className="uf-stack-6">
                <span className="uf-eyebrow uf-eyebrow-dim">Honest limits</span>
                <h2>Where it won&rsquo;t work.</h2>
                <p className="uf-lede">Judged at the moment bytes are actually requested — which is the moment things fail.</p>
              </div>
              <div className="uf-card">
                {compatibility.map((item) => (
                  <div key={item.title} className="uf-row">
                    <div className="uf-row-main">
                      <h4>{item.title}</h4>
                      <p>{item.copy}</p>
                    </div>
                    <span className={`uf-chip ${chipClass[item.status]}`}>{item.verdict}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- personalisation ---------------- */}
          <section className="uf-wrap uf-section" id="yours">
            <div className="uf-stack-l">
              <div className="uf-stack-6">
                <span className="uf-eyebrow">Make it yours</span>
                <h2>The workspace, in your colours.</h2>
                <p className="uf-lede">
                  Pick a theme for the workspace, then set up your profile with nameplates, frames, decorations and banners.
                </p>
              </div>
              <p className="uf-small">
                Your workspace keeps the theme you choose. Animated profile treatments follow your system&rsquo;s reduced-motion setting, and
                nothing about your profile ever reaches a destination site — these are local display choices.
              </p>
              <figure className="uf-shot">
                <div className="uf-shot-frame">
                  <img
                    src="/site/profile.webp"
                    alt="The profile workspace showing nameplates, frames and badges"
                    width={1400}
                    height={1000}
                    loading="lazy"
                  />
                </div>
                <figcaption className="uf-shot-cap">
                  <span className="uf-chip uf-chip-beta">Coming next</span> Profile studio · nameplates and frames
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ---------------- cta ---------------- */}
          <section className="uf-wrap uf-section">
            <div className="uf-card uf-stack">
              <span className="uf-eyebrow">Pre-release</span>
              <h2>Stop downloading, renaming, re-uploading.</h2>
              <p className="uf-lede">Capture → prepare → deliver, without the folder in between.</p>
              <div className="uf-cta-row">
                <StoreLink className="uf-btn uf-btn-primary">
                  Add to Chrome <span className="uf-arw">→</span>
                </StoreLink>
                <a className="uf-btn uf-btn-ghost" href="#compat">
                  Read the limits first
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="uf-foot uf-wrap">
          <Logo tagline="by CloudGrids" />
          <div className="uf-foot-links">
            <a href="/how-it-works">How it works</a>
            <a href="/whats-new">What&rsquo;s new</a>
            <a href="/privacy">Privacy</a>
            <a href="/support">Support</a>
            <a href="#compat">Limits</a>
            <a href="#top">Back to top ↑</a>
          </div>
          <p className="uf-small">
            UploadFlow does not grant rights to media. You&rsquo;re responsible for owning or being authorized to reuse anything you move
            through it.
          </p>
        </footer>
      </div>
    </div>
  );
}
