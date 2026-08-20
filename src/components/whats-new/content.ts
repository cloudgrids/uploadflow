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
    headline: 'The full editor is free, and the workspace is yours.',
    summary:
      'The first Chrome Web Store release. The full editor moves into the free plan, cutout gains real backdrops, media drags from the shelf straight onto a page — by pointer or by keyboard — and paid features are unlocked by a signed grant your copy verifies for itself.',
    changes: [
      {
        kind: 'changed',
        title: 'The full editor is part of the free plan',
        copy: 'Queue a file on any page and open it in the editor without a subscription.'
      },
      {
        kind: 'added',
        title: 'Cutout puts a backdrop behind the subject',
        copy: 'Keep it transparent, pick a colour, blur the original, or composite onto another image you added. Every backdrop still exports PNG.'
      },
      {
        kind: 'added',
        title: 'Cutout shows its result while you adjust it',
        copy: 'The preview updates as you work instead of only after you apply.'
      },
      {
        kind: 'added',
        title: 'Drag media from the shelf onto a page',
        copy: 'Dropping delivers the file with or without the review overlay. A post bundle drags as every file it holds, in order.'
      },
      {
        kind: 'added',
        title: 'Place media without a mouse',
        copy: 'The grip is a real button. Activate it and the page outlines the upload areas that accept files, so you can pick one with the keyboard.'
      },
      {
        kind: 'added',
        title: 'Profile studio',
        copy: 'Nameplates and frames sit behind your display name, and every cosmetic choice is remembered.'
      },
      {
        kind: 'added',
        title: 'Minimize folds the popup to its header',
        copy: 'The folded row keeps quick switches for the Capture and upload features, and can open the side panel without unfolding first.'
      },
      {
        kind: 'changed',
        title: 'Popup navigation is an icon rail',
        copy: 'Two tiles to a row, with labels in a flyout.'
      },
      {
        kind: 'changed',
        title: 'The compression sliders measure compression',
        copy: '100% is the smallest file, and 0% leaves the original alone. The popup metric counts the files you export and how much smaller they left.'
      },
      {
        kind: 'changed',
        title: 'Paid features unlock from a signed grant',
        copy: 'Your copy of UploadFlow verifies the grant itself, and the platinum trial now has an end date instead of lasting forever.'
      },
      {
        kind: 'fixed',
        title: 'Redaction and watermark follow the pointer exactly',
        copy: 'Regions and placement track the cursor one-to-one at any aspect ratio.'
      },
      {
        kind: 'fixed',
        title: 'The picker follows what a page asked for',
        copy: 'A page that wants a single file, or only certain file types, gets exactly that.'
      },
      {
        kind: 'fixed',
        title: 'A drop always ends the drag',
        copy: 'A page never leaves its drop overlay stranded across the screen after the drag is over.'
      },
      {
        kind: 'changed',
        title: 'Media inspector and privacy scanner are switched off',
        copy: 'The inspector never appeared over a hovered image and the scanner had no panel to open. Both are off while they are rebuilt, and return when they work.'
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
