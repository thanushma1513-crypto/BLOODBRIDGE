import React from 'react';
import { Clock, Building2, MapPin, CheckCircle, XCircle, AlertCircle, Radio, Users } from 'lucide-react';
import { BloodRequest, RequestStatus } from '../types';

interface MyRequestsPageProps {
  requests: BloodRequest[];
  onUpdateStatus: (id: number, status: RequestStatus) => void;
  onNewRequestNav: () => void;
}

export const MyRequestsPage: React.FC<MyRequestsPageProps> = ({
  requests,
  onUpdateStatus,
  onNewRequestNav,
}) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-0.5 text-xs font-semibold text-red-400 mb-2">
            <Clock className="h-3.5 w-3.5" />
            INCIDENT ARCHIVE
          </div>
          <h1 className="text-3xl font-extrabold text-white">Emergency Blood Requests</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time track record of all localized emergency broadcasts and dispatch histories.
          </p>
        </div>

        <button
          onClick={onNewRequestNav}
          className="self-start sm:self-auto rounded-xl bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950 hover:from-red-500 hover:to-rose-600 transition-all"
        >
          Create New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No active blood requests.</h3>
          <p className="text-xs text-slate-400 mb-4">
            Currently there are no registered emergency blood requests in the system.
          </p>
          <button
            onClick={onNewRequestNav}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
          >
            Create First Emergency Alert
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const formattedDate = new Date(req.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={req.id}
                id={`request-row-${req.id}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-3">
                  {/* Top Line: Request ID, Blood Group, Status Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-red-400 bg-red-950/80 border border-red-900 px-2.5 py-0.5 rounded-lg">
                      REQ-#{req.id}
                    </span>

                    <span className="text-sm font-black text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      🩸 {req.blood_group} ({req.units_required} {req.units_required === 1 ? 'Unit' : 'Units'})
                    </span>

                    <span
                      className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        req.status === 'ACTIVE'
                          ? 'bg-red-950/80 text-red-400 border-red-700 animate-pulse'
                          : req.status === 'FULFILLED'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                          : req.status === 'EXPIRED'
                          ? 'bg-amber-950/80 text-amber-400 border-amber-700'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      ● {req.status}
                    </span>

                    <span className="text-xs text-slate-400">{formattedDate}</span>
                  </div>

                  {/* Hospital & Requester Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      <span className="font-semibold text-white truncate">{req.hospital_name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      <span>
                        Radius: <strong className="text-white">{req.radius_km} KM</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Broadcasts: <strong className="text-emerald-400">{req.alerts_count} Sent</strong>
                      </span>
                    </div>
                  </div>

                  {/* Description text */}
                  <p className="text-xs text-slate-400 italic max-w-3xl line-clamp-2">
                    "{req.description}"
                  </p>
                </div>

                {/* Status Update / Fulfillment Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {req.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => onUpdateStatus(req.id, 'FULFILLED')}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 hover:bg-emerald-900/60 px-3 py-2 rounded-xl transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark Fulfilled
                      </button>

                      <button
                        onClick={() => onUpdateStatus(req.id, 'CANCELLED')}
                        className="flex items-center gap-1 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </>
                  )}

                  {req.status !== 'ACTIVE' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'ACTIVE')}
                      className="text-xs font-semibold text-slate-400 hover:text-white border border-slate-800 px-3 py-2 rounded-xl"
                    >
                      Reopen Alert
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
