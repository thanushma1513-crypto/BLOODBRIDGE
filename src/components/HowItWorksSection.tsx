import React from 'react';
import { UserPlus, Navigation, Send, Radio, AlertOctagon, CheckCircle2, ShieldCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 border-b border-red-950/40 bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-0.5 text-xs font-semibold text-red-400">
            RAPID RESPONSE ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How Blood Bridge Works
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            A 4-step emergency broadcast protocol built to reduce critical response time during
            urgent blood crises.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-red-700/60 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-950/80 border border-red-800/50 text-red-400 font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-red-400" />
                Register
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create your verified Blood Bridge account as an individual Citizen Donor or an authorized Hospital/Trauma Care Facility.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Instant sign-up • Secure hashing
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-red-700/60 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-950/80 border border-red-800/50 text-red-400 font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Navigation className="h-4 w-4 text-red-400" />
                Enable Location
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Grant GPS access so emergency alerts within your designated proximity (1-50 KM) can reach you in real-time.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Strict privacy: exact coordinates never published
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-red-700/60 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-950/80 border border-red-800/50 text-red-400 font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="h-4 w-4 text-red-400" />
                Request Blood
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter hospital details, blood group, patient age, units required, and select the emergency broadcast radius.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Configurable 1, 2, 5, 10, 20, 50 KM radius
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative rounded-2xl border border-red-800/60 bg-gradient-to-b from-red-950/40 to-slate-900/80 p-6 backdrop-blur-sm shadow-lg shadow-red-950/40 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/30 border border-red-500/50 text-red-400 font-black text-lg">
                4
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Radio className="h-4 w-4 text-red-400 animate-pulse" />
                Alert Nearby Users
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Every opted-in user within the selected radius receives the instant alert. Recipients verify their personal compatibility and tap "I CAN HELP".
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-red-900/60 text-[11px] font-semibold text-red-300">
              Haversine geo-broadcast
            </div>
          </div>
        </div>

        {/* Vital Architectural Principle: Location Broadcast vs Rigid Blood Matching */}
        <div className="mt-12 rounded-2xl border-2 border-red-600/60 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                <AlertOctagon className="h-4 w-4" />
                Why We Do NOT Pre-Filter By Blood Group in the Backend
              </div>
              <h3 className="text-xl font-black text-white">
                Location-Based Broadcast vs. Blood-Group Matching
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If a patient needs <strong>O+ blood</strong> and we only alert O+ users, we lose the surrounding network of family, friends, co-workers, and community members who can either step in, connect to alternate compatible donors, or notify their household. In an emergency, proximity is king.
              </p>
            </div>

            {/* Visual Logic Comparison Diagram */}
            <div className="w-full lg:w-auto shrink-0 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-mono text-red-400 font-bold">1. Requester GPS</span>
                <span>➔</span>
                <span className="font-mono text-white font-bold">Radius: 5 KM</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Haversine distance ≤ 5 KM? Broadcast alert!</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <span>Blood group displayed inside the notification for self-review.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
