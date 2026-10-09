import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Calendar, ChevronRight, Sparkles, Film } from 'lucide-react';
import { api } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function Home({ selectedCity, searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('now_showing');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [heroIndex, setHeroIndex] = useState(0);

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Comedy'];

  useEffect(() => {
    fetchMovies();
  }, [activeTab, selectedGenre, searchQuery]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.getMovies({
        status: activeTab,
        genre: selectedGenre,
        search: searchQuery
      });
      if (res.success) {
        setMovies(res.data);
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const featuredMovie =
    movies.find((movie) => movie.title.toLowerCase().includes('dune')) ||
    (movies.length > 0 ? movies[heroIndex % movies.length] : null);

  const heroBackdrop =
    featuredMovie?.backdropUrl ||
    featuredMovie?.posterUrl ||
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      {featuredMovie && !searchQuery && (
        <section className="relative h-[480px] sm:h-[560px] overflow-hidden">
          {/* Backdrop Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-dark-950" />
          <div className="absolute inset-0">
            <img
              src={heroBackdrop}
              alt={featuredMovie.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80';
              }}
              className="w-full h-full object-cover object-top opacity-35 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent" />
          </div>

          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Premiere
              </div>

              <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight leading-tight">
                {featuredMovie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {featuredMovie.rating.toFixed(1)} / 10
                </div>
                <span>•</span>
                <span>{featuredMovie.certificate || 'PG-13'}</span>
                <span>•</span>
                <span>{featuredMovie.duration} mins</span>
                <span>•</span>
                <span>{featuredMovie.genres?.join(', ')}</span>
              </div>

              <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed max-w-xl">
                {featuredMovie.description}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  to={`/movie/${featuredMovie._id}`}
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <Film className="w-4 h-4" />
                  Book Tickets Now
                </Link>

                {featuredMovie.trailerUrl && (
                  <a
                    href={featuredMovie.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl bg-dark-800/80 hover:bg-dark-700 border border-dark-600 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-slate-200" />
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs (Now Showing vs Coming Soon) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('now_showing')}
              className={`text-lg sm:text-xl font-bold font-heading pb-2 relative transition-colors ${
                activeTab === 'now_showing'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Now Showing
              {activeTab === 'now_showing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('coming_soon')}
              className={`text-lg sm:text-xl font-bold font-heading pb-2 relative transition-colors ${
                activeTab === 'coming_soon'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Coming Soon
              {activeTab === 'coming_soon' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Genre Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  selectedGenre === g
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="rounded-2xl bg-dark-800/40 aspect-[2/3] animate-pulse border border-dark-700/40" />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-dark-800/20 rounded-3xl border border-dark-800">
              <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-200 font-heading">No movies found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No titles match your current filter or search criteria. Try choosing "All" genres or clearing your query.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
