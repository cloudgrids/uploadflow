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
    <main className="min-h-screen bg-[#080c0d] px-5 py-10 text-white">
      <section className="mx-auto max-w-lg rounded-[28px] border border-white/10 bg-[#111617] p-6 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">UploadFlow Handoff</p>
        <h1 className="mt-4 text-4xl font-black italic leading-none">Phone to website, without sending it to yourself.</h1>
        {invalid ? (
          <p className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            This pairing link is missing or invalid. Start a new Handoff session from the UploadFlow side panel.
          </p>
        ) : pairing ? (
          <div className="mt-6">
            <p className="text-sm text-white/55">Confirm that this code matches the code on your computer.</p>
            <strong className="mt-3 block font-mono text-4xl tracking-[.25em] text-[#eefb7a]">{pairing.code}</strong>
            <label className="mt-6 block rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
              Choose media
              <input type="file" multiple accept="image/*,video/*,audio/*" disabled className="mt-3 block w-full text-xs opacity-45" />
            </label>
            <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/8 p-4 text-xs leading-5 text-amber-100">
              Encrypted pairing is implemented in the development foundation. Live WebRTC/signaling and the temporary encrypted relay are not connected yet, so this page cannot send files in the current build.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-white/45">Reading the temporary pairing invitation…</p>
        )}
        <p className="mt-6 text-xs leading-5 text-white/35">
          Handoff sessions are temporary, require confirmation on both devices, and must not create a permanent cloud media library.
        </p>
      </section>
    </main>
  );
}
