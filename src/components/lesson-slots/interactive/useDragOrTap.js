import { useState } from 'react'

// Pointer-events drag with a tap-to-place fallback.
//
// Two reasons this isn't HTML5 drag-and-drop: it does not fire on touch at all,
// and it has no keyboard equivalent. Pointer events cover mouse, pen and touch
// in one path, and the tap mode doubles as the keyboard path — select a chip
// with Enter, then activate a zone with Enter.
//
// Drop targets are found with elementFromPoint + a `data-drop-zone` attribute,
// so neither side has to track or invalidate bounding boxes on resize.

const DRAG_THRESHOLD_PX = 6

function zoneAtPoint(x, y) {
  const el = document.elementFromPoint(x, y)
  return el?.closest('[data-drop-zone]')?.getAttribute('data-drop-zone') ?? null
}

export function useDragOrTap({ onDrop, disabled = false }) {
  const [selectedId, setSelectedId] = useState(null)
  const [drag, setDrag] = useState(null)

  function endDrag(clientX, clientY, moved, id) {
    setDrag(null)
    if (!moved) {
      // A tap: arm this chip, or disarm it if it was already armed.
      setSelectedId((prev) => (prev === id ? null : id))
      return
    }
    const zoneId = zoneAtPoint(clientX, clientY)
    if (zoneId) {
      onDrop(id, zoneId)
      setSelectedId(null)
    }
  }

  function getItemProps(id) {
    if (disabled) return {}
    return {
      'data-drag-item': id,
      onPointerDown: (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return
        e.currentTarget.setPointerCapture?.(e.pointerId)
        setDrag({ id, x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, moved: false })
      },
      onPointerMove: (e) => {
        setDrag((prev) => {
          if (!prev || prev.id !== id) return prev
          const moved =
            prev.moved ||
            Math.hypot(e.clientX - prev.startX, e.clientY - prev.startY) > DRAG_THRESHOLD_PX
          return { ...prev, x: e.clientX, y: e.clientY, moved }
        })
      },
      onPointerUp: (e) => {
        e.currentTarget.releasePointerCapture?.(e.pointerId)
        const moved =
          drag?.id === id &&
          Math.hypot(e.clientX - (drag.startX ?? 0), e.clientY - (drag.startY ?? 0)) >
            DRAG_THRESHOLD_PX
        endDrag(e.clientX, e.clientY, moved, id)
      },
      onPointerCancel: () => setDrag(null),
      // Keyboard path: the chip is a real button, so Enter/Space lands here.
      onKeyDown: (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        setSelectedId((prev) => (prev === id ? null : id))
      },
    }
  }

  function getZoneProps(zoneId) {
    if (disabled) return { 'data-drop-zone': zoneId }
    return {
      'data-drop-zone': zoneId,
      onClick: () => {
        if (!selectedId) return
        onDrop(selectedId, zoneId)
        setSelectedId(null)
      },
    }
  }

  const isDragging = !!drag?.moved

  return {
    selectedId,
    clearSelection: () => setSelectedId(null),
    getItemProps,
    getZoneProps,
    isDragging,
    // Position for a floating copy of the chip while a drag is in flight.
    ghost: isDragging ? { id: drag.id, x: drag.x, y: drag.y } : null,
  }
}
