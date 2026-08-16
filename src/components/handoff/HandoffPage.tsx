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
    <div className="uf">
      <main className="uf-wrap uf-handoff">
        <section className="uf-card uf-stack">
          <div className="uf-row-top">
            <span className="uf-eyebrow">UploadFlow Handoff</span>
            <span className="uf-chip uf-chip-beta">Early access</span>
          </div>

          <h1>Phone to website, without sending it to yourself.</h1>
          <p className="uf-lede">
            Confirm the pairing code, choose media on this device, and continue the same temporary UploadFlow session on your computer.
          </p>

          {invalid ? (
            <div className="uf-card uf-card-flat uf-stack-6">
              <span className="uf-chip uf-chip-exp">Pairing unavailable</span>
              <p className="uf-small">
                This pairing link is missing or invalid. Start a new Handoff session from the UploadFlow side panel.
              </p>
            </div>
          ) : pairing ? (
            <div className="uf-stack">
              <div className="uf-code">
                <span className="uf-code-label">Confirm this code on your computer</span>
                <strong className="uf-code-value uf-mono">{pairing.code}</strong>
                <span className="uf-small uf-mono">Session {pairing.id.slice(0, 8)}</span>
              </div>

              <label className="uf-drop">
                <strong style={{ display: 'block', color: 'var(--uf-text)' }}>Choose media</strong>
                <span className="uf-small">Images, video, or audio</span>
                <input type="file" multiple accept="image/*,video/*,audio/*" disabled className="uf-field" style={{ marginTop: 10 }} />
              </label>

              <p className="uf-limit">
                <b>Transport not connected yet.</b> Encrypted pairing exists in the development foundation, but live signalling and the
                temporary encrypted relay are not connected in this build — this page cannot send files yet.
              </p>
            </div>
          ) : (
            <div className="uf-card uf-card-flat uf-stack-6">
              <span className="uf-chip uf-chip-live">Reading pairing invitation</span>
              <p className="uf-small">Validating the temporary session locally…</p>
            </div>
          )}

          <div className="uf-handoff-foot">
            <span>Temporary</span>
            <span>Confirmed</span>
            <span>Encrypted</span>
          </div>
        </section>
      </main>
    </div>
  );
}
