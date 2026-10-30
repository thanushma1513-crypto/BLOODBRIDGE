import { useEffect, useRef } from 'react';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260908_073327_03643c0a-db33-417a-ae8f-4a39259c7f9c.mp4';
const TAU = Math.PI * 2;

// Calibrated from the supplied reference's cardinal-direction checks.
// Full gaze-frames.json was not included in the pasted source, so this keeps
// the interaction smooth without inventing a different eye animation.
const gazePoints: Array<[number, number]> = [
  [0, 2.54167],
  [Math.PI / 2, 0.33333],
  [Math.PI, 1.0],
  [Math.PI * 1.5, 1.70833],
  [TAU, 2.54167],
];

function wrapAngle(angle: number) {
  return (angle % TAU + TAU) % TAU;
}

function timeForAngle(angle: number) {
  const target = wrapAngle(angle);
  for (let i = 0; i < gazePoints.length - 1; i += 1) {
    const [a1, t1] = gazePoints[i];
    const [a2, t2] = gazePoints[i + 1];
    if (target <= a2) {
      const p = (target - a1) / (a2 - a1);
      return t1 + (t2 - t1) * p;
    }
  }
  return gazePoints[0][1];
}

export default function AnimatedFooterBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let disposed = false;
    let pointer: { x: number; y: number } | null = null;
    let desiredTime = 0;
    let seeking = false;

    const mobile = window.matchMedia('(max-width: 700px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const applyMobilePlayback = () => {
      if (mobile.matches) {
        if (reducedMotion.matches) {
          video.pause();
        } else {
          void video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    };

    const seek = () => {
      raf = 0;
      if (disposed || mobile.matches || video.readyState < 2 || seeking) return;
      const duration = Number.isFinite(video.duration) ? video.duration : 7.041667;
      const maxTime = Math.max(0, duration - 1 / 24);
      const next = Math.min(Math.max(desiredTime, 0), maxTime);
      if (Math.abs(video.currentTime - next) < 1 / 48) return;
      seeking = true;
      try {
        video.currentTime = next;
      } catch {
        seeking = false;
      }
    };

    const scheduleSeek = () => {
      if (!raf) raf = requestAnimationFrame(seek);
    };

    const updateTarget = () => {
      if (mobile.matches || !pointer) return;
      const rect = video.getBoundingClientRect();
      const scale = Math.max(rect.width / 1920, rect.height / 1080);
      const eyeX = rect.left + rect.width / 2 + (948 - 960) * scale;
      const eyeY = rect.top + rect.height / 2 + (418 - 540) * scale;
      const dx = pointer.x - eyeX;
      const dy = pointer.y - eyeY;
      if (Math.hypot(dx, dy) <= 8) return;
      desiredTime = timeForAngle(Math.atan2(dy, dx));
      scheduleSeek();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      updateTarget();
    };
    const onResizeOrScroll = () => updateTarget();
    const onSeeked = () => {
      seeking = false;
      if (!mobile.matches) scheduleSeek();
    };
    const onMediaChange = () => applyMobilePlayback();

    video.addEventListener('seeked', onSeeked);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResizeOrScroll, { passive: true });
    window.addEventListener('scroll', onResizeOrScroll, { passive: true });
    mobile.addEventListener?.('change', onMediaChange);
    reducedMotion.addEventListener?.('change', onMediaChange);

    applyMobilePlayback();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResizeOrScroll);
      window.removeEventListener('scroll', onResizeOrScroll);
      mobile.removeEventListener?.('change', onMediaChange);
      reducedMotion.removeEventListener?.('change', onMediaChange);
    };
  }, []);

  return (
    <div className="animated-footer-background" aria-hidden="true">
      <video ref={videoRef} muted playsInline preload="auto" loop src={VIDEO_URL} />
    </div>
  );
}
