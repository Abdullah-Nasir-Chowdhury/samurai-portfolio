import { useEffect } from 'react';
import ChibiToast from './ChibiToast';
import { useToastTurn } from './toastQueue';
import { SCROLL_UP_ID, markScrollUpSeen } from './scrollUpHint';

// When someone taps the Frontend card while the photo is scrolled out of view,
// a playful text-only toast hints that something changed, and leaves finding it to them.
// Shows once per browser session. Add ?scrollup to the URL to preview it after 2 seconds.
//
// Shelved for now: the pointing chibi (hops, looks up, one arm pumping at the sky, the other flapping).
// To bring it back, remove showChibi={false} and add:
//   action="point"
//   chibiLabel="Pixel chibi of Abdulla hopping and pointing up"
// The pose itself lives in chibiSprite.js as chibi.point().

export default function ScrollUpToast({ colors }) {
  const [open, ask, done] = useToastTurn(SCROLL_UP_ID);
  const preview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('scrollup');

  useEffect(() => {
    if (!preview) return;
    const id = setTimeout(() => ask({ front: true }), 2_000);
    return () => clearTimeout(id);
  }, [ask, preview]);

  // Count it as seen only once it has actually shown
  useEffect(() => { if (open && !preview) markScrollUpSeen(); }, [open, preview]);

  return (
    <ChibiToast
      colors={colors}
      open={open}
      onClose={done}
      showChibi={false}
      lifeMs={6_000}
      jp="あれ？何か変わったかな…？"
      en="Hmm… did something just change?"
    />
  );
}
