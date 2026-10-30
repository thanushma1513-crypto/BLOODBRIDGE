import React, { useEffect } from 'react';
import { AlertTriangle, X, Radio, MapPin, Building2, User, Phone, Clock, CheckCircle, Users } from 'lucide-react';
import { playEmergencyAlertSound, triggerVibration } from '../utils/sound';

interface BroadcastPreviewProps {
  data: {
    request: any;
    alerts_sent: number;
    broadcast_message: { title: string; body: string; data: Record<string, any> };
    recipient_preview: Array<{ user_id: number; name: string; phone: string; distance_km: number }>;
  } | null;
  onClose: () => void;
}

export const BroadcastSentModal: React.FC<BroadcastPreviewProps> = ({ data, onClose }) => {
  useEffect(() => {
    if (data) {
      playEmergencyAlertSound();
      triggerVibration();
    }
  }, [data]);

  if (!data) return null;
  const req = data.request;
  const payload = data.broadcast_message.data;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-red-500 bg-slate-950 shadow-2xl shadow-red-900/70">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-red-900/60 bg-red-950/95 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 animate-pulse">🚨</div>
            <div>
              <h2 className="text-lg font-black text-white">BROADCAST ALERT SENT</h2>
              <p className="text-xs text-red-200">Request saved • recipient phone alert preview</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-300 hover:bg-slate-800"><X /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/30 p-4">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm"><CheckCircle className="h-4 w-4" /> Emergency request saved successfully</div>
            <p className="mt-1 text-xs text-slate-300">REQ-#{req.id} • {data.alerts_sent} nearby opted-in user(s) received the broadcast.</p>
          </div>

          <div className="rounded-2xl border-2 border-red-600 bg-gradient-to-b from-red-950/70 to-slate-950 p-5 shadow-lg shadow-red-950/50">
            <div className="flex items-center gap-2 text-red-400 text-xs font-black uppercase tracking-wider"><Radio className="h-4 w-4 animate-pulse" /> This is what appears on the recipient phone</div>
            <h3 className="mt-3 text-xl font-black text-white">{data.broadcast_message.title}</h3>
            <p className="mt-1 text-sm font-semibold text-red-200">{data.broadcast_message.body}</p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-slate-900 p-3"><span className="text-slate-500">Hospital</span><div className="font-bold text-white">{req.hospital_name}</div></div>
              <div className="rounded-xl bg-slate-900 p-3"><span className="text-slate-500">Blood Group</span><div className="font-bold text-white">🩸 {req.blood_group}</div></div>
              <div className="rounded-xl bg-slate-900 p-3"><span className="text-slate-500">Units</span><div className="font-bold text-white">{req.units_required}</div></div>
              <div className="rounded-xl bg-slate-900 p-3"><span className="text-slate-500">Patient Age</span><div className="font-bold text-white">{req.patient_age} years</div></div>
              <div className="rounded-xl bg-slate-900 p-3"><span className="text-slate-500">Emergency Contact</span><div className="font-bold text-white">{req.phone}</div></div>
              <div className="rounded-xl bg-slate-900 p-3"><span className="text-slate-500">Radius</span><div className="font-bold text-white">{req.radius_km} KM</div></div>
              <div className="rounded-xl bg-slate-900 p-3 col-span-2"><span className="text-slate-500">Requester</span><div className="font-bold text-white">{req.requester_name}</div></div>
              <div className="rounded-xl bg-slate-900 p-3 col-span-2"><span className="text-slate-500">Emergency Description</span><div className="font-medium text-slate-200">{req.description}</div></div>
              <div className="rounded-xl bg-slate-900 p-3 col-span-2"><span className="text-slate-500">GPS Broadcast Location</span><div className="font-mono font-bold text-white">{req.latitude}, {req.longitude}</div></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white mb-3"><Users className="h-4 w-4 text-emerald-400" /> Recipients inside radius</div>
            {data.recipient_preview.length === 0 ? <p className="text-xs text-slate-400">No opted-in users with location were inside the selected radius.</p> : (
              <div className="space-y-2">{data.recipient_preview.map(r => <div key={r.user_id} className="flex justify-between rounded-xl bg-slate-950 px-3 py-2 text-xs"><span className="font-semibold text-white">{r.name}</span><span className="text-emerald-300">{r.distance_km} KM away</span></div>)}</div>
            )}
          </div>

          <div className="rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4 text-xs text-amber-100">
            <div className="font-bold mb-1">📳 Vibration / sound demo</div>
            <p>The popup triggers the browser vibration API and emergency sound to demonstrate how the recipient alert behaves. On a real phone app, Firebase Cloud Messaging (FCM) would deliver the push notification even when the app is not open.</p>
          </div>

          <details className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <summary className="cursor-pointer text-xs font-bold text-slate-200">View exact notification data payload</summary>
            <pre className="mt-3 overflow-auto rounded-xl bg-black p-3 text-[10px] leading-relaxed text-emerald-300">{JSON.stringify(payload, null, 2)}</pre>
          </details>

          <button onClick={onClose} className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-500">OK — VIEW SAVED REQUEST</button>
        </div>
      </div>
    </div>
  );
};
