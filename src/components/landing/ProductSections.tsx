import { editorTools, productSurfaces } from './content';

export function ProductSurfaceSection() {
  return (
    <section className="border-b border-white/10 bg-[#0d1012]">
      <div className="mx-auto w-full max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mb-12 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#eefb7a]">One workflow · three depths</p>
            <ComingSoonBadge />
          </div>
          <h2 className="mt-5 text-4xl leading-[.9] sm:text-6xl">Capture quickly. Organize continuously. Edit precisely.</h2>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-white/45">
            The popup, side panel, and full editor share the same local shelf and preparation state, so the tool grows with the task instead
            of forcing every action into one window.
          </p>
        </div>
        <div className="grid border-l border-t border-white/15 lg:grid-cols-3">
          {productSurfaces.map(([number, title, copy]) => (
            <article key={number} className="min-h-60 border-b border-r border-white/15 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[9px] text-emerald-400">/{number}</span>
                <ComingSoonBadge />
              </div>
              <h3 className="mt-16 text-2xl">{title}</h3>
              <p className="mt-3 max-w-sm text-xs leading-5 text-white/40">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EditorToolsSection() {
  return (
    <section id="tools" className="border-y border-white/10 bg-[#111416]">
      <div className="mx-auto w-full max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.22em] text-emerald-400">Inside the workspace</p>
            <h2 className="mt-4 text-4xl leading-none sm:text-5xl">Every output can keep moving.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/40">
            Choose any compatible editor for the current output, or process selected items as a bounded batch.
          </p>
        </div>
        <div className="grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {editorTools.map((tool) => (
            <article
              key={tool.number}
              className="group relative min-h-72 border-b border-r border-white/15 p-6 transition hover:bg-[#eefb7a] hover:text-[#0b0d0f] sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] opacity-35">/{tool.number}</span>
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-current/15 text-base font-black">
                  {tool.mark}
                </span>
              </div>
              {tool.comingSoon && <div className="absolute left-6 top-20 sm:left-7"><ComingSoonBadge /></div>}
              <h3 className="mt-20 text-2xl">{tool.label}</h3>
              <p className="mt-3 text-xs leading-5 opacity-45 group-hover:opacity-65">{tool.copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {editorTools.filter((tool) => tool.image).map((tool) => (
            <figure key={`${tool.number}-preview`} className="overflow-hidden rounded-[24px] border border-white/15 bg-black/20">
              <img src={tool.image} alt={`Actual UploadFlow ${tool.label} workspace`} width="2880" height="1800" loading="lazy" className="h-auto w-full object-contain object-top" />
              <figcaption className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-white/35">
                <span>Actual extension workspace</span>
                <span className="text-[#eefb7a]">{tool.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <figure className="mt-12 overflow-hidden rounded-[24px] border border-white/15 bg-black/20">
          <img src="/features/workspace-settings-actual.png" alt="Actual UploadFlow full workspace settings screen" width="2880" height="1558" loading="lazy" className="h-auto w-full object-contain object-top" />
          <figcaption className="border-t border-white/10 px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-white/35">Actual extension workspace · Settings shown</figcaption>
        </figure>
      </div>
    </section>
  );
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex rounded-full border border-[#eefb7a]/35 bg-[#eefb7a]/10 px-2.5 py-1 text-[7px] font-black uppercase tracking-[.16em] text-[#eefb7a] group-hover:border-black/20 group-hover:bg-black/10 group-hover:text-black">
      Coming soon
    </span>
  );
}
