import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User as UserIcon, Building2, Shield, AlertCircle } from 'lucide-react';
import { Role, User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  existingUsers: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  onLogin,
  onRegister,
  existingUsers,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<Role>('USER');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // User specific
  const [age, setAge] = useState<number>(26);

  // Hospital specific
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const found = existingUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );
      if (found) {
        onLogin(found);
        onClose();
      } else {
        setError('No account found with this email. Please register or try a demo account.');
      }
    } else {
      // Register
      if (!email.trim() || !password.trim()) {
        setError('Email and password are required.');
        return;
      }

      const newUser: User = {
        id: Date.now(),
        name: role === 'HOSPITAL' ? hospitalName || name : name,
        email: email.trim(),
        phone: phone.trim() || '+1 (555) 000-0000',
        role: role,
        age: role === 'USER' ? Number(age) : undefined,
        hospital_name: role === 'HOSPITAL' ? hospitalName : undefined,
        hospital_id: role === 'HOSPITAL' ? hospitalId : undefined,
        hospital_address: role === 'HOSPITAL' ? hospitalAddress : undefined,
        latitude: 0,
        longitude: 0,
        alert_opt_in: true,
        created_at: new Date().toISOString(),
      };

      onRegister(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Sign In to Blood Bridge' : 'Create Emergency Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Enter credentials to access your alert dashboard'
              : 'Join as a volunteer citizen donor or medical facility'}
          </p>
        </div>

        {/* Quick Demo Switcher for fast testing */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
            Quick Fill Demo Accounts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail('demo@example.invalid');
                setPassword('');
              }}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200"
            >
              Rahul (Citizen)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('demo@example.invalid');
                setPassword('');
              }}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200"
            >
              Dr. Sarah (Hospital)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('demo@example.invalid');
                setPassword('');
              }}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200"
            >
              Priya (B- Donor)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-3">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('USER')}
                    className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                      role === 'USER'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    Individual User
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('HOSPITAL')}
                    className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                      role === 'HOSPITAL'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    Hospital / Center
                  </button>
                </div>
              </div>

              {/* Conditional Registration Fields */}
              {role === 'HOSPITAL' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="e.g. Metro Trauma Center"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Hospital Registration / ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={hospitalId}
                      onChange={(e) => setHospitalId(e.target.value)}
                      placeholder="e.g. HOSP-NY-8891"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Hospital Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={hospitalAddress}
                      onChange={(e) => setHospitalAddress(e.target.value)}
                      placeholder="100 Emergency Way, Medical District"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@example.invalid"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Passwords securely hashed in SQLite via Werkzeug/Bcrypt
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-700 py-3 text-xs font-black uppercase text-white shadow-lg shadow-red-950 hover:from-red-500 hover:to-rose-600 transition-all"
          >
            {mode === 'login' ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <div>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-red-400 hover:underline"
              >
                Register here
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-red-400 hover:underline"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
