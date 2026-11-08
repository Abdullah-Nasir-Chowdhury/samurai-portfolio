import { request } from './toastQueue';

// Shared by ScrollUpToast and the page: the toast's id and its once-per-session flag.

export const SCROLL_UP_ID = 'scroll-up';
const SESSION_KEY = 'scroll-up-toast-shown';

const readFlag = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } };
export const markScrollUpSeen = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage blocked */ } };

// The page calls this after the Frontend card changes the photo out of view.
// Jumps the queue, but is dropped if it can't show within 4 seconds (the moment has passed).
export function askScrollUpToast() {
  if (readFlag()) return;
  request(SCROLL_UP_ID, { front: true, ttlMs: 4_000 });
}
