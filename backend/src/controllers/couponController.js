
const { createCouponService, getCouponService, deleteCouponService, getTxsByCouponService, updateCouponService, getAllCouponByUserService } = require("../services/couponServices");


const handleResponse = (res, status, success, message, data = null) => {
    res.status(status).json({
        status,
        success,
        message,
        data,
    })
}
//Discount type 0: Fixed in USD, 1: Percentage
const createCoupon = async (req, res, next) => {
    const {user_id, coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date} = req.body;
    console.log("req.user", req.user)
    // const userId = req.user.user_id;
    // const userId = "ZAJ5_Bg";
    const userId = user_id;
    try {
        const createCoupom = await createCouponService(userId, coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date);
        handleResponse(res, 201, true, "Company Created Successfully", createCoupom);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);   
    }
}

const updateCoupon = async (req, res, next) => {
    const {coupon_id, coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date, is_active, used_count} = req.body;
    try {
        const updateUser = await updateCouponService(coupon_id, coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date, is_active, used_count);
        handleResponse(res, 201, true, "Coupon Updated Successfully", updateUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        
        next(error);   
    }
}

const deleteCoupon = async (req, res, next) => {
    const {coupon_id} = req.body;
    try {
        const updateUser = await deleteCouponService(coupon_id);
        handleResponse(res, 204, true, "Coupon deleted Successfully", updateUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        
        next(error);   
    }
}


const getCoupon = async (req, res, next) => {
    // session_id is PaymentSession ID.
    // If the Token is valid, we update the token immediately.
    const {coupon_code, user_id, amount, session_id} = req.body;
    try {
        const updateUser = await getCouponService(coupon_code, user_id, amount, session_id);
        handleResponse(res, 200, true, "Coupon Reterive Successfully", updateUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        
        next(error);   
    }
}


const getTxsByCoupon = async (req, res, next) => {
    const {coupon_code} = req.body;
    // const userId = req.user.user_id;
    const userId = "ZAJ5_Bg";
    try {
        const response = await getTxsByCouponService(coupon_code, userId);
        handleResponse(res, 200, true, "Data reterived Successfully", response);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        
        next(error);   
    }
}

const getAllCouponByUser = async (req, res, next) => {
    const {user_id} = req.query;
    try {
        const coupones = await getAllCouponByUserService(user_id);
        handleResponse(res, 200, true, "Coupon reterived Successfully", coupones);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        
        next(error);   
    }
}

module.exports = {createCoupon, getCoupon, deleteCoupon, updateCoupon, getTxsByCoupon, getAllCouponByUser}