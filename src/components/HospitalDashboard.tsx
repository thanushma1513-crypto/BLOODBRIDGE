import React from 'react';
import { Building2, PlusCircle, Radio, CheckCircle, Clock, AlertTriangle, Phone, Users, ShieldAlert } from 'lucide-react';
import { BloodRequest, AlertResponse, User as UserType, RequestStatus } from '../types';

interface HospitalDashboardProps {
  currentUser: UserType;
  requests: BloodRequest[];
  responses: AlertResponse[];
  onCreateRequestNav: () => void;
  onUpdateStatus: (id: number, status: RequestStatus) => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  currentUser,
  requests,
  responses,
  onCreateRequestNav,
  onUpdateStatus,
}) => {
  const activeRequests = requests.filter((r) => r.status === 'ACTIVE');
  const totalAlertsSent = requests.reduce((acc, r) => acc + r.alerts_count, 0);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Hospital Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-0.5 text-xs font-semibold text-red-400 mb-2">
            <Building2 className="h-3.5 w-3.5" />
            HOSPITAL CONTROL CONSOLE
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            {currentUser.hospital_name || currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Facility ID: <span className="font-mono text-red-400">{currentUser.hospital_id || 'HOSP-VERIFIED'}</span> • Authorized Blood Dispatch Unit
          </p>
        </div>

        <button
          onClick={onCreateRequestNav}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-950 hover:from-red-500 hover:to-rose-600 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Create Blood Request
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active Requests</span>
          <p className="mt-2 text-3xl font-black text-red-400">{activeRequests.length}</p>
          <span className="text-[11px] text-red-300">Urgent broadcast active</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase">Requests Created</span>
          <p className="mt-2 text-3xl font-black text-white">{requests.length}</p>
          <span className="text-[11px] text-slate-400">Total lifetime appeals</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase">Alerts Sent</span>
          <p className="mt-2 text-3xl font-black text-emerald-400">{totalAlertsSent}</p>
          <span className="text-[11px] text-slate-400">Device transmissions</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase">Responses Received</span>
          <p className="mt-2 text-3xl font-black text-rose-400">{responses.length}</p>
          <span className="text-[11px] text-slate-400">"I CAN HELP" pledges</span>
        </div>
      </div>

      {/* Main Grid: Active Requests & Community Responses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Hospital Emergency Requests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Active Emergency Requests ({activeRequests.length})
            </h2>
            <button
              onClick={onCreateRequestNav}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              + New Alert
            </button>
          </div>

          {activeRequests.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
              No emergency requests currently active.
            </div>
          ) : (
            <div className="space-y-3">
              {activeRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-red-900/50 bg-slate-900/80 p-4 backdrop-blur-md space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">🩸 {req.blood_group}</span>
                        <span className="text-xs text-slate-400 font-mono">REQ-#{req.id}</span>
                        <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-bold border border-red-800">
                          {req.units_required} Units
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Patient: {req.patient_age} yrs • Radius: {req.radius_km} KM • Broadcasts: {req.alerts_count} sent
                      </p>
                    </div>

                    <button
                      onClick={() => onUpdateStatus(req.id, 'FULFILLED')}
                      className="text-xs font-bold text-emerald-300 bg-emerald-950 border border-emerald-700/60 hover:bg-emerald-900 px-3 py-1.5 rounded-lg"
                    >
                      Close / Fulfilled
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    "{req.description}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Responses Received from Donors */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-rose-400" />
            Live Donor Responses ({responses.length})
          </h2>

          {responses.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
              No donor responses recorded yet. When users tap "I CAN HELP", their contact info and
              messages appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {responses.map((resp) => (
                <div
                  key={resp.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{resp.responder_name}</span>
                    <span className="text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                      I CAN HELP
                    </span>
                  </div>

                  {resp.blood_group && (
                    <div className="text-xs text-red-400 font-semibold">
                      Self-reported Blood Group: 🩸 {resp.blood_group}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Phone className="h-3.5 w-3.5 text-red-400" />
                    <span>{resp.responder_phone}</span>
                  </div>

                  {resp.message && (
                    <p className="text-xs text-slate-300 italic bg-slate-950 p-2 rounded">
                      "{resp.message}"
                    </p>
                  )}

                  <span className="text-[10px] text-slate-500 block">
                    {new Date(resp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
