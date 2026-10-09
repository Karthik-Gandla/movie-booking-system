import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search, MapPin, User, LogOut, Ticket, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ selectedCity, onSelectCity, searchQuery, onSearchChange }) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cities = ['All Cities', 'New York', 'Los Angeles', 'Austin'];

  return (
    <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight font-heading bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Cine<span className="text-brand-500">Pass</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Premier Box Office
              </span>
            </div>
          </Link>

          {/* City Selector */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 text-xs font-medium text-slate-300">
            <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer pr-1"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-dark-800 text-slate-200">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Search bar */}
          <div className="hidden sm:flex flex-1 max-w-md items-center relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search movies, genres, directors..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-800/80 border border-dark-700/80 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          {/* Desktop Navigation Links & User Profile */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Movies
            </Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-brand-500" />
                My Tickets
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 hover:bg-amber-500/20 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-dark-600 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-dark-600"
                  />
                  <span className="text-sm font-medium text-slate-200 hidden xl:inline">{user.name.split(' ')[0]}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl bg-dark-800 border border-dark-700 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-dark-700">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-brand-400 capitalize">{user.role}</p>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-dark-700 hover:text-white"
                    >
                      <Ticket className="w-4 h-4 text-slate-400" />
                      My Bookings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-dark-700"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-dark-700 border-t border-dark-700 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {!isAuthenticated ? (
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white"
              >
                Sign In
              </button>
            ) : (
              <Link to="/my-bookings" className="p-2 text-slate-300">
                <Ticket className="w-5 h-5 text-brand-500" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-dark-700 flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-slate-200 placeholder-slate-400"
            />
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-slate-400">Select City:</span>
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="bg-dark-800 text-slate-200 px-3 py-1 rounded border border-dark-700 text-sm"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-amber-400 text-sm py-1 font-semibold"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-rose-400 text-sm py-1 font-semibold text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out ({user.name})
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
