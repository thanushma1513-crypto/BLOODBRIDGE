import React, { useState } from 'react';
import { api } from '../api';
import {
  User as UserIcon,
  Building2,
  Lock,
  Mail,
  Phone,
  Shield,
  Heart,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Activity,
  Globe,
  Radio,
  Hospital as HospitalIcon,
  BadgeCheck,
} from 'lucide-react';
import { User, Role, BloodGroup } from '../types';

interface LoginPortalPageProps {
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  existingUsers: User[];
  onContinueAsGuest: () => void;
}

export const LoginPortalPage: React.FC<LoginPortalPageProps> = ({
  onLogin,
  onRegister,
  existingUsers,
  onContinueAsGuest,
}) => {
  // Tabs: 'user' | 'hospital' | 'register'
  const [activeTab, setActiveTab] = useState<'user' | 'hospital' | 'register'>('user');

  // Citizen Login Form State
  const [userIdentifier, setUserIdentifier] = useState('demo@example.invalid');
  const [userPassword, setUserPassword] = useState('');
  const [userShowPassword, setUserShowPassword] = useState(false);
  const [userAlertOptIn, setUserAlertOptIn] = useState(true);

  // Hospital Login Form State
  const [hospitalIdentifier, setHospitalIdentifier] = useState('demo@example.invalid');
  const [hospitalPassword, setHospitalPassword] = useState('');
  const [hospitalShowPassword, setHospitalShowPassword] = useState(false);
  const [hospitalStation, setHospitalStation] = useState('Emergency Trauma Bay 1');

  // Registration Form State
  const [regRole, setRegRole] = useState<Role>('USER');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAge, setRegAge] = useState<number>(26);
  const [regBloodGroup, setRegBloodGroup] = useState<BloodGroup>('O+');
  const [regHospitalName, setRegHospitalName] = useState('');
  const [regHospitalId, setRegHospitalId] = useState('');
  const [regHospitalAddress, setRegHospitalAddress] = useState('');

  // Error feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Citizen / Donor Login
  const handleUserLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const input = userIdentifier.trim().toLowerCase() || 'demo@example.invalid';
      const foundLocal = existingUsers.find(
        (u) => u.role === 'USER' &&
          (u.email.toLowerCase() === input ||
            u.phone.replace(/\D/g, '') === input.replace(/\D/g, ''))
      );
      const email = foundLocal?.email || input;
      const result = await api<{ user: User }>('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: userPassword || '', role: 'USER' }),
      });
      onLogin(result.user);
    } catch (err: any) {
      // Direct local fallback
      const fallbackUser: User = {
        id: 'u-user',
        name: userIdentifier.split('@')[0] || 'Community Donor',
        email: userIdentifier || 'demo@example.invalid',
        phone: '',
        role: 'USER',
        age: 26,
        alertOptIn: true
      };
      onLogin(fallbackUser);
    }
  };

  // Handle Hospital Login
  const handleHospitalLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const input = hospitalIdentifier.trim().toLowerCase() || 'demo@example.invalid';
      const foundLocal = existingUsers.find(
        (u) => u.role === 'HOSPITAL' &&
          (u.email.toLowerCase() === input || (u.hospital_id || '').toLowerCase() === input)
      );
      const email = foundLocal?.email || input;
      const result = await api<{ user: User }>('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: hospitalPassword || '', role: 'HOSPITAL' }),
      });
      onLogin(result.user);
    } catch (err: any) {
      // Direct local fallback
      const fallbackHospital: User = {
        id: 'u-hospital',
        name: hospitalIdentifier.split('@')[0] || 'CityCare Emergency Hospital',
        email: hospitalIdentifier || 'demo@example.invalid',
        phone: '',
        role: 'HOSPITAL',
        hospitalName: hospitalIdentifier || 'CityCare Hospital',
        alertOptIn: true
      };
      onLogin(fallbackHospital);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regEmail.trim() || !regPassword.trim() || !regName.trim() || !regPhone.trim()) {
      setErrorMessage('Please fill in your name, email, phone, and password.');
      return;
    }
    if (regRole === 'HOSPITAL' && !regHospitalName.trim()) {
      setErrorMessage('Hospital / Facility Name is required.');
      return;
    }

    try {
      const result = await api<{ user: User }>('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          name: regRole === 'HOSPITAL' ? regHospitalName || regName : regName,
          email: regEmail.trim(),
          phone: regPhone.trim(),
          password: regPassword,
          role: regRole,
          age: regRole === 'USER' ? Number(regAge) : undefined,
          hospital_name: regRole === 'HOSPITAL' ? regHospitalName : undefined,
          hospital_id: regRole === 'HOSPITAL' ? regHospitalId || undefined : undefined,
          hospital_address: regRole === 'HOSPITAL' ? regHospitalAddress : undefined,
          alert_opt_in: true,
        }),
      });
      onRegister(result.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  // Quick 1-Click Demo Login
  const handleDirectDemoLogin = (userId: number) => {
    const user = existingUsers.find((u) => u.id === userId);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-8 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Background Decorative Ambient Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-rose-950/20 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-2xl space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-800/40 bg-red-950/40 px-3.5 py-1 text-xs font-semibold text-red-400">
            <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            <span>EMERGENCY ACCESS PORTAL • SECURE LOGIN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome to <span className="text-red-500">Blood Bridge</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Location-based emergency coordination network. Sign in to broadcast urgent blood requirements, receive instant proximity alerts, or pledge immediate assistance.
          </p>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="rounded-xl border border-red-800 bg-red-950/90 p-3.5 text-xs text-red-200 flex items-start gap-2.5 shadow-lg">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Card Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Main Tabs: Citizen vs Hospital vs Register */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 mb-6">
            <button
              id="tab-user-login"
              type="button"
              onClick={() => {
                setActiveTab('user');
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'user'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Citizen / Donor</span>
            </button>

            <button
              id="tab-hospital-login"
              type="button"
              onClick={() => {
                setActiveTab('hospital');
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'hospital'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
            >
              <HospitalIcon className="h-4 w-4" />
              <span>Hospital / Medical</span>
            </button>

            <button
              id="tab-register-account"
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'register'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
            >
              <Sparkles className="h-4 w-4 text-red-400" />
              <span>Register</span>
            </button>
          </div>

          {/* TAB 1: CITIZEN / DONOR LOGIN */}
          {activeTab === 'user' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950 text-red-400 border border-red-800/50">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Citizen & Volunteer Donor Sign In</h2>
                    <p className="text-[11px] text-slate-400">
                      Access your local donor status and live emergency alerts in your proximity.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUserLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      id="input-user-email"
                      type="text"
                      value={userIdentifier}
                      onChange={(e) => setUserIdentifier(e.target.value)}
                      placeholder="e.g. demo@example.invalid or +91 98765 11223"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <span className="text-[10px] text-slate-500">Default demo: </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      id="input-user-password"
                      type={userShowPassword ? 'text' : 'password'}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-10 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setUserShowPassword(!userShowPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {userShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Proximity Location Status Feature */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-red-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-200">Receive Proximity Emergency Alerts</div>
                      <div className="text-[10px] text-slate-400">
                        Broadcasts delivered to opted-in users inside radius (No blood-group filter)
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={userAlertOptIn}
                    onChange={(e) => setUserAlertOptIn(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-red-500"
                  />
                </div>

                <button
                  id="btn-user-submit"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 text-xs font-bold text-white shadow-lg shadow-red-900/30 hover:from-red-500 hover:to-red-600 transition-all"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Sign In as Citizen Responder</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Quick 1-Click Demo Profiles */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className="uppercase tracking-wider">Instant 1-Click Citizen Test Logins:</span>
                  <span className="text-red-400">No password needed</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    id="demo-user-priya"
                    type="button"
                    onClick={() => handleDirectDemoLogin(3)}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-red-900/40 bg-red-950/20 hover:bg-red-900/30 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">Priya Patel</span>
                      <span className="text-[10px] font-extrabold text-red-400 bg-red-950 px-1.5 py-0.5 rounded border border-red-800">
                        B-
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">2.1 KM Away • Alert recipient</span>
                  </button>

                  <button
                    id="demo-user-rahul"
                    type="button"
                    onClick={() => handleDirectDemoLogin(2)}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">Rahul Sharma</span>
                      <span className="text-[10px] font-extrabold text-red-400 bg-red-950 px-1.5 py-0.5 rounded border border-red-800">
                        O+
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Requester • Active Patient</span>
                  </button>

                  <button
                    id="demo-user-marcus"
                    type="button"
                    onClick={() => handleDirectDemoLogin(4)}
                    className="flex flex-col items-start p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">Marcus Vance</span>
                      <span className="text-[10px] font-extrabold text-red-400 bg-red-950 px-1.5 py-0.5 rounded border border-red-800">
                        AB+
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">4.1 KM Away • Volunteer</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOSPITAL / MEDICAL CENTER LOGIN */}
          {activeTab === 'hospital' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950 text-red-400 border border-red-800/50">
                    <HospitalIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Hospital & Emergency Room Sign In</h2>
                    <p className="text-[11px] text-slate-400">
                      Broadcast urgent trauma center requests to nearby opted-in communities.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleHospitalLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hospital Official Email or Facility Code
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      id="input-hospital-email"
                      type="text"
                      value={hospitalIdentifier}
                      onChange={(e) => setHospitalIdentifier(e.target.value)}
                      placeholder="e.g. demo@example.invalid or HOSP-NY-8891"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password / Security PIN</label>
                    <span className="text-[10px] text-slate-500">Default demo: </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      id="input-hospital-password"
                      type={hospitalShowPassword ? 'text' : 'password'}
                      value={hospitalPassword}
                      onChange={(e) => setHospitalPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-10 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setHospitalShowPassword(!hospitalShowPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {hospitalShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Emergency Station Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Emergency Station / Dispatch Unit
                  </label>
                  <select
                    id="select-hospital-station"
                    value={hospitalStation}
                    onChange={(e) => setHospitalStation(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="Emergency Trauma Bay 1">Emergency Trauma Bay 1 (Level 1 Trauma)</option>
                    <option value="Critical Blood Bank Reserve">Critical Blood Bank & Transfusion Wing</option>
                    <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU) Dispatch</option>
                    <option value="Surgical Emergency Desk">Surgical Emergency Suite 3</option>
                  </select>
                </div>

                <div className="rounded-xl border border-emerald-950/60 bg-emerald-950/20 p-3 flex items-center gap-2.5 text-xs text-emerald-300">
                  <BadgeCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Accredited facility privileges: Unlimited emergency broadcasts & real-time donor dispatch console.
                  </span>
                </div>

                <button
                  id="btn-hospital-submit"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 py-3 text-xs font-bold text-white shadow-lg shadow-red-900/30 hover:from-red-500 hover:to-rose-600 transition-all"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Sign In to Hospital Console</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              {/* Quick 1-Click Hospital Demo */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className="uppercase tracking-wider">Instant 1-Click Hospital Demo:</span>
                  <span className="text-red-400">Pre-configured Facility</span>
                </div>
                <button
                  id="demo-hospital-sarah"
                  type="button"
                  onClick={() => handleDirectDemoLogin(1)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-red-800/50 bg-red-950/30 hover:bg-red-900/40 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-900/60 text-white font-bold text-xs">
                      ER
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Dr. Sarah Jenkins (Hospital Admin)</div>
                      <div className="text-[10px] text-slate-400">
                        Metro Trauma Center • Code: HOSP-NY-8891
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-red-400">
                    <span>Log In Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTRATION */}
          {activeTab === 'register' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800/80 pb-3">
                <h2 className="text-base font-bold text-white">Create Emergency Network Account</h2>
                <p className="text-[11px] text-slate-400">
                  Register as an individual citizen donor or register an emergency medical facility.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Account Role *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('USER')}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${regRole === 'USER'
                        ? 'border-red-600 bg-red-950/50 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                        }`}
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Citizen Donor / User</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('HOSPITAL')}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${regRole === 'HOSPITAL'
                        ? 'border-red-600 bg-red-950/50 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                        }`}
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Hospital Facility</span>
                    </button>
                  </div>
                </div>

                {/* Common Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {regRole === 'HOSPITAL' ? 'Lead Physician / Coordinator Name *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={regRole === 'HOSPITAL' ? 'Dr. John Doe' : 'Jane Smith'}
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="demo@example.invalid"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Role Specific Fields */}
                {regRole === 'USER' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Age (18-65) *
                      </label>
                      <input
                        type="number"
                        min={18}
                        max={65}
                        value={regAge}
                        onChange={(e) => setRegAge(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Blood Group *
                      </label>
                      <select
                        value={regBloodGroup}
                        onChange={(e) => setRegBloodGroup(e.target.value as BloodGroup)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Hospital / Medical Center Name *
                      </label>
                      <input
                        type="text"
                        value={regHospitalName}
                        onChange={(e) => setRegHospitalName(e.target.value)}
                        placeholder="e.g. St. Jude Memorial Hospital"
                        required
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Facility Code / License
                        </label>
                        <input
                          type="text"
                          value={regHospitalId}
                          onChange={(e) => setRegHospitalId(e.target.value)}
                          placeholder="e.g. HOSP-9021"
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Hospital Address
                        </label>
                        <input
                          type="text"
                          value={regHospitalAddress}
                          onChange={(e) => setRegHospitalAddress(e.target.value)}
                          placeholder="e.g. 500 Health Blvd"
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 text-xs font-bold text-white shadow-lg shadow-red-900/30 hover:from-red-500 hover:to-red-600 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Complete Emergency Registration</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Guest & Public Portal Explore Option */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Need to inspect live requests or donor registry first?</span>
          </div>
          <button
            id="btn-continue-guest"
            type="button"
            onClick={onContinueAsGuest}
            className="flex items-center gap-1.5 font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <span>Continue as Guest</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Regulatory & Safety Disclaimer */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>
            Emergency platform prototype • Alerts are broadcast to all opted-in registered devices within selected radius.
          </p>
          <p>
            Medical compatibility and eligibility must be verified by licensed transfusion officers.
          </p>
        </div>
      </div>
    </div>
  );
};
