import { AnnouncementsPanel } from '../../../../components/site/operator/AnnouncementsPanel';

/** Admin and up. The rank is enforced by the API; the shell decides whether to render this. */
export default function AnnouncementsSlot() {
  return <AnnouncementsPanel />;
}
