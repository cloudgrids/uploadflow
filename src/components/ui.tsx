import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none ${className}`}>{children}</section>;
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>}
        <h2 className="m-0 text-sm text-slate-900 dark:text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function IconButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/8 bg-white/5 text-slate-400 transition hover:border-white/15 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${className}`}
      {...props}
    />
  );
}
