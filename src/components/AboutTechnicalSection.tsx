import React from 'react';
import { ShieldCheck, Smartphone, Radio, Code2, AlertTriangle, Cpu, Globe, Server, FileText } from 'lucide-react';

interface AboutTechnicalSectionProps {
  onViewSourceCode: () => void;
}

export const AboutTechnicalSection: React.FC<AboutTechnicalSectionProps> = ({ onViewSourceCode }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-0.5 text-xs font-semibold text-red-400">
          SYSTEM SPECIFICATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          About Blood Bridge & Technical Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          An emergency coordination platform built on transparent location broadcasting, zero
          algorithmic gatekeeping, and respectful privacy-first design.
        </p>
      </div>

      {/* Production FCM Notice (Section 10 Requirement) */}
      <div className="rounded-2xl border-2 border-red-700/80 bg-red-950/40 p-6 sm:p-8 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/30 text-red-400 border border-red-500/40">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Production Mobile Push Notification Note</h2>
            <span className="text-xs text-red-300 font-mono">CRITICAL ARCHITECTURAL REALITY</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 bg-slate-950/60 p-4 rounded-xl border border-red-900/50">
          <p className="font-semibold text-red-300">
            "For a production mobile application, Firebase Cloud Messaging (FCM) should be integrated
            so alerts can be delivered as push notifications even when the app is not actively open."
          </p>
          <p className="text-slate-300 text-xs">
            Notice: Web browsers running inside sandboxes cannot autonomously wake up un-navigated
            smartphones without push services. In Blood Bridge:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            <li>We do NOT falsely claim that the browser can send alerts to every nearby mobile phone in the city.</li>
            <li>
              Only registered Blood Bridge users who have <strong>(1) logged in</strong>,{' '}
              <strong>(2) enabled location</strong>, and <strong>(3) opted in for emergency alerts</strong>{' '}
              receive alerts via real-time WebSocket rooms (and native push tokens in full mobile builds).
            </li>
          </ul>
        </div>
      </div>

      {/* Haversine Formula & Broadcast Math */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-rose-400 border border-slate-700">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Haversine Distance Broadcast Engine</h2>
            <span className="text-xs text-slate-400">Spherical Trigonometry Calculation</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          When an emergency request is generated at coordinate <span className="font-mono text-red-400">(lat₁, lon₁)</span> with radius <span className="font-mono text-white">R_req</span>, the distance to each candidate user <span className="font-mono text-rose-300">(lat₂, lon₂)</span> is computed using the spherical earth formula:
        </p>

        <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto space-y-1">
          <div>a = sin²(Δlat/2) + cos(lat₁) · cos(lat₂) · sin²(Δlon/2)</div>
          <div>c = 2 · atan2( √a, √(1−a) )</div>
          <div className="text-red-400 font-bold">d = R_earth · c (where R_earth = 6,371 KM)</div>
          <div className="pt-2 text-emerald-400">
            if d ≤ R_req: broadcast_to_user(user_id)  // BLOOD GROUP IS NOT FILTERED!
          </div>
        </div>

        <p className="text-xs text-slate-400">
          The blood group is transmitted inside the notification payload, giving the recipient the
          agency and awareness to either donate directly or rally their immediate circle.
        </p>
      </div>

      {/* Backend & Single-File app.py Information */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Python Flask & Flask-SocketIO Backend</h2>
              <span className="text-xs text-slate-400">app.py Single-File Standalone Architecture</span>
            </div>
          </div>

          <button
            onClick={onViewSourceCode}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            <Code2 className="h-4 w-4 text-red-400" />
            View Complete app.py Code
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The entire backend and standalone bundle is authored in <span className="font-mono text-red-400">app.py</span>.
          It implements:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <strong className="text-white block mb-1">SQLite & SQLAlchemy Models</strong>
            <span className="text-slate-400">
              Automatic <code className="text-red-400">db.create_all()</code> initializing User,
              DonorProfile, BloodRequest, Alert, and Response tables in <code className="text-slate-300">blood_bridge.db</code>.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <strong className="text-white block mb-1">Flask-SocketIO Rooms</strong>
            <span className="text-slate-400">
              Individual private rooms <code className="text-red-400">user_&lt;user_id&gt;</code> for targeted
              proximity push emissions on <code className="text-slate-300">blood_alert</code>.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <strong className="text-white block mb-1">Security & Session Auth</strong>
            <span className="text-slate-400">
              Passlib / Werkzeug SHA256 password hashing, session tokens, and input validation without
              leaking private GPS or medical history.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <strong className="text-white block mb-1">REST API Endpoints</strong>
            <span className="text-slate-400">
              Full suite: <code className="text-slate-300">/api/register</code>, <code className="text-slate-300">/api/login</code>, <code className="text-slate-300">/api/blood-request</code>, <code className="text-slate-300">/api/donors</code>, <code className="text-slate-300">/api/request/&lt;id&gt;/respond</code>.
            </span>
          </div>
        </div>
      </div>

      {/* Medical Disclaimers (Section 29) */}
      <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6 space-y-3 text-xs text-amber-200">
        <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
          <AlertTriangle className="h-4 w-4" />
          Mandatory Medical & Emergency Disclaimers
        </div>
        <p className="leading-relaxed">
          "Blood Bridge is an emergency coordination prototype. It does not replace hospitals, blood
          banks, ambulance services, or medical professionals."
        </p>
        <p className="leading-relaxed">
          "Blood group compatibility and donor eligibility must be confirmed through authorized
          medical professionals/blood banks."
        </p>
      </div>
    </div>
  );
};
