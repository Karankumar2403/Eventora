const Booking = require('../models/bookings');
const OTP = require('../models/OTP');
const Event = require('../models/Event');
const { sendOTPEmail, sendBookingEmail } = require('../utils/email');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for booking verification
exports.sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOTP();
        await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
        await OTP.create({ email: req.user.email, otp, action: 'event_booking' });
        await sendOTPEmail(req.user.email, otp, 'event_booking');
        res.json({ message: 'OTP sent to email. Please verify.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// Create a booking (requires OTP verification)
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, otp } = req.body;
        const otpRecord = await OTP.findOne({ email: req.user.email, action: 'event_booking' });
        if (!otpRecord || String(otpRecord.otp) !== String(otp)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }

        const existingBooking = await Booking.findOne({ userId: req.user._id, eventId });
        if (existingBooking && existingBooking.status !== 'cancelled') {
            return res.status(400).json({ message: 'You have already booked this event' });
        }

        event.availableSeats -= 1;
        await event.save();

        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            status: 'pending',
            paymentStatus: 'non_paid',
            amount: event.ticketPrice
        });

        await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
        res.status(201).json({ message: 'Booking created successfully, check your email for details', booking });
    } catch (error) {
        res.status(500).json({ message: 'Booking failed', error: error.message });
    }
};

// Admin: confirm a booking
exports.confirmBooking = async (req, res) => {
    try {
        const paymentStatus = req.body.paymentStatus;
        if (!['paid', 'non_paid'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }
        const booking = await Booking.findById(req.params.id).populate('userId eventId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.status === 'confirmed') {
            return res.status(400).json({ message: 'Booking is already confirmed' });
        }
        booking.status = 'confirmed';
        booking.paymentStatus = paymentStatus;
        await booking.save();
        await sendBookingEmail(booking.userId.email, booking.userId.name, booking.eventId.title);
        res.json({ message: 'Booking confirmed successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Failed to confirm booking', error: error.message });
    }
};

// User: get their own bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('eventId')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
};

// Admin: get ALL bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('userId', 'name email')
            .populate('eventId', 'title date availableSeats totalSeats')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all bookings', error: error.message });
    }
};

// User/Admin: cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Admins can cancel any booking; users can only cancel their own
        if (req.user.role !== 'admin' && booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
        }

        const wasConfirmed = booking.status === 'confirmed';
        booking.status = 'cancelled';
        await booking.save();

        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
    }
};
