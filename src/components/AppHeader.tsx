export const AppHeader = () => {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-5">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f4c95d]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#58c477]" />
      </div>
      <span className="font-mono text-[8px] uppercase tracking-[.2em] text-white/30">Private workspace · local</span>
    </header>
  );
};
