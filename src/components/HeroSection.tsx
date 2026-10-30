import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Activity,
  AlertCircle,
  ArrowRight,
  Radio,
  Users,
  ShieldCheck,
  Droplets,
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  stats: {
    users: number;
    requests: number;
    donors: number;
    alertsSent: number;
  };
}

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const Stat = ({ value }: { value: number }) => {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const target = Number(value || 0);
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display.toLocaleString()}</>;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, stats }) => {
  return (
    <section className="relative overflow-hidden border-b border-red-950/40 pt-10 pb-20 sm:pt-16 sm:pb-24">
      {/* Quiet ambient motion — deliberately slow so it feels product-designed, not AI-demo flashy. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 left-[38%] top-[18%] h-[520px] w-[520px] rounded-full bg-red-700/10 blur-3xl"
        animate={{
          x: [0, 28, -12, 0],
          y: [0, -18, 16, 0],
          scale: [1, 1.08, 0.96, 1],
          opacity: [0.42, 0.58, 0.4, 0.42],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 -left-24 top-24 h-72 w-72 rounded-full bg-rose-600/10 blur-3xl"
        animate={{ x: [0, 22, 0], y: [0, 18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <motion.div
            className="space-y-6 text-center lg:col-span-7 lg:text-left"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
            }}
          >
            <motion.div variants={reveal} transition={{ duration: 0.55 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-800/60 bg-red-950/50 px-3.5 py-1.5 text-xs font-semibold text-red-300 shadow-inner backdrop-blur-md">
                <motion.span
                  className="flex h-2 w-2 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.45, 1], opacity: [1, 0.55, 1] }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="font-mono">BLOOD SUPPORT NETWORK</span>
                <span className="text-red-500">•</span>
                <span className="text-slate-300">LIVE</span>
              </div>
            </motion.div>

            <motion.div variants={reveal} transition={{ duration: 0.65 }} className="space-y-3">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                BLOOD{' '}
                <motion.span
                  className="inline-block bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  BRIDGE
                </motion.span>
              </h1>

              <p className="text-xl font-bold tracking-wide text-red-200/90 sm:text-2xl">
                One request. One alert. A chance to help.
              </p>
            </motion.div>

            <motion.p variants={reveal} transition={{ duration: 0.6 }} className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 lg:mx-0 sm:text-lg">
              Blood Bridge connects verified blood requests with eligible, opted-in donors by blood group,
              while helping blood banks and thalassemia support centres coordinate recurring requirements.
            </motion.p>

            <motion.div variants={reveal} transition={{ duration: 0.6 }} className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-left text-xs text-slate-300 shadow-lg shadow-black/10 backdrop-blur-sm">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  <span className="font-bold text-red-400">Blood-group based alerts:</span>
                  <span className="ml-1 text-slate-300">
                    Emergency requests are routed to opted-in contacts whose registered blood group matches the request.
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={reveal} transition={{ duration: 0.6 }} className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <motion.button
                id="hero-btn-request"
                onClick={() => onNavigate('request')}
                whileHover={{ y: -2, scale: 1.02, boxShadow: '0 16px 35px rgba(185,28,28,0.28)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-red-900/50 sm:w-auto"
              >
                <AlertCircle className="h-4 w-4" />
                REQUEST BLOOD
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                id="hero-btn-become-donor"
                onClick={() => onNavigate('become-donor')}
                whileHover={{ y: -2, scale: 1.02, borderColor: 'rgba(220,38,38,.65)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-200 sm:w-auto"
              >
                <Heart className="h-4 w-4 text-red-500 transition-transform duration-200 group-hover:scale-110" />
                BECOME A DONOR
              </motion.button>
            </motion.div>
          </motion.div>

          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative flex w-full max-w-[610px] items-center justify-center lg:justify-start">
            <motion.div
              className="relative flex h-72 w-72 items-center justify-center sm:h-88 sm:w-88 lg:ml-0"
              initial={{ opacity: 0, scale: 0.88, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-red-950/70"
                animate={{ scale: [0.88, 1.04, 0.88], opacity: [0.25, 0.55, 0.25] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-7 rounded-full border border-red-950/65"
                animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.8, 0.45] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-16 rounded-full border border-red-950/55 bg-black/25 backdrop-blur-sm" />

              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom bg-gradient-to-b from-red-700/90 to-transparent" />
              </motion.div>

              <motion.div
                className="absolute left-3 top-5 rounded-lg border border-red-950 bg-black/90 px-2.5 py-1.5 text-[10px] font-mono text-slate-300 shadow-lg"
                animate={{ y: [0, -5, 0], opacity: [0.78, 1, 0.78] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                B+ MATCH
              </motion.div>

              <motion.div
                className="absolute bottom-5 right-2 rounded-lg border border-emerald-950/80 bg-black/90 px-2.5 py-1.5 text-[10px] font-mono text-slate-300 shadow-lg"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                ALERT READY
              </motion.div>

              <motion.div
                className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-b from-red-900 via-red-950 to-black shadow-2xl shadow-red-950/70 ring-4 ring-red-950/70"
                animate={{ y: [0, -7, 0], boxShadow: ['0 18px 45px rgba(80,0,10,.55)', '0 24px 65px rgba(110,0,15,.72)', '0 18px 45px rgba(80,0,10,.55)'] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Droplets className="h-14 w-14 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" />
                <div className="absolute -bottom-2 flex items-center gap-1 rounded-full border border-red-950 bg-black/95 px-2 py-0.5 text-[9px] font-bold text-red-400">
                  <Activity className="h-2.5 w-2.5" />
                  READY
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute right-0 top-1/2 hidden w-[205px] -translate-y-1/2 space-y-3 lg:block"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              {[
                { label: 'Active Donors', value: stats.donors, note: 'Verified & opted-in', icon: Users },
                { label: 'Emergency Requests', value: stats.requests, note: 'Needs attention', icon: AlertCircle },
                { label: 'Alerts Broadcast', value: stats.alertsSent, note: 'Delivered safely', icon: Radio },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -3, x: -3 }}
                    animate={{ y: [0, i % 2 ? -3 : 3, 0] }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_18px_45px_rgba(35,18,20,.14)] backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">{item.label}</span>
                        <strong className="mt-1 block text-2xl font-black tracking-tight text-slate-900"><Stat value={item.value} /></strong>
                        <span className="text-[10px] text-slate-500">{item.note}</span>
                      </div>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-red-800">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-16 hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {[
            { label: 'Registered Users', value: stats.users, note: 'Community network', icon: Users, iconClass: 'text-red-400' },
            { label: 'Emergency Requests', value: stats.requests, note: 'Active & recorded', icon: AlertCircle, iconClass: 'text-rose-400' },
            { label: 'Active Donors', value: stats.donors, note: 'Opted-in network', icon: Heart, iconClass: 'text-red-500' },
            { label: 'Alerts Broadcast', value: stats.alertsSent, note: 'Delivery activity', icon: Radio, iconClass: 'text-emerald-400' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                variants={cardReveal}
                transition={{ duration: 0.55 }}
                whileHover={{ y: -4, borderColor: 'rgba(220,38,38,.38)' }}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/10 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</span>
                  <Icon className={`h-4 w-4 ${item.iconClass}`} />
                </div>
                <p className="mt-2 text-2xl font-black text-white sm:text-3xl"><Stat value={item.value} /></p>
                <span className="text-[11px] text-slate-400">{item.note}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
