import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Phone, Mail, AlertTriangle, ShieldCheck, CheckCircle2, BellRing, CalendarClock, HeartPulse } from 'lucide-react';
import { BloodGroup, DonorProfile, User as UserType } from '../types';

interface BecomeDonorPageProps {
  currentUser: UserType | null;
  onRegisterDonor: (donor: Omit<DonorProfile, 'id' | 'created_at'>) => Promise<void>;
  onSuccessNavigate: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BecomeDonorPage: React.FC<BecomeDonorPageProps> = ({ currentUser, onRegisterDonor, onSuccessNavigate }) => {
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [age, setAge] = useState<number>(currentUser?.age || 26);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [healthIssues, setHealthIssues] = useState(false);
  const [availability, setAvailability] = useState<'Available' | 'Currently Unavailable'>('Available');
  const [alertOptIn, setAlertOptIn] = useState(currentUser?.alert_opt_in ?? true);
  const [reminderOptIn, setReminderOptIn] = useState(true);
  const [thalassemiaAlertOptIn, setThalassemiaAlertOptIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onRegisterDonor({
        user_id: currentUser?.id || 999,
        donor_name: fullName,
        age: Number(age),
        blood_group: bloodGroup,
        health_issues: healthIssues,
        availability,
        phone,
        email,
        latitude: null,
        longitude: null,
        alert_opt_in: alertOptIn,
        last_donation_date: lastDonationDate || undefined,
        reminder_opt_in: reminderOptIn,
        thalassemia_alert_opt_in: thalassemiaAlertOptIn,
        verified: false,
      });
      setSuccessNotice(true);
      setTimeout(onSuccessNavigate, 1100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3"><div className="inline-flex items-center gap-2 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-1 text-[10px] font-bold tracking-[.18em] text-red-300"><Heart className="h-3.5 w-3.5 fill-red-500" /> DONOR REGISTRATION</div><h1 className="text-3xl font-black text-white sm:text-4xl">Become a donor. Choose how you help.</h1><p className="text-sm leading-6 text-slate-400">Register your blood group and notification preferences. Blood Bridge does not require GPS location for donor matching.</p></div>

      <div className="mb-7 rounded-2xl border border-amber-900/60 bg-amber-950/20 p-4 text-xs text-amber-200"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" /><div><strong className="block text-amber-400">Medical eligibility notice</strong> Registration does not confirm eligibility to donate. A blood bank or qualified medical professional should confirm eligibility before donation.</div></div></div>

      {successNotice && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-700 bg-emerald-950/40 p-4 text-xs text-emerald-200"><CheckCircle2 className="h-5 w-5 text-emerald-400" /><div><strong className="block">Donor profile saved</strong>Your notification preferences are ready for the Blood Bridge network.</div></motion.div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/75 p-6 shadow-xl shadow-black/10 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-300">Full name *<input required value={fullName} onChange={e => setFullName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-red-500" /></label>
            <label className="text-xs font-semibold text-slate-300">Age *<input required min="18" max="100" type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-red-500" /></label>
            <div className="sm:col-span-2"><span className="text-xs font-semibold text-slate-300">Blood group *</span><div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">{BLOOD_GROUPS.map(bg => <button type="button" key={bg} onClick={() => setBloodGroup(bg)} className={`rounded-xl border py-3 text-xs font-black ${bloodGroup === bg ? 'border-red-500 bg-red-600 text-white' : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-red-800'}`}>{bg}</button>)}</div></div>
            <label className="text-xs font-semibold text-slate-300">Mobile number *<div className="relative mt-2"><Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-3 text-sm text-white outline-none focus:border-red-500" placeholder="+91 ..." /></div></label>
            <label className="text-xs font-semibold text-slate-300">Email address *<div className="relative mt-2"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-3 text-sm text-white outline-none focus:border-red-500" /></div></label>
            <label className="text-xs font-semibold text-slate-300">Last donation date<input type="date" value={lastDonationDate} onChange={e => setLastDonationDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-red-500" /><span className="mt-1 block text-[10px] text-slate-500">Optional. Verified donation history can later come from a partner blood bank.</span></label>
            <div><span className="text-xs font-semibold text-slate-300">Current availability</span><div className="mt-2 grid grid-cols-2 gap-2">{(['Available','Currently Unavailable'] as const).map(v => <button type="button" key={v} onClick={() => setAvailability(v)} className={`rounded-xl border py-3 text-xs font-bold ${availability === v ? 'border-red-600 bg-red-950/60 text-red-300' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>{v}</button>)}</div></div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/75 p-6 shadow-xl shadow-black/10 sm:p-8">
          <h2 className="text-base font-black text-white">Notification preferences</h2>
          <p className="mt-1 text-xs text-slate-500">You control which alert categories you receive.</p>
          <div className="mt-5 space-y-3">
            {[
              [alertOptIn, setAlertOptIn, BellRing, 'Emergency blood alerts', `Notify me when a ${bloodGroup} request is broadcast.`],
              [reminderOptIn, setReminderOptIn, CalendarClock, 'Donation reminders', 'Remind me to check my eligibility again based on verified donation records.'],
              [thalassemiaAlertOptIn, setThalassemiaAlertOptIn, HeartPulse, 'Thalassemia support alerts', 'Notify me about verified recurring blood requirements from partner centres.'],
            ].map(([checked, setter, Icon, title, text]) => {
              const I = Icon as React.ElementType; const set = setter as React.Dispatch<React.SetStateAction<boolean>>;
              return <label key={title as string} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${checked ? 'border-red-800/70 bg-red-950/25' : 'border-slate-800 bg-slate-950'}`}><input type="checkbox" checked={checked as boolean} onChange={e => set(e.target.checked)} className="mt-1 accent-red-600" /><I className="mt-0.5 h-5 w-5 shrink-0 text-red-400" /><span><span className="block text-xs font-black text-white">{title as string}</span><span className="mt-1 block text-[11px] leading-5 text-slate-400">{text as string}</span></span></label>;
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-400" /><span>Partner verification can be used later to confirm donations. Donors should not receive unnecessary patient medical details.</span></div></section>
        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: .98 }} disabled={isSubmitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-red-950/30 hover:bg-red-500 disabled:opacity-60"><Heart className="h-4 w-4 fill-white" />{isSubmitting ? 'SAVING PROFILE…' : 'REGISTER AS DONOR'}</motion.button>
      </form>
    </div>
  );
};
