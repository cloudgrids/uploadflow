export const MEDIA_INSPECTOR_STYLES = `
  * { box-sizing: border-box; }
  .layer { position: fixed; inset: 0; pointer-events: none; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
  .media-action { position: fixed; width: 28px; height: 28px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.22); border-radius: 8px; background: #171717; color: #fff; box-shadow: 0 4px 18px rgba(0,0,0,.32); cursor: pointer; visibility: hidden; opacity: 0; pointer-events: none; font-size: 16px; font-weight: 800; line-height: 1; transition: opacity .12s ease, transform .15s ease, background .15s ease; }
  .media-action.visible { visibility: visible; opacity: 1; pointer-events: auto; }
  .media-action:hover { transform: translateY(-1px); background: #292929; }
  .media-action:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  .menu { position: fixed; width: min(340px, calc(100vw - 24px)); max-height: calc(100vh - 24px); overflow: auto; padding: 12px; border: 1px solid rgba(255,255,255,.14); border-radius: 12px; background: #171717; color: #fff; box-shadow: 0 18px 50px rgba(0,0,0,.42); pointer-events: auto; }
  .menu-title { margin: 0; font-size: 11px; font-weight: 850; font-style: italic; text-transform: uppercase; letter-spacing: -.01em; }
  .url { margin-top: 8px; padding: 8px; border-radius: 7px; background: rgba(255,255,255,.07); color: #a3a3a3; font: 10px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; max-height: 76px; overflow: auto; }
  .download-status { min-height: 14px; margin: 8px 0 0; color: #a3a3a3; font: 10px/1.4 Inter, ui-sans-serif, system-ui, sans-serif; }
  .download-status.error { color: #fca5a5; }
  .download-status.success { color: #6ee7b7; }
  .actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .action { display: inline-flex; align-items: center; justify-content: center; min-height: 30px; padding: 0 10px; border: 1px solid rgba(255,255,255,.14); border-radius: 7px; background: rgba(255,255,255,.07); color: #fff; text-decoration: none; cursor: pointer; font: 700 10px/1 Inter, ui-sans-serif, system-ui, sans-serif; }
  .action:hover { background: rgba(255,255,255,.14); }
  .action.primary { border-color: #fff; background: #fff; color: #171717; }
  .unavailable { color: #fbbf24; }
`;
