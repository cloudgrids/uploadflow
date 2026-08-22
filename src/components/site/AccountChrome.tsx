import type { ReactNode } from 'react';
import { Logo, SiteFooter } from './SiteChrome';
import { ThemeToggle } from './ThemeToggle';

/**
 * The shell for somebody who is already signed in.
 *
 * The marketing header sells the product and offers a way to sign in. Neither is much use to a
 * person who has bought it and is signed in, so this drops the call to action and the account link
 * and keeps a short row of the pages an account holder might actually want next.
 *
 * The footer is the shared one, because a signed-in reader still needs the privacy notice and the
 * legal line as much as anybody else.
 */
const ACCOUNT_LINKS = [
  { href: '/plans', label: 'Plans' },
  { href: '/drops', label: 'Drops' },
  { href: '/support', label: 'Support' }
];

export function AccountChrome({ children }: { children: ReactNode }) {
  return (
    <div className="uf">
      <div className="uf-inner">
        <header className="uf-bar">
          <div className="uf-bar-in">
            <Logo tagline="Private toolkit" />
            <span className="uf-bar-spacer" />
            <nav aria-label="Main navigation">
              {ACCOUNT_LINKS.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </header>
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
