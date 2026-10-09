import React from 'react';
import { Armchair, Check, Sparkles } from 'lucide-react';

export default function SeatMap({ seatMap, selectedSeats, onToggleSeat, ticketPrices }) {
  // Group seats by tier or rows
  const tiers = [
    { name: 'VIP Recliner', rows: ['H', 'G'], price: ticketPrices?.VIP || 22, color: 'text-amber-400 border-amber-500/30' },
    { name: 'Premium Club', rows: ['F', 'E', 'D', 'C'], price: ticketPrices?.Premium || 16, color: 'text-sky-400 border-sky-500/30' },
    { name: 'Standard Classic', rows: ['B', 'A'], price: ticketPrices?.Standard || 12, color: 'text-slate-300 border-slate-600/30' }
  ];

  const getSeatObj = (seatId) => seatMap.find((s) => s.seatNumber === seatId);

  const isSelected = (seatId) => selectedSeats.some((s) => s.seatNumber === seatId);

  return (
    <div className="w-full flex flex-col items-center select-none py-6">
      {/* Cinema Screen Visual with curved glow */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="w-full h-10 border-t-4 border-sky-400 rounded-t-[100px] shadow-[0_-12px_28px_rgba(56,189,248,0.35)] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 to-transparent pointer-events-none" />
        </div>
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-sky-300/80 mt-1">
          EYES TOWARDS THE SCREEN
        </p>
      </div>

      {/* Seat Rows by Tier */}
      <div className="w-full max-w-3xl space-y-8">
        {tiers.map((tier) => (
          <div key={tier.name} className="space-y-3">
            {/* Tier Header with Price Tag */}
            <div className="flex items-center justify-between border-b border-dark-700/60 pb-1.5 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                {tier.name === 'VIP Recliner' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                {tier.name}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-dark-800 text-slate-200 border border-dark-700">
                ${tier.price.toFixed(2)}
              </span>
            </div>

            {/* Rows in this tier */}
            <div className="space-y-2">
              {tier.rows.map((rowLetter) => (
                <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3">
                  {/* Row Label Left */}
                  <span className="w-5 text-center text-xs font-bold text-slate-500">
                    {rowLetter}
                  </span>

                  {/* Left Aisle Seats (1 to 5) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((col) => {
                      const seatId = `${rowLetter}${col}`;
                      const seat = getSeatObj(seatId);
                      if (!seat) return <div key={seatId} className="w-7 h-7 sm:w-8 sm:h-8" />;

                      const booked = seat.status === 'booked';
                      const selected = isSelected(seatId);

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={booked}
                          onClick={() => onToggleSeat(seat)}
                          title={`${seatId} - $${seat.price}`}
                          className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all ${
                            booked
                              ? 'bg-dark-800 text-slate-600 border border-dark-700 cursor-not-allowed opacity-50'
                              : selected
                              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/50 scale-105 ring-2 ring-white/40'
                              : tier.name === 'VIP Recliner'
                              ? 'bg-amber-950/30 text-amber-200 border border-amber-600/40 hover:bg-amber-600 hover:text-white'
                              : tier.name === 'Premium Club'
                              ? 'bg-sky-950/30 text-sky-200 border border-sky-600/40 hover:bg-sky-600 hover:text-white'
                              : 'bg-dark-700 text-slate-300 border border-slate-600 hover:bg-dark-600'
                          }`}
                        >
                          {selected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : col}
                        </button>
                      );
                    })}
                  </div>

                  {/* Center Aisle Gap */}
                  <div className="w-4 sm:w-8" />

                  {/* Right Aisle Seats (6 to 10) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[6, 7, 8, 9, 10].map((col) => {
                      const seatId = `${rowLetter}${col}`;
                      const seat = getSeatObj(seatId);
                      if (!seat) return <div key={seatId} className="w-7 h-7 sm:w-8 sm:h-8" />;

                      const booked = seat.status === 'booked';
                      const selected = isSelected(seatId);

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={booked}
                          onClick={() => onToggleSeat(seat)}
                          title={`${seatId} - $${seat.price}`}
                          className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all ${
                            booked
                              ? 'bg-dark-800 text-slate-600 border border-dark-700 cursor-not-allowed opacity-50'
                              : selected
                              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/50 scale-105 ring-2 ring-white/40'
                              : tier.name === 'VIP Recliner'
                              ? 'bg-amber-950/30 text-amber-200 border border-amber-600/40 hover:bg-amber-600 hover:text-white'
                              : tier.name === 'Premium Club'
                              ? 'bg-sky-950/30 text-sky-200 border border-sky-600/40 hover:bg-sky-600 hover:text-white'
                              : 'bg-dark-700 text-slate-300 border border-slate-600 hover:bg-dark-600'
                          }`}
                        >
                          {selected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : col}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row Label Right */}
                  <span className="w-5 text-center text-xs font-bold text-slate-500">
                    {rowLetter}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Status Legend */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-dark-800/60 border border-dark-700/60">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="w-5 h-5 rounded-md bg-dark-700 border border-slate-600" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="w-5 h-5 rounded-md bg-brand-600 flex items-center justify-center text-white">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="w-5 h-5 rounded-md bg-dark-800 border border-dark-700 opacity-50" />
          <span>Booked / Reserved</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-300">
          <div className="w-5 h-5 rounded-md bg-amber-950/40 border border-amber-600" />
          <span>VIP Recliner</span>
        </div>
      </div>
    </div>
  );
}
