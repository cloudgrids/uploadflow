import { NextResponse, type NextRequest } from 'next/server';

/**
 * Tells a layout which page it is wrapping.
 *
 * A layout is given no pathname — it renders for many of them, so there is nothing to hand it. The
 * gates need one anyway, to send somebody back where they were going once they have signed in, and
 * a header set here is how it reaches them.
 *
 * **This does no gating of its own, deliberately.** A proxy runs before anything is rendered, which
 * makes it a tempting place to put an access decision and a bad one to put it in: it cannot read
 * the session, because the tokens live in local storage, so anything it decided would rest on a
 * cookie that carries no authority. The decision belongs where it can be honest about what it
 * knows — the group layout for *is anybody signed in*, and the API for everything else.
 *
 * Named `proxy` rather than `middleware` because the older convention is deprecated and warns on
 * every build. The rename is not cosmetic: the name it warns about is the one that invites exactly
 * the misuse above.
 */
export const PATHNAME_HEADER = 'x-uf-pathname';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.set(PATHNAME_HEADER, `${pathname}${search}`);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  /**
   * Everything a person navigates to, and nothing a browser fetches on their behalf.
   *
   * The build's own assets, the icons and the one API route gain nothing from a header and would
   * pay for it on every request.
   */
  matcher: ['/((?!_next/static|_next/image|api/|favicon|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|mp4|webm|txt|xml)$).*)']
};
