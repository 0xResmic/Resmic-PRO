const express = require('express');
const { makePayment, makePaymentTest, getPaymentSession, updatePayment, generateTempWalletAddress, updatePaymentSubscription } = require('../controllers/makePaymentController');
const authenticateApiKey = require('../middlewares/apiAuthMiddleware');
const { hostedPageAuth } = require('../middlewares/hostedPageAuthMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const limiter = rateLimit({
    // windowMs: 15 * 60 * 1000, // 15 minutes
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: 15, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

// Dynamic Rate limiting based on the user plan/tier.
const dynamicRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    keyGenerator: (req) => req.user?.api_secret,
    limit: (req, res) => {
        if (!req.user) return 15; // Default limit for unknown users
        switch (req.user.tier) {
            case 99 || 3: return 50;  // Premium users or Free trial user
            case 1: return 30;   // Mid-tier users
            case 2: return 20;   // Basic users
            default: return 15;    // Default limit
        }
    },
    standardHeaders: 'draft-8', // Use standard rate limit headers
    legacyHeaders: false,       // Disable old headers
});


// Below route is creating the session and returning the Session Id.
// Make Entry Function.
// Creates a payment Session.
// Add Rate Limiting for each API.
router.post('/', authenticateApiKey, dynamicRateLimiter,  makePayment);

// Return the session details
router.get('/session/', getPaymentSession);

// Complets the payment session. Accept the origin from the payment page only.
// Need to be controlled by the origin. Only Hosted Payment Page URL should able to acces.
router.put('/', hostedPageAuth, updatePayment);

// router.post('/subscription/payment-status', updatePaymentSubscription);
router.post('/subscription/payment-status', hostedPageAuth, updatePaymentSubscription);




module.exports = router;