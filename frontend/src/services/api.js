const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Movies
  getMovies: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/movies?${query}`);
    return res.json();
  },

  getMovieById: async (id) => {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    return res.json();
  },

  createMovie: async (movieData) => {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(movieData)
    });
    return res.json();
  },

  deleteMovie: async (id) => {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Theaters
  getTheaters: async (city = '') => {
    const res = await fetch(`${API_BASE}/theaters?city=${encodeURIComponent(city)}`);
    return res.json();
  },

  getTheaterById: async (id) => {
    const res = await fetch(`${API_BASE}/theaters/${id}`);
    return res.json();
  },

  // Showtimes
  getShowtimes: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/showtimes?${query}`);
    return res.json();
  },

  getShowtimeById: async (id) => {
    const res = await fetch(`${API_BASE}/showtimes/${id}`);
    return res.json();
  },

  createShowtime: async (stData) => {
    const res = await fetch(`${API_BASE}/showtimes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(stData)
    });
    return res.json();
  },

  // Bookings
  createBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  getMyBookings: async () => {
    const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getBookingById: async (id) => {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  cancelBooking: async (id) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Admin
  getStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getAllBookings: async () => {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
