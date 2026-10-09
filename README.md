# 🎬 CinePass - MERN Movie Ticket Booking System

A modern, full-stack **MERN (MongoDB, Express.js, React, Node.js)** Movie Ticket Booking web application featuring real-time seat reservation, auditorium tier mapping (VIP Recliner, Premium Club, Standard), JWT authentication, digital boarding-pass tickets with simulated QR validation, and an Admin Management Console.

---

## 🌟 Key Features

- **Dynamic Box Office Catalog**:
  - Browse "Now Showing" and "Coming Soon" movies with real posters, backdrops, and trailer links.
  - Filter by Genre (Sci-Fi, Action, Drama, Animation, etc.) and search by title/director.
  - Multi-city cinema filtering (New York, Los Angeles, Austin).

- **Theatrical Auditorium & Interactive Seat Map**:
  - Curved glowing cinema screen perspective.
  - Multi-tiered seat selection:
    - **VIP Recliner**: Plush luxury rows with prime comfort ($22)
    - **Premium Club**: Center rows with optimum field of view ($16)
    - **Standard**: Classic theater seating ($12)
  - Real-time seat status indication: *Available*, *Selected*, and *Occupied/Reserved*.

- **Smart Checkout & Digital E-Ticket**:
  - Transparent pricing breakdown: subtotal, taxes, and convenience fee.
  - Promo code discounts (Use coupon **`CINEMA20`** for 20% off).
  - Simulated payment options: Credit Card, Apple Pay, PayPal.
  - Boarding-pass voucher design with perforated stub, unique reference code (`CNP-XXXXX`), and print/save capability.
  - Celebratory confetti on purchase completion.

- **User Accounts & Booking History**:
  - JWT-based authentication with bcrypt-encrypted passwords.
  - "My Tickets" dashboard to view active tickets or request cancellations with simulated refund & seat release.
  - Convenient 1-Click "Demo Auto-Fill" buttons for quick login.

- **Admin Operations Center**:
  - Metric dashboards: Gross Revenue ($), Total Tickets Sold, Active Screenings.
  - Add new movies with poster URL, duration, rating, genres, and cast.
  - Manage catalog & remove movies.
  - Schedule new showtimes across theaters and screen formats (IMAX 3D Laser, Dolby Atmos, 4DX).

- **Zero-Friction Dual Database Mode**:
  - Connects to your local MongoDB or Atlas instance (`MONGODB_URI`).
  - **Automatic Fallback**: If MongoDB is not running locally, the server seamlessly runs on an integrated JSON-persisted database engine (`backend/src/data/db.json`), ensuring **100% out-of-the-box readiness** with pre-seeded blockbusters!

---

## 🏗️ Project Architecture

```
movie-ticket-booking/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & fallback manager
│   │   ├── controllers/     # Auth, Movie, Theater, Showtime, Booking, Admin
│   │   ├── data/            # Seed datasets & JSON persistence engine
│   │   ├── middleware/      # JWT Protect & Role Authorize middleware
│   │   ├── models/          # Mongoose Schemas (User, Movie, Theater, Showtime, Booking)
│   │   ├── routes/          # Express API route endpoints
│   │   └── server.js        # Express app entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, MovieCard, SeatMap, AuthModal
│   │   ├── context/         # AuthContext (JWT session management)
│   │   ├── pages/           # Home, MovieDetails, SeatSelection, BookingConfirmation, MyBookings, Admin
│   │   ├── services/        # Centralized Fetch API client
│   │   ├── App.jsx
│   │   ├── index.css        # Tailwind styling & cinema glow effects
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── run-dev.js               # Concurrent launcher for Backend + Frontend
├── package.json             # Root workspace scripts
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+ installed.
- *(Optional)* **MongoDB**: Local `mongod` or MongoDB Atlas URI (if omitted, the built-in persistent mock database automatically handles all operations).

### 2. Install Dependencies

From the project root directory (`movie-ticket-booking`):

```bash
# Install both backend and frontend dependencies
npm run install:all
```

Or install separately:
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Start the Application

To launch both the **Express Backend (Port 5000)** and **React Vite Frontend (Port 5173)** together:

```bash
npm run dev
```

Open your browser at:
👉 **http://localhost:5173**

---

## 🔑 Pre-Seeded Demo Accounts

You can use the **1-Click Demo Fill** buttons in the Sign In modal or use these credentials:

| Role | Email | Password | Access |
|---|---|---|---|
| **Regular User** | `user@cinema.com` | `user123` | Book tickets, view history, cancel tickets |
| **Admin** | `admin@cinema.com` | `admin123` | Analytics, add movies, schedule showtimes |

---

## 🏷️ Test Promo Code
- Enter **`CINEMA20`** on the seat checkout screen to receive a **20% discount** on your ticket order.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account | Public |
| `POST` | `/api/auth/login` | Login and obtain JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Required |
| `GET` | `/api/movies` | List movies with genre/status/search query | Public |
| `GET` | `/api/movies/:id` | Get details for a single movie | Public |
| `POST` | `/api/movies` | Create a movie | Admin |
| `DELETE` | `/api/movies/:id` | Delete a movie | Admin |
| `GET` | `/api/theaters` | List theaters filtered by city | Public |
| `GET` | `/api/showtimes` | List showtimes for movie & date | Public |
| `GET` | `/api/showtimes/:id` | Get showtime with real-time seat matrix | Public |
| `POST` | `/api/bookings` | Reserve seats and generate booking | Required |
| `GET` | `/api/bookings/my-bookings` | Fetch user's booking history | Required |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking and release seats | Required |
| `GET` | `/api/admin/stats` | Revenue and occupancy analytics | Admin |
| `GET` | `/api/admin/bookings` | List all system transactions | Admin |

---

## 🛠️ Environment Configuration

Backend `.env` options:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/movieticketbooking
JWT_SECRET=super_secret_jwt_key_movie_booking_2026_xyz
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
