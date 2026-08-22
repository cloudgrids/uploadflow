import { SESSION_HINT_COOKIE } from '../../lib/api/sessionHint';

/**
 * The attribute on `<html>` that says somebody is signed in, and the script that sets it.
 *
 * Both live here so the selector in `globals.css`, the script below and the component that corrects
 * it after hydration cannot drift apart — the failure would be silent and would look exactly like
 * the flicker this exists to remove.
 */
export const SESSION_FLAG = 'data-uf-session';

/**
 * Runs before the first paint, from the cookie alone.
 *
 * It reads a hint that carries no credential and grants nothing — see `sessionHint.ts` — so the
 * worst a wrong one does is show the wrong word for a moment before hydration corrects it. It is
 * wrapped in a `try` because a page that fails to render over an unreadable cookie would be a far
 * worse bug than the one being fixed.
 */
export const SESSION_FLAG_SCRIPT = `try{var m=document.cookie.match(/(?:^|; )${SESSION_HINT_COOKIE.replace('.', '\\\\.')}=([^;]*)/);var h=m&&JSON.parse(decodeURIComponent(m[1]));if(h&&h.e>Date.now())document.documentElement.setAttribute('${SESSION_FLAG}','')}catch(e){}`;
