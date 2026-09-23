const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        enum: ['account_verification', 'event_booking'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

// Compound unique index: one OTP per email+action combo
otpSchema.index({ email: 1, action: 1 }, { unique: true });

module.exports = mongoose.models.OTP || mongoose.model('OTP', otpSchema);