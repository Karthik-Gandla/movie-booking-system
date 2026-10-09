import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, MapPin, Tag, ShieldCheck, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowtimeData();
  }, [showtimeId]);

  const fetchShowtimeData = async () => {
    setLoading(true);
    try {
      const res = await api.getShowtimeById(showtimeId);
      if (res.success) {
        setShowtime(res.data);
      } else {
        setError('Showtime details could not be found');
      }
    } catch (err) {
      setError('Failed to fetch showtime information');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeat = (seat) => {
    const exists = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'CINEMA20') {
      setDiscountPercent(0.20);
      setPromoMessage('Promo code applied: 20% discount!');
    } else {
      setDiscountPercent(0);
      setPromoMessage('Invalid promo code. Try "CINEMA20"');
    }
  };

  // Pricing calculations
  const subtotal = selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  const discountAmount = +(subtotal * discountPercent).toFixed(2);
  const taxableAmount = subtotal - discountAmount;
  const convenienceFee = selectedSeats.length > 0 ? 2.50 : 0;
  const tax = selectedSeats.length > 0 ? +(taxableAmount * 0.08).toFixed(2) : 0;
  const grandTotal = +(taxableAmount + convenienceFee + tax).toFixed(2);

  const handleProceedBooking = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.createBooking({
        showtimeId,
        seats: selectedSeats.map((s) => ({
          seatNumber: s.seatNumber,
          tier: s.tier,
          price: s.price
        })),
        promoCode: discountPercent > 0 ? 'CINEMA20' : '',
        paymentMethod
      });

      if (res.success && res.data) {
        navigate(`/confirmation/${res.data._id || res.data.bookingReference}`, {
          state: { booking: res.data }
        });
      } else {
        setError(res.message || 'Booking reservation failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during booking checkout');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Preparing auditorium seat chart...</p>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-rose-400 text-base mb-3 font-semibold">{error || 'Screening not found'}</p>
        <button onClick={() => navigate(-1)} className="text-brand-400 hover:underline text-sm">
          Return to previous page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Top Header Bar */}
      <div className="bg-dark-900 border-b border-dark-800 py-4 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 border border-dark-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold font-heading text-white">{showtime.movie?.title}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{showtime.theater?.name}</span>
                <span>•</span>
                <span className="text-brand-400 font-semibold">{showtime.screenFormat || 'Dolby Atmos'}</span>
                <span>•</span>
                <span>{showtime.date} at {showtime.time}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Selected Seats:</span>
            {selectedSeats.length > 0 ? (
              <span className="font-mono text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                {selectedSeats.map((s) => s.seatNumber).join(', ')} ({selectedSeats.length})
              </span>
            ) : (
              <span className="italic text-slate-500">None chosen yet</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl text-center">
            {error}
          </div>
        </div>
      )}

      {/* Main Seat Layout & Right Sidebar Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactive Seat Chart */}
        <div className="lg:col-span-2 bg-dark-900/60 rounded-3xl border border-dark-800 p-6 sm:p-8">
          <SeatMap
            seatMap={showtime.seatMap || []}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            ticketPrices={showtime.ticketPrices}
          />
        </div>

        {/* Right Column: Checkout Breakdown */}
        <div className="space-y-6">
          <div className="bg-dark-850 rounded-3xl border border-dark-700/80 bg-dark-800/80 p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold font-heading text-white border-b border-dark-700 pb-3">
              Booking Summary
            </h2>

            {/* Movie preview snippet */}
            <div className="flex gap-3">
              <img
                src={showtime.movie?.posterUrl}
                alt={showtime.movie?.title}
                className="w-16 h-24 object-cover rounded-xl border border-dark-700"
              />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-white text-sm line-clamp-1">{showtime.movie?.title}</p>
                <p className="text-slate-400">{showtime.theater?.name}</p>
                <p className="text-slate-400">{showtime.date} • {showtime.time}</p>
                <p className="text-brand-400 font-semibold">{showtime.screenFormat}</p>
              </div>
            </div>

            {/* Selected Seats Chips */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">Selected Seats & Tiers:</p>
              {selectedSeats.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedSeats.map((s) => (
                    <div
                      key={s.seatNumber}
                      className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-dark-900 border border-dark-700"
                    >
                      <span className="font-semibold text-slate-200">
                        Seat {s.seatNumber} ({s.tier})
                      </span>
                      <span className="font-mono text-slate-300">${s.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-500 bg-dark-900/50 p-3 rounded-xl border border-dark-800 text-center">
                  Click on any available seat on the map to begin.
                </p>
              )}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-2 border-t border-dark-700">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-500" /> Have a discount code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CINEMA20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs uppercase font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-xs font-semibold rounded-xl text-slate-200 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] mt-1.5 ${discountPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {promoMessage}
                </p>
              )}
            </form>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-dark-700">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['Credit Card', 'Apple Pay', 'PayPal'].map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                      paymentMethod === pm
                        ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                        : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-dark-700 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Tickets Subtotal</span>
                <span className="font-mono text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount (20%)</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Convenience Fee</span>
                <span className="font-mono text-slate-200">${convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Surcharges (8%)</span>
                <span className="font-mono text-slate-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-dark-700">
                <span>Grand Total</span>
                <span className="font-mono text-brand-400 text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedBooking}
              disabled={selectedSeats.length === 0 || submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <CreditCard className="w-4 h-4" />
              {submitting
                ? 'Processing Payment...'
                : !isAuthenticated
                ? 'Sign In & Confirm Reservation'
                : `Pay $${grandTotal.toFixed(2)} & Book`}
            </button>

            <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              256-bit Encrypted Cinema Booking Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
