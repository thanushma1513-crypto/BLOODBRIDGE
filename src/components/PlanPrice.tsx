import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const PERIODS = [
  { value: 'monthly', label: 'Monthly', price: 30 },
  { value: 'yearly', label: 'Yearly', price: 24 },
] as const;

const formatGBP = (value: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  useEffect(() => {
    const start = previous.current;
    const end = value;
    const startTime = performance.now();
    const duration = 450;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
      else previous.current = end;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{formatGBP(display)}</>;
};

/** Motion UI-inspired billing card supplied for the Blood Bridge prototype. */
export const PlanPrice: React.FC = () => {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const { price } = PERIODS.find((option) => option.value === period)!;
  const billing = period === 'yearly' ? `${formatGBP(price * 12)} billed yearly` : 'Billed monthly';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur-md"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <span className="text-sm font-semibold">Partner plan</span>
        <div role="group" aria-label="Billing period" className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950 p-0.5">
          {PERIODS.map((option) => {
            const selected = option.value === period;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setPeriod(option.value)}
                className={`relative h-8 rounded-full px-3 text-xs font-semibold transition-colors ${selected ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {selected && (
                  <motion.span
                    layoutId="blood-bridge-plan-thumb"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-red-600"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1">
        <div className="text-4xl font-black tracking-tight text-white">
          <AnimatedNumber value={price} /><span className="ml-1 text-base font-semibold text-slate-400">/mo</span>
        </div>
        <span className="text-xs text-slate-400">{billing}</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">Partner portal</div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">Verified records</div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">Camp tools</div>
      </div>
    </motion.div>
  );
};
