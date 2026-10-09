import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Film, Play, ArrowLeft, Ticket } from 'lucide-react';
import { api } from '../services/api';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  // Generate date options (Today, Tomorrow, and next 3 days)
  const dateOptions = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { iso, dayName, dayNum };
  });

  useEffect(() => {
    setSelectedDate(dateOptions[0].iso);
  }, []);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  useEffect(() => {
    if (id && selectedDate) {
      fetchShowtimes();
    }
  }, [id, selectedDate]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getMovieById(id);
      if (res.success) {
        setMovie(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const res = await api.getShowtimes({ movie: id, date: selectedDate });
      if (res.success) {
        setShowtimes(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading movie details and cinema listings...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2 font-heading">Movie Not Found</h2>
        <Link to="/" className="text-brand-400 hover:underline text-sm">Return to Home</Link>
      </div>
    );
  }

  // Group showtimes by theater
  const theatersMap = {};
  showtimes.forEach((st) => {
    const theaterId = st.theater?._id || 'unknown';
    if (!theatersMap[theaterId]) {
      theatersMap[theaterId] = {
        theater: st.theater,
        times: []
      };
    }
    theatersMap[theaterId].times.push(st);
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Top Banner / Backdrop */}
      <div className="relative h-[340px] sm:h-[420px] overflow-hidden">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-xs font-semibold text-slate-300 border border-dark-700 backdrop-blur-md transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </div>

      {/* Main Details Card overlapping banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Box */}
          <div className="w-48 sm:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-dark-700 bg-dark-800 mx-auto md:mx-0">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-auto aspect-[2/3] object-cover"
            />
          </div>

          {/* Info Details */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-dark-800 border border-dark-600 text-xs font-bold text-slate-300">
                {movie.certificate || 'PG-13'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-dark-800 border border-dark-600 text-xs font-medium text-slate-300">
                {movie.language || 'English'}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {movie.rating?.toFixed(1)} / 10
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" /> {movie.duration} mins
              </span>
              <span>•</span>
              <span>{movie.genres?.join(', ')}</span>
              <span>•</span>
              <span>Released {new Date(movie.releaseDate).getFullYear()}</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {movie.description}
            </p>

            {movie.trailerUrl && (
              <div className="flex justify-center md:justify-start pt-1">
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-600/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </a>
              </div>
            )}

            {/* Cast & Director */}
            <div className="pt-2 border-t border-dark-800 flex flex-wrap gap-6 text-xs text-slate-400">
              {movie.director && (
                <div>
                  <span className="block text-slate-400 font-medium">Director</span>
                  <span className="text-slate-200 font-semibold">{movie.director}</span>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="block text-slate-400 font-medium">Starring Cast</span>
                  <span className="text-slate-200 font-semibold">{movie.cast.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date Selector Chips */}
        <div className="mt-14 pt-8 border-t border-dark-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              Select Date & Showtimes
            </h2>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
            {dateOptions.map((item) => (
              <button
                key={item.iso}
                onClick={() => setSelectedDate(item.iso)}
                className={`flex flex-col items-center justify-center min-w-[90px] py-3 px-4 rounded-2xl border transition-all ${
                  selectedDate === item.iso
                    ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/30 scale-105'
                    : 'bg-dark-800/80 border-dark-700 text-slate-300 hover:bg-dark-700 hover:border-slate-600'
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider">{item.dayName}</span>
                <span className="text-base font-bold font-heading mt-0.5">{item.dayNum}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theaters & Showtimes Listing */}
        <div className="mt-6 space-y-4">
          {Object.keys(theatersMap).length > 0 ? (
            Object.values(theatersMap).map(({ theater, times }) => (
              <div
                key={theater?._id || Math.random()}
                className="p-5 sm:p-6 rounded-2xl bg-dark-800/60 border border-dark-700/60 hover:border-dark-600 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-dark-700/60 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                      {theater?.name || 'Grand Cinema Complex'}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      {theater?.address}, {theater?.city}
                    </p>
                  </div>
                </div>

                {/* Showtimes Pill Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {times.map((st) => (
                    <Link
                      key={st._id}
                      to={`/booking/${st._id}`}
                      className="group flex flex-col items-center py-2.5 px-5 rounded-xl bg-dark-900 border border-dark-700 hover:border-brand-500 hover:bg-brand-950/20 transition-all text-center"
                    >
                      <span className="text-sm font-bold text-slate-100 group-hover:text-brand-400 transition-colors">
                        {st.time}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-300 mt-0.5">
                        {st.screenFormat || 'Dolby 7.1'}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-dark-800/30 rounded-2xl border border-dark-700">
              <Film className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">No screenings available for this date</p>
              <p className="text-xs text-slate-400 mt-1">Please select another date above or check back shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
