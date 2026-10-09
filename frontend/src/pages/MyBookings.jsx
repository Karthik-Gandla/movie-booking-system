import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Eye, XCircle, ArrowRight, Film } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyBookings() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The seats will be released and a refund simulated.')) {
      return;
    }

    setCancellingId(id);
    try {
      const res = await api.cancelBooking(id);
      if (res.success) {
        setBookings(bookings.map((b) => (b._id === id ? { ...b, paymentStatus: 'refunded' } : b)));
      } else {
        alert(res.message || 'Failed to cancel booking');
      }
    } catch (err) {
      alert('Error cancelling booking: ' + err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <Ticket className="w-12 h-12 text-brand-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white font-heading">Sign In Required</h2>
        <p className="text-xs text-slate-400 mt-2 mb-6">
          Please log in to view your booked tickets, reservations, and history.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading your ticket reservations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-dark-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white flex items-center gap-2.5">
            <Ticket className="w-7 h-7 text-brand-500" />
            My Tickets & Reservations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your active cinema admissions, boarding passes, and booking history.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 border border-dark-700 transition-all self-start"
        >
          Browse Movies <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isRefunded = booking.paymentStatus === 'refunded';
            const movie = booking.movie;
            const theater = booking.theater;
            const showtime = booking.showtime;
            const seatList = booking.seats?.map((s) => s.seatNumber).join(', ');

            return (
              <div
                key={booking._id}
                className={`p-5 sm:p-6 rounded-2xl bg-dark-800/80 border transition-all ${
                  isRefunded
                    ? 'border-dark-700/40 opacity-70'
                    : 'border-dark-700 hover:border-brand-500/50 hover:shadow-xl'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
                  <div className="flex gap-4 items-start">
                    <img
                      src={movie?.posterUrl}
                      alt={movie?.title}
                      className="w-20 h-28 object-cover rounded-xl border border-dark-700 shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                          {booking.bookingReference}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isRefunded
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isRefunded ? 'Refunded' : 'Confirmed'}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold font-heading text-white">{movie?.title}</h2>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-500" />
                        {theater?.name} • {showtime?.screenFormat || 'Dolby Atmos'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {showtime?.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-brand-400">
                          <Clock className="w-3.5 h-3.5" /> {showtime?.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seat details and action buttons */}
                  <div className="flex flex-col md:items-end justify-between self-stretch gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-dark-700">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400">Seats Reserved:</p>
                      <p className="font-mono font-bold text-amber-300 text-sm">{seatList}</p>
                      <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                        ${booking.totalAmount?.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/confirmation/${booking._id}`}
                        state={{ booking }}
                        className="px-3.5 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Pass
                      </Link>

                      {!isRefunded && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-dark-800/30 rounded-3xl border border-dark-800">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-heading">No tickets booked yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
            Explore now-showing blockbusters, choose your preferred cinema and select your luxury seats today.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all inline-flex items-center gap-2"
          >
            Explore Movies
          </Link>
        </div>
      )}
    </div>
  );
}
