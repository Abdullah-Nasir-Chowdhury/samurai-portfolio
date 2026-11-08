import { useEffect } from 'react';
import ChibiToast from './ChibiToast';
import { useToastTurn } from './toastQueue';

// After a visitor has had the page visible for a minute, the chibi bows and says thanks.
// Shows once per browser session. Add ?thanks to the URL to see it after 3 seconds.
// It waits its turn if another toast or the omikuji is up.

const WAIT_MS = 60_000;
const SESSION_KEY = 'thanks-toast-shown';

const readFlag = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } };
const writeFlag = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage blocked */ } };

export default function ThankYouToast({ colors }) {
  const [open, ask, done] = useToastTurn('thanks');

  // Count only visible time, then ask for a turn once
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has('thanks');
    if (!preview && readFlag()) return;
    const wait = preview ? 3_000 : WAIT_MS;
    let visibleMs = 0;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === 'visible') visibleMs += now - last;
      last = now;
      if (visibleMs >= wait) {
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
      action="bow"
      jp="ありがとうございます"
      en="Thank you for spending a minute here. It means a lot."
      chibiLabel="Pixel chibi of Abdulla bowing"
    />
  );
}
