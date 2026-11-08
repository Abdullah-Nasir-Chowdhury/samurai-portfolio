import { useEffect } from 'react';
import ChibiToast from './ChibiToast';
import { useToastTurn } from './toastQueue';

// Once someone has had the page visible for 10 seconds, the chibi pops up waving and asks about the easter eggs.
// Shows once per browser session. Add ?welcome to the URL to see it every time.
// It waits its turn if another toast or the omikuji is up.

const WAIT_MS = 10_000;
const SESSION_KEY = 'welcome-toast-shown';

const readFlag = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } };
const writeFlag = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage blocked */ } };

export default function WelcomeToast({ colors }) {
  const [open, ask, done] = useToastTurn('welcome');

  // Count only time the tab is visible, then ask for a turn once
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.has('welcome');
    if (params.has('thanks')) return; // keep the thank-you preview on its own
    if (!preview && readFlag()) return;
    let visibleMs = 0;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === 'visible') visibleMs += now - last;
      last = now;
      if (visibleMs >= WAIT_MS) {
        clearInterval(id);
        if (!preview) writeFlag();
        ask();
      }
    }, 250);
    return () => clearInterval(id);
  }, [ask]);

  return (
    <ChibiToast
      colors={colors}
      open={open}
      onClose={done}
      action="wave"
      jp="ようこそ！"
      jpSub="ゆっくりしていってください"
      chibiLabel="Pixel chibi of Abdulla waving hello"
    />
  );
}
