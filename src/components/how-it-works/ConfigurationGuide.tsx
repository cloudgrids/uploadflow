import type { CSSProperties } from 'react';
import { CheckIcon } from '../landing/icons';
import { configurationGroups } from './content';

export function ConfigurationGuide() {
  return (
    <section id="configuration" className="border-t border-white/10 py-16 sm:py-24">
      <div className="max-w-3xl" data-reveal>
        <p className="eyebrow text-emerald-400">Configure UploadFlow</p>
        <h2 className="mt-5 text-4xl leading-[.92] sm:text-5xl">Choose how UploadFlow fits your workflow.</h2>
        <p className="mt-6 text-base leading-relaxed text-white/60">
          Settings define when UploadFlow appears, where files come from, and which reusable defaults are available. They do not publish,
          submit, or permanently alter source media by themselves.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {configurationGroups.map((configuration, index) => (
          <article key={configuration.id} id={`configuration-${configuration.id}`} className="content-card hover-lift" data-reveal style={{ '--reveal-delay': `${(index % 3) * 65}ms` } as CSSProperties}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-[#eefb7a]">/{String(index + 1).padStart(2, '0')}</span>
              <a href={`#configuration-${configuration.id}`} className="text-[10px] font-semibold uppercase tracking-wider text-white/35 transition-colors hover:text-[#eefb7a]">Configuration</a>
            </div>
            <h3 className="mt-7 text-xl font-bold">{configuration.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{configuration.summary}</p>
            <ul className="mt-6 space-y-3 border-t border-white/8 pt-5">
              {configuration.choices.map((choice) => (
                <li key={choice} className="flex gap-2.5 text-xs leading-relaxed text-white/48 sm:text-sm">
                  <span className="mt-0.5 shrink-0 text-[#eefb7a]"><CheckIcon /></span>
                  {choice}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
