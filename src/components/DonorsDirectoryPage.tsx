import React, { useState } from 'react';
import { Heart, Search, Filter, ShieldCheck, MapPin, Phone, User, Radio, Eye, CheckCircle2 } from 'lucide-react';
import { BloodGroup, DonorProfile, User as UserType } from '../types';
import { calculateHaversineDistance } from '../utils/sound';

interface DonorsDirectoryPageProps {
  donors: DonorProfile[];
  currentUser: UserType | null;
  onContactDonor: (donor: DonorProfile) => void;
  onRegisterDonorNav: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DonorsDirectoryPage: React.FC<DonorsDirectoryPageProps> = ({
  donors,
  currentUser,
  onContactDonor,
  onRegisterDonorNav,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedDonorForModal, setSelectedDonorForModal] = useState<DonorProfile | null>(null);
  const [contactedDonorId, setContactedDonorId] = useState<number | null>(null);

  // Reference coordinates for distance calculation (defaults to City Center if user has no coords)
  const refLat = currentUser?.latitude || 16.5062;
  const refLng = currentUser?.longitude || 80.6480;

  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      d.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.blood_group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'ALL' || d.blood_group === selectedGroup;
    const matchesAvail = !onlyAvailable || d.availability === 'Available';
    return matchesSearch && matchesGroup && matchesAvail;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-0.5 text-xs font-semibold text-red-400 mb-2">
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            VERIFIED VOLUNTEER NETWORK
          </div>
          <h1 className="text-3xl font-extrabold text-white">Active Blood Donors</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Connect with registered community donors standing by for emergency blood appeals.
          </p>
        </div>

        <button
          id="btn-nav-become-donor-secondary"
          onClick={onRegisterDonorNav}
          className="self-start md:self-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950 hover:from-red-500 hover:to-rose-600 transition-all"
        >
          <Heart className="h-3.5 w-3.5" />
          Join as a Donor
        </button>
      </div>

      {/* Privacy Notice Card */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300 font-semibold">Privacy Protected:</strong> Exact GPS
          coordinates and sensitive health records are strictly confidential. Distances displayed are
          approximate. Direct phone contact is made available in coordination with emergency
          response workflows.
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              id="donors-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search donor name or blood type..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              id="avail-toggle"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <label htmlFor="avail-toggle" className="cursor-pointer">
              Only Available Donors
            </label>
          </div>
        </div>

        {/* Blood Group Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase mr-1">Filter:</span>
          <button
            onClick={() => setSelectedGroup('ALL')}
            className={`px-3 py-1 rounded-lg border font-semibold whitespace-nowrap transition-all ${
              selectedGroup === 'ALL'
                ? 'bg-red-950 text-red-300 border-red-800'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Types
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-2.5 py-1 rounded-lg border font-bold whitespace-nowrap transition-all ${
                selectedGroup === bg
                  ? 'bg-red-600 text-white border-red-500 shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🩸 {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No registered donors available yet.</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or register as the first community donor in your area!
          </p>
          <button
            onClick={onRegisterDonorNav}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
          >
            Register as Donor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map((donor) => {
            const distance =
              donor.latitude && donor.longitude
                ? calculateHaversineDistance(refLat, refLng, donor.latitude, donor.longitude)
                : null;

            return (
              <div
                key={donor.id}
                id={`donor-card-${donor.id}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-red-800/70 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Row: Name & Blood Group Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                        <User className="h-4 w-4 text-slate-400" />
                        {donor.donor_name}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {donor.age ? `${donor.age} yrs` : 'Adult'} • Volunteer
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="rounded-xl border border-red-800/60 bg-red-950/80 px-3 py-1 text-sm font-black text-white shadow-inner">
                        🩸 {donor.blood_group}
                      </span>
                    </div>
                  </div>

                  {/* Status & Distance Chips */}
                  <div className="flex flex-wrap gap-2 my-3 text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium ${
                        donor.availability === 'Available'
                          ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          donor.availability === 'Available' ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}
                      />
                      {donor.availability}
                    </span>

                    {distance !== null ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/80 px-2 py-0.5 text-slate-300 border border-slate-700/60">
                        <MapPin className="h-3 w-3 text-red-400" />
                        ~{distance} KM away
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Location unlisted</span>
                    )}

                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/60 px-2 py-0.5 text-slate-400">
                      <Radio className="h-3 w-3 text-red-400" />
                      {donor.alert_opt_in ? 'Alerts ON' : 'Alerts OFF'}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => setSelectedDonorForModal(donor)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white py-1.5 px-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    VIEW PROFILE
                  </button>

                  <button
                    id={`btn-contact-donor-${donor.id}`}
                    onClick={() => {
                      onContactDonor(donor);
                      setContactedDonorId(donor.id);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-950 border border-red-800/70 hover:bg-red-900/80 py-1.5 px-3 rounded-lg transition-all"
                  >
                    <Phone className="h-3.5 w-3.5 text-red-400" />
                    {contactedDonorId === donor.id ? 'CONTACTED ✓' : 'CONTACT / I CAN HELP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Donor Profile Modal */}
      {selectedDonorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-red-400" />
                Donor Profile Overview
              </h3>
              <button
                onClick={() => setSelectedDonorForModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Name:</span>
                <span className="font-bold text-white">{selectedDonorForModal.donor_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-black text-red-400">🩸 {selectedDonorForModal.blood_group}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Age:</span>
                <span>{selectedDonorForModal.age || 'Not specified'} years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-400">
                  {selectedDonorForModal.availability}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Emergency Alerts:</span>
                <span>
                  {selectedDonorForModal.alert_opt_in
                    ? 'Opted In for Proximity Alerts'
                    : 'Not Opted In'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Approximate Distance:</span>
                <span>
                  {selectedDonorForModal.latitude && selectedDonorForModal.longitude
                    ? `~${calculateHaversineDistance(
                        refLat,
                        refLng,
                        selectedDonorForModal.latitude,
                        selectedDonorForModal.longitude
                      )} KM from current location`
                    : 'Location undisclosed'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Phone (Authorized Access):</span>
                <span className="font-mono text-slate-200">{selectedDonorForModal.phone}</span>
              </div>
            </div>

            <div className="rounded-lg bg-amber-950/30 border border-amber-900/40 p-3 text-[11px] text-amber-200">
              "Donor registration does not confirm medical eligibility. Final eligibility must be
              determined by an authorized blood bank or medical professional."
            </div>

            <button
              onClick={() => setSelectedDonorForModal(null)}
              className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
