import React from 'react';
import { Heart, Bell, Shield, User, Building2, LogOut, Radio, HelpCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserType | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  activeAlertCount: number;
  onOpenDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenProfile,
  activeAlertCount,
  onOpenDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-red-950/60 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          id="navbar-brand"
          className="flex cursor-pointer items-center gap-3"
          onClick={() => setActiveTab('home')}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-900 shadow-lg shadow-red-900/40 ring-1 ring-red-500/30">
            <Heart className="h-5 w-5 fill-red-100 text-red-100 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-wider text-white">
                BLOOD <span className="text-red-500">BRIDGE</span>
              </span>
              <span className="hidden rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-800/40 uppercase tracking-widest sm:inline-block">
                EMERGENCY ALERT
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">Connect. Alert. Save Lives.</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            id="nav-link-home"
            onClick={() => setActiveTab('home')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === 'home'
                ? 'bg-red-950/70 text-red-400 font-semibold border border-red-900/60'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            id="nav-link-request"
            onClick={() => setActiveTab('request')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === 'request'
                ? 'bg-red-950/70 text-red-400 font-semibold border border-red-900/60'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            Request Donor
          </button>
          <button
            id="nav-link-become-donor"
            onClick={() => setActiveTab('become-donor')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === 'become-donor'
                ? 'bg-red-950/70 text-red-400 font-semibold border border-red-900/60'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            Become a Donor
          </button>
          <button
            id="nav-link-donors"
            onClick={() => setActiveTab('donors')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === 'donors'
                ? 'bg-red-950/70 text-red-400 font-semibold border border-red-900/60'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            Active Donors
          </button>
          {currentUser ? (
            <button
              id="nav-link-my-requests"
              onClick={() => setActiveTab('my-requests')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeTab === 'my-requests'
                  ? 'bg-red-950/70 text-red-400 font-semibold border border-red-900/60'
                  : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              My Requests
            </button>
          ) : (
            <button
              id="nav-link-login-portal"
              onClick={() => setActiveTab('login')}
              className={`rounded-lg px-3 py-1.5 transition-colors font-bold ${
                activeTab === 'login'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-red-400 hover:bg-slate-900 hover:text-red-300'
              }`}
            >
              🔑 Login Portal
            </button>
          )}
          <button
            id="nav-link-features"
            onClick={() => setActiveTab('features')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === 'features'
                ? 'bg-red-950/70 text-red-400 font-semibold border border-red-900/60'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            Support Hub
          </button>
          <button
            id="nav-link-about"
            onClick={() => setActiveTab('about')}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === 'about'
                ? 'bg-red-950/70 text-red-400 font-semibold border border-red-900/60'
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            About & Tech
          </button>
        </nav>

        {/* Right Section: Alert Bell & Auth Controls */}
        <div className="flex items-center gap-3">
          {/* Demo mode quick switch button */}
          <button
            id="nav-btn-demo"
            onClick={onOpenDemo}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-red-800/50 bg-red-950/40 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/40 transition-colors"
            title="Live Radius Broadcast Demo & Test Suite"
          >
            <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            <span>Demo Testbed</span>
          </button>

          {/* Active Alerts Button with dynamic counter */}
          <button
            id="nav-btn-alerts"
            onClick={() => setActiveTab(currentUser?.role === 'HOSPITAL' ? 'hospital-dashboard' : currentUser ? 'user-dashboard' : 'login')}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-red-700/60 hover:text-red-400 transition-colors"
            title="Active Emergency Alerts"
          >
            <Bell className="h-4 w-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-bounce">
                {activeAlertCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                id="nav-btn-dashboard"
                onClick={() =>
                  setActiveTab(
                    currentUser.role === 'HOSPITAL' ? 'hospital-dashboard' : 'user-dashboard'
                  )
                }
                className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-red-500/50 transition-colors"
              >
                {currentUser.role === 'HOSPITAL' ? (
                  <Building2 className="h-3.5 w-3.5 text-red-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-rose-400" />
                )}
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
              </button>

              <button
                id="nav-btn-switch-account"
                onClick={() => setActiveTab('login')}
                className="hidden lg:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1.5 text-[11px] text-slate-400 hover:text-white transition-colors"
                title="Switch User or Hospital Account"
              >
                <span>Switch</span>
              </button>

              <button
                id="nav-btn-profile"
                onClick={onOpenProfile}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:text-white transition-colors"
                title="Profile & Location Settings"
              >
                <Shield className="h-4 w-4" />
              </button>

              <button
                id="nav-btn-logout"
                onClick={onLogout}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Sign out to Login Screen"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-btn-login"
                onClick={() => setActiveTab('login')}
                className="rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-red-950 transition-colors"
              >
                Sign In
              </button>
              <button
                id="nav-btn-register"
                onClick={() => {
                  onOpenAuth('register');
                }}
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="flex md:hidden border-t border-slate-900 overflow-x-auto px-4 py-2 gap-2 bg-slate-950 text-xs font-medium no-scrollbar">
        <button
          onClick={() => setActiveTab('home')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'home' ? 'bg-red-950 text-red-400' : 'text-slate-400'}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('request')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'request' ? 'bg-red-950 text-red-400 font-bold' : 'text-slate-400'}`}
        >
          Request Blood
        </button>
        <button
          onClick={() => setActiveTab('become-donor')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'become-donor' ? 'bg-red-950 text-red-400' : 'text-slate-400'}`}
        >
          Become Donor
        </button>
        <button
          onClick={() => setActiveTab('donors')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'donors' ? 'bg-red-950 text-red-400' : 'text-slate-400'}`}
        >
          Donors
        </button>
        <button
          onClick={() => setActiveTab('my-requests')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'my-requests' ? 'bg-red-950 text-red-400' : 'text-slate-400'}`}
        >
          My Requests
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'features' ? 'bg-red-950 text-red-400 font-bold' : 'text-slate-400'}`}
        >
          Support Hub
        </button>
        <button
          onClick={() => setActiveTab(currentUser?.role === 'HOSPITAL' ? 'hospital-dashboard' : 'dashboard')}
          className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab.includes('dashboard') ? 'bg-red-950 text-red-400' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={onOpenDemo}
          className="whitespace-nowrap px-2.5 py-1 rounded bg-red-950/60 text-red-300 border border-red-800/40"
        >
          Demo Test
        </button>
      </div>
    </header>
  );
};
