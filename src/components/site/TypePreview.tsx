'use client';

import { useEffect, useState } from 'react';

/**
 * TEMPORARY, DEVELOPMENT ONLY.
 *
 * Lets you browse the real pages with different heading treatments before
 * settling on one. It renders `null` in production builds, so nothing ships;
 * delete this file and its two mounts in SitePage/SiteLanding once a direction
 * is chosen, then hard-code the winning values in `globals.css`.
 *
 * The choice persists in localStorage so it survives navigation between pages.
 */

const FACES = [
  { id: 'figtree', label: 'Figtree', stack: 'Figtree, "Figtree Variable", Inter, ui-sans-serif, system-ui, sans-serif' },
  { id: 'inter', label: 'Inter', stack: 'Inter, "Inter Variable", ui-sans-serif, system-ui, sans-serif' },
  { id: 'system', label: 'System', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  { id: 'avenir', label: 'Avenir', stack: '"Avenir Next", Avenir, "Nimbus Sans", system-ui, sans-serif' },
  { id: 'helvetica', label: 'Helvetica', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: 'grotesk', label: 'Grotesk', stack: '"Space Grotesk", "DM Sans", Inter, system-ui, sans-serif' },
  { id: 'serif', label: 'Serif', stack: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif' },
  { id: 'mono', label: 'Mono', stack: 'ui-monospace, "SF Mono", Menlo, "Cascadia Mono", monospace' }
];

const WEIGHTS = ['600', '700', '800', '900'];
const TRACKS = ['-0.045rem', '-0.02em', '0em', '0.04em'];

interface Settings {
  face: string;
  italic: boolean;
  upper: boolean;
  weight: string;
  track: string;
}

const DEFAULTS: Settings = { face: 'avenir', italic: true, upper: true, weight: '700', track: '-0.045rem' };
// Bump when DEFAULTS change, so a stale stored value cannot silently mask the
// shipped design. DEFAULTS must mirror the --uf-head-* values in globals.css.
const KEY = 'uf-type-preview-v2';

/** Runs during lazy state init; guarded because this component is server-rendered too. */
function readStored(): Settings {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const saved = window.localStorage.getItem(KEY);
    return saved ? { ...DEFAULTS, ...(JSON.parse(saved) as Partial<Settings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function apply(settings: Settings) {
  const root = document.documentElement;
  const face = FACES.find((f) => f.id === settings.face) ?? FACES[0];
  root.style.setProperty('--uf-head', face.stack);
  root.style.setProperty('--uf-head-style', settings.italic ? 'italic' : 'normal');
  root.style.setProperty('--uf-head-case', settings.upper ? 'uppercase' : 'none');
  root.style.setProperty('--uf-head-weight', settings.weight);
  root.style.setProperty('--uf-head-track', settings.track);
  root.style.setProperty('--uf-head-track-lg', settings.track);
}

export function TypePreview() {
  // Lazy init reads storage without a setState-in-effect. Nothing rendered on
  // the first pass depends on it — the panel starts closed and the toggle label
  // is static — so server and client markup agree.
  const [settings, setSettings] = useState<Settings>(readStored);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    apply(settings);
  }, [settings]);

  // Functional update: two clicks batched into one render must not both read
  // the same stale `settings` and clobber each other.
  const update = (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore quota / private-mode failures */
      }
      return next;
    });
  };

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="uf-typedock">
      <button type="button" className="uf-typedock-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        Aa Type
      </button>

      {open ? (
        <div className="uf-typedock-panel">
          <span className="uf-typedock-label">Typeface</span>
          <div className="uf-typedock-row">
            {FACES.map((face) => (
              <button
                key={face.id}
                type="button"
                onClick={() => update({ face: face.id })}
                aria-pressed={settings.face === face.id}
                style={{ fontFamily: face.stack }}
              >
                {face.label}
              </button>
            ))}
          </div>

          <span className="uf-typedock-label">Treatment</span>
          <div className="uf-typedock-row">
            <button type="button" onClick={() => update({ upper: !settings.upper })} aria-pressed={settings.upper}>
              UPPERCASE
            </button>
            <button type="button" onClick={() => update({ italic: !settings.italic })} aria-pressed={settings.italic}>
              <i>Italic</i>
            </button>
          </div>

          <span className="uf-typedock-label">Weight</span>
          <div className="uf-typedock-row">
            {WEIGHTS.map((weight) => (
              <button key={weight} type="button" onClick={() => update({ weight })} aria-pressed={settings.weight === weight}>
                {weight}
              </button>
            ))}
          </div>

          <span className="uf-typedock-label">Tracking</span>
          <div className="uf-typedock-row">
            {TRACKS.map((track) => (
              <button key={track} type="button" onClick={() => update({ track })} aria-pressed={settings.track === track}>
                {track}
              </button>
            ))}
          </div>

          <div className="uf-typedock-row">
            <button type="button" onClick={() => update(DEFAULTS)}>
              Reset to current
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
