const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth.js');
const eventRoutes = require('./routes/events.js');
const bookingRoutes = require('./routes/booking.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// ─── Serve React client in production ────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientBuildPath));

    // All non-API routes → serve index.html (React Router handles them)
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}
// ─────────────────────────────────────────────────────────────────────────────

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URL;
if (!mongoUrl) {
    console.error('MongoDB connection error: MONGO_URL is not configured in server/.env');
} else {
    mongoose.connect(mongoUrl)
        .then(() => console.log('MongoDB Connected'))
        .catch((error) => console.error('MongoDB connection error:', error));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});