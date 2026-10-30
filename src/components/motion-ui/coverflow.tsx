import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export function CoverflowItem({ children, label }: { children: React.ReactNode; label?: string }) {
  return <div aria-label={label} className="w-full">{children}</div>;
}

export function Coverflow({
  items,
  rotation = 22,
  'aria-label': ariaLabel,
  children,
}: {
  items: React.ReactNode[];
  rotation?: number;
  'aria-label'?: string;
  children?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const total = items.length;

  const go = (next: number) => setIndex((next + total) % total);
  const current = items[index];
  const prev = items[(index - 1 + total) % total];
  const next = items[(index + 1) % total];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') go(index - 1);
      if (event.key === 'ArrowRight') go(index + 1);
    };
    const onControl = (event: Event) => {
      const detail = (event as CustomEvent<number>).detail;
      setIndex((detail >= 0 && detail < total) ? detail : (index + detail + total) % total);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('bloodbridge-coverflow-control', onControl);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('bloodbridge-coverflow-control', onControl);
    };
  }, [index, total]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('bloodbridge-coverflow-change', { detail: { index, total } }));
  }, [index, total]);

  const sideStyle = useMemo(() => ({
    width: 'min(560px, 72vw)',
  }), []);

  return (
    <div className="relative w-full" role="region" aria-label={ariaLabel}>
      <div className="relative mx-auto flex min-h-[250px] w-full max-w-5xl items-center justify-center overflow-hidden px-2 sm:min-h-[285px] sm:px-8">
        <motion.div
          key={`prev-${index}`}
          className="absolute hidden opacity-45 blur-[0.2px] md:block"
          style={sideStyle}
          initial={{ opacity: 0, x: -80, rotateY: rotation }}
          animate={{ opacity: 0.42, x: '-58%', rotateY: rotation }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          aria-hidden="true"
        >
          {prev}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="relative z-20 w-full max-w-2xl [perspective:1200px]"
            initial={{ opacity: 0, x: 80, rotateY: -rotation, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, x: -80, rotateY: rotation, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.22}
            onDragEnd={(_, info) => {
              if (info.offset.x < -55) go(index + 1);
              if (info.offset.x > 55) go(index - 1);
            }}
          >
            {current}
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={`next-${index}`}
          className="absolute hidden opacity-45 md:block"
          style={sideStyle}
          initial={{ opacity: 0, x: 80, rotateY: -rotation }}
          animate={{ opacity: 0.42, x: '58%', rotateY: -rotation }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          aria-hidden="true"
        >
          {next}
        </motion.div>
      </div>
      {children}
    </div>
  );
}

export function CoverflowControls({
  announce,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  dotsLabel = 'Choose',
}: {
  announce?: (index: number, total: number) => string;
  prevLabel?: string;
  nextLabel?: string;
  dotsLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(3);
  // The controls communicate with the nearest Coverflow through a lightweight DOM event.
  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{index: number; total: number}>).detail;
      setIndex(detail.index);
      setTotal(detail.total);
    };
    window.addEventListener('bloodbridge-coverflow-change', onChange);
    return () => window.removeEventListener('bloodbridge-coverflow-change', onChange);
  }, []);

  const dispatch = (next: number) => {
    window.dispatchEvent(new CustomEvent('bloodbridge-coverflow-control', { detail: next }));
  };

  return (
    <div className="mt-5 flex flex-col items-center gap-3">
      <span className="sr-only" aria-live="polite">{announce ? announce(index, total) : `Item ${index + 1} of ${total}`}</span>
      <div className="flex items-center gap-2">
        <button type="button" aria-label={prevLabel} onClick={() => dispatch(-1)} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-red-500/60 hover:text-white">←</button>
        <div className="flex items-center gap-1.5" aria-label={dotsLabel}>
          {Array.from({ length: total }, (_, dot) => (
            <button key={dot} type="button" aria-label={`${dotsLabel} ${dot + 1}`} onClick={() => dispatch(dot)} className={`h-2 rounded-full transition-all ${index === dot ? 'w-6 bg-red-500' : 'w-2 bg-slate-700 hover:bg-slate-500'}`} />
          ))}
        </div>
        <button type="button" aria-label={nextLabel} onClick={() => dispatch(1)} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-red-500/60 hover:text-white">→</button>
      </div>
    </div>
  );
}
