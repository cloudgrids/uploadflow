import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Joins class names and lets a later one win over an earlier one of the same kind.
 *
 * Every component under `components/ui` is written against this, because that is the shape they
 * arrive in and rewriting it in each one is how a copied component starts drifting from the
 * upstream it can still be diffed against.
 *
 * Nothing outside `components/ui` needs it. The rest of the site styles with `uf-` classes, which
 * do not collide and so have nothing to merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
