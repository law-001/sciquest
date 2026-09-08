import { getAvatar } from '../lib/avatars';
import { AVATAR_BACKGROUNDS, AVATAR_STICKERS, normalizeAvatarStyle } from '../lib/avatar-personalization';
import { AvatarCharacter } from './AvatarCharacter';

export function AvatarSticker({ stickerId }) {
  const sticker = AVATAR_STICKERS.find((s) => s.id === stickerId);
  if (!sticker) return null;
  const { Glyph, color } = sticker;
  return <svg viewBox="0 0 32 32" className={`w-full h-full overflow-visible ${color}`} aria-hidden="true">
    <Glyph x="4" y="4" width="24" height="24" className="text-white" strokeWidth="5" />
    <Glyph x="4" y="4" width="24" height="24" strokeWidth="2.5" />
  </svg>;
}

// Percentage coordinates keep the saved design identical at all display sizes.
export function Avatar({ avatarId, avatarStyle, name = '', size = 64, className = '' }) {
  const avatar = getAvatar(avatarId);
  const style = normalizeAvatarStyle(avatarStyle);
  const background = AVATAR_BACKGROUNDS.find((b) => b.id === style.background);
  const original = style.background === 'original';
  const gradient = original ? `bg-gradient-to-br ${avatar?.gradient ?? 'from-primary-500 to-amber-400'}` : background.className;
  const Glyph = avatar?.Glyph;
  return <div role="img" aria-label={`${name || avatar?.label || 'Initial'} profile picture${style.stickers.length ? ` with ${style.stickers.length} stickers` : ''}`}
    className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white ${gradient} ${className}`}
    style={{ width: size, height: size }}>
    {avatar?.kind === 'image' ? <img src={`${import.meta.env.BASE_URL}${avatar.src.replace(/^\//, '')}`} alt="" width={size} height={size} loading="lazy" draggable={false}
      className="rounded-full object-cover" style={{ width: original ? '100%' : '84%', height: original ? '100%' : '84%' }} />
      : avatar?.kind === 'character' ? <AvatarCharacter character={avatar.character} />
        : Glyph ? <Glyph style={{ width: size * 0.5, height: size * 0.5 }} aria-hidden="true" />
          : <span className="font-black font-heading" style={{ fontSize: size * 0.4 }}>{(name.trim().charAt(0) || 'S').toUpperCase()}</span>}
    {style.stickers.map((s) => <span key={s.id} className="absolute pointer-events-none" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}%`, height: `${s.size}%`, transform: `translate(-50%, -50%) rotate(${s.rotation}deg)` }}><AvatarSticker stickerId={s.stickerId} /></span>)}
  </div>;
}
