const express = require('express');
const router = express.Router();
const { register, login, verifyOTP } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
// Normalized to /verifyotp — matches AuthContext.jsx call
router.post('/verifyotp', verifyOTP);

module.exports = router;
