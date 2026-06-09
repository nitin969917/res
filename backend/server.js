const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Connect Database
const { connectDB } = require('./config/db');
connectDB();

// Initialize Passport config
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup — allow localhost (any port), LAN IP, and ngrok tunnels
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl / Postman / no-origin
    const allowed =
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||         // any localhost port
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||     // loopback
      /^http:\/\/192\.0\.0\.\d+(:\d+)?$/.test(origin) ||   // CLAT LAN
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) || // normal LAN
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) || // 10.x.x.x LAN
      /\.ngrok(-free)?\.app$/.test(origin) ||               // any ngrok tunnel
      /\.ngrok\.io$/.test(origin);
    if (allowed) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true
}));

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'biteqr_super_secret_session_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false, // Set to true if running on HTTPS
      sameSite: 'lax'
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Static folder for local uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/items', require('./routes/items'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/tables', require('./routes/tables'));

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the BiteQR Restaurant API!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong on the server!' });
});

// Start Server — bind on 0.0.0.0 so LAN devices (mobile) can reach it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 LAN access: http://192.0.0.2:${PORT}`);
});
