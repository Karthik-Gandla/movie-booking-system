import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-dark-900 text-slate-100">
          <Navbar
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    selectedCity={selectedCity}
                    searchQuery={searchQuery}
                  />
                }
              />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/booking/:showtimeId" element={<SeatSelection />} />
              <Route path="/confirmation/:id" element={<BookingConfirmation />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <Footer />
          <AuthModal />
        </div>
      </Router>
    </AuthProvider>
  );
}
