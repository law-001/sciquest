import { useEffect } from 'react'

// Warns before a refresh, a tab close, or a back-navigation out of the app
// while the editor holds unsaved changes.
//
// Browsers ignore any message we supply and show their own wording; setting
// returnValue (and calling preventDefault, which is what current Chrome
// actually looks at) is the whole contract.
export function useUnsavedChanges(isDirty) {
  useEffect(() => {
    if (!isDirty) return

    function handleBeforeUnload(e) {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])
}
