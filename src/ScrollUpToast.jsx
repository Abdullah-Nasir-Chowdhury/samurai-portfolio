import { useEffect } from 'react';
import ChibiToast from './ChibiToast';
import { useToastTurn } from './toastQueue';

// When someone on a phone taps the Frontend card while the photo is scrolled off screen,
// a playful text-only toast hints that something changed, and leaves finding it to them.
// The page asks for it; add ?scrollup to the URL to preview it after 2 seconds.
//
// Shelved for now: the pointing chibi (hops, looks up, one arm pumping at the sky, the other flapping).
// To bring it back, remove showChibi={false} and add:
//   action="point"
//   chibiLabel="Pixel chibi of Abdulla hopping and pointing up"
// The pose itself lives in chibiSprite.js as chibi.point().

export const SCROLL_UP_ID = 'scroll-up';

export default function ScrollUpToast({ colors }) {
  const [open, ask, done] = useToastTurn(SCROLL_UP_ID);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('scrollup')) return;
    const id = setTimeout(() => ask({ front: true }), 2_000);
    return () => clearTimeout(id);
  }, [ask]);

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
