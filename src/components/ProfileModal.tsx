import React, { useState } from 'react';
import { X, User, MapPin, Radio, Shield, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  currentUser: UserType | null;
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserType>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdateProfile,
}) => {
  if (!isOpen || !currentUser) return null;

  const [alertOptIn, setAlertOptIn] = useState<boolean>(currentUser.alert_opt_in);
  const [lat, setLat] = useState<number>(currentUser.latitude || 16.5062);
  const [lng, setLng] = useState<number>(currentUser.longitude || 80.6480);
  const [locMsg, setLocMsg] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setLocMsg('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetecting(true);
    setLocMsg('Detecting current GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(4)));
        setLng(Number(pos.coords.longitude.toFixed(4)));
        setIsDetecting(false);
        setLocMsg(`Updated from GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        setIsDetecting(false);
        setLocMsg(`Could not read GPS (${err.message}). Coordinates remain preserved.`);
      }
    );
  };

  const handleSave = () => {
    onUpdateProfile({
      alert_opt_in: alertOptIn,
      latitude: lat,
      longitude: lng,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-950 text-red-400 border border-red-800/60 font-bold text-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <p className="text-xs text-slate-400 font-mono">
              Role: <span className="text-red-400 uppercase">{currentUser.role}</span> • {currentUser.email}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Profile & Location updated successfully!</span>
          </div>
        )}

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Phone:</span>
            <span className="font-mono">{currentUser.phone}</span>
          </div>
          {currentUser.age && (
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Age:</span>
              <span>{currentUser.age} years</span>
            </div>
          )}
          {currentUser.hospital_name && (
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Hospital Facility:</span>
              <span className="font-bold text-white">{currentUser.hospital_name}</span>
            </div>
          )}
        </div>

        {/* Emergency Alert Preference Toggle */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-white">Emergency Alert Preference</label>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">
                Receive Radius Emergency Alerts
              </span>
              <span className="text-[11px] text-slate-400">
                {alertOptIn ? 'Active: Will trigger alarm on proximity requests' : 'Disabled'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setAlertOptIn(!alertOptIn)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                alertOptIn ? 'bg-red-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  alertOptIn ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Location Update */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-red-400" />
              Registered Proximity Coordinates
            </label>
            <button
              type="button"
              onClick={handleDetectGps}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              {isDetecting ? 'Detecting...' : 'Detect via GPS'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Latitude</span>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Longitude</span>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          {locMsg && <p className="text-[11px] text-red-300 italic">{locMsg}</p>}

          {/* Mandatory Privacy Explanation (Section 5) */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <Shield className="h-3.5 w-3.5 text-red-400 inline mr-1" />
            "Your location is used only to determine whether emergency alerts fall within the
            requested radius."
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 py-2.5 text-xs font-bold uppercase text-white shadow hover:from-red-500 hover:to-rose-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
