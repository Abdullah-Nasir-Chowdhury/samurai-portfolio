import { useEffect, useState } from 'react';
import ChibiToast from './ChibiToast';

// Once someone has had the page visible for 10 seconds, the chibi pops up waving and asks about the easter eggs.
// Shows once per browser session. Add ?welcome to the URL to see it every time.

const WAIT_MS = 10_000;
const SESSION_KEY = 'welcome-toast-shown';

const readFlag = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } };
const writeFlag = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage blocked */ } };

export default function WelcomeToast({ colors }) {
  const [open, setOpen] = useState(false);

  // Count only time the tab is visible, then open once
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
        setOpen(true);
      }
    }, 250);
    return () => clearInterval(id);
  }, []);

  return (
    <ChibiToast
      colors={colors}
      open={open}
      onClose={() => setOpen(false)}
      action="wave"
      jp="ようこそ！"
      jpSub="ゆっくりしていってください"
      chibiLabel="Pixel chibi of Abdulla waving hello"
    />
  );
}
