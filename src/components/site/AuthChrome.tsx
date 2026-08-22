import type { ReactNode } from 'react';
import { Logo } from './SiteChrome';
import { ThemeToggle } from './ThemeToggle';

/**
 * The shell for the four pages somebody is on because they are trying to get in.
 *
 * **Less than the marketing shell, on purpose.** The full header carries a six-item nav, an account
 * link and a call to action — every one of them an invitation to leave a page somebody arrived at
 * with a single thing to do. Signing in is not a moment to be sold to, and a sign-in page that
 * offers "Add to Chrome" is asking a question they have already answered.
 *
 * What survives is what a stranded person actually needs: the mark, so they can tell whose sign-in
 * page this is, and a way home. The theme control stays because it is the reader's own setting
 * rather than ours, and this is a page they may sit on for a while reading an email.
 */
export function AuthChrome({ children }: { children: ReactNode }) {
  return (
    <div className="uf">
      <div className="uf-inner">
        <header className="uf-bar">
          <div className="uf-bar-in">
            <Logo tagline="Private toolkit" />
            <span className="uf-bar-spacer" />
            <ThemeToggle />
          </div>
        </header>
        {/*
          One narrow column for the whole page, title included.
          A sign-in form is a handful of short controls, and letting it fill a desktop is what made
          an email field a thousand pixels wide with its label stranded at the far left. A form is
          easier to read when the eye does not have to travel — so this is the width the design
          system already uses for a single column of prose, and everything sits in it.
        */}
        <main className="uf-auth">{children}</main>
        <footer className="uf-foot uf-wrap">
          <div className="uf-foot-links">
            <a href="/">Home</a>
            <a href="/privacy">Privacy</a>
            <a href="/support">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
