import { useEffect, useState } from 'react';
import ChibiToast from './ChibiToast';

// Shortly after someone arrives, the chibi pops up waving and asks about the easter eggs.
// Shows once per browser session. Add ?welcome to the URL to see it every time.

const DELAY_MS = 1_500;
const SESSION_KEY = 'welcome-toast-shown';

const readFlag = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } };
const writeFlag = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage blocked */ } };

export default function WelcomeToast({ colors }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.has('welcome');
    if (params.has('thanks')) return; // keep the thank-you preview on its own
    if (!preview && readFlag()) return;
    const id = setTimeout(() => {
      if (!preview) writeFlag();
      setOpen(true);
    }, DELAY_MS);
    return () => clearTimeout(id);
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
