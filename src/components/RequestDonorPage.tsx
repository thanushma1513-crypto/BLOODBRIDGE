import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Building2, Phone, FileText, Send, Radio, ShieldCheck, User, Droplets } from 'lucide-react';
import { BloodGroup, BloodRequest, User as UserType } from '../types';

interface RequestDonorPageProps {
  currentUser: UserType | null;
  users: UserType[];
  onSubmitRequest: (req: Omit<BloodRequest, 'id' | 'created_at' | 'expires_at' | 'alerts_count' | 'responses_count'>) => void;
  onRequestSuccessTab: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const RequestDonorPage: React.FC<RequestDonorPageProps> = ({ currentUser, onSubmitRequest, onRequestSuccessTab }) => {
  const [requesterName, setRequesterName] = useState(currentUser?.name || '');
  const [hospitalName, setHospitalName] = useState(currentUser?.hospital_name || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [patientAge, setPatientAge] = useState<number>(28);
  const [unitsRequired, setUnitsRequired] = useState<number>(2);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState<'Emergency' | 'Scheduled'>('Emergency');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!requesterName.trim() || !hospitalName.trim() || !phone.trim() || !description.trim()) {
      setErrorMsg('Please complete the requester, hospital, phone and requirement details.');
      return;
    }
    if (patientAge < 0 || patientAge > 120 || unitsRequired < 1 || unitsRequired > 20) {
      setErrorMsg('Please enter valid patient age and units required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitRequest({
        requester_id: currentUser?.id || 999,
        requester_name: requesterName,
        hospital_name: hospitalName,
        blood_group: bloodGroup,
        patient_age: Number(patientAge),
        units_required: Number(unitsRequired),
        phone,
        description: `${requestType} request: ${description}`,
        radius_km: 0,
        latitude: 0,
        longitude: 0,
        status: 'ACTIVE',
      });
      onRequestSuccessTab();
    } catch {
      // Parent displays the error toast.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-1 text-[10px] font-bold tracking-[.18em] text-red-300"><Radio className="h-3.5 w-3.5 animate-pulse" /> EMERGENCY REQUEST</div>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Request blood from the right donor network.</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-400">The updated prototype uses <strong className="text-slate-200">blood-group matching</strong> for alerts. No GPS radius selection is required.</p>
      </div>

      <div className="mb-7 grid gap-3 sm:grid-cols-3">
        {[
          ['1', 'Create request'], ['2', 'Match blood group'], ['3', 'Notify opted-in contacts']
        ].map(([n, t]) => <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><span className="text-xs font-black text-red-400">0{n}</span><div className="mt-2 text-xs font-bold text-slate-200">{t}</div></div>)}
      </div>

      <div className="mb-7 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-4 text-xs text-emerald-200">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><div><strong className="block text-emerald-400">Consent-first alert routing</strong> Only users/contacts who voluntarily opted in to emergency alerts are intended recipients. The prototype does not discover random phones.</div></div>
      </div>

      {errorMsg && <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-700 bg-red-950/70 p-4 text-xs font-semibold text-red-200"><AlertCircle className="h-4 w-4" />{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/75 p-6 shadow-xl shadow-black/10 sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4"><Building2 className="h-5 w-5 text-red-400" /><div><h2 className="text-base font-black text-white">Request details</h2><p className="text-[11px] text-slate-500">Keep the request clear enough for a donor to act quickly.</p></div></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-300">Requester name *<input value={requesterName} onChange={e => setRequesterName(e.target.value)} required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-red-500" placeholder="Requester / coordinator name" /></label>
            <label className="text-xs font-semibold text-slate-300">Hospital / centre *<input value={hospitalName} onChange={e => setHospitalName(e.target.value)} required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-red-500" placeholder="Hospital or support centre" /></label>
            <div className="sm:col-span-2"><label className="text-xs font-semibold text-slate-300">Required blood group *</label><div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">{BLOOD_GROUPS.map(bg => <button key={bg} type="button" onClick={() => setBloodGroup(bg)} className={`rounded-xl border py-3 text-xs font-black transition-all ${bloodGroup === bg ? 'border-red-500 bg-red-600 text-white shadow-lg shadow-red-950/40' : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-red-800'}`}><Droplets className="mx-auto mb-1 h-3.5 w-3.5" />{bg}</button>)}</div></div>
            <label className="text-xs font-semibold text-slate-300">Patient age *<input type="number" min="0" max="120" value={patientAge} onChange={e => setPatientAge(Number(e.target.value))} required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-red-500" /></label>
            <label className="text-xs font-semibold text-slate-300">Units required *<input type="number" min="1" max="20" value={unitsRequired} onChange={e => setUnitsRequired(Number(e.target.value))} required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none focus:border-red-500" /></label>
            <label className="text-xs font-semibold text-slate-300">Emergency phone *<div className="relative mt-2"><Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={phone} onChange={e => setPhone(e.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-3.5 text-sm text-white outline-none focus:border-red-500" placeholder="+91 ..." /></div></label>
            <div><span className="text-xs font-semibold text-slate-300">Request type</span><div className="mt-2 grid grid-cols-2 gap-2">{(['Emergency','Scheduled'] as const).map(type => <button key={type} type="button" onClick={() => setRequestType(type)} className={`rounded-xl border py-3 text-xs font-bold ${requestType === type ? 'border-red-600 bg-red-950/60 text-red-300' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>{type}</button>)}</div></div>
            <label className="text-xs font-semibold text-slate-300 sm:col-span-2">Requirement / ward details *<div className="relative mt-2"><FileText className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-3.5 text-sm text-white outline-none focus:border-red-500" placeholder="Example: ICU, surgery support, required before 8 PM..." /></div></label>
          </div>
        </section>

        <motion.button disabled={isSubmitting} whileHover={{ y: -2 }} whileTap={{ scale: .98 }} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-red-950/30 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60">
          <Send className="h-4 w-4" /> {isSubmitting ? 'SENDING ALERT…' : `CREATE ${requestType.toUpperCase()} REQUEST`}
        </motion.button>
      </form>
    </div>
  );
};
