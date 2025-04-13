const express = require('express');
const { createCoupon, deleteCoupon, updateCoupon, getCoupon, getTxsByCoupon, getAllCouponByUser } = require('../controllers/couponController');
const { hostedPageAuth } = require('../middlewares/hostedPageAuthMiddleware');

const router = express.Router();

router.get('/txs', getTxsByCoupon);
router.get('/coupon-list', getAllCouponByUser);

router.post('/create', createCoupon);
router.put('/update', updateCoupon);

router.delete('/', deleteCoupon);
router.post('/apply-coupon', hostedPageAuth, getCoupon); // @note Need AUTH., Caching the coupon



module.exports = router;