import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

// Standard dialog keyboard behaviour for the editor modals: Escape closes,
// focus starts inside, Tab cycles within the panel instead of wandering onto
// the page underneath, and the trigger gets focus back on close.
//
// Returns a ref to spread onto the dialog panel (the inner card, not the
// backdrop). The panel needs tabIndex={-1} so it can take focus when it holds
// no controls of its own.
export function useModalDismiss(onClose) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const previouslyFocused = document.activeElement

    const first = panel.querySelector(FOCUSABLE)
    ;(first ?? panel).focus?.()

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current?.()
        return
      }
      if (e.key !== 'Tab') return

      const items = [...panel.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const firstItem = items[0]
      const lastItem = items[items.length - 1]

      // A click on the backdrop leaves focus on <body>; pull it back in rather
      // than letting the next Tab escape into the page behind the dialog.
      if (!panel.contains(document.activeElement)) {
        e.preventDefault()
        firstItem.focus()
      } else if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [])

  return panelRef
}
