const bcrypt = require('bcryptjs');

const getSeedData = () => {
  const salt = bcrypt.genSaltSync(10);
  const userPasswordHash = bcrypt.hashSync('user123', salt);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);

  const users = [
    {
      _id: '661000000000000000000001',
      name: 'John Doe',
      email: 'user@cinema.com',
      password: userPasswordHash,
      role: 'user',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    {
      _id: '661000000000000000000002',
      name: 'Cinema Admin',
      email: 'admin@cinema.com',
      password: adminPasswordHash,
      role: 'admin',
      phone: '+1 (555) 987-6543',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const movies = [
    {
      _id: '661000000000000000000011',
      title: 'Dune: Part Two',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200nd.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      genres: ['Sci-Fi', 'Adventure', 'Action'],
      duration: 166,
      language: 'English',
      rating: 8.8,
      votesCount: 42100,
      certificate: 'PG-13',
      releaseDate: new Date('2024-03-01'),
      status: 'now_showing',
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler']
    },
    {
      _id: '661000000000000000000012',
      title: 'Oppenheimer',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the deep moral dilemma and geopolitical upheaval of the dawn of the nuclear era.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/fm6K9vYI7vdEN39Ha3AjDqXMrrQ.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
      genres: ['Biography', 'Drama', 'History'],
      duration: 180,
      language: 'English',
      rating: 8.9,
      votesCount: 56300,
      certificate: 'R',
      releaseDate: new Date('2023-07-21'),
      status: 'now_showing',
      director: 'Christopher Nolan',
      cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh']
    },
    {
      _id: '661000000000000000000013',
      title: 'Spider-Man: Across the Spider-Verse',
      description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
      genres: ['Animation', 'Action', 'Sci-Fi'],
      duration: 140,
      language: 'English',
      rating: 8.7,
      votesCount: 38900,
      certificate: 'PG',
      releaseDate: new Date('2023-06-02'),
      status: 'now_showing',
      director: 'Joaquim Dos Santos, Kemp Powers',
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya']
    },
    {
      _id: '661000000000000000000014',
      title: 'Interstellar',
      description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTrKGqDCRIIqo664sY9XZIvQ.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      genres: ['Sci-Fi', 'Drama', 'Adventure'],
      duration: 169,
      language: 'English',
      rating: 8.7,
      votesCount: 68000,
      certificate: 'PG-13',
      releaseDate: new Date('2014-11-07'),
      status: 'now_showing',
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine']
    },
    {
      _id: '661000000000000000000015',
      title: 'Gladiator II',
      description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/euYIwmwkmz95mnEx7vA49496i.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
      genres: ['Action', 'Adventure', 'Drama'],
      duration: 150,
      language: 'English',
      rating: 8.4,
      votesCount: 15200,
      certificate: 'R',
      releaseDate: new Date('2024-11-22'),
      status: 'coming_soon',
      director: 'Ridley Scott',
      cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen']
    },
    {
      _id: '661000000000000000000016',
      title: 'Deadpool & Wolverine',
      description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up with an even more reluctant Wolverine.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1jv8vgC.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
      genres: ['Action', 'Comedy', 'Sci-Fi'],
      duration: 128,
      language: 'English',
      rating: 8.2,
      votesCount: 29500,
      certificate: 'R',
      releaseDate: new Date('2024-07-26'),
      status: 'now_showing',
      director: 'Shawn Levy',
      cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen']
    },
    {
      _id: '661000000000000000000017',
      title: 'Salaar: Ceasefire',
      description: 'A rugged rebel leader rises against a ruthless empire, forcing a violent showdown filled with power, betrayal, and unforgettable action in this explosive Telugu blockbuster.',
      posterUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d90455187149357.6582898ae18c1.png',
      backdropUrl: 'https://image.tmdb.org/t/p/original/l0wX5m5A4n2rYwJQ6y1c5T9D9f0.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=vQ1TQ0e2ZgY',
      genres: ['Action', 'Crime', 'Drama'],
      duration: 170,
      language: 'Telugu',
      rating: 8.3,
      votesCount: 88200,
      certificate: 'UA',
      releaseDate: new Date('2023-12-22'),
      status: 'now_showing',
      director: 'Prashanth Neel',
      cast: ['Prabhas', 'Prithviraj Sukumaran', 'Shruti Haasan', 'Jagapathi Babu']
    },
    {
      _id: '661000000000000000000018',
      title: 'KGF: Chapter 2',
      description: 'Rocky rises from the dust of a dangerous past to confront a bigger empire, setting the stage for a high-stakes siege of power, revenge, and raw muscle.',
      posterUrl: 'https://www.bing.com/th/id/OIP.gYPWFgw0NhdUrM2XdY-EWAHaLH?w=193&h=290&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=ImgAns&rm=2',
      backdropUrl: 'https://image.tmdb.org/t/p/original/1EtwJ3m7owY0IT8y2TQhy4I8Y5p.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=Qah9sSIXJqk',
      genres: ['Action', 'Drama', 'Thriller'],
      duration: 166,
      language: 'Kannada',
      rating: 8.6,
      votesCount: 96100,
      certificate: 'UA',
      releaseDate: new Date('2022-04-14'),
      status: 'now_showing',
      director: 'Prashanth Neel',
      cast: ['Yash', 'Sanjay Dutt', 'Raveena Tandon', 'Srinidhi Shetty']
    },
    {
      _id: '661000000000000000000019',
      title: 'Pushpa 2: The Rule',
      description: 'The red sandalwood king returns with a bigger empire, tougher rivals, and a battle that escalates into a full-scale power struggle across the wild frontier.',
      posterUrl: 'https://th.bing.com/th/id/OIP.EZYwaaB1HzMm7IY8ESO5PAHaLe?w=200&h=311&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      backdropUrl: 'https://image.tmdb.org/t/p/original/4V3T9U5OPQw1yQdFQXjN4S4lq5U.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=2WltjW5p0o0',
      genres: ['Action', 'Drama', 'Thriller'],
      duration: 182,
      language: 'Telugu',
      rating: 8.4,
      votesCount: 104000,
      certificate: 'UA',
      releaseDate: new Date('2024-12-05'),
      status: 'now_showing',
      director: 'Sukumar',
      cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil', 'Sreeleela']
    },
    {
      _id: '661000000000000000000020',
      title: 'Spider-Man: Brand New Day',
      description: 'Peter Parker faces a fresh wave of enemies and a new chapter of responsibility as he balances a secret life against the chaos of a city that no longer knows his name.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/8gYjJw0Zxj1b8x0OPL2W4Z7YIhw.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=5lK4l0iLSxY',
      genres: ['Action', 'Sci-Fi', 'Adventure'],
      duration: 145,
      language: 'English',
      rating: 8.5,
      votesCount: 53400,
      certificate: 'PG-13',
      releaseDate: new Date('2026-07-31'),
      status: 'now_showing',
      director: 'Destin Daniel Cretton',
      cast: ['Tom Holland', 'Zendaya', 'Jacob Batalon', 'Jon Bernthal']
    },
    {
      _id: '661000000000000000000021',
      title: 'Avatar: Fire and Ash',
      description: 'A new era of Pandora unfolds as old loyalties, new threats, and breathtaking worlds collide in a visually stunning epic adventure.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8wQeF5f2rVoI1W9sX7v5cR2dYfO.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/8wQeF5f2rVoI1W9sX7v5cR2dYfO.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=Qvzr9s9cDkg',
      genres: ['Sci-Fi', 'Adventure', 'Action'],
      duration: 192,
      language: 'English',
      rating: 8.7,
      votesCount: 67200,
      certificate: 'PG-13',
      releaseDate: new Date('2025-12-19'),
      status: 'coming_soon',
      director: 'James Cameron',
      cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver', 'Stephen Lang']
    }
  ];

  const theaters = [
    {
      _id: '661000000000000000000021',
      name: 'AMC Empire 25 IMAX',
      chain: 'AMC Theatres',
      city: 'New York',
      address: '234 W 42nd St, Times Square, New York, NY 10036',
      screens: [
        {
          screenNumber: 1,
          name: 'Screen 1 - IMAX Laser',
          format: 'IMAX 3D / Laser',
          totalSeats: 80,
          seatLayout: {
            rows: 8,
            columns: 10,
            rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            seatCategories: [
              { name: 'Standard', rows: ['A', 'B'], price: 14 },
              { name: 'Premium', rows: ['C', 'D', 'E', 'F'], price: 18 },
              { name: 'VIP', rows: ['G', 'H'], price: 24 }
            ]
          }
        },
        {
          screenNumber: 2,
          name: 'Screen 2 - Dolby Cinema',
          format: 'Dolby Atmos Atmos',
          totalSeats: 80,
          seatLayout: {
            rows: 8,
            columns: 10,
            rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            seatCategories: [
              { name: 'Standard', rows: ['A', 'B'], price: 12 },
              { name: 'Premium', rows: ['C', 'D', 'E', 'F'], price: 16 },
              { name: 'VIP', rows: ['G', 'H'], price: 22 }
            ]
          }
        }
      ]
    },
    {
      _id: '661000000000000000000022',
      name: 'Regal LA Live 4DX',
      chain: 'Regal Cinemas',
      city: 'Los Angeles',
      address: '1000 W Olympic Blvd, Los Angeles, CA 90015',
      screens: [
        {
          screenNumber: 1,
          name: 'Screen 1 - 4DX Theater',
          format: '4DX Dynamic',
          totalSeats: 80,
          seatLayout: {
            rows: 8,
            columns: 10,
            rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            seatCategories: [
              { name: 'Standard', rows: ['A', 'B'], price: 15 },
              { name: 'Premium', rows: ['C', 'D', 'E', 'F'], price: 20 },
              { name: 'VIP', rows: ['G', 'H'], price: 26 }
            ]
          }
        }
      ]
    },
    {
      _id: '661000000000000000000023',
      name: 'Alamo Drafthouse Cinema',
      chain: 'Alamo Drafthouse',
      city: 'Austin',
      address: '1120 S Lamar Blvd, Austin, TX 78704',
      screens: [
        {
          screenNumber: 1,
          name: 'The Big Show',
          format: 'Dolby Atmos 7.1',
          totalSeats: 80,
          seatLayout: {
            rows: 8,
            columns: 10,
            rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            seatCategories: [
              { name: 'Standard', rows: ['A', 'B'], price: 13 },
              { name: 'Premium', rows: ['C', 'D', 'E', 'F'], price: 17 },
              { name: 'VIP', rows: ['G', 'H'], price: 23 }
            ]
          }
        }
      ]
    }
  ];

  // Helper to format ISO date string "YYYY-MM-DD"
  const getTodayDateStr = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const showtimes = [];
  let showtimeCounter = 31;

  // Generate showtimes for today, tomorrow, and day after tomorrow
  [0, 1, 2].forEach((dayOffset) => {
    const dateStr = getTodayDateStr(dayOffset);
    movies.filter(m => m.status === 'now_showing').forEach((movie, mIdx) => {
      theaters.forEach((theater, tIdx) => {
        const times = ['11:30 AM', '02:45 PM', '06:15 PM', '09:45 PM'];
        times.forEach((time, timeIdx) => {
          showtimeCounter++;
          const hexId = '661000000000000000000' + showtimeCounter.toString(16).padStart(3, '0');
          // Some pre-booked seats to show realistic booked seats
          const sampleBooked = [];
          if (timeIdx % 2 === 0) {
            sampleBooked.push('C4', 'C5', 'D6', 'D7', 'G3', 'G4');
          } else {
            sampleBooked.push('E5', 'E6', 'F4', 'F5');
          }

          showtimes.push({
            _id: hexId,
            movie: movie._id,
            theater: theater._id,
            screenNumber: (mIdx % 2) + 1,
            screenFormat: tIdx === 0 ? 'IMAX Laser 3D' : 'Dolby Atmos',
            date: dateStr,
            time: time,
            ticketPrices: {
              Standard: 12,
              Premium: 16,
              VIP: 22
            },
            bookedSeats: sampleBooked
          });
        });
      });
    });
  });

  const bookings = [
    {
      _id: '661000000000000000000081',
      bookingReference: 'CNP-78291',
      user: users[0]._id,
      movie: movies[0]._id,
      theater: theaters[0]._id,
      showtime: showtimes[0]._id,
      seats: [
        { seatNumber: 'D4', tier: 'Premium', price: 16 },
        { seatNumber: 'D5', tier: 'Premium', price: 16 }
      ],
      subtotal: 32,
      convenienceFee: 2.50,
      tax: 2.76,
      discount: 0,
      totalAmount: 37.26,
      paymentMethod: 'Credit Card (ending 4242)',
      paymentStatus: 'completed',
      ticketQrCode: 'CNP-78291-DUNE2-D4-D5',
      createdAt: new Date().toISOString()
    }
  ];

  return { users, movies, theaters, showtimes, bookings };
};

module.exports = { getSeedData };
