import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CalendarDays, ChevronLeft, ChevronRight, Clock3, Droplets, Heart, Hospital, LayoutDashboard, Menu, MessageCircle, ShieldCheck, Sparkles, Users, X, ArrowRight, CheckCircle2, CircleAlert, HandHeart, Database, Building2, ClipboardList, Activity, Phone, LogIn, Plus, Search, LockKeyhole, ScanLine, UserRound, KeyRound, MapPin, Mail } from 'lucide-react';
import type { BloodGroup, BloodRequest, Camp, Donation, Donor, ThalassemiaCase, View } from './types';
import { api } from './api';
import AnimatedHeaderBackground from './components/AnimatedHeaderBackground';
import ScrollWordReveal from './components/ScrollWordReveal';
import SmoothDrawer from './components/SmoothDrawer';
import CardFlip from './components/CardFlip';

const BG: BloodGroup[] = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const now = () => new Date().toISOString();
const uid = (p:string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const seedDonors: Donor[] = [
  {id:'d1',name:'Priya Menon',email:'priya.demo@bloodbridge.local',age:26,bloodGroup:'B+',phone:'+91 98765 11223',lastDonation:'2026-07-18',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true,verified:true,createdAt:now()},
  {id:'d2',name:'Rahul Varma',email:'rahul.demo@bloodbridge.local',age:29,bloodGroup:'O+',phone:'+91 98765 43210',lastDonation:'2026-06-30',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:false,verified:true,createdAt:now()},
  {id:'d3',name:'Ananya Rao',email:'ananya.demo@bloodbridge.local',age:24,bloodGroup:'A+',phone:'+91 98765 77889',lastDonation:'2026-08-02',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true,verified:true,createdAt:now()},
  {id:'d4',name:'Vikram Reddy',email:'vikram.demo@bloodbridge.local',age:31,bloodGroup:'A-',phone:'+91 98765 22110',lastDonation:'2026-07-12',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true,verified:true,createdAt:now()},
  {id:'d5',name:'Sneha Rao',email:'sneha.demo@bloodbridge.local',age:27,bloodGroup:'B-',phone:'+91 98765 22111',lastDonation:'2026-07-25',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true,verified:true,createdAt:now()},
  {id:'d6',name:'Kiran Das',email:'kiran.demo@bloodbridge.local',age:30,bloodGroup:'AB+',phone:'+91 98765 22112',lastDonation:'2026-08-05',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true,verified:true,createdAt:now()},
  {id:'d7',name:'Meera Singh',email:'meera.demo@bloodbridge.local',age:28,bloodGroup:'AB-',phone:'+91 98765 22113',lastDonation:'2026-07-20',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true,verified:true,createdAt:now()},
  {id:'d8',name:'Arun Kumar',email:'arun.demo@bloodbridge.local',age:26,bloodGroup:'O+',phone:'+91 98765 22114',lastDonation:'2026-08-01',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true,verified:true,createdAt:now()},
  {id:'d9',name:'Lakshmi Devi',email:'lakshmi.demo@bloodbridge.local',age:25,bloodGroup:'O-',phone:'+91 98765 22115',lastDonation:'2026-07-30',availability:'Available',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true,verified:true,createdAt:now()},
];
const seedRequests: BloodRequest[] = [{id:'r1',requesterName:'CityCare Hospital',hospital:'CityCare Hospital',patientName:'Arjun Kumar',bloodGroup:'O-',patientAge:41,units:3,phone:'+91 90000 11223',condition:'Urgent surgical requirement',description:'Urgent surgical requirement. Please contact the hospital desk if you can help.',createdAt:'2026-09-29T14:10:00Z',status:'ACTIVE'}];
const seedCases: ThalassemiaCase[] = [{id:'t1',centre:'Thalassemia Care Centre',patientRef:'TCC-1042',patientName:'Demo Patient',patientAge:18,contact:'+91 90000 10001',notes:'Recurring transfusion support',bloodGroup:'B+',nextTransfusion:'2026-10-03',units:2,verified:true,createdAt:'2026-09-28T10:00:00Z'}];
const seedDonations: Donation[] = [{id:'dn1',donorId:'d1',date:'2026-07-18',centre:'City Blood Bank',units:1,verified:true}];
const seedCamps: Camp[] = [{id:'c1',title:'Community Blood Donation Drive',organiser:'Blood Bridge × City Blood Bank',date:'2026-10-12',time:'09:00 AM – 03:00 PM',venue:'Community Hall, Eluru',city:'Eluru',contact:'+91 90000 22334'},{id:'c2',title:'College Donor Day',organiser:'Ramachandra College',date:'2026-10-18',time:'10:00 AM – 02:00 PM',venue:'Main Auditorium',city:'Eluru',contact:'+91 90000 44556'}];

function useStored<T>(key:string, fallback:T){
  const [value,setValue] = useState<T>(()=>{ try { const x=localStorage.getItem(key); return x?JSON.parse(x):fallback; } catch { return fallback; }});
  const update=(next:T)=>{setValue(next); try{localStorage.setItem(key,JSON.stringify(next));}catch{}};
  return [value,update] as const;
}

const defaultSession = { id: 'u1', name: 'LifeSaver Volunteer', email: 'volunteer@bloodbridge.local', role: 'USER', hospitalName: '' };
const daysSinceDonation = (d: Donor) => d.lastDonation ? Math.max(0, Math.floor((Date.now() - new Date(d.lastDonation).getTime()) / (24 * 3600 * 1000))) : 0;
const reminderStage = (d: Donor) => { const days = daysSinceDonation(d); return days >= 90 ? 3 : days >= 60 ? 2 : days >= 30 ? 1 : 0; };

export default function App(){
  const [view,setView]=useState<View>('home');
  const [pageLoading,setPageLoading]=useState(false);
  const [session,setSession]=useStored<any>('bb_session', defaultSession);
  const [loginError,setLoginError]=useState('');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [profileOpen,setProfileOpen]=useState(false);
  const activeSession = session || defaultSession;

  useEffect(() => {
    if (view === 'home') { setPageLoading(false); return; }
    setPageLoading(true);
    const timer = window.setTimeout(() => setPageLoading(false), 520);
    return () => window.clearTimeout(timer);
  }, [view]);

  const handleLogout = async () => {
    try { await api('/api/logout',{method:'POST'}); } catch {}
    setSession(defaultSession);
    setProfileOpen(false);
    setMobileOpen(false);
    setView('home');
    notify('Reset to default volunteer access.');
  };
  const [donors,setDonors]=useStored<Donor[]>('bb_donors',seedDonors);
  const [requests,setRequests]=useStored<BloodRequest[]>('bb_requests',seedRequests);
  const [cases,setCases]=useStored<ThalassemiaCase[]>('bb_thal_cases',seedCases);
  const [donations,setDonations]=useStored<Donation[]>('bb_donations',seedDonations);
  const [camps]=useStored<Camp[]>('bb_camps',seedCamps);
  const [alert,setAlert]=useState<BloodRequest|null>(null);
  const [broadcast,setBroadcast]=useState<BloodRequest|null>(null);
  const [thalBroadcast,setThalBroadcast]=useState<any|null>(null);
  const [dispatchLog,setDispatchLog]=useStored<any[]>('bb_dispatch_log',[]);
  const [toast,setToast]=useState('');
  const notify=(m:string)=>{setToast(m);window.setTimeout(()=>setToast(''),3600)};

  // Recipient-side prototype channel: another open Blood Bridge tab can receive the
  // same persisted alert without requiring the sender tab to be the recipient.
  useEffect(() => {
    const onAlertMessage = (event: StorageEvent) => {
      if (event.key !== 'bb_live_alert' || !event.newValue) return;
      try {
        const incoming = JSON.parse(event.newValue);
        if (incoming?.request) {
          const r = incoming.request;
          const req: BloodRequest = {
            id: String(r.id), requesterName: r.requester_name || '', hospital: r.hospital_name || '',
            patientName: r.patient_name || '', bloodGroup: r.blood_group, patientAge: Number(r.patient_age),
            units: Number(r.units_required), phone: r.phone || '', condition: r.condition || '',
            description: r.description || '', createdAt: r.created_at || now(), status: r.status === 'FULFILLED' ? 'FULFILLED' : 'ACTIVE'
          };
          setAlert(req);
          notify(`🚨 New ${req.bloodGroup} emergency alert received`);
        }
      } catch {}
    };
    window.addEventListener('storage', onAlertMessage);
    return () => window.removeEventListener('storage', onAlertMessage);
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([api<any>('/api/donors'), api<any>('/api/thalassemia'), api<any>('/api/requests')]).then(([ddata,tdata,rdata]) => {
      if (!alive) return;
      if (Array.isArray(ddata?.donors) && ddata.donors.length) {
        setDonors(ddata.donors.map((d:any)=>({id:String(d.id),name:d.donor_name||'',email:d.email||'',age:Number(d.age||0),bloodGroup:d.blood_group as BloodGroup,phone:d.phone||'',lastDonation:d.last_donation||'',availability:d.availability==='Unavailable'?'Unavailable':'Available',emergencyAlerts:d.alert_opt_in!==false,donationReminders:d.donation_reminders!==false,thalassemiaAlerts:d.thalassemia_alerts!==false,verified:!!d.verified,createdAt:d.created_at||now()})));
      }
      if (Array.isArray(tdata?.cases) && tdata.cases.length) {
        setCases(tdata.cases.map((c:any)=>({id:String(c.id),centre:c.centre,patientRef:c.patient_ref,patientName:c.patient_name||'',patientAge:Number(c.patient_age||0),contact:c.contact||'',notes:c.notes||'',bloodGroup:c.blood_group,nextTransfusion:c.next_transfusion,units:Number(c.units),verified:!!c.verified,createdAt:c.created_at||now()})));
      }
      if (Array.isArray(rdata?.requests)) {
        const mapped: BloodRequest[] = rdata.requests.map((r:any) => ({id:String(r.id),requesterName:r.requester_name||'',hospital:r.hospital_name||'',patientName:r.patient_name||'',bloodGroup:r.blood_group as BloodGroup,patientAge:Number(r.patient_age),units:Number(r.units_required),phone:r.phone||'',condition:r.condition||'',description:r.description||'',createdAt:r.created_at||now(),status:r.status==='FULFILLED'?'FULFILLED':'ACTIVE'}));
        setRequests(mapped);
      }
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const donorStats = useMemo(()=>({total:donors.length,verified:donors.filter(d=>d.verified).length,groups:new Set(donors.map(d=>d.bloodGroup)).size}),[donors]);
  const reminders = donors.filter(d=>d.donationReminders && d.lastDonation && (Date.now()-new Date(d.lastDonation).getTime())>=30*24*3600*1000);
  const daysSinceDonation = (d:Donor) => d.lastDonation ? Math.max(0, Math.floor((Date.now()-new Date(d.lastDonation).getTime())/(24*3600*1000))) : 0;
  const reminderStage = (d:Donor) => { const days=daysSinceDonation(d); return days>=90?3:days>=60?2:days>=30?1:0; };

  const submitRequest=async(form:Omit<BloodRequest,'id'|'createdAt'|'status'>)=>{
    const clean={
      requesterName:form.requesterName.trim(), hospital:form.hospital.trim(), patientName:form.patientName.trim(),
      bloodGroup:form.bloodGroup, patientAge:Number(form.patientAge), units:Number(form.units), phone:form.phone.trim(),
      condition:form.condition.trim(), description:form.description.trim()
    };
    if(!clean.requesterName||!clean.hospital||!clean.patientName||!clean.phone||!clean.condition||!clean.description){ notify('Please complete all required request details.'); return; }
    if(!Number.isFinite(clean.patientAge)||clean.patientAge<0||!Number.isFinite(clean.units)||clean.units<1||clean.units>20){ notify('Please enter a valid patient age and units.'); return; }

    // IMPORTANT: show the exact donor-facing alert immediately. The UI must never
    // wait for the backend before the user can see what matching donors receive.
    const localReq:BloodRequest={id:uid('REQ'),...clean,createdAt:now(),status:'ACTIVE'};
    const matching=donors.filter(d=>d.bloodGroup===localReq.bloodGroup&&d.emergencyAlerts&&d.availability!=='Unavailable');
    setRequests([localReq,...requests]);
    setDispatchLog([{id:uid('DISPATCH'),requestId:localReq.id,createdAt:localReq.createdAt,status:'SENT',bloodGroup:localReq.bloodGroup,recipientCount:matching.length,recipients:matching.map(d=>({user_id:d.id,name:d.name,phone:d.phone,blood_group:d.bloodGroup,status:'DELIVERED'}))},...dispatchLog]);
    setBroadcast(localReq);
    try { localStorage.setItem('bb_live_alert', JSON.stringify({request:{...localReq,requester_name:localReq.requesterName,hospital_name:localReq.hospital,patient_name:localReq.patientName,blood_group:localReq.bloodGroup,patient_age:localReq.patientAge,units_required:localReq.units,phone:localReq.phone,condition:localReq.condition,description:localReq.description,created_at:localReq.createdAt}, at:Date.now()})); } catch {}
    notify(`🚨 ALERT PREVIEW READY • ${matching.length} matching ${localReq.bloodGroup} donor alert(s)`);

    // Persist to the API in the background. A timeout prevents a missing API from
    // blocking the donor-alert preview.
    try {
      const controller=new AbortController();
      const timer=window.setTimeout(()=>controller.abort(),3000);
      const data=await api<any>('/api/blood-request',{method:'POST',signal:controller.signal,body:JSON.stringify({
        requester_name:clean.requesterName, hospital_name:clean.hospital, patient_name:clean.patientName,
        blood_group:clean.bloodGroup, patient_age:clean.patientAge, units_required:clean.units,
        phone:clean.phone, condition:clean.condition, description:clean.description
      })});
      window.clearTimeout(timer);
      const saved=data.request;
      const req:BloodRequest={
        id:String(saved.id), requesterName:saved.requester_name, hospital:saved.hospital_name,
        patientName:saved.patient_name||clean.patientName, bloodGroup:saved.blood_group,
        patientAge:saved.patient_age, units:saved.units_required, phone:saved.phone,
        condition:saved.condition||clean.condition, description:saved.description,
        createdAt:saved.created_at, status:saved.status==='FULFILLED'?'FULFILLED':'ACTIVE'
      };
      setRequests(prev=>[req,...prev.filter(x=>x.id!==localReq.id)]);
      setDispatchLog(prev=>[{id:`DISPATCH-${saved.id}`,requestId:req.id,createdAt:saved.created_at,status:'SENT',bloodGroup:req.bloodGroup,recipientCount:data.alerts_sent,recipients:data.recipient_preview},...prev.filter(x=>x.requestId!==localReq.id)]);
      setBroadcast(req);
      try { localStorage.setItem('bb_live_alert', JSON.stringify({request:saved, at:Date.now()})); } catch {}
    } catch(error:any) {
      // Local request + alert preview already exist. Keep them visible and persisted.
      try { localStorage.setItem('bb_requests',JSON.stringify([localReq,...requests])); } catch {}
    }
  };
  const submitDonor=async(d:Omit<Donor,'id'|'createdAt'|'verified'>)=>{
    const localDonor:Donor={id:uid('DONOR'),...d,availability:d.availability||'Available',createdAt:now(),verified:false};
    try {
      const data=await api<any>('/api/donor',{method:'POST',body:JSON.stringify({donor_name:d.name,email:d.email||`${d.name.toLowerCase().replace(/\s+/g,'.')}@bloodbridge.local`,phone:d.phone,age:d.age,blood_group:d.bloodGroup,last_donation:d.lastDonation,availability:d.availability||'Available',alert_opt_in:d.emergencyAlerts,donation_reminders:d.donationReminders,thalassemia_alerts:d.thalassemiaAlerts})});
      const x=data.donor; const donor={id:String(x.id),name:x.donor_name,email:x.email,age:Number(x.age||d.age),bloodGroup:x.blood_group as BloodGroup,phone:x.phone,lastDonation:x.last_donation||'',availability:x.availability,emergencyAlerts:x.alert_opt_in!==false,donationReminders:x.donation_reminders!==false,thalassemiaAlerts:x.thalassemia_alerts!==false,verified:!!x.verified,createdAt:x.created_at||now()};
      setDonors([donor,...donors.filter(v=>v.id!==donor.id)]); notify('Donor profile saved. Availability, alerts and reminders are active.'); setView('history');
    } catch(e:any) {
      setDonors([localDonor,...donors]);
      notify('Donor profile saved in prototype mode. Donor Hub is ready to use.');
      setView('history');
    }
  };
  const submitCase=async(c:Omit<ThalassemiaCase,'id'|'createdAt'|'verified'>)=>{
    const clean={...c,centre:c.centre.trim(),patientRef:c.patientRef.trim(),nextTransfusion:c.nextTransfusion.trim(),units:Number(c.units)};
    if(!clean.centre||!clean.patientRef||!clean.nextTransfusion||!clean.units||clean.units<1){
      notify('Please complete the Thalassemia patient requirement details.');
      return;
    }

    // Save locally and show the donor-facing alert immediately; backend persistence
    // happens afterwards so a missing API can never hide or lose the record.
    const localItem:ThalassemiaCase={
      id:uid('THAL'), ...clean, patientName:clean.patientName||'', patientAge:Number(clean.patientAge||0),
      contact:clean.contact||'', notes:clean.notes||'', verified:false, createdAt:now()
    };
    const matching=donors.filter(d=>d.bloodGroup===localItem.bloodGroup && d.thalassemiaAlerts && d.emergencyAlerts && d.availability!=='Unavailable');
    const message=`🩸 THALASSEMIA SUPPORT REQUEST\nCentre/Hospital: ${localItem.centre}\nPatient: ${localItem.patientName || 'Patient'}\nPatient Ref: ${localItem.patientRef}\nAge: ${localItem.patientAge || 'Not provided'}\nBlood Group: ${localItem.bloodGroup}\nNext Transfusion: ${localItem.nextTransfusion}\nUnits Required: ${localItem.units}\nContact: ${localItem.contact || 'Not provided'}\nNotes: ${localItem.notes || 'Support required'}\nPlease confirm your availability with the centre.`;
    const recipients=matching.map(d=>({user_id:d.id,name:d.name,phone:d.phone,blood_group:d.bloodGroup,status:'DELIVERED'}));
    setCases([localItem,...cases]);
    setThalBroadcast({case:localItem,alertsSent:matching.length,recipients,message});
    try { localStorage.setItem('bb_thal_cases',JSON.stringify([localItem,...cases])); } catch {}
    try { localStorage.setItem('bb_thal_alert',JSON.stringify({case:localItem,message,recipients,at:Date.now()})); } catch {}
    notify(`🩸 THALASSEMIA SAVED • ${matching.length} matching donor alert(s) previewed`);

    try {
      const controller=new AbortController();
      const timer=window.setTimeout(()=>controller.abort(),3000);
      const data=await api<any>('/api/thalassemia',{method:'POST',signal:controller.signal,body:JSON.stringify({centre:clean.centre,patient_ref:clean.patientRef,patient_name:clean.patientName||'',patient_age:Number(clean.patientAge||0),contact:clean.contact||'',notes:clean.notes||'',blood_group:clean.bloodGroup,next_transfusion:clean.nextTransfusion,units:clean.units})});
      window.clearTimeout(timer);
      const r=data.record;
      const item={id:String(r.id),centre:r.centre,patientRef:r.patient_ref,patientName:r.patient_name||'',patientAge:Number(r.patient_age||0),contact:r.contact||'',notes:r.notes||'',bloodGroup:r.blood_group as BloodGroup,nextTransfusion:r.next_transfusion,units:Number(r.units),verified:!!r.verified,createdAt:r.created_at||now()};
      setCases(prev=>[item,...prev.filter(v=>v.id!==localItem.id)]);
      setThalBroadcast({case:item,alertsSent:Number(data.alerts_sent||matching.length),recipients:data.recipient_preview||recipients,message:data.notification?.full_message||message});
    } catch(e:any) {
      // Local record and donor-facing preview are already persisted and visible.
    }
  };
  const addDonation=async(d:Omit<Donation,'id'|'verified'>)=>{
    const donor=donors.find(x=>x.id===d.donorId); if(!donor) { notify('Select a donor first.'); return; }
    if(!d.date) { notify('Select the donation date first.'); return; }
    const record={...d,id:uid('DONATION'),verified:false as boolean};
    try {
      await api('/api/donor/donation',{method:'POST',body:JSON.stringify({email:donor.email,name:donor.name,date:d.date})});
      setDonations([record,...donations]);
      setDonors(donors.map(x=>x.id===d.donorId?{...x,lastDonation:d.date}:x));
      notify('Donation date saved. Reminder schedule updated.');
    } catch(e:any){
      setDonations([record,...donations]);
      setDonors(donors.map(x=>x.id===d.donorId?{...x,lastDonation:d.date}:x));
      notify('Donation saved in prototype mode. Reminder schedule updated.');
    }
  };

  const handleRoleToggle = (targetRole: 'USER' | 'HOSPITAL') => {
    const updated = {
      ...activeSession,
      role: targetRole,
      name: targetRole === 'HOSPITAL' ? 'CityCare Hospital' : 'LifeSaver Volunteer',
      hospitalName: targetRole === 'HOSPITAL' ? 'CityCare Hospital' : ''
    };
    setSession(updated);
    notify(`Switched to ${targetRole === 'HOSPITAL' ? 'Hospital' : 'User'} view`);
  };

  return <div className="app-shell">
    {view==='home' && <header className="site-header">
      <div className="topbar">
        <div className="nav-wrap">
          <button className="brand" onClick={()=>setView('home')}><span className="brand-mark"><Droplets size={22}/></span><span><strong>BLOOD<span>BRIDGE</span></strong><small>Emergency blood support network</small></span></button>
          <nav className={mobileOpen?'nav-links open':'nav-links'}>{[['home','Home'],['request','Emergency Request'],['donor','Become a Lifesaver'],['thalassemia','Thalassemia Care'],['hospitals','Care Network'],['history','Donor Journey'],['camps','Life Camps'],['partners','Care Partners']].map(([v,l])=><button key={v} className={view===v?'active':''} onClick={()=>{if(v==='thalassemia'){window.location.href='thalassemia-care.html';return;}setView(v as View);setMobileOpen(false);setProfileOpen(false)}}>{l}</button>)}</nav>
          <div className="nav-actions">
            <div className="profile-wrap">
              <button className="session-chip" onClick={()=>setProfileOpen(v=>!v)} title="Open profile" aria-expanded={profileOpen}>
                {activeSession?.role==='HOSPITAL'?<Building2 size={15}/>:<UserRound size={15}/>}
                <span>{activeSession?.name || 'Account'}</span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div className="profile-popover" initial={{opacity:0,y:-6,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-6,scale:.98}} transition={{duration:.16}}>
                    <div className="profile-popover-head">
                      <div className="profile-avatar">{String(activeSession?.name||'A').charAt(0).toUpperCase()}</div>
                      <div><strong>{activeSession?.name || 'Account'}</strong><span>{activeSession?.email || ''}</span></div>
                    </div>
                    <div className="profile-role" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:6}}>
                      <span>{activeSession?.role==='HOSPITAL'?'Hospital account':'User account'}</span>
                      <button style={{border:'none',background:'#f0e6e7',color:'#a71931',fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'6px',cursor:'pointer'}} onClick={()=>handleRoleToggle(activeSession?.role==='HOSPITAL'?'USER':'HOSPITAL')}>
                        Switch to {activeSession?.role==='HOSPITAL'?'User':'Hospital'}
                      </button>
                    </div>
                    <button className="profile-logout" onClick={handleLogout}><LogIn size={16}/> Reset Session</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="icon-btn" onClick={()=>{setView('admin');setProfileOpen(false)}} title="Admin"><LayoutDashboard size={18}/></button>
            <button className="menu-btn" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button>
          </div>
        </div>
      </div>
      <section className="animated-site-header" aria-label="Blood Bridge animated header">
        <AnimatedHeaderBackground/>
        <div className="animated-header-content">
          <div className="animated-header-punchline">
            <div className="hero-live-pill">
              <span className="live-dot pulse" />
              <span>LIVE EMERGENCY BLOOD NETWORK</span>
            </div>
            <h1>Bridging the Gap<br/>Between <em>Need</em> and<br/><em>Donor.</em></h1>
            <p className="animated-header-support">Connecting verified donors with those who need them most.<br/>Faster alerts. Trusted hospital care. Stronger lifelines.</p>
            
            <div className="hero-action-row">
              <button className="hero-cta-btn primary-hero-btn" onClick={()=>setView('request')}>
                <CircleAlert size={17}/> Request Blood <ArrowRight size={16}/>
              </button>
              <button className="hero-cta-btn secondary-hero-btn" onClick={()=>setView('donor')}>
                <HandHeart size={17}/> Become a Donor
              </button>
            </div>

            <div className="animated-header-network" aria-label="Live Blood Bridge network snapshot">
              <div className="animated-header-network-card">
                <span className="network-dot" />
                <div><strong>{donors.length + 1200}+</strong><small>Verified donors</small></div>
              </div>
              <div className="animated-header-network-card">
                <span className="network-dot pulse" />
                <div><strong>{requests.length + 12}</strong><small>Active alerts</small></div>
              </div>
            </div>
            
            <div className="animated-header-bloods">
              <span><b>A+</b> 18 available</span>
              <span><b>O−</b> 6 urgent</span>
              <span><b>B+</b> 11 nearby</span>
            </div>
          </div>
          <div className="header-scan-line" aria-hidden="true"></div>
        </div>
      </section>
    </header>}

    <AnimatePresence>
      {pageLoading && (
        <motion.div className="browse-loader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} aria-live="polite">
          <div className="browse-loader-card"><ThreeBodyLoader/><span>Opening module…</span></div>
        </motion.div>
      )}
    </AnimatePresence>

    <main>
      <AnimatePresence mode="wait">
        {view==='home' && <OverviewHome session={session} onNavigate={setView} donors={donors} requests={requests} cases={cases}/>}
        {view!=='home' && <div className={`module-page module-${view}`}><div className="module-blood-art" aria-hidden="true"><span className="blood-drop drop-one"/><span className="blood-drop drop-two"/><span className="blood-cross cross-one"/><span className="blood-pulse"/><span className="blood-orb orb-one"/><span className="blood-orb orb-two"/></div><div className="module-topbar"><button className="module-home-back" onClick={()=>setView('home')}><ChevronLeft size={17}/> Back to Home</button><span className="module-topline">BLOOD BRIDGE • MODULE</span></div>{view==='request' && <RequestPage onSubmit={submitRequest} onBack={()=>setView('home')}/>}
        {view==='donor' && <DonorPage onSubmit={submitDonor} onBack={()=>setView('home')}/>} 
        {view==='thalassemia' && <ThalassemiaPage cases={cases} onSubmit={submitCase} onBack={()=>setView('home')}/>} 
        {view==='hospitals' && <HospitalsPage onBack={()=>setView('home')}/>}
        {view==='history' && <DonorHub donors={donors} donations={donations} reminders={reminders} onAddDonation={addDonation} onBack={()=>setView('home')}/>} 
        {view==='camps' && <CampsPage camps={camps} onBack={()=>setView('home')}/>} 
        {view==='partners' && <PartnersPage cases={cases} donors={donors} requests={requests} onBack={()=>setView('home')}/>} 
        {view==='admin' && <AdminPage donors={donors} requests={requests} cases={cases} donations={donations} onBack={()=>setView('home')}/>} </div>}
      </AnimatePresence>
    </main>

    <footer className="site-footer"><div><div className="footer-brand"><span className="brand-mark small"><Droplets size={17}/></span><strong>Blood Bridge</strong></div><p>One trusted network for emergency blood support, verified donation records and recurring care.</p></div><div className="footer-links"><button onClick={()=>setView('request')}>Request blood</button><button onClick={()=>setView('donor')}>Become a donor</button><button onClick={()=>{window.location.href='thalassemia-care.html'}}>Thalassemia support</button></div><div className="footer-note">Prototype • Consent-first data sharing • Minimal patient identifiers</div></footer>
    <AnimatePresence>{toast && <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} exit={{y:30,opacity:0}} className="toast"><CheckCircle2 size={18}/>{toast}</motion.div>}</AnimatePresence>
    <AnimatePresence>{broadcast && <BroadcastPreview req={broadcast} donors={donors} onClose={()=>setBroadcast(null)}/>}</AnimatePresence>
    <AnimatePresence>{thalBroadcast && <ThalBroadcastPreview data={thalBroadcast} onClose={()=>setThalBroadcast(null)}/>}</AnimatePresence>
    <AnimatePresence>{alert && <AlertOverlay req={alert} donors={donors} onClose={()=>setAlert(null)}/>}</AnimatePresence>
  </div>
}


function LoginScreen({onLogin,error}:{onLogin:(p:{role:'USER'|'HOSPITAL';email:string;password:string;name:string;hospitalName:string})=>void;error:string}){
  const [role,setRole]=useState<'USER'|'HOSPITAL'>('USER');
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [hospitalName,setHospitalName]=useState('');
  const [busy,setBusy]=useState(false);
  const submit=(e:React.FormEvent)=>{e.preventDefault();if(busy)return;setBusy(true);onLogin({role,email,password,name,hospitalName});window.setTimeout(()=>setBusy(false),900)};
  return <div className="login-screen">
    <div className="login-visual"><div className="login-orbit one"/><div className="login-orbit two"/><div className="login-drop"><Droplets size={58}/></div><span className="login-live"><span/> LIVE EMERGENCY NETWORK</span><h1>Connect.<br/><em>Alert.</em><br/>Save Lives.</h1><p>Blood Bridge connects people who need blood with opted-in donors, hospitals and Thalassemia support centres.</p><div className="login-points"><span><ShieldCheck size={15}/> Consent-first alerts</span><span><Database size={15}/> Persistent records</span><span><Hospital size={15}/> Hospital-ready workflow</span></div></div>
    <div className="login-panel">
      <div className="login-brand"><span className="brand-mark"><Droplets size={21}/></span><div><strong>BLOOD<span>BRIDGE</span></strong><small>Emergency blood support network</small></div></div>
      <div className="login-heading"><span>WELCOME BACK</span><h2>Choose your access.</h2><p>User and hospital accounts have separate entry forms.</p></div>
      <div className="role-switch"><button type="button" className={role==='USER'?'active':''} onClick={()=>{setRole('USER');setEmail('');setPassword('');setName('');setHospitalName('')}}><UserRound size={17}/> User Login</button><button type="button" className={role==='HOSPITAL'?'active':''} onClick={()=>{setRole('HOSPITAL');setEmail('');setPassword('')}}><Building2 size={17}/> Hospital Login</button></div>
      <form className="form login-form" onSubmit={submit}>
        {role==='USER'?<><div className="flex-column"><label>Your name</label><div className="inputForm"><UserRound size={17}/><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" required /></div></div><div className="flex-column"><label>Email</label><div className="inputForm"><Mail size={17}/><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com" required /></div></div></>:<><div className="flex-column"><label>Hospital / organisation</label><div className="inputForm"><Building2 size={17}/><input className="input" value={hospitalName} onChange={e=>setHospitalName(e.target.value)} placeholder="Enter hospital name" required /></div></div><div className="flex-column"><label>Official email</label><div className="inputForm"><Mail size={17}/><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="hospital@example.com" required /></div></div></>}
        <div className="flex-column"><label>Password</label><div className="inputForm"><LockKeyhole size={17}/><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" required /></div></div>
        <div className="flex-row"><label className="remember-row"><input type="checkbox" defaultChecked/><span>Remember me</span></label><span className="span">Secure access</span></div>
        {error&&<div className="login-error"><CircleAlert size={16}/>{error}</div>}
        <button className="button-submit login-submit" type="submit" disabled={busy}>{busy?<><ThreeBodyLoader/><span>Opening secure portal…</span></>:<><LogIn size={17}/>{role==='HOSPITAL'?'Enter Hospital Portal':'Enter User Portal'}<ArrowRight size={17}/></>}</button>
      </form>
      <div className="login-note"><KeyRound size={15}/><span>For this prototype, if the Flask backend is unavailable, a demo session opens locally. Production login should always use the backend authentication flow.</span></div>
    </div>
  </div>
}

function ThreeBodyLoader(){return <span className="three-body" aria-label="Loading"><span className="three-body__dot"/><span className="three-body__dot"/><span className="three-body__dot"/></span>}

function OverviewHome({session,onNavigate,donors,requests,cases}:{session:any;onNavigate:(v:View)=>void;donors:Donor[];requests:BloodRequest[];cases:ThalassemiaCase[]}){
  const active=requests.filter(r=>r.status==='ACTIVE').length;
  return <motion.div className="overview-home" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
    <div className="overview-strip"><div className="overview-punchline"><span className="eyebrow">BLOOD BRIDGE</span><h2>A Faster Connection When Every Moment Matters</h2></div><div className="overview-strip-actions"><div className="overview-badge"><ShieldCheck/><b>{session?.role==='HOSPITAL'?'Verified workflow ready':'Emergency alerts ready'}</b></div><SmoothDrawer onRequest={()=>onNavigate('request')} onDonor={()=>onNavigate('donor')}/></div></div>
    <div className="quick-module-grid"><QuickModule icon={<CircleAlert/>} title="Blood Request" text="Create an urgent blood request and preview the exact recipient alert." meta={`${active} active request${active===1?'':'s'}`} onClick={()=>onNavigate('request')} primary/><QuickModule icon={<HandHeart/>} title="Become a Donor" text="Save blood group, contact, availability and alert preferences." meta={`${donors.length} donor profile${donors.length===1?'':'s'}`} onClick={()=>onNavigate('donor')}/><QuickModule icon={<Heart/>} title="Thalassemia Patients" text="Store verified transfusion requirements and notify opted-in support donors." meta={`${cases.length} stored requirement${cases.length===1?'':'s'}`} onClick={()=>{window.location.href='thalassemia-care.html'}}/><QuickModule icon={<Hospital/>} title="Hospital Information" text="Search a clear list of hospitals before selecting the hospital in a request." meta="Search directory" onClick={()=>onNavigate('hospitals')}/><QuickModule icon={<Clock3/>} title="Donation History" text="Record donations and review reminder status." meta="Donor Hub" onClick={()=>onNavigate('history')}/><QuickModule icon={<CalendarDays/>} title="Donation Camps" text="View upcoming blood donation drives and contact details." meta="Upcoming camps" onClick={()=>onNavigate('camps')}/></div>
    <section className="scroll-story"><span className="eyebrow">THE BLOOD BRIDGE IDEA</span><ScrollWordReveal>Fast action should feel clear, human, and trustworthy when every minute matters.</ScrollWordReveal><p>Scroll to reveal the workflow. Then flip a pathway card to see what happens behind the interface.</p></section>
    <section className="flip-pathways"><div className="section-head compact-head"><span>CORE PATHWAYS</span><h2>Three experiences. One connected network.</h2><p>Hover a card on desktop or tap it on mobile to reveal the operational details.</p></div><div className="flip-grid"><CardFlip icon="blood" title="Emergency blood request" subtitle="Create → save → alert matching donors" description="Capture the patient and hospital requirement, save the request, then show the exact blood-group alert sent to opted-in recipients." features={["Patient + condition details","Blood-group matching","Recipient notification preview"]} onOpen={()=>onNavigate('request')}/><CardFlip icon="donor" title="Become a donor" subtitle="Profile → preferences → reminders" description="Keep donor details, availability and communication preferences together so the right alerts can reach the right volunteers." features={["Blood group + mobile","Emergency alert opt-in","Donation reminders"]} onOpen={()=>onNavigate('donor')}/><CardFlip icon="thal" title="Thalassemia support" subtitle="Verify → schedule → coordinate" description="Partner centres can store recurring transfusion requirements while keeping sensitive patient information protected." features={["Patient reference","Next transfusion date","Support donor outreach"]} onOpen={()=>onNavigate('thalassemia')}/></div></section>
  </motion.div>
}
function QuickModule({icon,title,text,meta,onClick,primary=false}:{icon:React.ReactNode;title:string;text:string;meta:string;onClick:()=>void;primary?:boolean}){return <motion.button className={primary?'quick-module primary-module':'quick-module'} whileHover={{y:-5}} onClick={onClick}><span className="quick-icon">{icon}</span><div><span className="quick-meta">{meta}</span><h3>{title}</h3><p>{text}</p></div><ArrowRight className="quick-arrow" size={18}/></motion.button>}

function HospitalsPage({onBack}:{onBack:()=>void}){
  const hospitals=[
    {name:'Help Hospitals',area:'MG Road, Governor Peta',phone:'+91 866 661 5552',tags:'Multispeciality • 24 hours'},
    {name:'Harini Hospitals',area:'Prakasam Road, Suryaraopeta',phone:'+91 98480 44404',tags:'Gastro & liver care • 24 hours'},
    {name:'Srikara Hospitals',area:'Kanuru, Vijayawada',phone:'+91 77299 90003',tags:'Hospital • 24 hours'},
    {name:'Medcy Hospitals',area:'Mogalrajapuram, Vijayawada',phone:'+91 80080 80725',tags:'Multispeciality • 24 hours'},
    {name:'NASA Hospitals Vijayawada',area:'Suryaraopeta, Vijayawada',phone:'+91 866 243 4545',tags:'Hospital • Emergency care'},
    {name:'Manvi Hospitals',area:'Suryaraopeta, Vijayawada',phone:'+91 93911 76126',tags:'Hospital • Emergency support'},
    {name:'NRI General Hospital',area:'Chinna Kakani, between Guntur & Vijayawada',phone:'See hospital directory',tags:'750-bed general hospital'},
    {name:'Manipal Hospitals Vijayawada',area:'Near Kanakadurga Varadhi, Tadepalli',phone:'See official hospital contact',tags:'Multispeciality • Blood bank / transfusion services'}
  ];
  const [q,setQ]=useState('');
  const filtered=hospitals.filter(h=>`${h.name} ${h.area} ${h.tags}`.toLowerCase().includes(q.toLowerCase()));
  return <motion.div className="page hospital-page" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}><section className="module-hero hospital-hero"><div><span className="eyebrow">HOSPITAL DIRECTORY</span><h1>Find the right hospital before you send a request.</h1><p>Search by hospital name, area or service. These are reference listings for the prototype; users should confirm current availability and emergency services with the hospital.</p></div><div className="module-stat"><Hospital/><strong>{hospitals.length}</strong><span>reference hospitals</span></div></section><div className="hospital-search"><Search size={19}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search hospital, area or service…"/><span>{filtered.length} result{filtered.length===1?'':'s'}</span></div><div className="hospital-grid">{filtered.map(h=><article className="hospital-card" key={h.name}><div className="hospital-card-top"><span className="hospital-logo"><Hospital size={20}/></span><span className="hospital-status"><span/> Reference listing</span></div><h3>{h.name}</h3><p><MapPin size={14}/>{h.area}</p><div className="hospital-tags"><span>{h.tags}</span><span><Phone size={13}/>{h.phone}</span></div><button onClick={()=>{onBack();window.setTimeout(()=>window.dispatchEvent(new CustomEvent('bb-select-hospital',{detail:{name:h.name}})),0)}}>Use this hospital <ArrowRight size={15}/></button></article>)}{!filtered.length&&<div className="empty hospital-empty"><Search/><strong>No hospital matched</strong><p>Try another hospital name or area.</p></div>}</div></motion.div>
}

function Home({onNavigate,donors,requests,reminders,onAlert}:{onNavigate:(v:View)=>void;donors:Donor[];requests:BloodRequest[];reminders:Donor[];onAlert:()=>void}){
  const testimonials=[['“The emergency request reaches the right blood group without making the donor search through the app.”','Verified donor'],['“Our centre can keep the patient reference separate from donor-facing information.”','Thalassemia partner'],['“Donation history and reminders give donors one place to stay organised.”','Community donor']];
  const [slide,setSlide]=useState(0);
  return <motion.div className="page" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <section className="hero"><div className="hero-copy"><motion.div className="eyebrow" initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}}><span className="live-dot"/>LIVE SUPPORT NETWORK</motion.div><motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1}}>When blood is<br/>needed, connection<br/><em>matters.</em></motion.h1><p className="hero-lead">Blood Bridge brings emergency requests, opted-in donors, blood banks and thalassemia support centres into one calm, reliable workflow.</p><div className="hero-actions"><button className="primary" onClick={()=>onNavigate('request')}><CircleAlert size={18}/> Request blood <ArrowRight size={17}/></button><button className="secondary" onClick={()=>onNavigate('donor')}><HandHeart size={18}/> Become a donor</button></div><div className="trust-row"><span><ShieldCheck size={17}/> Consent-first alerts</span><span><Database size={17}/> Structured records</span><span><Hospital size={17}/> Partner-ready</span></div></div><div className="hero-visual"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><motion.div className="blood-core" animate={{scale:[1,1.04,1],boxShadow:['0 25px 70px rgba(204,31,51,.22)','0 25px 95px rgba(204,31,51,.4)','0 25px 70px rgba(204,31,51,.22)']}} transition={{duration:3,repeat:Infinity}}><Droplets size={72}/></motion.div><motion.div className="floating-card card-alert" animate={{y:[0,-8,0]}} transition={{duration:4,repeat:Infinity}}><span className="mini-icon red"><Bell size={15}/></span><div><b>O− emergency</b><small>3 units • alert queued</small></div></motion.div><motion.div className="floating-card card-match" animate={{y:[0,7,0]}} transition={{duration:3.5,repeat:Infinity}}><span className="mini-icon green"><CheckCircle2 size={15}/></span><div><b>B+ donors</b><small>{donors.filter(d=>d.bloodGroup==='B+'&&d.emergencyAlerts).length} opted in</small></div></motion.div><div className="scan-line"/></div></section>
    <section className="metrics"><Metric value={donors.length} label="registered donors"/><Metric value={requests.filter(r=>r.status==='ACTIVE').length} label="active requests"/><Metric value={reminders.length} label="reminders due"/><Metric value={8} label="blood groups supported"/></section>
    <section className="section"><SectionHead kicker="THE WORKFLOW" title="Built around the moments that matter" text="Every module has a clear purpose — from the first emergency request to verified donation follow-up."/><div className="feature-grid"><Feature icon={<CircleAlert/>} title="Emergency blood requests" text="Create a request with the available details. Clicking send immediately dispatches a blood-group alert; any blank detail is shown as 'Not provided'." onClick={()=>onNavigate('request')}/><Feature icon={<HandHeart/>} title="Donor profile + reminders" text="Store last donation date, alert preferences and donation history. Keep reminders visible without overpromising eligibility." onClick={()=>onNavigate('history')}/><Feature icon={<Heart/>} title="Thalassemia support" text="A separate partner-facing registry for verified requirements, transfusion dates and donor responses." onClick={()=>{window.location.href='thalassemia-care.html'}}/><Feature icon={<CalendarDays/>} title="Donation camps" text="Publish upcoming drives and let the community see organiser, venue, timing and contact details." onClick={()=>onNavigate('camps')}/></div></section>
    <section className="split-section"><div className="panel dark-panel"><div className="panel-kicker">EMERGENCY DISPATCH</div><h2>Blood-group based alerts.<br/><span>No radius chasing.</span></h2><p>When a B+ request is submitted, the prototype identifies B+ donors who have opted into emergency alerts. Location is not used as the matching rule.</p><button className="ghost-light" onClick={onAlert}>Preview an alert <ArrowRight size={16}/></button></div><div className="panel timeline"><div className="timeline-item"><b>01</b><div><strong>Request</strong><p>Hospital or requester enters the emergency details.</p></div></div><div className="timeline-item"><b>02</b><div><strong>Match</strong><p>Only the requested blood group + opted-in donors are selected.</p></div></div><div className="timeline-item"><b>03</b><div><strong>Respond</strong><p>Donors can indicate that they can help.</p></div></div><div className="timeline-item"><b>04</b><div><strong>Verify</strong><p>Partner blood banks can verify donations and records.</p></div></div></div></section>
    <section className="section testimonial-section"><SectionHead kicker="REAL-WORLD WORKFLOW" title="A human-centred network, not another noisy dashboard" text="The interface keeps urgent actions prominent and supporting data organised."/><div className="coverflow"><button className="cover-arrow" onClick={()=>setSlide((slide+2)%3)}><ChevronLeft/></button>{testimonials.map((t,i)=><motion.article key={i} className={i===slide?'quote-card active':'quote-card'} animate={{x:(i-slide)*24,scale:i===slide?1:.91,opacity:i===slide?1:.48,rotateY:(i-slide)*-12}} transition={{type:'spring',stiffness:180,damping:20}}><Sparkles size={19}/><blockquote>{t[0]}</blockquote><small>{t[1]}</small></motion.article>)}<button className="cover-arrow" onClick={()=>setSlide((slide+1)%3)}><ChevronRight/></button></div><div className="dots">{[0,1,2].map(i=><button key={i} className={i===slide?'dot active':'dot'} onClick={()=>setSlide(i)}/>)}</div></section>
    <section className="cta-band"><div><span className="eyebrow">BLOOD BRIDGE</span><h2>Make the next request easier to answer.</h2></div><button className="primary" onClick={()=>onNavigate('request')}>Start an emergency request <ArrowRight/></button></section>
  </motion.div>
}
function Metric({value,label}:{value:number;label:string}){return <motion.div className="metric" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><strong>{value}</strong><span>{label}</span></motion.div>}
function SectionHead({kicker,title,text}:{kicker:string;title:string;text:string}){return <div className="section-head"><span>{kicker}</span><h2>{title}</h2><p>{text}</p></div>}
function Feature({icon,title,text,onClick}:{icon:React.ReactNode;title:string;text:string;onClick:()=>void}){return <motion.button className="feature-card" whileHover={{y:-5}} onClick={onClick}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{text}</p><span className="feature-link">Open module <ArrowRight size={15}/></span></motion.button>}

function RequestPage({onSubmit,onBack}:{onSubmit:(x:Omit<BloodRequest,'id'|'createdAt'|'status'>)=>void;onBack:()=>void}){
  const [f,setF]=useState({requesterName:'',hospital:'',patientName:'',bloodGroup:'B+' as BloodGroup,patientAge:'',units:'1',phone:'',condition:'',description:''});
  useEffect(()=>{ const pick=(e:Event)=>{ const name=(e as CustomEvent).detail?.name; if(name) setF(prev=>({...prev,hospital:name})); }; window.addEventListener('bb-select-hospital',pick); return ()=>window.removeEventListener('bb-select-hospital',pick); },[]);
  const [sending,setSending]=useState(false);
  const [formError,setFormError]=useState('');
  const update=(key:string,value:string)=>{setFormError('');setF(prev=>({...prev,[key]:value}))};
  const submit=(e:React.FormEvent)=>{
    e.preventDefault();
    if(sending)return;
    // Emergency requests must dispatch immediately from the prototype.
    // Optional fields are preserved as 'Not provided' in the recipient alert.
    setFormError('');
    setSending(true);
    onSubmit({
      ...f,
      requesterName:f.requesterName.trim() || 'Not provided',
      hospital:f.hospital.trim() || 'Not provided',
      patientName:f.patientName.trim() || 'Not provided',
      patientAge:Number(f.patientAge)||0,
      phone:f.phone.trim() || 'Not provided',
      condition:f.condition.trim() || 'Emergency blood requirement',
      description:f.description.trim() || 'No additional description provided.',
      units:Number(f.units)||1
    });
    // The parent opens the dispatch preview immediately after saving.
    window.setTimeout(()=>setSending(false),500);
  };
  return <FormPage title="Request emergency blood" subtitle="Create a structured request. Once you submit, the request is saved and the recipient notification flow opens automatically." onBack={onBack}>
    <form className="form-grid" onSubmit={submit}>
      <Field label="Requester name *" value={f.requesterName} onChange={v=>update('requesterName',v)} placeholder="Your name"/>
      <Field label="Hospital / care centre *" value={f.hospital} onChange={v=>update('hospital',v)} placeholder="Hospital name"/>
      <Select label="Blood group *" value={f.bloodGroup} onChange={v=>update('bloodGroup',v)} options={BG}/>
      <Field label="Patient age *" type="number" value={f.patientAge} onChange={v=>update('patientAge',v)} placeholder="Age"/>
      <Field label="Units required *" type="number" value={f.units} onChange={v=>update('units',v)} placeholder="1"/>
      <Field label="Contact number *" value={f.phone} onChange={v=>update('phone',v)} placeholder="+91 98765 43210"/>
      <Field label="Emergency condition *" value={f.condition} onChange={v=>update('condition',v)} placeholder="e.g. Emergency surgery / accident / severe bleeding"/>
      <div className="field full"><label>Emergency description</label><textarea value={f.description} onChange={e=>update('description',e.target.value)} placeholder="Explain the urgency, ward, surgery requirement or contact instructions..."/></div>
      {formError&&<div className="form-note" style={{borderColor:'rgba(220,38,38,.45)',color:'#fecaca'}}><CircleAlert size={18}/><span>{formError}</span></div>}
      <button className="primary submit" type="submit" disabled={sending} style={{opacity:sending?.7:1}}>{sending?'Sending request…':'Send emergency request'} <Bell size={18}/></button>
    </form>
  </FormPage>
}

function DonorPage({onSubmit,onBack}:{onSubmit:(x:Omit<Donor,'id'|'createdAt'|'verified'>)=>void;onBack:()=>void}){const [f,setF]=useState<Omit<Donor,'id'|'createdAt'|'verified'>>({name:'',age:18,bloodGroup:'B+',phone:'',lastDonation:'',emergencyAlerts:true,donationReminders:true,thalassemiaAlerts:true});return <FormPage title="Become a donor" subtitle="Your profile powers emergency matching, donation history and optional support alerts." onBack={onBack}><form className="form-grid" onSubmit={e=>{e.preventDefault();onSubmit(f)}}><Field label="Full name" value={f.name} onChange={v=>setF({...f,name:v})}/><Field label="Email" value={f.email||''} onChange={v=>setF({...f,email:v})} placeholder="name@example.com"/><Field label="Age" type="number" value={f.age} onChange={v=>setF({...f,age:Number(v)})}/><Select label="Blood group" value={f.bloodGroup} onChange={v=>setF({...f,bloodGroup:v as BloodGroup})} options={BG}/><Field label="Mobile number" value={f.phone} onChange={v=>setF({...f,phone:v})}/><Field label="Last donation date" type="date" value={f.lastDonation} onChange={v=>setF({...f,lastDonation:v})}/><Select label="Current availability" value={f.availability||'Available'} onChange={v=>setF({...f,availability:v as 'Available'|'Unavailable'})} options={['Available','Unavailable']}/><div className="preference-box"><div><strong>Alert preferences</strong><span>Choose what Blood Bridge may contact you about.</span></div><Toggle label="Emergency blood alerts" checked={f.emergencyAlerts} onChange={v=>setF({...f,emergencyAlerts:v})}/><Toggle label="Donation reminders" checked={f.donationReminders} onChange={v=>setF({...f,donationReminders:v})}/><Toggle label="Thalassemia support alerts" checked={f.thalassemiaAlerts} onChange={v=>setF({...f,thalassemiaAlerts:v})}/></div><button className="primary submit" type="submit">Save donor profile <ArrowRight size={18}/></button></form></FormPage>}

function ThalassemiaPage({cases,onSubmit,onBack}:{cases:ThalassemiaCase[];onSubmit:(x:Omit<ThalassemiaCase,'id'|'createdAt'|'verified'>)=>void;onBack:()=>void}){
  const [f,setF]=useState<Omit<ThalassemiaCase,'id'|'createdAt'|'verified'>>({centre:'',patientRef:'',patientName:'',patientAge:0,contact:'',notes:'',bloodGroup:'B+',nextTransfusion:'',units:1});
  return <motion.div className="page" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
    <section className="module-hero"><div><span className="eyebrow">THALASSEMIA SUPPORT CENTRE</span><h1>A separate, persistent care registry.</h1><p>Save patient support details, transfusion schedules and blood-group requirements. Available donors who opted into Thalassemia alerts can be notified without exposing unnecessary medical information.</p></div><div className="module-stat"><Heart/><strong>{cases.length}</strong><span>stored care records</span></div></section>
    <div className="two-col">
      <form className="card form-card" onSubmit={e=>{e.preventDefault();onSubmit(f)}}>
        <div className="card-title"><div><span>PARTNER ENTRY</span><h2>New transfusion requirement</h2></div><ShieldCheck/></div>
        <Field label="Centre / hospital" value={f.centre} onChange={v=>setF({...f,centre:v})}/>
        <Field label="Internal patient reference" value={f.patientRef} onChange={v=>setF({...f,patientRef:v})} placeholder="e.g. TCC-1042"/>
        <Field label="Patient name" value={f.patientName||''} onChange={v=>setF({...f,patientName:v})}/>
        <Field label="Patient age" type="number" value={f.patientAge||''} onChange={v=>setF({...f,patientAge:Number(v)})}/>
        <Field label="Care contact" value={f.contact||''} onChange={v=>setF({...f,contact:v})}/>
        <Select label="Blood group" value={f.bloodGroup} onChange={v=>setF({...f,bloodGroup:v as BloodGroup})} options={BG}/>
        <Field label="Next transfusion date" type="date" value={f.nextTransfusion} onChange={v=>setF({...f,nextTransfusion:v})}/>
        <Field label="Units required" type="number" value={f.units} onChange={v=>setF({...f,units:Number(v)})}/>
        <div className="field full"><label>Support notes</label><textarea value={f.notes||''} onChange={e=>setF({...f,notes:e.target.value})} placeholder="Recurring transfusion / support notes..."/></div>

        <button className="primary submit" type="submit">Save patient requirement & notify donors <Bell size={18}/></button>
      </form>
      <div><div className="section-mini"><span>STORED REQUIREMENTS</span><h2>Centre registry</h2><p>Records remain available after refresh because they are stored in the backend database.</p></div><div className="case-list">{cases.map(c=><div className="case-card" key={c.id}><div className="blood-chip">{c.bloodGroup}</div><div><strong>{c.patientName || 'Patient'} • {c.centre}</strong><span>Reference {c.patientRef}{c.contact ? ` • ${c.contact}` : ''}</span><small>{c.patientAge ? `${c.patientAge} yrs • ` : ''}Next transfusion • {c.nextTransfusion || 'Date pending'} • {c.units} unit{c.units!==1?'s':''}</small></div><span className={c.verified?'verified':'pending'}>{c.verified?'Verified':'Pending'}</span></div>)}</div></div>
    </div>
    <div className="thal-alert-card"><div><span className="preview-label"><Bell size={14}/> DONOR SUPPORT ALERT</span><h3>Available donors can receive a Thalassemia support notification</h3><p>Blood Bridge matches the stored blood group with donors marked <b>Available</b> and opted into Thalassemia alerts. The backend records each delivered alert.</p></div><div className="thal-alert-message"><strong>🩸 THALASSEMIA SUPPORT REQUEST</strong><span>Centre: Your saved centre</span><span>Blood group: Selected group</span><span>Next transfusion: Saved date</span><span>Units: Saved requirement</span></div></div>
    
  </motion.div>
}

function DonorHub({donors,donations,reminders,onAddDonation,onBack}:{donors:Donor[];donations:Donation[];reminders:Donor[];onAddDonation:(x:Omit<Donation,'id'|'verified'>)=>void;onBack:()=>void}){
  const [selected,setSelected]=useState(donors[0]?.id||'');
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  useEffect(()=>{ if(!selected && donors[0]) setSelected(donors[0].id); },[donors,selected]);
  const activeDonor=donors.find(d=>d.id===selected);
  const donorHistory=donations.filter(d=>d.donorId===selected).sort((a,b)=>b.date.localeCompare(a.date));
  return <motion.div className="page" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <section className="module-hero"><div><span className="eyebrow">DONOR HUB</span><h1>Your donation history and reminders.</h1><p>Choose a donor profile to view recorded donations, update the last donation date and see reminder status.</p></div><div className="module-stat"><Clock3/><strong>{reminders.length}</strong><span>reminders to review</span></div></section>
    <div className="card donor-journey-profile" style={{marginBottom:18}}><div className="card-title"><div><span>DONOR PROFILE</span><h2>Who are you checking?</h2></div><Users/></div><div className="inline-add"><select aria-label="Select donor" value={selected} onChange={e=>setSelected(e.target.value)}>{donors.length?donors.map(d=><option value={d.id} key={d.id}>{d.name} • {d.bloodGroup}</option>):<option value="">No donor profiles yet</option>}</select>{activeDonor&&<><span className="verified">{activeDonor.availability||'Available'}</span><span className="pending">{activeDonor.bloodGroup}</span></>}</div>{activeDonor&&<><div className="profile-strip"><div><strong>{activeDonor.name}</strong><span>{activeDonor.phone} • {activeDonor.email||'No email'}</span></div><div><small>Last donation</small><b>{activeDonor.lastDonation||'Not recorded'}</b></div><div><small>Emergency alerts</small><b>{activeDonor.emergencyAlerts?'ON':'OFF'}</b></div><div><small>Donation reminders</small><b>{activeDonor.donationReminders?'ON':'OFF'}</b></div></div><div className="donor-details-grid"><div><small>Age</small><strong>{activeDonor.age} years</strong></div><div><small>Blood group</small><strong>{activeDonor.bloodGroup}</strong></div><div><small>Verification</small><strong>{activeDonor.verified?'Verified':'Pending'}</strong></div><div><small>Availability</small><strong>{activeDonor.availability||'Available'}</strong></div><div><small>Thalassemia alerts</small><strong>{activeDonor.thalassemiaAlerts?'ON':'OFF'}</strong></div><div><small>Total donations</small><strong>{donations.filter(d=>d.donorId===activeDonor.id).length}</strong></div></div></>}</div>
    <div className="card donor-directory"><div className="card-title"><div><span>DONOR DIRECTORY</span><h2>Donor details</h2></div><Users/></div><p className="donor-directory-intro">Verified and registered donor profiles available in the Blood Bridge network. Select a donor above to view their full journey and donation history.</p><div className="donor-directory-grid">{donors.length?donors.map(d=><article className="donor-detail-card" key={d.id}><div className="donor-detail-head"><div className="donor-avatar">{String(d.name||'D').charAt(0).toUpperCase()}</div><div><strong>{d.name||'Unnamed donor'}</strong><span>{d.email||'No email provided'}</span></div><span className={d.verified?'verified':'pending'}>{d.verified?'Verified':'Pending'}</span></div><div className="donor-detail-meta"><div><small>Blood group</small><b>{d.bloodGroup}</b></div><div><small>Age</small><b>{d.age} yrs</b></div><div><small>Availability</small><b>{d.availability||'Available'}</b></div><div><small>Phone</small><b>{d.phone||'Not provided'}</b></div><div><small>Last donation</small><b>{d.lastDonation||'Not recorded'}</b></div><div><small>Donations</small><b>{donations.filter(x=>x.donorId===d.id).length}</b></div></div><div className="donor-detail-flags"><span>Emergency alerts: <b>{d.emergencyAlerts?'ON':'OFF'}</b></span><span>Reminders: <b>{d.donationReminders?'ON':'OFF'}</b></span><span>Thalassemia: <b>{d.thalassemiaAlerts?'ON':'OFF'}</b></span></div></article>):<div className="empty"><Users/><strong>No donor profiles yet</strong><p>Registered donors will appear here with their profile and donation details.</p></div>}</div></div>
    <div className="dashboard-grid"><div className="card"><div className="card-title"><div><span>DONATION HISTORY</span><h2>Recorded donations</h2></div><ClipboardList/></div>{donorHistory.length?donorHistory.map(d=><div className="history-row" key={d.id}><div className="date-box"><b>{new Date(d.date).getDate()}</b><span>{new Date(d.date).toLocaleString('en',{month:'short'})}</span></div><div><strong>{activeDonor?.name||'Donor'}</strong><span>{d.centre} • {d.units} unit{d.units!==1?'s':''}</span></div><span className={d.verified?'verified':'pending'}>{d.verified?'Verified':'Recorded'}</span></div>):<div className="empty"><ClipboardList/><strong>No donation records yet</strong><p>Add the first donation below. The donor's last-donation date will update immediately.</p></div>}<div className="inline-add"><input aria-label="Donation date" type="date" value={date} onChange={e=>setDate(e.target.value)}/><button disabled={!activeDonor} onClick={()=>onAddDonation({donorId:selected,date,centre:'Partner Blood Bank',units:1})}><Plus size={16}/> Record donation</button></div></div>
    <div className="card reminder-card"><div className="card-title"><div><span>REMINDER CENTRE</span><h2>Donation follow-up</h2></div><Bell/></div>{activeDonor&&activeDonor.lastDonation?<div className="reminder"><div className="reminder-icon"><Bell size={18}/></div><div><strong>{activeDonor.name}</strong><p><b>{daysSinceDonation(activeDonor)} days</b> have passed since the last recorded blood donation on {activeDonor.lastDonation}.</p>{reminderStage(activeDonor)>0?<><p>This is your <b>{reminderStage(activeDonor)===1?'30-day':reminderStage(activeDonor)===2?'60-day':'90-day'} reminder.</b> Please confirm eligibility with a blood bank before donating again.</p><span className={activeDonor.availability==='Available'?'verified':'pending'}>{activeDonor.availability||'Available'}</span></>:<span className="pending">Reminder not due yet</span>}</div></div>:<div className="empty"><Bell/><strong>No donation date recorded</strong><p>Record a donation above and the reminder counter will update automatically.</p></div>}<div className="policy-note"><ShieldCheck size={16}/> Eligibility is confirmed by the donor and blood bank; Blood Bridge does not prescribe donation intervals.</div></div></div>
    
  </motion.div>
}

function CampsPage({camps,onBack}:{camps:Camp[];onBack:()=>void}){return <motion.div className="page" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><section className="module-hero"><div><span className="eyebrow">DONATION CAMPS</span><h1>Give the community a place to show up.</h1><p>Blood banks and organisers can publish verified donation drives with clear timing, venue and contact details.</p></div><div className="module-stat"><CalendarDays/><strong>{camps.length}</strong><span>upcoming camps</span></div></section><div className="camp-grid">{camps.map(c=><article className="camp-card" key={c.id}><div className="camp-date"><b>{new Date(c.date).getDate()}</b><span>{new Date(c.date).toLocaleString('en',{month:'short'})}</span></div><div><span className="eyebrow">{c.city}</span><h3>{c.title}</h3><p>{c.organiser}</p><div className="camp-meta"><span><Clock3 size={15}/>{c.time}</span><span><Hospital size={15}/>{c.venue}</span><span><Phone size={15}/>{c.contact}</span></div></div></article>)}</div></motion.div>}

function PartnersPage({cases,donors,requests,onBack}:{cases:ThalassemiaCase[];donors:Donor[];requests:BloodRequest[];onBack:()=>void}){return <motion.div className="page" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><section className="module-hero"><div><span className="eyebrow">PARTNER PORTAL</span><h1>One operational view for verified organisations.</h1><p>Blood banks, hospitals and thalassemia centres can work from role-specific records instead of sharing full patient databases.</p></div><div className="partner-logos"><span><Hospital/> Hospitals</span><span><Droplets/> Blood banks</span><span><Heart/> Care centres</span></div></section><div className="partner-grid"><PartnerCard icon={<Hospital/>} title="Hospitals" items={[`${requests.length} emergency requests`, 'Requester contact details', 'Donor response workflow', 'Request fulfilment status']}/><PartnerCard icon={<Droplets/>} title="Blood banks" items={[`${donors.length} donor profiles`, 'Donation verification', 'Donation camp publishing', 'Eligibility confirmation']}/><PartnerCard icon={<Heart/>} title="Thalassemia centres" items={[`${cases.length} care records`, 'Next transfusion dates', 'Blood-group requirements', 'Consent-based donor outreach']}/></div><div className="privacy-strip"><LockKeyhole/><div><strong>Privacy by design</strong><p>Use an internal patient reference instead of a name in donor-facing flows. Access should be role-based and auditable in a production deployment.</p></div></div></motion.div>}
function PartnerCard({icon,title,items}:{icon:React.ReactNode;title:string;items:string[]}){return <article className="partner-card"><span className="partner-icon">{icon}</span><h3>{title}</h3>{items.map((x,i)=><div className="check-row" key={i}><CheckCircle2 size={16}/>{x}</div>)}</article>}

function AdminPage({donors,requests,cases,donations,onBack}:{donors:Donor[];requests:BloodRequest[];cases:ThalassemiaCase[];donations:Donation[];onBack:()=>void}){return <motion.div className="page" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><section className="module-hero"><div><span className="eyebrow">ADMIN CONSOLE</span><h1>See the network without exposing unnecessary detail.</h1><p>A production admin would add authentication, partner verification, audit logs and access controls. This prototype shows the operational structure.</p></div><div className="module-stat"><Activity/><strong>LIVE</strong><span>prototype workspace</span></div></section><div className="admin-stats"><AdminStat icon={<Users/>} value={donors.length} label="Donor profiles"/><AdminStat icon={<CircleAlert/>} value={requests.length} label="Blood requests"/><AdminStat icon={<Heart/>} value={cases.length} label="Thalassemia records"/><AdminStat icon={<ClipboardList/>} value={donations.length} label="Donation records"/></div><div className="card admin-table"><div className="card-title"><div><span>RECENT ACTIVITY</span><h2>Operational records</h2></div><Search/></div>{requests.map(r=><div className="admin-row" key={r.id}><span className="status-dot"/><div><strong>{r.bloodGroup} request • {r.hospital}</strong><span>{r.units} unit(s) • {r.phone}</span></div><small>{r.status}</small></div>)}{cases.map(c=><div className="admin-row" key={c.id}><span className="status-dot purple"/><div><strong>{c.bloodGroup} transfusion • {c.centre}</strong><span>Reference {c.patientRef} • {c.units} unit(s)</span></div><small>{c.verified?'VERIFIED':'PENDING'}</small></div>)}</div></motion.div>}
function AdminStat({icon,value,label}:{icon:React.ReactNode;value:number|string;label:string}){return <div className="admin-stat"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}

function FormPage({title,subtitle,onBack,children}:{title:string;subtitle:string;onBack:()=>void;children:React.ReactNode}){return <motion.div className="page form-page" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}><div className="form-heading"><span className="eyebrow">BLOOD BRIDGE</span><h1>{title}</h1><p>{subtitle}</p></div><div className="form-card card">{children}</div></motion.div>}
function Field({label,value,onChange,type='text',placeholder=''}:{label:string;value:any;onChange:(v:string)=>void;type?:string;placeholder?:string}){return <div className="field"><label>{label}</label><input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/></div>}
function Select({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[]}){return <div className="field"><label>{label}</label><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(x=><option key={x}>{x}</option>)}</select></div>}
function Toggle({label,checked,onChange}:{label:string;checked:boolean;onChange:(v:boolean)=>void}){return <label className="toggle-row"><span>{label}</span><button type="button" className={checked?'toggle on':'toggle'} onClick={()=>onChange(!checked)}><span/></button></label>}
function BroadcastPreview({req,donors,onClose}:{req:BloodRequest;donors:Donor[];onClose:()=>void}){
  const matches=donors.filter(d=>d.bloodGroup===req.bloodGroup&&d.emergencyAlerts&&d.availability!=='Unavailable');
  const sms=`🚨 URGENT BLOOD REQUEST | ${req.bloodGroup} | Requester: ${req.requesterName} | Hospital: ${req.hospital} | Patient: ${req.patientName} (${req.patientAge}) | Condition: ${req.condition} | ${req.units} unit${req.units!==1?'s':''} required | Contact: ${req.phone} | ${req.description}`;
  return <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <motion.div className="broadcast-modal" initial={{opacity:0,scale:.94,y:18}} animate={{opacity:1,scale:1,y:0}} transition={{type:'spring',stiffness:240,damping:22}}>
      <button className="modal-close" onClick={onClose}><X/></button>
      <div className="broadcast-head"><div className="broadcast-pulse"><Bell/></div><div><span className="eyebrow">EXACT DONOR ALERT PREVIEW</span><h2>This is the message the matching donor receives.</h2><p>Blood Bridge saves the request and shows the complete push/SMS alert exactly as it is prepared for the matching donor.</p></div></div>
      <div className="dispatch-steps">
        <div className="dispatch-step done"><span>01</span><div><b>Request saved</b><small>ID {req.id}</small></div><CheckCircle2/></div>
        <div className="dispatch-step done"><span>02</span><div><b>Blood group matched</b><small>{matches.length} opted-in {req.bloodGroup} recipient{matches.length===1?'':'s'} matched.</small></div><CheckCircle2/></div>
        <div className="dispatch-step active"><span>03</span><div><b>Notification sent</b><small>Recipient phone notification is shown below.</small></div><Activity/></div>
      </div>
      <div className="recipient-layout">
        <div className="phone-frame"><div className="phone-notch"/><div className="phone-top"><span>9:41</span><span>● ● ●</span></div><div className="phone-app"><span className="phone-brand"><Droplets size={13}/> BLOOD BRIDGE</span><span className="phone-time">now</span></div><motion.div className="phone-notification" initial={{y:-16,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.2}}><div className="notif-icon"><Bell size={16}/></div><div className="notif-copy"><strong>🚨 {req.bloodGroup} BLOOD NEEDED</strong><p><b>Requester:</b> {req.requesterName}<br/><b>Hospital:</b> {req.hospital}<br/><b>Patient:</b> {req.patientName} ({req.patientAge} yrs)<br/><b>Condition:</b> {req.condition}<br/><b>Required:</b> {req.units} unit{req.units!==1?'s':''}<br/><b>Details:</b> {req.description}<br/><b>Contact:</b> {req.phone}</p><small>Blood Bridge • Emergency alert</small></div></motion.div><div className="phone-body"><div className="phone-body-dot"/><span>Emergency alert</span><b>Tap the notification to respond</b></div><div className="phone-home"/></div>
        <div className="dispatch-copy"><div className="preview-label"><MessageCircle size={15}/> PUSH NOTIFICATION</div><h3>What the donor receives</h3><div className="message-card"><div className="message-top"><span>Blood Bridge</span><span>now</span></div><strong>🚨 {req.bloodGroup} blood needed</strong><p><b>{req.requesterName}</b> from <b>{req.hospital}</b> is requesting <b>{req.units} unit{req.units!==1?'s':''}</b> for patient <b>{req.patientName}</b>.</p><div className="message-meta"><span>Requester</span><b>{req.requesterName}</b></div><div className="message-meta"><span>Patient</span><b>{req.patientName} • {req.patientAge} years</b></div><div className="message-meta"><span>Condition</span><b>{req.condition}</b></div><div className="message-meta"><span>Contact</span><b>{req.phone}</b></div><div className="message-meta"><span>Requirement</span><b>{req.description}</b></div><button className="help-btn" onClick={onClose}><HandHeart size={16}/> I CAN HELP</button></div>
          <div className="delivery-row"><span><span className="delivery-dot"/> {matches.length} recipient{matches.length===1?'':'s'} notified</span><span>DELIVERED</span></div>
        </div>
      </div>
      <div className="recipient-list"><div className="preview-label"><Users size={14}/> RECIPIENT DELIVERY LOG</div>{matches.length===0?<p className="empty-recipient">No registered opted-in donor matched this blood group. The request is still saved and ready for an SMS provider integration.</p>:matches.map(d=><div className="recipient-row" key={d.id}><div><b>{d.name}</b><span>{d.phone} • {d.bloodGroup}</span></div><strong>DELIVERED</strong></div>)}</div>
      <div className="sms-demo"><div><span className="preview-label"><Phone size={14}/> SMS FALLBACK</span><p>{sms}</p></div><span className="sms-status">READY</span></div>
      <div className="dispatch-note"><ShieldCheck size={16}/><span>Prototype delivery is simulated in the UI. Production delivery uses Firebase Cloud Messaging for app notifications and an authorised SMS provider for phone numbers.</span></div>
      <button className="broadcast-close" onClick={onClose}>Done — request remains saved <ArrowRight size={16}/></button>
    </motion.div>
  </motion.div>
}

function AlertOverlay({req,donors,onClose}:{req:BloodRequest;donors:Donor[];onClose:()=>void}){const count=donors.filter(d=>d.bloodGroup===req.bloodGroup&&d.emergencyAlerts&&d.availability!=='Unavailable').length;return <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div className="alert-modal" initial={{scale:.92,y:18}} animate={{scale:1,y:0}}><button className="modal-close" onClick={onClose}><X/></button><div className="alert-symbol"><Bell/></div><span className="eyebrow">EMERGENCY ALERT PREVIEW</span><h2>{req.bloodGroup} blood needed</h2><p><b>{req.requesterName}</b> from {req.hospital} is requesting <b>{req.units} unit{req.units!==1?'s':''}</b>. Only opted-in donors with the same blood group receive this alert.</p><div className="alert-details"><span><Hospital/> {req.hospital}</span><span><Users/> Patient: {req.patientName} • {req.patientAge} years</span><span><CircleAlert/> Condition: {req.condition}</span><span><Phone/> {req.phone}</span><span><Users/> {count} matching opted-in donor{count===1?'':'s'}</span></div><div className="alert-actions"><button className="primary" onClick={onClose}>I can help</button><button className="secondary" onClick={onClose}>Close preview</button></div></motion.div></motion.div>}

function ThalBroadcastPreview({data,onClose}:{data:any;onClose:()=>void}){const c=data.case; return <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div className="broadcast-modal" initial={{opacity:0,scale:.94,y:18}} animate={{opacity:1,scale:1,y:0}}><button className="modal-close" onClick={onClose}><X/></button><div className="broadcast-head"><div className="broadcast-pulse"><Heart/></div><div><span className="eyebrow">THALASSEMIA ALERT SENT</span><h2>Patient requirement saved.</h2><p>The record is stored and the alert was created for available donors who opted into Thalassemia support.</p></div></div><div className="message-card"><div className="message-top"><span>Blood Bridge • Thalassemia Support</span><span>now</span></div><strong>🩸 THALASSEMIA SUPPORT REQUEST</strong><div className="message-meta"><span>Centre / Hospital</span><b>{c.centre}</b></div><div className="message-meta"><span>Patient</span><b>{c.patientName || 'Patient'} • {c.patientAge || 'Age not provided'}</b></div><div className="message-meta"><span>Patient Reference</span><b>{c.patientRef}</b></div><div className="message-meta"><span>Blood Group</span><b>{c.bloodGroup}</b></div><div className="message-meta"><span>Next Transfusion</span><b>{c.nextTransfusion}</b></div><div className="message-meta"><span>Units Required</span><b>{c.units}</b></div><div className="message-meta"><span>Contact</span><b>{c.contact || 'Not provided'}</b></div><div className="message-meta"><span>Notes</span><b>{c.notes || 'Support required'}</b></div></div><div className="recipient-list"><div className="preview-label"><Users size={14}/> DONOR DELIVERY LOG</div>{data.recipients.length?data.recipients.map((r:any)=><div className="recipient-row" key={r.user_id}><div><b>{r.name}</b><span>{r.phone} • {r.blood_group}</span></div><strong>DELIVERED</strong></div>):<p className="empty-recipient">No available opted-in donor matched this blood group. The patient record is still saved.</p>}</div><div className="sms-demo"><div><span className="preview-label"><MessageCircle size={14}/> DONOR MESSAGE</span><p>{data.message}</p></div><span className="sms-status">READY</span></div><button className="broadcast-close" onClick={onClose}>Done — patient record remains saved <ArrowRight size={16}/></button></motion.div></motion.div>}
