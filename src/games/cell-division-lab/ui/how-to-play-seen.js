const STORAGE_KEY = 'cdl.how-to-play.seen';

// Storage can be unavailable (private windows, blocked site data). When it is,
// the guide simply shows again — there is nothing worth failing a run over.
export function hasSeenHowToPlay() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markHowToPlaySeen() {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* see above */
  }
}
