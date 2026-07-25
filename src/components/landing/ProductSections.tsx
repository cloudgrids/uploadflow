import type { CSSProperties } from 'react';
import { editorTools, mediaMemoryPillars, mediaMemoryRoadmap, productStatus, productSurfaces, type ProductStatus } from './content';

export function MediaMemorySection() {
  return (
    <section className="border-b border-white/10 bg-[#0d1012]/92">
      <div className="mx-auto w-full max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div data-reveal="left">
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">The browser&apos;s missing media layer</p>
              <StatusBadge status="beta" />
            </div>
            <h2 className="mt-5 text-4xl leading-[.92] sm:text-6xl">UploadFlow remembers your media so you do not have to.</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">
              Every explicit capture can retain its source, version family, transformations, destinations, and confirmed usage count as one
              local media history.
            </p>
            <div className="content-card mt-8 max-w-lg">
              <div className="status-line status-line-lime"><span>Source</span><strong>Remembered</strong></div>
              <div className="status-line status-line-green"><span>Versions</span><strong>Connected</strong></div>
              <div className="status-line status-line-violet"><span>Destinations</span><strong>Recallable</strong></div>
            </div>
          </div>
          <div className="section-rail pl-6 sm:pl-8" data-reveal="right">
            {mediaMemoryPillars.map(([number, title, copy], index) => (
              <article key={number} className="feature-card grid gap-3 border-b border-white/15 py-6 sm:grid-cols-[55px_140px_1fr]" style={{ '--reveal-delay': `${index * 55}ms` } as CSSProperties}>
                <span className="font-mono text-xs font-semibold text-[#eefb7a] sm:text-sm">/{number}</span>
                <h3 className="text-lg">{title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-2" data-reveal>
          {mediaMemoryRoadmap.map((feature) => (
            <span key={feature.label} className="hover-lift inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/3 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white/60">
              {feature.label} <StatusBadge status={feature.status} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductSurfaceSection() {
  return (
    <section className="border-b border-white/10 bg-[#0d1012]/92">
      <div className="mx-auto w-full max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mb-12 max-w-3xl" data-reveal>
          <p className="eyebrow">One workflow · three depths</p>
          <h2 className="mt-5 text-4xl leading-[.9] sm:text-6xl">Capture quickly. Organize continuously. Edit precisely.</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55">
            The popup, side panel, and full editor share the same shelf and preparation state. The interface expands with the task instead of
            forcing every operation into one crowded window.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Product availability status">
            {(Object.keys(productStatus) as ProductStatus[]).map((status) => <StatusBadge key={status} status={status} />)}
          </div>
        </div>
        <div className="grid border-l border-t border-white/15 lg:grid-cols-3">
          {productSurfaces.map((surface, index) => (
            <article key={surface.number} className="feature-card min-h-64 border-b border-r border-white/15 p-6 sm:p-8" data-reveal style={{ '--reveal-delay': `${index * 85}ms` } as CSSProperties}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-semibold text-emerald-400 sm:text-sm">/{surface.number}</span>
                <StatusBadge status={surface.status} />
              </div>
              <h3 className="mt-16 text-2xl">{surface.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">{surface.copy}</p>
              <p className="mt-4 border-t border-white/8 pt-4 text-xs leading-5 text-white/38">{productStatus[surface.status].detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EditorToolsSection() {
  return (
    <section id="tools" className="border-y border-white/10 bg-[#101416]/92">
      <div className="mx-auto w-full max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end" data-reveal>
          <div>
            <p className="eyebrow text-emerald-400">Inside the workspace</p>
            <h2 className="mt-4 text-4xl leading-none sm:text-5xl">Every output can keep moving.</h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-white/55">
            Each tool keeps the current draft connected to the wider upload workflow instead of creating a dead-end export.
          </p>
        </div>
        <div className="grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {editorTools.map((tool, index) => (
            <article key={tool.number} className="feature-card group relative min-h-76 border-b border-r border-white/15 p-6 sm:p-7" data-reveal style={{ '--reveal-delay': `${(index % 4) * 55}ms` } as CSSProperties}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white/38">/{tool.number}</span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/4 text-base font-black text-[#eefb7a] transition duration-300 group-hover:rotate-3 group-hover:border-[#eefb7a]/35 group-hover:bg-[#eefb7a] group-hover:text-black">
                  {tool.mark}
                </span>
              </div>
              <div className="mt-8"><StatusBadge status={tool.status} /></div>
              <h3 className="mt-8 text-2xl">{tool.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50 transition group-hover:text-white/68">{tool.copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {editorTools.filter((tool) => tool.image).map((tool, index) => (
            <figure key={`${tool.number}-preview`} className="media-frame" data-reveal style={{ '--reveal-delay': `${(index % 2) * 90}ms` } as CSSProperties}>
              <img src={tool.image} alt={`UploadFlow ${tool.label} workspace`} width="2880" height="1800" loading="lazy" className="h-auto w-full object-contain object-top" />
              <figcaption className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/48">
                <span>{tool.screenshot}</span>
                <span className="text-[#eefb7a]">{tool.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <figure className="media-frame mt-12" data-reveal>
          <img src="/features/workspace-settings-actual.png" alt="UploadFlow full workspace settings screen" width="2880" height="1558" loading="lazy" className="h-auto w-full object-contain object-top" />
          <figcaption className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/48">
            <span>UploadFlow Extension · Settings workspace</span>
            <span className="text-[#eefb7a]">Behaviour stays explicit</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: ProductStatus }) {
  const styles: Record<ProductStatus, string> = {
    available: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300',
    beta: 'border-sky-400/35 bg-sky-400/10 text-sky-300',
    early: 'border-violet-400/35 bg-violet-400/10 text-violet-300',
    experimental: 'border-amber-400/35 bg-amber-400/10 text-amber-300',
    next: 'border-[#eefb7a]/35 bg-[#eefb7a]/10 text-[#eefb7a]',
    planned: 'border-white/20 bg-white/5 text-white/45'
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider sm:text-xs ${styles[status]}`}>{productStatus[status].label}</span>;
}
