const express = require('express');
const { sendEmailOTP, verifyEmailOTP, reSendEmailOTP } = require('../controllers/userAuthController');
const rateLimit = require('express-rate-limit');
const router = express.Router();


const limiter = rateLimit({
    // windowMs: 15 * 60 * 1000, // 15 minutes
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

router.post('/login',limiter, sendEmailOTP);
router.post('/verify', verifyEmailOTP);
router.post('/resendotp', limiter, reSendEmailOTP);

module.exports = router;