import { commonQuestions, practicalUseCases, productProblems, simpleWorkflow } from './content';

export function PlainEnglishSection() {
  return (
    <section className="border-b border-white/10 bg-[#111416]">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.22em] text-emerald-400">UploadFlow in plain English</p>
            <h2 className="mt-5 text-4xl leading-[.95] sm:text-6xl">A smart, private clipboard for media.</h2>
            <p className="mt-6 max-w-xl text-sm leading-6 text-white/50">
              UploadFlow creates a temporary working layer between a source webpage and a destination upload field. It remembers media you
              explicitly capture, lets you prepare it in the browser, and hands the resulting file to another supported website.
            </p>
            <p className="mt-5 border-l-2 border-[#eefb7a] pl-4 text-sm font-bold leading-6 text-white/75">
              Stop downloading, finding, renaming, editing, and re-uploading. Capture → prepare → deliver.
            </p>
          </div>
          <div className="grid border-l border-t border-white/15 sm:grid-cols-3">
            {simpleWorkflow.map(([number, title, copy]) => (
              <article key={number} className="border-b border-r border-white/15 p-6">
                <span className="font-mono text-[9px] text-[#eefb7a]">/{number}</span>
                <h3 className="mt-12 text-2xl">{title}</h3>
                <p className="mt-3 text-xs leading-5 text-white/40">{copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-14 rounded-3xl border border-white/15 bg-[#0b0d0f] p-6 sm:p-8">
          <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#eefb7a]">Everyday example</p>
          <p className="mt-4 max-w-4xl text-base leading-7 text-white/60">
            Save an authorized photo to UploadFlow, open the side panel to crop it and add your watermark, then open a destination post
            creator and choose that prepared version from its upload field. The workflow finishes without leaving a permanent copy in your
            Downloads folder.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProblemsAndUseCasesSection() {
  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#eefb7a]">What problem does it solve?</p>
          <h2 className="mt-5 text-4xl leading-[.95] sm:text-6xl">The missing step between finding media and uploading it.</h2>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-white/45">
            Browsers offer Download, and websites offer Upload. UploadFlow adds the private workspace in between so media can remain
            findable, prepared, and ready to reuse.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-3xl border border-white/15">
          {productProblems.map(([problem, solution]) => (
            <article key={problem} className="grid border-b border-white/10 last:border-b-0 sm:grid-cols-[.7fr_1.3fr]">
              <h3 className="bg-white/3 p-5 text-lg sm:p-6">{problem}</h3>
              <p className="p-5 text-sm leading-6 text-white/45 sm:p-6">{solution}</p>
            </article>
          ))}
        </div>

        <div className="mt-24">
          <p className="text-[9px] font-black uppercase tracking-[.22em] text-emerald-400">Practical use cases</p>
          <h2 className="mt-5 text-4xl sm:text-6xl">Who is UploadFlow for?</h2>
          <div className="mt-10 grid border-l border-t border-white/15 md:grid-cols-2 lg:grid-cols-3">
            {practicalUseCases.map((useCase) => (
              <article key={useCase.audience} className="border-b border-r border-white/15 p-6 sm:p-8">
                <h3 className="text-xl">{useCase.audience}</h3>
                <p className="mt-5 text-xs leading-5 text-white/45">{useCase.workflow}</p>
                <p className="mt-5 border-t border-white/10 pt-4 text-[10px] font-bold uppercase leading-5 tracking-wide text-[#eefb7a]">
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
    <section className="border-b border-white/10 bg-[#111416]">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 lg:px-12">
        <p className="text-[9px] font-black uppercase tracking-[.22em] text-emerald-400">Direct answers</p>
        <h2 className="mt-5 text-4xl sm:text-6xl">Understand it in two minutes.</h2>
        <div className="mt-10 grid border-l border-t border-white/15 lg:grid-cols-2">
          {commonQuestions.map((item) => (
            <article key={item.question} className="border-b border-r border-white/15 p-6 sm:p-8">
              <h3 className="text-xl">{item.question}</h3>
              <p className="mt-4 text-sm leading-6 text-white/45">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
