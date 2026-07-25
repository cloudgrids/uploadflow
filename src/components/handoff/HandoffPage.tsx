'use client';

import { useEffect, useState } from 'react';

interface PairingPayload {
  id: string;
  code: string;
  key: JsonWebKey;
}

export function HandoffPage() {
  const [pairing, setPairing] = useState<PairingPayload | null>(null);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const value = new URLSearchParams(window.location.hash.slice(1)).get('pair');
        if (!value) throw new Error();
        const normalized = value.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
        const parsed = JSON.parse(atob(normalized)) as Partial<PairingPayload>;
        if (typeof parsed.id !== 'string' || !/^\d{6}$/.test(parsed.code ?? '') || !parsed.key) throw new Error();
        setPairing(parsed as PairingPayload);
      } catch {
        setInvalid(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b0d]/72 px-5 py-10 text-white sm:py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#eefb7a]/70 to-transparent" />
      <section className="glass-panel relative mx-auto max-w-xl overflow-hidden rounded-[32px] p-6 sm:p-8" data-reveal>
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#eefb7a]/8 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow text-emerald-400">UploadFlow Handoff</p>
            <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-200">Early access</span>
          </div>
          <h1 className="mt-6 text-4xl leading-[.9] sm:text-5xl">Phone to website, without sending it to yourself.</h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/52 sm:text-base">
            Confirm the pairing code, choose media on this device, and continue the same temporary UploadFlow session on your computer.
          </p>

          {invalid ? (
            <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/8 p-5 animate-fadeIn">
              <p className="text-xs font-black uppercase tracking-wider text-red-300">Pairing unavailable</p>
              <p className="mt-3 text-sm leading-relaxed text-red-100/80">
                This pairing link is missing or invalid. Start a new Handoff session from the UploadFlow side panel.
              </p>
            </div>
          ) : pairing ? (
            <div className="mt-8 animate-fadeIn">
              <div className="rounded-3xl border border-[#eefb7a]/22 bg-[#eefb7a]/6 p-5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-white/42">Confirm this code on your computer</p>
                <strong className="mt-4 block font-mono text-4xl tracking-[.25em] text-[#eefb7a] sm:text-5xl">{pairing.code}</strong>
                <p className="mt-3 text-xs text-white/38">Session {pairing.id.slice(0, 8)}</p>
              </div>

              <label className="mt-5 block rounded-2xl border border-dashed border-white/18 bg-black/18 p-5 text-sm text-white/55 transition hover:border-[#eefb7a]/30">
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <strong className="block text-sm text-white">Choose media</strong>
                    <small className="mt-1 block text-xs text-white/38">Images, video, or audio</small>
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/4 text-[#eefb7a]">＋</span>
                </span>
                <input type="file" multiple accept="image/*,video/*,audio/*" disabled className="mt-4 block w-full text-xs opacity-45" />
              </label>

              <div className="mt-5 rounded-2xl border border-amber-400/18 bg-amber-400/7 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-amber-200">Transport not connected yet</p>
                <p className="mt-3 text-xs leading-5 text-amber-100/68">
                  Encrypted pairing is implemented in the development foundation. Live WebRTC/signalling and the temporary encrypted relay are not connected in this build, so this page cannot send files yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/3 p-6">
              <div className="flex items-center gap-4">
                <span className="h-3 w-3 animate-pulse rounded-full bg-[#eefb7a] shadow-[0_0_20px_rgba(238,251,122,.7)]" />
                <div>
                  <p className="text-sm font-bold text-white">Reading pairing invitation</p>
                  <p className="mt-1 text-xs text-white/38">Validating the temporary session locally…</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/8 pt-5 text-center text-[9px] font-bold uppercase tracking-wider text-white/28">
            <span>Temporary</span>
            <span>Confirmed</span>
            <span>Encrypted</span>
          </div>
        </div>
      </section>
    </main>
  );
}
