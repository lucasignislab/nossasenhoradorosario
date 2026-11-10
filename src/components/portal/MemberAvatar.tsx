import { profileDisplayName, profileInitial } from '@/lib/members';
import type { Profile } from '@/types';

/** Foto do membro nas listas do portal; cai na inicial quando não há foto. */
export function MemberAvatar({ member }: { member: Profile }) {
  if (member.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={member.avatar_url} alt={`Foto de ${profileDisplayName(member)}`} className="portal-member-avatar" />
    );
  }
  return <span>{profileInitial(member)}</span>;
}
