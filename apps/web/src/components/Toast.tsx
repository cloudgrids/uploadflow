interface ToastProps {
  message: string;
  tone?: 'success' | 'error' | 'warning' | 'info';
}

export function Toast({ message, tone = 'success' }: ToastProps) {
  const toneClasses = {
    success: 'border-emerald-500/25 bg-emerald-950 text-emerald-100',
    error: 'border-red-500/25 bg-red-950 text-red-100',
    warning: 'border-amber-500/25 bg-amber-950 text-amber-100',
    info: 'border-sky-500/25 bg-sky-950 text-sky-100'
  };
  const dotClasses = {
    success: 'bg-emerald-400',
    error: 'bg-red-400',
    warning: 'bg-amber-400',
    info: 'bg-sky-400'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ zIndex: 2147483647 }}
      className={`pointer-events-auto fixed right-4 top-4 flex max-w-xs items-center gap-2 rounded-lg border px-4 py-3 text-xs font-semibold shadow-xl animate-fadeIn ${toneClasses[tone]}`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${dotClasses[tone]}`} />
      {message}
    </div>
  );
}
