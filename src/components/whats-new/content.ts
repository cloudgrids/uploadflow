export type ReleaseState = 'development' | 'released';
export type ChangeKind = 'added' | 'changed' | 'fixed';

export interface ReleaseChange {
  kind: ChangeKind;
  title: string;
  copy: string;
}

export interface Release {
  version: string;
  state: ReleaseState;
  date: string;
  headline: string;
  summary: string;
  changes: ReleaseChange[];
}

export const changeKinds: Record<ChangeKind, { label: string; className: string }> = {
  added: { label: 'New', className: 'border-[#eefb7a]/35 bg-[#eefb7a]/10 text-[#eefb7a]' },
  changed: { label: 'Changed', className: 'border-sky-400/35 bg-sky-400/10 text-sky-300' },
  fixed: { label: 'Fixed', className: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300' }
};

export const releases = [
  {
    version: '2.2.1',
    state: 'development',
    date: 'Not yet released',
    headline: 'A workspace you can make your own.',
    summary:
      'A profile studio with animated nameplates and frames, a navigation rail that trades nine stacked buttons for icon tiles, release notes inside the extension, and a round of fixes to capture, redaction, watermarking, and background removal.',
    changes: [
      {
        kind: 'added',
        title: 'Profile nameplates',
        copy: 'Aurora, Comet, Prism, Ember, and Circuit sit behind your display name with animated gradient washes, streaks, and sparks.'
      },
      {
        kind: 'added',
        title: 'Profile frames',
        copy: 'Gold, Neon, Holographic, and Stealth wrap the full and compact profile cards with sheen, glow, and hue-cycle treatments.'
      },
      {
        kind: 'added',
        title: 'Your look is saved',
        copy: 'Avatar decoration, profile effect, banner, nameplate, and frame are stored with your profile instead of resetting when the workspace closes.'
      },
      {
        kind: 'added',
        title: 'Motion follows your system',
        copy: 'The reduced-motion preview starts from your operating system setting and follows it when you change it.'
      },
      {
        kind: 'added',
        title: 'Release notes in the extension',
        copy: 'A What’s new page opens from the workspace header, lists every catalogued release newest-first, and marks the build you are running.'
      },
      {
        kind: 'changed',
        title: 'Navigation is an icon rail',
        copy: 'Nine stacked label buttons became a column of icon tiles, two to a row. Labels appear in a flyout on hover and on keyboard focus, and the workspace keeps the width the labels used to take.'
      },
      {
        kind: 'changed',
        title: 'Keyboard and screen-reader parity',
        copy: 'Tab names stay as accessible names, arrow keys follow the tile grid and stop at the ends, and unavailable tabs still explain why. The side panel keeps its own tabs.'
      },
      {
        kind: 'changed',
        title: 'Release history reads as a timeline',
        copy: 'One rail, a node per release, the in-development version at the head in a dashed card, and highlights as separate rows rather than bullets.'
      },
      {
        kind: 'changed',
        title: 'Badges are display-only',
        copy: 'Badges are issued by UploadFlow, so the controls that implied you could add your own were removed rather than left as dead buttons.'
      },
      {
        kind: 'fixed',
        title: 'Capture complete post finds more posts',
        copy: 'Capture now survives a selected caption, a focused comment box, or a framed post, and reads media a page delivers as a CSS background, a lazy-loaded image, or content inside a web component.'
      },
      {
        kind: 'fixed',
        title: 'No more borrowed captions',
        copy: 'A post with images but no text is captured at its own container instead of climbing into the feed and attaching a neighbouring post’s caption.'
      },
      {
        kind: 'fixed',
        title: 'Redaction covers what it says it covers',
        copy: 'The region overlay now matches the pixels the redaction actually touches, and pointer tracking uses the image’s real aspect ratio, so drags follow the cursor one-to-one.'
      },
      {
        kind: 'fixed',
        title: 'Watermark click-to-position works',
        copy: 'Placement moved onto the original preview with a visible marker, and clicking the letterbox margin pans the view instead of snapping the watermark to an edge.'
      },
      {
        kind: 'fixed',
        title: 'Background removal previews live',
        copy: 'Cutout now previews as you work, like every other image tool, so its result is visible and selectable before you apply it.'
      }
    ]
  },
  {
    version: '2.1.1',
    state: 'released',
    date: '14 August 2026',
    headline: 'The baseline release.',
    summary:
      'Capture, the private media shelf, the preparation workspace, and cross-site upload handoff as documented across this site. Earlier history predates published release notes.',
    changes: []
  }
] satisfies Release[];

export const upcomingRelease = releases[0];
export const latestShippedRelease = releases.find((release) => release.state === 'released') ?? releases[releases.length - 1];

export const releaseHighlights = [
  {
    title: 'Profile studio',
    copy: 'Nameplates, frames, decorations, and banners that stay with your profile.',
    kind: 'added'
  },
  {
    title: 'Icon rail navigation',
    copy: 'Nine stacked buttons became compact icon tiles with labels on hover and focus.',
    kind: 'changed'
  },
  {
    title: 'Release notes in-product',
    copy: 'A What’s new timeline in the workspace that marks the build you are running.',
    kind: 'added'
  },
  {
    title: 'Sharper editing tools',
    copy: 'Redaction, watermark placement, and background removal behave the way the preview promises.',
    kind: 'fixed'
  }
] satisfies Array<{ title: string; copy: string; kind: ChangeKind }>;
