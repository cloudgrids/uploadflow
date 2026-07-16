import { useEffect, useState } from 'react';

const PUBLIC_LAUNCH_AT = new Date('2026-07-18T18:00:00+05:30').getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  launched: boolean;
}

function remainingTime(): TimeRemaining {
  const difference = Math.max(0, PUBLIC_LAUNCH_AT - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference % 86_400_000) / 3_600_000),
    minutes: Math.floor((difference % 3_600_000) / 60_000),
    seconds: Math.floor((difference % 60_000) / 1_000),
    launched: difference === 0
  };
}

export function LaunchCountdown() {
  const [remaining, setRemaining] = useState(remainingTime);

  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(remainingTime()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    ['Days', remaining.days],
    ['Hours', remaining.hours],
    ['Minutes', remaining.minutes],
    ['Seconds', remaining.seconds]
  ] as const;

  return (
    <section aria-label="UploadFlow public launch countdown" className="border-b border-white/10 bg-[#101416]">
      <div className="mx-auto grid w-full max-w-360 items-center gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_auto] lg:px-12">
        <div className="flex items-start gap-4">
          <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eefb7a] text-lg font-black text-[#101416]">03</span>
          <div>
            <p className="text-[8px] font-black uppercase tracking-[.22em] text-emerald-400">Public release · July 18, 2026</p>
            <h2 className="mt-2 text-3xl leading-none sm:text-4xl">{remaining.launched ? 'UploadFlow is now public.' : 'UploadFlow goes public in'}</h2>
            <p className="mt-2 text-[10px] text-white/35">6:00 PM IST · Private upload control for everyone.</p>
          </div>
        </div>

        <div className="grid grid-cols-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {units.map(([label, value]) => (
            <div key={label} className="min-w-18 border-r border-white/10 px-3 py-3 text-center last:border-r-0 sm:min-w-24 sm:px-5">
              <strong className="block font-mono text-xl font-black tracking-[-.06em] text-[#eefb7a] sm:text-3xl">{String(value).padStart(2, '0')}</strong>
              <span className="mt-1 block text-[7px] font-bold uppercase tracking-[.15em] text-white/30">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
