import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Printer, ArrowRight, Film, MapPin, Calendar, Clock, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function BookingConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (!booking && id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await api.getBookingById(id);
      if (res.success) {
        setBooking(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Generating your digital cinema ticket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2 font-heading">Booking Not Found</h2>
        <Link to="/" className="text-brand-400 hover:underline text-sm">Return Home</Link>
      </div>
    );
  }

  const movie = booking.movie;
  const theater = booking.theater;
  const showtime = booking.showtime;
  const seatList = booking.seats?.map((s) => s.seatNumber).join(', ');

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Success Badge */}
      <div className="text-center mb-8 space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-black font-heading text-white">Booking Confirmed!</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Your e-tickets have been reserved. Show this digital pass at the auditorium entrance.
        </p>
      </div>

      {/* Theatrical Boarding Pass / Ticket Design */}
      <div className="w-full max-w-md bg-dark-800 rounded-3xl overflow-hidden shadow-2xl border border-dark-700/80 relative print:bg-white print:text-black">
        {/* Ticket Header Banner */}
        <div className="relative bg-gradient-to-r from-brand-700 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            <span className="font-heading font-black tracking-wider text-base uppercase">CinePass Boarding Pass</span>
          </div>
          <span className="font-mono text-xs font-bold bg-black/30 px-2.5 py-1 rounded-full border border-white/20">
            {booking.bookingReference}
          </span>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5">
          {/* Movie Poster & Title */}
          <div className="flex gap-4 items-center">
            <img
              src={movie?.posterUrl}
              alt={movie?.title}
              className="w-16 h-24 object-cover rounded-xl border border-dark-700 shrink-0"
            />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Movie Title</span>
              <h2 className="text-lg font-bold font-heading text-white line-clamp-1">{movie?.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{movie?.certificate} • {movie?.duration} mins • {movie?.language}</p>
            </div>
          </div>

          {/* Grid of show info */}
          <div className="grid grid-cols-2 gap-4 py-3 border-y border-dark-700/60 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Theater & Screen</span>
              <p className="font-semibold text-white truncate">{theater?.name}</p>
              <p className="text-[11px] text-slate-400">{showtime?.screenFormat || 'Dolby Atmos'}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Date & Time</span>
              <p className="font-semibold text-white">{showtime?.date}</p>
              <p className="text-[11px] text-brand-400 font-bold">{showtime?.time}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Assigned Seats</span>
              <p className="font-mono font-bold text-base text-amber-300">{seatList}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Total Paid</span>
              <p className="font-mono font-bold text-base text-emerald-400">${booking.totalAmount?.toFixed(2)}</p>
            </div>
          </div>

          {/* Simulated QR Code / Barcode representation */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="w-32 h-32 bg-white p-2 rounded-2xl flex items-center justify-center shadow-inner">
              {/* QR Canvas Mock Visual */}
              <div className="w-full h-full flex flex-col justify-between p-1 bg-slate-900 rounded-lg text-white font-mono text-[9px] text-center overflow-hidden">
                <div className="flex justify-between items-center text-[10px] text-brand-400 font-bold">
                  <span>[SCAN]</span>
                  <span>{booking.bookingReference}</span>
                </div>
                <div className="text-[11px] tracking-widest text-slate-300 font-mono">
                  ||||| | |||| ||| ||||
                </div>
                <div className="text-[8px] text-slate-400">VALID ADMISSION</div>
              </div>
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-widest uppercase mt-2">
              REF: {booking.bookingReference}
            </p>
          </div>
        </div>

        {/* Perforation Line & Notches */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="ticket-notch-left" />
          <div className="w-full border-t-2 border-dashed border-dark-700/80 mx-4" />
          <div className="ticket-notch-right" />
        </div>

        {/* Ticket Footer */}
        <div className="p-4 bg-dark-900/60 text-center text-[11px] text-slate-400 border-t border-dark-700/60">
          Present this ticket at the cinema kiosk or gate for admission. Enjoy your movie!
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 text-xs font-semibold transition-all shadow-md"
        >
          <Printer className="w-4 h-4" />
          Print / Save Ticket
        </button>

        <Link
          to="/my-bookings"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all"
        >
          <Ticket className="w-4 h-4" />
          View All Bookings
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs font-semibold transition-all"
        >
          Book Another Movie
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
