import { useState } from 'react';
import { getAvatar } from '../lib/avatars';
import { AVATAR_BACKGROUNDS, AVATAR_STICKERS, normalizeAvatarStyle } from '../lib/avatar-personalization';

const assetUrl = (src) => `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;

// Unmounts itself if the file is missing so a broken asset falls back to the
// layer beneath instead of showing a torn-image icon. Opacity is deliberately
// not gated on an onLoad flag: a cached image can already be complete before
// React attaches the handler, which would strand the layer invisible.
function ImageLayer({ src, fit, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null);
  if (failedSrc === src) return null;
  return <img src={assetUrl(src)} alt="" aria-hidden="true" draggable={false} loading="lazy"
    onError={() => setFailedSrc(src)}
    className={`absolute inset-0 w-full h-full ${fit} ${className}`} />;
}

export function AvatarBackgroundPreview({ background, className = '' }) {
  return <span aria-hidden="true" className={`relative block overflow-hidden rounded-full shrink-0 bg-primary-500 ${className}`}>
    {background?.src && <ImageLayer src={background.src} fit="object-cover" />}
  </span>;
}

export function AvatarSticker({ stickerId }) {
  const sticker = AVATAR_STICKERS.find((s) => s.id === stickerId);
  if (!sticker) return null;
  // A single generated sprite sheet keeps the twelve polished stickers
  // fast to load while the crop coordinates select the requested sticker.
  return <span aria-hidden="true" className="block w-full h-full bg-no-repeat"
    style={{
      backgroundImage: `url(${import.meta.env.BASE_URL}avatars/stickers/stickers.webp)`,
      backgroundSize: '400% 300%',
      backgroundPosition: `${sticker.col / 3 * 100}% ${sticker.row / 2 * 100}%`,
    }} />;
}

// Percentage coordinates keep the saved design identical at all display sizes.
export function Avatar({ avatarId, avatarStyle, name = '', size = 64, className = '' }) {
  const avatar = getAvatar(avatarId);
  const style = normalizeAvatarStyle(avatarStyle);
  const background = AVATAR_BACKGROUNDS.find((b) => b.id === style.background);
  return <div role="img" aria-label={`${name || avatar?.label || 'Initial'} profile picture${style.stickers.length ? ` with ${style.stickers.length} stickers` : ''}`}
    className={`relative isolate rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white bg-primary-500 ${className}`}
    style={{ width: size, height: size }}>
    {background?.src && <ImageLayer src={background.src} fit="object-cover" />}
    {avatar?.category === 'character' ? <ImageLayer src={avatar.src} fit="object-contain" className="z-10" />
      : avatar?.kind === 'image' ? <span className="relative z-10 block rounded-full overflow-hidden" style={{ width: '84%', height: '84%' }}><ImageLayer src={avatar.src} fit="object-cover" /></span>
        : <span className="relative z-10 font-black font-heading" style={{ fontSize: size * 0.4 }}>{(name.trim().charAt(0) || 'S').toUpperCase()}</span>}
    {style.stickers.map((s) => <span key={s.id} className="absolute z-20 pointer-events-none" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.width}%`, height: `${s.height}%`, transform: `translate(-50%, -50%) rotate(${s.rotation}deg)` }}><AvatarSticker stickerId={s.stickerId} /></span>)}
  </div>;
}
