import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity, ArrowRight, BellRing, Building2, CalendarDays, CheckCircle2, ChevronRight,
  Clock3, Droplets, HeartPulse, Hospital, LayoutDashboard, ShieldCheck, Sparkles, Users,
} from 'lucide-react';
import { PlanPrice } from './PlanPrice';
import { BloodGroup } from '../types';

const GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

type Module = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  tab: string;
};

const modules: Module[] = [
  { id: 'emergency', title: 'Emergency Blood Request', subtitle: 'Create a verified request and notify opted-in matching blood-group contacts.', icon: BellRing, tab: 'request' },
  { id: 'donor', title: 'Become a Donor', subtitle: 'Register your blood group, availability and notification preferences.', icon: Droplets, tab: 'become-donor' },
  { id: 'thal', title: 'Thalassemia Support', subtitle: 'Coordinate verified recurring transfusion requirements with support centres.', icon: HeartPulse, tab: 'thalassemia' },
  { id: 'history', title: 'Donation History', subtitle: 'Track verified donations and see when to check eligibility again.', icon: Clock3, tab: 'history' },
  { id: 'camps', title: 'Blood Donation Camps', subtitle: 'Discover upcoming drives and register participation.', icon: CalendarDays, tab: 'camps' },
  { id: 'partners', title: 'Partner Portals', subtitle: 'Separate workflows for blood banks, hospitals and thalassemia centres.', icon: Building2, tab: 'partners' },
  { id: 'admin', title: 'Admin Console', subtitle: 'Review partner verification, alerts, consent and audit activity.', icon: LayoutDashboard, tab: 'admin' },
];

const Panel: React.FC<{ title: string; eyebrow: string; children: React.ReactNode }> = ({ title, eyebrow, children }) => (
  <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/15">
    <div className="mb-6">
      <div className="text-[10px] font-bold uppercase tracking-[.22em] text-red-400">{eyebrow}</div>
      <h2 className="mt-1 text-2xl font-black text-white">{title}</h2>
    </div>
    {children}
  </motion.section>
);

export const PlatformFeaturesPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [active, setActive] = useState('emergency');
  const [group, setGroup] = useState<BloodGroup>('B+');
  const [saved, setSaved] = useState(false);

  const activeModule = modules.find(m => m.id === active)!;
  const matchingCount = useMemo(() => ({ 'A+': 42, 'A-': 9, 'B+': 31, 'B-': 7, 'AB+': 18, 'AB-': 4, 'O+': 56, 'O-': 11 }[group]), [group]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-3xl border border-red-900/50 bg-gradient-to-br from-red-950/80 via-slate-950 to-slate-950 p-7 sm:p-10 overflow-hidden relative">
          <motion.div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-red-500/10" animate={{ scale: [1, 1.12, 1], opacity: [.2, .5, .2] }} transition={{ duration: 4.5, repeat: Infinity }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-800/60 bg-red-950/60 px-3 py-1 text-[10px] font-bold tracking-[.18em] text-red-300"><Sparkles className="h-3.5 w-3.5" /> COMPLETE BLOOD BRIDGE NETWORK</div>
            <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">From one emergency request to a coordinated donor response.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">The prototype now includes emergency requests, blood-group alerts, donor preferences, donation history, recurring thalassemia support, camps, verified partners and administration workflows.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('request')} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-black text-white hover:bg-red-500">Create emergency request <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => onNavigate('become-donor')} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-200 hover:border-red-700">Register donor</button>
            </div>
          </div>
        </div>
        <PlanPrice />
      </motion.div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((m, index) => {
          const Icon = m.icon;
          const selected = m.id === active;
          return (
            <motion.button key={m.id} onClick={() => setActive(m.id)} whileHover={{ y: -3 }} whileTap={{ scale: .985 }} className={`text-left rounded-2xl border p-4 transition-colors ${selected ? 'border-red-700/70 bg-red-950/35' : 'border-slate-800 bg-slate-900/65 hover:border-slate-700'}`}>
              <div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? 'bg-red-600 text-white' : 'bg-slate-950 text-red-400'}`}><Icon className="h-5 w-5" /></span><span className="text-[10px] font-bold text-slate-500">0{index + 1}</span></div>
              <h3 className="mt-4 text-sm font-black text-white">{m.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">{m.subtitle}</p>
            </motion.button>
          );
        })}
      </div>

      <Panel title={activeModule.title} eyebrow="Interactive prototype module">
        {active === 'emergency' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
            <div>
              <p className="text-sm leading-6 text-slate-300">Choose the required blood group. The alert preview is designed to route only to people who have that blood group and have explicitly opted in to emergency notifications.</p>
              <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">{GROUPS.map(bg => <button key={bg} onClick={() => setGroup(bg)} className={`rounded-xl border py-3 text-xs font-black ${group === bg ? 'border-red-500 bg-red-600 text-white' : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-red-800'}`}>{bg}</button>)}</div>
            </div>
            <motion.div key={group} initial={{ scale: .96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl border border-red-900/60 bg-slate-950 p-5">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Alert preview</span><span className="flex items-center gap-1 text-[10px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> READY</span></div>
              <div className="mt-4 text-lg font-black text-white">🩸 {group} blood needed</div>
              <div className="mt-2 text-xs text-slate-400">City General Hospital • 2 units • Emergency</div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-300"><Users className="h-4 w-4 text-red-400" /> {matchingCount} opted-in {group} contacts in the demo network</div>
              <button onClick={() => setSaved(true)} className="mt-4 w-full rounded-xl bg-red-600 py-2.5 text-xs font-black text-white hover:bg-red-500">Simulate broadcast</button>
              {saved && <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Alert queued in prototype mode.</div>}
            </motion.div>
          </div>
        )}

        {active === 'donor' && <div className="grid gap-4 md:grid-cols-3">{['Blood group', 'Emergency alerts', 'Donation reminders'].map((x, i) => <div key={x} className="rounded-2xl border border-slate-800 bg-slate-950 p-5"><div className="text-xs font-bold text-slate-300">{x}</div><div className="mt-3 flex items-center gap-2 text-sm font-black text-white"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> {i === 0 ? 'Required' : 'Opt-in control'}</div></div>)}</div>}

        {active === 'thal' && <div className="grid gap-4 md:grid-cols-3">{[['Next transfusion', '18 Oct 2026'], ['Required units', '2 units'], ['Verification', 'Partner verified']].map(([a,b]) => <div key={a} className="rounded-2xl border border-slate-800 bg-slate-950 p-5"><div className="text-[10px] uppercase tracking-wider text-slate-500">{a}</div><div className="mt-2 text-lg font-black text-white">{b}</div></div>)}</div>}

        {active === 'history' && <div className="space-y-3">{[['12 Sep 2026', 'B+', 'Verified by partner blood bank'], ['20 Jul 2026', 'B+', 'Verified donation'], ['02 May 2026', 'B+', 'Verified donation']].map(([date,bg,note]) => <div key={date} className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-sm font-black text-white">{date} • {bg}</div><div className="text-xs text-slate-400">{note}</div></div><span className="rounded-full bg-emerald-950/60 px-3 py-1 text-[10px] font-bold text-emerald-400">VERIFIED</span></div>)}</div>}

        {active === 'camps' && <div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-800 bg-slate-950 p-5"><div className="flex items-center gap-2 text-sm font-black text-white"><CalendarDays className="h-4 w-4 text-red-400" /> Community Blood Drive</div><p className="mt-2 text-xs text-slate-400">12 Oct • City Community Hall • 9:00 AM–2:00 PM</p><button className="mt-4 rounded-lg border border-red-800/60 px-3 py-2 text-xs font-bold text-red-300">Register interest</button></div><div className="rounded-2xl border border-slate-800 bg-slate-950 p-5"><div className="flex items-center gap-2 text-sm font-black text-white"><CalendarDays className="h-4 w-4 text-red-400" /> College Donation Camp</div><p className="mt-2 text-xs text-slate-400">26 Oct • Campus Health Centre • 10:00 AM–4:00 PM</p><button className="mt-4 rounded-lg border border-red-800/60 px-3 py-2 text-xs font-bold text-red-300">View camp</button></div></div>}

        {active === 'partners' && <div className="grid gap-4 md:grid-cols-3">{[['Blood Bank', Hospital], ['Hospital', Building2], ['Thalassemia Centre', HeartPulse]].map(([name, Icon]: any) => <button key={name} onClick={() => setSaved(true)} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left hover:border-red-800"><Icon className="h-6 w-6 text-red-400" /><div className="mt-3 text-sm font-black text-white">{name} Portal</div><p className="mt-1 text-xs text-slate-400">Verification, requests, donor responses and records.</p></button>)}</div>}

        {active === 'admin' && <div className="grid gap-4 md:grid-cols-4">{[['Partners', '12 pending'], ['Emergency alerts', '48 today'], ['Consent records', '1,284'], ['Audit events', '3,902']].map(([a,b]) => <div key={a} className="rounded-2xl border border-slate-800 bg-slate-950 p-5"><ShieldCheck className="h-5 w-5 text-red-400" /><div className="mt-3 text-xs text-slate-400">{a}</div><div className="mt-1 text-xl font-black text-white">{b}</div></div>)}</div>}
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><Activity className="h-5 w-5 text-emerald-400" /><div className="mt-3 text-sm font-black text-white">Consent-first alerts</div><p className="mt-1 text-xs leading-5 text-slate-400">People receive emergency notifications only after opting in.</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><ShieldCheck className="h-5 w-5 text-red-400" /><div className="mt-3 text-sm font-black text-white">Minimal patient data</div><p className="mt-1 text-xs leading-5 text-slate-400">Donors see only what they need to respond; partner verification stays restricted.</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><ChevronRight className="h-5 w-5 text-red-400" /><div className="mt-3 text-sm font-black text-white">Ready for backend wiring</div><p className="mt-1 text-xs leading-5 text-slate-400">These UI flows can later connect to Flask, PostgreSQL, FCM and an authorized SMS provider.</p></div>
      </div>
    </div>
  );
};
