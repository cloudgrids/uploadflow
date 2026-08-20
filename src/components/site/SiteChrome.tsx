import type { ReactNode } from 'react';
import { UploadFlowIcon } from '../../lib/icons';
import { navigation, storeUrl } from './content';
import { ThemeToggle } from './ThemeToggle';

export function Logo({ tagline, href = '/' }: { tagline: string; href?: string }) {
  return (
    <a className="uf-logo" href={href}>
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

export function StoreLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <a className={className} href={storeUrl} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function SiteHeader() {
  return (
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
  );
}

export function SiteFooter() {
  return (
    <footer className="uf-foot uf-wrap">
      <Logo tagline="by CloudGrids" />
      <div className="uf-foot-links">
        <a href="/how-it-works">How it works</a>
        <a href="/plans">Plans</a>
        <a href="/whats-new">What&rsquo;s new</a>
        <a href="/privacy">Privacy</a>
        <a href="/support">Support</a>
        <a href="/test">Test layer</a>
        <a href="https://cloudgrids.tech/" target="_blank" rel="noreferrer">
          CloudGrids
        </a>
      </div>
      <p className="uf-small">
        UploadFlow does not grant rights to media. You&rsquo;re responsible for owning or being authorized to reuse anything you move
        through it.
      </p>
    </footer>
  );
}

/** The shell every page below the landing page shares. */
export function SitePage({ children }: { children: ReactNode }) {
  return (
    <div className="uf">
      <div className="uf-inner">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}

export function PageHero({ eyebrow, title, lede, aside }: { eyebrow: string; title: ReactNode; lede: string; aside?: ReactNode }) {
  return (
    <section className="uf-wrap uf-page-hero">
      <div className="uf-page-hero-in">
        <div className="uf-stack-6">
          <span className="uf-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="uf-lede">{lede}</p>
        </div>
        {aside ? <div className="uf-page-hero-aside">{aside}</div> : null}
      </div>
    </section>
  );
}

export function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="uf-statline">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
