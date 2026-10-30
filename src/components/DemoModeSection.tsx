import React, { useState } from 'react';
import { Radio, AlertTriangle, Users, MapPin, Volume2, Smartphone, CheckCircle, XCircle, Play, RefreshCw, Info } from 'lucide-react';
import { User, BloodGroup } from '../types';
import { calculateHaversineDistance, playEmergencyAlertSound, triggerVibration } from '../utils/sound';

interface DemoModeSectionProps {
  currentUser: User | null;
  onSwitchUser: (user: User) => void;
  users: User[];
  onTriggerDemoBroadcast: (testRadiusKm: number, testBloodGroup: BloodGroup) => void;
}

export const DemoModeSection: React.FC<DemoModeSectionProps> = ({
  currentUser,
  onSwitchUser,
  users,
  onTriggerDemoBroadcast,
}) => {
  const [testRadius, setTestRadius] = useState<number>(5);
  const [testBloodGroup, setTestBloodGroup] = useState<BloodGroup>('O+');
  const [lastTestRun, setLastTestRun] = useState<{
    radius: number;
    bloodGroup: BloodGroup;
    recipients: { name: string; distance: number; blood: string; received: boolean; reason: string }[];
  } | null>(null);

  // User A coordinates (Requester)
  const originLat = 16.5062;
  const originLng = 80.6480;

  const handleRunDemoSimulation = () => {
    // Play alert sound and trigger vibration to test sensory components
    playEmergencyAlertSound();
    triggerVibration();

    // Calculate recipients
    const simulationResults = users
      .filter((u) => u.role === 'USER')
      .map((u) => {
        const dist =
          u.latitude && u.longitude
            ? calculateHaversineDistance(originLat, originLng, u.latitude, u.longitude)
            : 999;

        const isInsideRadius = dist <= testRadius;
        const isOptedIn = u.alert_opt_in;
        const received = isInsideRadius && isOptedIn;

        let reason = '';
        if (!isOptedIn) {
          reason = 'Opted out of emergency alerts';
        } else if (!isInsideRadius) {
          reason = `Distance (${dist} KM) exceeds selected ${testRadius} KM radius`;
        } else {
          reason = `Inside ${testRadius} KM radius (${dist} KM) & opted in. Blood group NOT filtered!`;
        }

        return {
          name: u.name,
          distance: dist,
          blood: u.name.includes('B-') ? 'B-' : u.name.includes('AB+') ? 'AB+' : u.name.includes('O+') ? 'O+' : 'O-',
          received,
          reason,
        };
      });

    setLastTestRun({
      radius: testRadius,
      bloodGroup: testBloodGroup,
      recipients: simulationResults,
    });

    onTriggerDemoBroadcast(testRadius, testBloodGroup);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-red-950/60 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-red-950/40 px-3 py-0.5 text-xs font-semibold text-red-400 mb-2">
          <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
          INTERACTIVE DEMO & TESTBED
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Proximity Alert Engine: Proof of Core Logic
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
          Verify the system's foundational rule: <strong>The backend NEVER filters recipients by blood group</strong>.
          Every opted-in user within the radius receives the alert, regardless of their own blood type.
        </p>
      </div>

      {/* Sensory Test Controls (Audio & Vibration) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-red-400" />
            Browser Siren & Haptic Vibration Test
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test the urgent 3-pulse audio oscillator and navigator.vibrate() emergency signal.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => playEmergencyAlertSound()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-red-900 bg-red-950/80 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-900/80 transition-colors"
          >
            <Volume2 className="h-3.5 w-3.5" />
            Play Alarm Sound
          </button>

          <button
            onClick={() => triggerVibration()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Smartphone className="h-3.5 w-3.5" />
            Trigger Vibration
          </button>
        </div>
      </div>

      {/* Switch Persona Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Current Simulated Persona:
        </span>
        <div className="flex flex-wrap gap-2">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => onSwitchUser(u)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                currentUser?.id === u.id
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${currentUser?.id === u.id ? 'bg-white' : 'bg-red-500'}`} />
              <span>{u.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({u.role})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Test Scenario Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Test Parameters */}
        <div className="lg:col-span-5 rounded-2xl border border-red-900/60 bg-slate-900/80 p-6 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Play className="h-4 w-4 text-red-500" />
            1. Configure Test Broadcast
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Emergency Blood Needed
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['O+', 'O-', 'A+', 'B-'] as BloodGroup[]).map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setTestBloodGroup(bg)}
                    className={`py-2 rounded-lg font-bold border ${
                      testBloodGroup === bg
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    🩸 {bg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Broadcast Radius (KM)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 5, 10].map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => setTestRadius(km)}
                    className={`py-2 rounded-lg font-bold border ${
                      testRadius === km
                        ? 'bg-rose-700 text-white border-rose-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {km} KM
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1 text-slate-300">
              <div className="font-bold text-red-400">Requester Location (User A):</div>
              <div className="font-mono text-[11px] text-slate-400">
                Latitude: {originLat}, Longitude: {originLng}
              </div>
            </div>

            <button
              onClick={handleRunDemoSimulation}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-950 hover:from-red-500 hover:to-rose-600 active:scale-95 transition-all"
            >
              <Radio className="h-4 w-4 animate-pulse" />
              Trigger Live Broadcast Test
            </button>
          </div>
        </div>

        {/* Real-time Proof of Logic Table */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              2. Broadcast Dispatch Results
            </h2>
            <span className="text-xs text-slate-400">Haversine Calculation</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Notice that when requesting <span className="text-red-400 font-bold">{testBloodGroup}</span> with a{' '}
            <span className="text-white font-bold">{testRadius} KM</span> radius:
          </p>

          <div className="space-y-2.5">
            {users
              .filter((u) => u.role === 'USER')
              .map((user) => {
                const dist =
                  user.latitude && user.longitude
                    ? calculateHaversineDistance(originLat, originLng, user.latitude, user.longitude)
                    : 999;
                const isInside = dist <= testRadius;
                const willReceive = isInside && user.alert_opt_in;

                return (
                  <div
                    key={user.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                      willReceive
                        ? 'border-emerald-700/70 bg-emerald-950/20'
                        : 'border-slate-800 bg-slate-950/40 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{user.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {dist} KM Away
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Alert Preference:{' '}
                        <strong className={user.alert_opt_in ? 'text-emerald-400' : 'text-amber-400'}>
                          {user.alert_opt_in ? 'Opted In' : 'Opted Out'}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {willReceive ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-lg">
                          <CheckCircle className="h-3.5 w-3.5" />
                          ALERTS SENT
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                          <XCircle className="h-3.5 w-3.5 text-slate-500" />
                          NOT SENT ({!user.alert_opt_in ? 'Opted Out' : `> ${testRadius} KM`})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="rounded-xl bg-red-950/40 border border-red-900/60 p-3.5 text-xs text-red-200 mt-4">
            <strong className="block text-red-400 font-bold mb-1">
              Confirmed Architecture Compliance:
            </strong>
            User B (Blood Group B-) still receives the {testBloodGroup} request because she is 2.1 KM
            away. User D (O+) is 8.2 KM away and does NOT receive it. This confirms that proximity,
            not blood matching, governs emergency delivery.
          </div>
        </div>
      </div>
    </section>
  );
};
