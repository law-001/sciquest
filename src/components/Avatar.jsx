import React from 'react'
import { getAvatar } from '../lib/avatars'

// Renders a student's chosen avatar from the curated catalog, falling
// back to an initial-based circle when none is set or the id is stale.
//
// `size` is the diameter in px so the same component works for the small
// header avatar and the larger modal preview.
export function Avatar({ avatarId, name = '', size = 64, className = '' }) {
  const avatar = getAvatar(avatarId)
  const initial = (name.trim().charAt(0) || 'S').toUpperCase()
  const box = { width: size, height: size }

  if (avatar?.kind === 'image') {
    return (
      <img
        src={avatar.src}
        alt={avatar.label}
        width={size}
        height={size}
        loading="lazy"
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={box}
      />
    )
  }

  if (avatar?.kind === 'svg') {
    const { Glyph, gradient, label } = avatar
    return (
      <div
        role="img"
        aria-label={label}
        className={`rounded-full shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center text-white ${className}`}
        style={box}
      >
        <Glyph style={{ width: size * 0.5, height: size * 0.5 }} aria-hidden="true" />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={name || 'Avatar'}
      className={`rounded-full shrink-0 bg-primary-500 flex items-center justify-center font-black text-white font-heading ${className}`}
      style={{ ...box, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  )
  
}
