/**
 * Shared product vocabulary.
 *
 * The rest of this module was marketing data for the previous design and is
 * gone; the two exports below are what the current site actually consumes.
 * Page copy lives in `components/site/content.ts`, `components/how-it-works/content.ts`
 * and `components/whats-new/content.ts`.
 */
export type ProductStatus = 'available' | 'beta' | 'early' | 'experimental' | 'next' | 'planned';

export const productStatus: Record<ProductStatus, { label: string; detail: string }> = {
  available: { label: 'Available Now', detail: 'Included in the Chrome Web Store build.' },
  beta: { label: 'In beta', detail: 'Shipped and actively changing.' },
  early: { label: 'Early Access', detail: 'Groundwork exists; the complete workflow does not.' },
  experimental: { label: 'Experimental', detail: 'Not reachable in a stable build.' },
  next: { label: 'Coming next', detail: 'Being prepared for an upcoming release.' },
  planned: { label: 'Planned', detail: 'On the roadmap, with scope still subject to change.' }
};

export const chromeWebStoreUrl = 'https://chromewebstore.google.com/detail/uploadflow/geaebpfeoobmmdodclaglapichfalifh';
