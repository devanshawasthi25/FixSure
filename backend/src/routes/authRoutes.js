const express = require('express');
const { login, signup, mockSendOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/otp/send', mockSendOtp);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
