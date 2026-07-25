import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, description, aside }: { eyebrow: string; title: ReactNode; description: string; aside?: ReactNode }) {
  return (
    <header className="page-hero" data-reveal>
      <div className="page-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero-description">{description}</p>
      </div>
      {aside ? <div className="page-hero-aside">{aside}</div> : null}
    </header>
  );
}

export function ContentCard({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`content-card ${className}`} data-reveal>
      {children}
    </section>
  );
}

export function StatusLine({ label, value, tone = 'lime' }: { label: string; value: string; tone?: 'lime' | 'green' | 'violet' }) {
  return (
    <div className={`status-line status-line-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
