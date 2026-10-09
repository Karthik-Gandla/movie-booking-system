import React from 'react';
const FilmIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" strokeWidth="2"/>
    <line x1="7" y1="2" x2="7" y2="22" strokeWidth="2"/>
    <line x1="17" y1="2" x2="17" y2="22" strokeWidth="2"/>
    <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2"/>
    <line x1="2" y1="7" x2="7" y2="7" strokeWidth="2"/>
    <line x1="2" y1="17" x2="7" y2="17" strokeWidth="2"/>
    <line x1="17" y1="17" x2="22" y2="17" strokeWidth="2"/>
    <line x1="17" y1="7" x2="22" y2="7" strokeWidth="2"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-dark-800">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
                <FilmIcon />
              </div>
              <span className="text-xl font-bold font-heading text-white">
                Cine<span className="text-brand-500">Pass</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience movie magic with seamless online ticket booking, real-time seat reservation, IMAX screens, and instant digital passes.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Cinema Experience
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-brand-400 cursor-pointer transition-colors">IMAX with Laser</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Dolby Cinema Atmos</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">4DX Sensory Motion</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">VIP Recliner Lounges</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Support & Info
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Booking Policies & Refunds</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Privacy Notice</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">FAQ & Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Exclusive Offers
            </h4>
            <p className="text-sm text-slate-400 mb-3">
              Use promo code <span className="font-mono text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">CINEMA20</span> at checkout for 20% off your booking!
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email for deals"
                className="bg-dark-800 border border-dark-700 text-xs px-3 py-2 rounded-lg text-slate-200 w-full outline-none focus:border-brand-500"
              />
              <button className="bg-brand-600 hover:bg-brand-500 text-xs font-semibold px-3 py-2 rounded-lg text-white">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CinePass MERN Technologies. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Powered by MongoDB • Express • React • Node.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
