import React from 'react';
import { User, Bell, Heart, Clock, MapPin, Radio, AlertTriangle, Shield, CheckCircle, ChevronRight, Phone } from 'lucide-react';
import { BloodRequest, EmergencyAlert, DonorProfile, User as UserType } from '../types';
import { calculateHaversineDistance } from '../utils/sound';

interface UserDashboardProps {
  currentUser: UserType;
  myDonorProfile?: DonorProfile;
  alerts: EmergencyAlert[];
  allActiveRequests: BloodRequest[];
  onOpenAlertModal: (alert: EmergencyAlert) => void;
  onRespondToRequest: (requestId: number, resp: 'I_CAN_HELP') => void;
  onToggleAlertOptIn: () => void;
  onUpdateLocation: () => void;
  onNavigate: (tab: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  myDonorProfile,
  alerts,
  allActiveRequests,
  onOpenAlertModal,
  onRespondToRequest,
  onToggleAlertOptIn,
  onUpdateLocation,
  onNavigate,
}) => {
  const userLat = currentUser.latitude || 16.5062;
  const userLng = currentUser.longitude || 80.6480;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-0.5 text-xs font-semibold text-red-400 mb-2">
            <User className="h-3.5 w-3.5" />
            CITIZEN RESPONDER DASHBOARD
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {currentUser.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Emergency alert dispatch status: {currentUser.alert_opt_in ? (
              <span className="text-emerald-400 font-bold">Active & Listening within radius</span>
            ) : (
              <span className="text-amber-400 font-bold">Alerts Paused</span>
            )}
          </p>
        </div>

        {/* Quick Location & Alert Settings */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onToggleAlertOptIn}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
              currentUser.alert_opt_in
                ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            {currentUser.alert_opt_in ? 'Emergency Alerts: ON' : 'Emergency Alerts: OFF'}
          </button>

          <button
            onClick={onUpdateLocation}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 text-red-400" />
            Update GPS Location
          </button>
        </div>
      </div>

      {/* Emergency Alerts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white animate-pulse">
              <Bell className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-black text-white">
              🚨 {alerts.length} Emergency {alerts.length === 1 ? 'Alert' : 'Alerts'} Within Proximity
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Location: {userLat.toFixed(4)}, {userLng.toFixed(4)}
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
            No emergency alerts currently in your zone. When someone creates a request within your
            radius, it will immediately sound an alarm and appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((al) => {
              const req = al.request;
              return (
                <div
                  key={al.id}
                  id={`alert-card-${al.id}`}
                  className="relative overflow-hidden rounded-2xl border-2 border-red-600/80 bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-950 p-5 shadow-lg shadow-red-950/60 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-2xl font-black text-white">
                          🩸 {req.blood_group} Blood Required
                        </span>
                        <div className="flex items-center gap-2 text-xs text-red-300 font-bold mt-1">
                          <MapPin className="h-3.5 w-3.5 text-red-400" />
                          <span>{al.distance_km} KM Away (Inside {req.radius_km} KM Radius)</span>
                        </div>
                      </div>
                      <span className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black text-white uppercase animate-pulse">
                        URGENT
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 bg-slate-950/70 p-3 rounded-xl border border-red-900/40">
                      <div>
                        <strong className="text-slate-400">Facility:</strong> {req.hospital_name}
                      </div>
                      <div>
                        <strong className="text-slate-400">Units:</strong> {req.units_required} Units • Patient Age: {req.patient_age} yrs
                      </div>
                      <div>
                        <strong className="text-slate-400">Contact:</strong> {req.phone}
                      </div>
                      <p className="text-slate-400 italic pt-1 line-clamp-2">
                        "{req.description}"
                      </p>
                    </div>

                    <p className="text-[11px] text-red-300/90 font-medium">
                      "Please verify your eligibility and blood-group compatibility before responding."
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-red-900/50">
                    <button
                      onClick={() => onRespondToRequest(req.id, 'I_CAN_HELP')}
                      className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 py-2.5 text-xs font-black uppercase text-white shadow hover:from-red-500 hover:to-rose-600"
                    >
                      I CAN HELP
                    </button>
                    <button
                      onClick={() => onOpenAlertModal(al)}
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Columns: My Donor Profile & Nearby Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Donor Profile Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              My Donor Profile
            </h3>
            <button
              onClick={() => onNavigate('become-donor')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              {myDonorProfile ? 'Edit Profile' : 'Complete Registration'}
            </button>
          </div>

          {myDonorProfile ? (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Registered Name:</span>
                <span className="font-bold text-white">{myDonorProfile.donor_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-black text-red-400 text-sm">🩸 {myDonorProfile.blood_group}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-400">{myDonorProfile.availability}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Health Self-Report:</span>
                <span>{myDonorProfile.health_issues ? 'Noted for doctor review' : 'No health issues reported'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Proximity Alerts:</span>
                <span className="text-emerald-400 font-semibold">Enabled</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-950 p-5 text-center space-y-3">
              <p className="text-xs text-slate-400">
                You haven't completed your donor profile yet. Register to appear in the volunteer
                roster and save lives in emergency situations.
              </p>
              <button
                onClick={() => onNavigate('become-donor')}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
              >
                Become a Donor Now
              </button>
            </div>
          )}
        </div>

        {/* Nearby Active Incidents Summary */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="h-5 w-5 text-rose-400" />
              All Nearby Incidents
            </h3>
            <button
              onClick={() => onNavigate('my-requests')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {allActiveRequests.slice(0, 3).map((req) => {
              const dist = calculateHaversineDistance(userLat, userLng, req.latitude, req.longitude);
              return (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">🩸 {req.blood_group}</span>
                      <span className="text-[11px] text-slate-400">{req.hospital_name}</span>
                    </div>
                    <span className="text-[10px] text-red-400 font-mono">
                      ~{dist} KM away • Radius: {req.radius_km} KM
                    </span>
                  </div>

                  <button
                    onClick={() => onRespondToRequest(req.id, 'I_CAN_HELP')}
                    className="text-xs font-bold text-white bg-red-950 border border-red-800 hover:bg-red-900 px-3 py-1.5 rounded-lg"
                  >
                    Respond
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
