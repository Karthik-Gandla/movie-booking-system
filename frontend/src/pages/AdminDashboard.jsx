import React, { useState, useEffect } from 'react';
import { DollarSign, Ticket, Film, Users, Plus, Trash2, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'add_movie', 'manage_movies', 'add_showtime'

  // Form states
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    genres: 'Action, Sci-Fi',
    duration: 135,
    language: 'English',
    rating: 8.5,
    certificate: 'PG-13',
    releaseDate: new Date().toISOString().split('T')[0],
    status: 'now_showing',
    director: '',
    cast: ''
  });

  const [showtimeForm, setShowtimeForm] = useState({
    movie: '',
    theater: '',
    screenNumber: 1,
    screenFormat: 'Dolby Atmos',
    date: new Date().toISOString().split('T')[0],
    time: '07:30 PM',
    ticketPrices: {
      Standard: 12,
      Premium: 16,
      VIP: 22
    }
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, moviesRes, theatersRes, bookingsRes] = await Promise.all([
        api.getStats(),
        api.getMovies(),
        api.getTheaters(),
        api.getAllBookings()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (moviesRes.success) {
        setMovies(moviesRes.data);
        if (moviesRes.data.length > 0) {
          setShowtimeForm((prev) => ({ ...prev, movie: moviesRes.data[0]._id }));
        }
      }
      if (theatersRes.success) {
        setTheaters(theatersRes.data);
        if (theatersRes.data.length > 0) {
          setShowtimeForm((prev) => ({ ...prev, theater: theatersRes.data[0]._id }));
        }
      }
      if (bookingsRes.success) setBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = {
        ...movieForm,
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating),
        genres: movieForm.genres.split(',').map((g) => g.trim()),
        cast: movieForm.cast ? movieForm.cast.split(',').map((c) => c.trim()) : []
      };

      const res = await api.createMovie(payload);
      if (res.success) {
        setMessage('Movie created successfully!');
        setMovieForm({
          title: '',
          description: '',
          posterUrl: '',
          backdropUrl: '',
          trailerUrl: '',
          genres: 'Action, Sci-Fi',
          duration: 135,
          language: 'English',
          rating: 8.5,
          certificate: 'PG-13',
          releaseDate: new Date().toISOString().split('T')[0],
          status: 'now_showing',
          director: '',
          cast: ''
        });
        loadAdminData();
      } else {
        setMessage('Failed: ' + res.message);
      }
    } catch (err) {
      setMessage('Error creating movie: ' + err.message);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to remove this movie?')) return;
    try {
      const res = await api.deleteMovie(id);
      if (res.success) {
        setMovies(movies.filter((m) => m._id !== id));
        setMessage('Movie deleted successfully');
      }
    } catch (err) {
      setMessage('Error deleting movie');
    }
  };

  const handleCreateShowtime = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.createShowtime(showtimeForm);
      if (res.success) {
        setMessage('Showtime added successfully!');
        loadAdminData();
      } else {
        setMessage('Failed: ' + res.message);
      }
    } catch (err) {
      setMessage('Error creating showtime: ' + err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white font-heading">Access Denied</h2>
        <p className="text-xs text-slate-400 mt-2">
          Administrator privileges are required to access this console. Sign in as an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-dark-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
            Admin Operations Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time box office analytics, catalog scheduling, and inventory control.
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
          {message}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-dark-800/80 border border-dark-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Gross Revenue</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black font-heading text-white mt-2 font-mono">
              ${stats.totalRevenue?.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">Box office collections</p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800/80 border border-dark-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Bookings</span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black font-heading text-white mt-2 font-mono">{stats.totalBookings}</p>
            <p className="text-[11px] text-sky-400 mt-1 font-medium">Confirmed orders</p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800/80 border border-dark-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Tickets Sold</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black font-heading text-white mt-2 font-mono">{stats.totalTicketsSold}</p>
            <p className="text-[11px] text-amber-400 mt-1 font-medium">Auditorium seats occupied</p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-800/80 border border-dark-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Movies</span>
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <Film className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black font-heading text-white mt-2 font-mono">{movies.length}</p>
            <p className="text-[11px] text-brand-400 mt-1 font-medium">Titles in catalog</p>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-3 mb-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Recent Transactions' },
          { id: 'add_movie', label: 'Add Movie' },
          { id: 'manage_movies', label: 'Manage Movies' },
          { id: 'add_showtime', label: 'Schedule Showtime' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setMessage('');
            }}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Transactions */}
      {activeTab === 'overview' && (
        <div className="bg-dark-800/60 rounded-2xl border border-dark-700 overflow-hidden">
          <div className="p-5 border-b border-dark-700">
            <h3 className="font-heading font-bold text-base text-white">Recent Box Office Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-dark-700">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Movie</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/60 text-slate-300">
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-dark-750/50">
                      <td className="py-3 px-4 font-mono font-bold text-brand-400">{b.bookingReference}</td>
                      <td className="py-3 px-4 font-medium text-white">{b.movie?.title || 'Unknown Title'}</td>
                      <td className="py-3 px-4 text-slate-400">{b.user?.name || b.user?.email || 'Customer'}</td>
                      <td className="py-3 px-4 font-mono text-amber-300">
                        {b.seats?.map((s) => s.seatNumber).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        ${b.totalAmount?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.paymentStatus === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500">
                      No transactions recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Add Movie */}
      {activeTab === 'add_movie' && (
        <form onSubmit={handleCreateMovie} className="max-w-2xl bg-dark-800/60 rounded-3xl border border-dark-700 p-6 sm:p-8 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white mb-2">Publish New Movie</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Movie Title</label>
              <input
                type="text"
                required
                value={movieForm.title}
                onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                placeholder="e.g. Interstellar 2"
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Description / Synopsis</label>
              <textarea
                rows="3"
                required
                value={movieForm.description}
                onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                placeholder="Provide a compelling storyline synopsis..."
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Poster Image URL</label>
              <input
                type="url"
                required
                value={movieForm.posterUrl}
                onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                placeholder="https://image.tmdb.org/..."
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Backdrop Image URL</label>
              <input
                type="url"
                value={movieForm.backdropUrl}
                onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                placeholder="https://image.tmdb.org/..."
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Trailer URL</label>
              <input
                type="url"
                value={movieForm.trailerUrl}
                onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Genres (comma separated)</label>
              <input
                type="text"
                required
                value={movieForm.genres}
                onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                placeholder="Sci-Fi, Action, Adventure"
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (minutes)</label>
              <input
                type="number"
                required
                value={movieForm.duration}
                onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
              <select
                value={movieForm.status}
                onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              >
                <option value="now_showing">Now Showing</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Director</label>
              <input
                type="text"
                value={movieForm.director}
                onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                placeholder="Director name"
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Cast (comma separated)</label>
              <input
                type="text"
                value={movieForm.cast}
                onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                placeholder="Actor 1, Actor 2, Actor 3"
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Create & Add to Catalog
          </button>
        </form>
      )}

      {/* Tab 3: Manage Movies */}
      {activeTab === 'manage_movies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {movies.map((m) => (
            <div key={m._id} className="p-4 rounded-2xl bg-dark-800/60 border border-dark-700 flex gap-3 items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={m.posterUrl} alt={m.title} className="w-12 h-16 object-cover rounded-lg border border-dark-700" />
                <div>
                  <h4 className="font-bold text-sm text-white line-clamp-1">{m.title}</h4>
                  <p className="text-[11px] text-slate-400">{m.genres?.slice(0, 2).join(', ')}</p>
                  <span className="text-[10px] font-bold uppercase text-brand-400">{m.status}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteMovie(m._id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                title="Delete Movie"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Schedule Showtime */}
      {activeTab === 'add_showtime' && (
        <form onSubmit={handleCreateShowtime} className="max-w-xl bg-dark-800/60 rounded-3xl border border-dark-700 p-6 sm:p-8 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white mb-2">Schedule Screening Session</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Movie</label>
            <select
              value={showtimeForm.movie}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, movie: e.target.value })}
              className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
            >
              {movies.map((m) => (
                <option key={m._id} value={m._id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Theater</label>
            <select
              value={showtimeForm.theater}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, theater: e.target.value })}
              className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
            >
              {theaters.map((t) => (
                <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Date (YYYY-MM-DD)</label>
              <input
                type="date"
                required
                value={showtimeForm.date}
                onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Screening Time</label>
              <input
                type="text"
                required
                value={showtimeForm.time}
                onChange={(e) => setShowtimeForm({ ...showtimeForm, time: e.target.value })}
                placeholder="e.g. 07:30 PM"
                className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Screen Format</label>
            <input
              type="text"
              required
              value={showtimeForm.screenFormat}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, screenFormat: e.target.value })}
              placeholder="e.g. IMAX Laser 3D, Dolby Atmos"
              className="w-full bg-dark-900 border border-dark-700 px-3 py-2 rounded-xl text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Publish Showtime Session
          </button>
        </form>
      )}
    </div>
  );
}
