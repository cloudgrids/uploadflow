import { authedRequest } from './session';
import type { CampaignChannel } from './campaigns';
import type { PlanId } from '../../components/site/plansContent';

/**
 * Announcements: composing them, seeing what they would reach, and retiring them.
 *
 * The one rule worth carrying into every screen that uses this: **an announcement cannot be
 * unsent.** It can be expired or retired, both of which stop it being served from that moment on,
 * and neither of which unsees it. So the audience preview is not a nicety — it is the only step
 * between meaning to tell a segment and telling everybody.
 */

/** How loudly it reads to somebody. Lowest first, so the composer can default to the quietest. */
export const SEVERITIES = ['INFO', 'SUCCESS', 'WARNING', 'CRITICAL'] as const;
export type Severity = (typeof SEVERITIES)[number];

/**
 * Where an announcement is in its life. **Derived from the window on every read, never stored** —
 * so it is reported here and never chosen. Scheduling something is giving it a future start.
 */
export type AnnouncementPhase = 'SCHEDULED' | 'LIVE' | 'EXPIRED' | 'RETIRED';

/**
 * Who it is for. A filter rather than a mailing list.
 *
 * **Empty means everyone**, which is the broadest audience rather than the narrowest — worth
 * knowing before assuming an unfilled form is safe.
 */
export interface Audience {
  channels?: CampaignChannel[];
  plans?: PlanId[];
  /** Matched against a signed-in caller only. */
  userIds?: string[];
}

/** How broad an audience is, before any number is read. */
export type AudienceScope = 'everyone' | 'people' | 'segment';

export interface AudiencePreview {
  scope: AudienceScope;
  installations: number;
  accounts: number;
  /** The same population with no filter, so a share can be read rather than a bare count. */
  totalInstallations: number;
  activeSince: string;
  /** Ids matching no account. What a mis-pasted list looks like, and otherwise silent. */
  unknownUserIds: string[];
}

export interface Announcement {
  id: string;
  title: string;
  bodyMd: string;
  severity: Severity;
  phase: AnnouncementPhase;
  audience: Audience;
  actionUrl: string | null;
  actionLabel: string | null;
  startsAt: string | null;
  endsAt: string | null;
  /** Installations that acknowledged it — the nearest thing to a delivery confirmation. */
  seenCount: number;
  dismissedCount: number;
  createdAt: string;
  updatedAt: string;
  retiredAt: string | null;
}

export interface AnnouncementPage {
  items: Announcement[];
  total: number;
  limit: number;
  offset: number;
  /** The read hit its ceiling, so this listing is incomplete and says so rather than implying it is all. */
  truncated: boolean;
}

export interface AnnouncementDraft {
  /** Omitted creates; supplied corrects. */
  id?: string;
  title: string;
  bodyMd: string;
  severity?: Severity;
  audience?: Audience;
  actionUrl?: string;
  actionLabel?: string;
  startsAt?: string;
  endsAt?: string;
}

export const ANNOUNCEMENT_PAGE_SIZE = 25;

export function listAnnouncements(
  query: { phase?: AnnouncementPhase; offset?: number; limit?: number } = {},
  signal?: AbortSignal
): Promise<AnnouncementPage> {
  const params = new URLSearchParams({
    offset: String(query.offset ?? 0),
    limit: String(query.limit ?? ANNOUNCEMENT_PAGE_SIZE)
  });
  if (query.phase) params.set('phase', query.phase);
  return authedRequest<AnnouncementPage>(`/announcements/all?${params}`, { signal });
}

/**
 * What an audience would reach. **Writes nothing**, despite the method — it takes a nested body,
 * which is the whole reason it is not a `GET`.
 */
export function previewAudience(audience: Audience, signal?: AbortSignal): Promise<AudiencePreview> {
  return authedRequest<AudiencePreview>('/announcements/audience/preview', { method: 'POST', body: audience, signal });
}

export function saveAnnouncement(draft: AnnouncementDraft, signal?: AbortSignal): Promise<Announcement> {
  return authedRequest<Announcement>('/announcements', { method: 'POST', body: draft, signal });
}

/** Stops it being served. Soft, so the record of who saw it survives. */
export function retireAnnouncement(id: string, signal?: AbortSignal): Promise<boolean> {
  return authedRequest<boolean>(`/announcements/${encodeURIComponent(id)}`, { method: 'DELETE', signal });
}
