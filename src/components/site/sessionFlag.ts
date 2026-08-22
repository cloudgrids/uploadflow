import { SESSION_HINT_COOKIE } from '../../lib/api/sessionHint';

/**
 * The attribute on `<html>` that says somebody is signed in, and the script that sets it.
 *
 * Both live here so the selector in `globals.css`, the script below and the component that corrects
 * it after hydration cannot drift apart — the failure would be silent and would look exactly like
 * the flicker this exists to remove.
 */
export const SESSION_FLAG = 'data-uf-session';

/** Where the value starts, once the name and its `=` are behind us. */
const PREFIX = `${SESSION_HINT_COOKIE}=`;

/**
 * Runs before the first paint, from the cookie alone.
 *
 * It reads a hint that carries no credential and grants nothing — see `sessionHint.ts` — so the
 * worst a wrong one does is show the wrong word for a moment before hydration corrects it. It is
 * wrapped in a `try` because a page that fails to render over an unreadable cookie would be a far
 * worse bug than the one being fixed.
 *
 * **It finds the cookie by prefix rather than by regular expression, and that is the fix rather
 * than the style.** The name contains a dot, so it has to be escaped to go into a pattern; the
 * escape was written for the string literal and then again for the regular expression, and what
 * shipped looked for a literal backslash in the middle of the cookie name. It matched nothing, ever,
 * in production, and it was silent — the flag was still set a moment later by hydration, which is
 * exactly the flicker this exists to remove and exactly what made it invisible.
 *
 * A prefix comparison needs no escaping, so the class of bug is gone rather than corrected.
 */
export const SESSION_FLAG_SCRIPT = `try{var p=${JSON.stringify(PREFIX)},c=document.cookie.split("; "),i=0,h;for(;i<c.length;i++){if(c[i].indexOf(p)===0){h=JSON.parse(decodeURIComponent(c[i].slice(p.length)));if(h&&h.e>Date.now())document.documentElement.setAttribute(${JSON.stringify(SESSION_FLAG)},"");break}}}catch(e){}`;
