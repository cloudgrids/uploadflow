import { UploadFlowIcon } from '../lib/icons';
import { copyShareUrl, SHARE_URL, shareUploadFlow } from '../utils/share';
import { toast } from '../utils/Toaster';

export function SharePanel() {
  const handleCopy = async () => {
    try {
      await copyShareUrl();
      toast.success('UploadFlow link copied.');
    } catch {
      toast.error('Could not copy the UploadFlow link.');
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareUploadFlow();
      if (result === 'copied') toast.success('UploadFlow link copied.');
    } catch {
      toast.error('Could not open the share menu.');
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#eefb7a]/20 bg-[#eefb7a] p-4 text-left text-[#101416] shadow-none">
      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full border-22 border-black/[.035]" />
      <div className="relative flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#101416] text-white"><UploadFlowIcon /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-black uppercase tracking-[.18em] opacity-45">Share the toolkit</p>
          <h3 className="mt-1 text-base text-[#101416]">Send UploadFlow to someone</h3>
          <p className="mt-1.5 max-w-md text-[10px] leading-4 text-black/55">Share the public landing page so others can learn how private upload interception works.</p>
        </div>
      </div>

      <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 truncate rounded-xl border border-black/10 bg-white/45 px-3 py-2.5 font-mono text-[9px] text-black/55">{SHARE_URL}</div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => void handleCopy()} className="cursor-pointer rounded-xl border border-black/15 px-3.5 py-2.5 text-[9px] font-black uppercase tracking-wide transition hover:bg-black/5">Copy link</button>
          <button type="button" onClick={() => void handleShare()} className="cursor-pointer rounded-xl bg-[#101416] px-3.5 py-2.5 text-[9px] font-black uppercase tracking-wide text-white transition hover:bg-black">Share</button>
          <a href={SHARE_URL} target="_blank" rel="noopener noreferrer" className="grid min-h-10 w-10 place-items-center rounded-xl border border-black/15 text-sm font-black transition hover:bg-black/5" aria-label="Open UploadFlow landing page" title="Open landing page">↗</a>
        </div>
      </div>
    </section>
  );
}
