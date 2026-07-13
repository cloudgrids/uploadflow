interface FullscreenButtonProps {
  isFullscreen: boolean;
  onClick: () => void;
  className?: string;
}

export function FullscreenButton({ isFullscreen, onClick, className = '' }: FullscreenButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-700 bg-slate-900/90 text-slate-300 shadow-sm transition-colors hover:border-purple-500/60 hover:text-purple-300 ${className}`}
      aria-label={isFullscreen ? 'Exit fullscreen preview' : 'Open fullscreen preview'}
      title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
    >
      {isFullscreen ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9H5V5m10 4h4V5M9 15H5v4m10-4h4v4" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9V5h4m10 4V5h-4M5 15v4h4m10-4v4h-4" />
        </svg>
      )}
    </button>
  );
}
