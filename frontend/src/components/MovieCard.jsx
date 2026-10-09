import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

export default function MovieCard({ movie }) {
  const formatDuration = (mins) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const isNowShowing = movie.status === 'now_showing';

  return (
    <div className="group flex flex-col bg-dark-800/60 rounded-2xl overflow-hidden border border-dark-700/60 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/20 hover:-translate-y-1">
      {/* Poster Image with overlays */}
      <Link to={`/movie/${movie._id}`} className="relative aspect-[2/3] overflow-hidden bg-dark-900 block">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/30 opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-dark-900/80 backdrop-blur-md border border-amber-500/30 flex items-center gap-1.5 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-amber-200">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Certificate tag */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-dark-900/80 backdrop-blur-md border border-slate-700 text-[10px] font-semibold text-slate-300">
          {movie.certificate || 'PG-13'}
        </div>

        {/* Status ribbon if coming soon */}
        {!isNowShowing && (
          <div className="absolute bottom-3 left-3 right-3 bg-amber-500/90 text-dark-900 text-center py-1 rounded-lg text-xs font-bold tracking-wide uppercase shadow-lg">
            Coming Soon
          </div>
        )}
      </Link>

      {/* Card Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatDuration(movie.duration)}
            </span>
            <span>•</span>
            <span>{movie.language || 'English'}</span>
          </div>

          <Link to={`/movie/${movie._id}`}>
            <h3 className="font-heading font-bold text-base text-slate-100 group-hover:text-brand-400 transition-colors line-clamp-1">
              {movie.title}
            </h3>
          </Link>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genres?.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-[11px] px-2 py-0.5 rounded-full bg-dark-700/80 text-slate-300 font-medium"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/movie/${movie._id}`}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            isNowShowing
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30'
              : 'bg-dark-700 hover:bg-dark-600 text-slate-300'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          {isNowShowing ? 'Book Tickets' : 'View Details'}
        </Link>
      </div>
    </div>
  );
}
