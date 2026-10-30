import React, { useEffect } from 'react';
import { AlertTriangle, MapPin, Building2, User, Phone, CheckCircle, X, Radio, Clock } from 'lucide-react';
import { EmergencyAlert } from '../types';
import { playEmergencyAlertSound, triggerVibration } from '../utils/sound';

interface EmergencyAlertModalProps {
  alert: EmergencyAlert | null;
  onClose: () => void;
  onRespond: (requestId: number, response: 'I_CAN_HELP' | 'DECLINED') => void;
  onViewDetails: (requestId: number) => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  alert,
  onClose,
  onRespond,
  onViewDetails,
}) => {
  useEffect(() => {
    if (alert) {
      // Trigger sound and vibration on alert pop-up
      playEmergencyAlertSound();
      triggerVibration();
    }
  }, [alert]);

  if (!alert) return null;

  const req = alert.request;

  return (
    <div
      id="emergency-alert-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div
        id="emergency-alert-card"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-red-600 bg-gradient-to-b from-slate-950 via-red-950/40 to-slate-950 p-6 shadow-2xl shadow-red-900/80 ring-4 ring-red-500/20"
      >
        {/* Urgent Glowing Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 animate-pulse" />

        {/* Close Button */}
        <button
          id="close-alert-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Dismiss Alert"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Urgent Alert Banner */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/30 text-red-500 border border-red-500/50 animate-pulse">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-xl font-extrabold uppercase tracking-wide text-red-400">
                🚨 EMERGENCY BLOOD REQUEST
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Immediate community response required within your geographical radius
            </p>
          </div>
        </div>

        {/* Highlighted Blood Group & Distance Banner */}
        <div className="grid grid-cols-2 gap-3 p-4 mb-4 rounded-xl bg-red-950/70 border border-red-800/60 shadow-inner">
          <div className="text-center border-r border-red-900/60 pr-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Blood Group Required
            </span>
            <span className="text-3xl font-black text-white drop-shadow-md">
              🩸 {req.blood_group}
            </span>
            <span className="text-[10px] text-red-300 font-medium block mt-0.5">
              {req.units_required} {req.units_required === 1 ? 'Unit' : 'Units'} needed
            </span>
          </div>

          <div className="text-center pl-2 flex flex-col justify-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Distance to You
            </span>
            <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-rose-300">
              <MapPin className="h-5 w-5 text-red-400" />
              <span>{alert.distance_km} KM</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Inside {req.radius_km} KM Broadcast Radius
            </span>
          </div>
        </div>

        {/* Emergency Case Details */}
        <div className="space-y-2.5 text-xs text-slate-300 mb-5 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-red-400" /> Hospital / Facility:
            </span>
            <span className="font-semibold text-white">{req.hospital_name}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-red-400" /> Patient Age:
            </span>
            <span className="font-medium text-slate-200">{req.patient_age} Years</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-red-400" /> Emergency Contact:
            </span>
            <span className="font-mono font-bold text-red-300">{req.phone}</span>
          </div>

          <div className="flex items-start justify-between pt-1">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
              <Clock className="h-3.5 w-3.5 text-red-400" /> Description:
            </span>
            <span className="font-normal text-slate-200 text-right pl-4 line-clamp-2">
              {req.description}
            </span>
          </div>
        </div>

        {/* Mandatory Medical Compatibility Notice */}
        <div className="p-3 mb-5 rounded-lg bg-red-950/40 border border-red-900/50 text-[11px] text-red-200/90 leading-relaxed">
          <p className="font-semibold text-red-400 mb-0.5 flex items-center gap-1">
            <Radio className="h-3.5 w-3.5" /> Please Note:
          </p>
          "Please verify your eligibility and blood-group compatibility before responding. Blood Bridge broadcasts by distance, not pre-matched blood types."
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="alert-btn-can-help"
            onClick={() => onRespond(req.id, 'I_CAN_HELP')}
            className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-900/50 hover:from-red-500 hover:to-rose-600 active:scale-95 transition-all"
          >
            <CheckCircle className="h-4 w-4" />
            I CAN HELP
          </button>

          <button
            id="alert-btn-details"
            onClick={() => {
              onViewDetails(req.id);
              onClose();
            }}
            className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            VIEW DETAILS
          </button>

          <button
            id="alert-btn-dismiss"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-transparent px-3 py-3 text-xs text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
