const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');
const {
    bookEvent,
    sendBookingOTP,
    getMyBookings,
    getAllBookings,
    confirmBooking,
    cancelBooking
} = require('../controllers/bookingController');

// User routes
router.post('/send-otp', protect, sendBookingOTP);
router.post('/', protect, bookEvent);
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);

// Admin routes
router.get('/all', protect, admin, getAllBookings);
router.put('/:id/confirm', protect, admin, confirmBooking);

module.exports = router;
