import type { CSSProperties } from 'react';
import { commonQuestions, practicalUseCases, productProblems, simpleWorkflow } from './content';

export function PlainEnglishSection() {
  return (
    <section className="border-b border-white/10 bg-[#101416]/88">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div data-reveal="left">
            <p className="eyebrow text-emerald-400">UploadFlow in plain English</p>
            <h2 className="mt-5 text-4xl leading-[.95] sm:text-6xl">A smart, private clipboard for media.</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
              UploadFlow creates a temporary working layer between a source webpage and a destination upload field. It remembers media you
              explicitly capture, lets you prepare it in the browser, and hands the approved file to another supported website.
            </p>
            <p className="mt-7 rounded-r-2xl border-l-2 border-[#eefb7a] bg-[#eefb7a]/5 px-5 py-4 text-base font-bold leading-relaxed text-white/85">
              Stop downloading, finding, renaming, editing, and re-uploading. Capture → prepare → deliver.
            </p>
          </div>
          <div className="grid border-l border-t border-white/15 sm:grid-cols-3" data-reveal="right">
            {simpleWorkflow.map(([number, title, copy], index) => (
              <article key={number} className="feature-card border-b border-r border-white/15 p-6" style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}>
                <span className="font-mono text-xs font-semibold text-[#eefb7a] sm:text-sm">/{number}</span>
                <h3 className="mt-12 text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="content-card mt-14" data-reveal>
          <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
            <span className="rounded-full border border-[#eefb7a]/30 bg-[#eefb7a]/8 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#eefb7a]">Everyday example</span>
            <p className="max-w-4xl text-base leading-relaxed text-white/70 sm:text-lg">
              Save an authorised photo to UploadFlow, open the side panel to crop it and add your watermark, then open a destination post
              creator and choose that prepared version from its upload field. The workflow finishes without leaving a permanent copy in Downloads.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProblemsAndUseCasesSection() {
  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow">What problem does it solve?</p>
          <h2 className="mt-5 text-4xl leading-[.95] sm:text-6xl">The missing step between finding media and uploading it.</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55">
            Browsers offer Download, and websites offer Upload. UploadFlow adds the private workspace in between so media remains findable,
            prepared, and ready to reuse.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/15 bg-white/2" data-reveal>
          {productProblems.map(([problem, solution], index) => (
            <article key={problem} className="feature-card grid border-b border-white/10 last:border-b-0 sm:grid-cols-[.7fr_1.3fr]" style={{ '--reveal-delay': `${index * 45}ms` } as CSSProperties}>
              <h3 className="bg-white/3 p-5 text-lg font-bold sm:p-6">{problem}</h3>
              <p className="p-5 text-sm leading-relaxed text-white/55 sm:p-6 sm:text-base">{solution}</p>
            </article>
          ))}
        </div>

        <div className="mt-24">
          <div data-reveal>
            <p className="eyebrow text-emerald-400">Practical use cases</p>
            <h2 className="mt-5 text-4xl sm:text-6xl">Who is UploadFlow for?</h2>
          </div>
          <div className="mt-10 grid border-l border-t border-white/15 md:grid-cols-2 lg:grid-cols-3">
            {practicalUseCases.map((useCase, index) => (
              <article key={useCase.audience} className="feature-card border-b border-r border-white/15 p-6 sm:p-8" data-reveal style={{ '--reveal-delay': `${(index % 3) * 65}ms` } as CSSProperties}>
                <span className="font-mono text-xs text-[#eefb7a]">/{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-8 text-xl">{useCase.audience}</h3>
                <p className="mt-5 text-sm leading-relaxed text-white/50">{useCase.workflow}</p>
                <p className="mt-5 border-t border-white/10 pt-4 text-xs font-bold uppercase leading-5 tracking-wide text-[#eefb7a] sm:text-sm">
                  {useCase.benefit}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CommonQuestionsSection() {
  return (
    <section className="border-b border-white/10 bg-[#101416]/88">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-12">
        <div data-reveal>
          <p className="eyebrow text-emerald-400">Direct answers</p>
          <h2 className="mt-5 text-4xl sm:text-6xl">Understand it in two minutes.</h2>
        </div>
        <div className="mt-10 grid border-l border-t border-white/15 lg:grid-cols-2">
          {commonQuestions.map((item, index) => (
            <article key={item.question} className="feature-card border-b border-r border-white/15 p-6 sm:p-8" data-reveal style={{ '--reveal-delay': `${(index % 2) * 75}ms` } as CSSProperties}>
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-[#eefb7a]">/{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-xl">{item.question}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">{item.answer}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
