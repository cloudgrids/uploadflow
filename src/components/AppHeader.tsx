import { UploadFlowIcon } from '../lib/icons';

export const AppHeader = () => {
  return (
    <header className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
          <UploadFlowIcon />
        </div>
        <div>
          <h1 className="m-0 text-[17px] leading-none text-slate-950 dark:text-white">UploadFlow</h1>
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Local file optimizer</span>
        </div>
      </div>
    </header>
  );
};
