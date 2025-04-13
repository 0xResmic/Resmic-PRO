const pool = require('../config/db');
const {nanoid} = require('nanoid');
const { v4: uuidv4 } = require('uuid');



const createCouponService = async(userId, coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date) => {
    try {
        let coupon_id =  uuidv4();
        
        const query = `INSERT INTO coupon (coupon_id, user_id, coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`
        const result = await pool.query(query, [coupon_id, userId, coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date, true]);
        return "Coupon created successfully";
    } catch (error) {
        console.log(":error",error)
        throw new Error(error)
    }
}

const updateCouponService = async(coupon_id, coupon_code, discount_type, discount_value, usage_limit, min_order, start_date, end_date, is_active, used_count) => {
    
    if(!coupon_id){
        throw new Error("Coupon Id is required");
    }
    let query = "UPDATE coupon SET ";
    let queryParams = [];
    let fieldCount = 1;
    try {
        
        if(coupon_code){
            query += `coupon_code = $${fieldCount}, `;
            queryParams.push(coupon_code);
            fieldCount++;
        }
        if(discount_type){
            query += `discount_type = $${fieldCount}, `;
            queryParams.push(discount_type);
            fieldCount++;
        }
        if(discount_value){
            query += `discount_value = $${fieldCount}, `;
            queryParams.push(discount_value);
            fieldCount++;
        }
        if(usage_limit){
            query += `usage_limit = $${fieldCount}, `;
            queryParams.push(usage_limit);
            fieldCount++;
        }
        if(min_order){
            query += `min_order = $${fieldCount}, `;
            queryParams.push(min_order);
            fieldCount++;
        }
        if(start_date){
            query += `start_date = $${fieldCount}, `;
            queryParams.push(start_date);
            fieldCount++;
        }
        if(end_date){
            query += `end_date = $${fieldCount}, `;
            queryParams.push(end_date);
            fieldCount++;
        }
        if(is_active){
            query += `is_active = $${fieldCount}, `;
            queryParams.push(is_active);
            fieldCount++;
        }
        if(used_count){
            query += `used_count = $${fieldCount}, `;
            queryParams.push(used_count);
            fieldCount++;
        }

        // Removing the last comma and space
        query = query.slice(0, -2);

        if(coupon_id){
            query += ` WHERE coupon_id = $${fieldCount}`;
            queryParams.push(coupon_id);
            fieldCount++;
        }
        const updateData = await pool.query(query, queryParams);
        return "Coupon updated successfully";
    } catch (error) {
        console.log(":error",error)
        throw new Error(error)
    }
}

const deleteCouponService = async(coupon_id) => {
    try {
        const query = `DELETE FROM coupon WHERE coupon_id = $1;`
        const result = await pool.query(query, [coupon_id]);
        return "Coupon Deleted successfully";
    } catch (error) {
        console.log(":error",error)
        throw new Error(error)
    }
}

const getCouponService = async(coupon_code, user_id, user_order_value, session_id) => {
    if(!coupon_code || !user_id){
        throw new Error("Coupon ID or User ID is messing")
    }
    try {
        
        const query = `SELECT * from coupon WHERE coupon_code = $1 AND user_id = $2;`
        const result = await pool.query(query, [coupon_code, user_id]);
        console.log("result", result.rows)
        if(result.rows.length === 0){
            // throw new Error("Coupon Doesn Not Exist")
            return []
        }

        const sessionQuery = `select * from paymentsession where session_id = $1`
        const getSessionDetails = await pool.query(sessionQuery, [session_id])
        const amountInSession = getSessionDetails.rows[0].amount
        if(getSessionDetails.rows[0].coupon_code === coupon_code) {

            throw new Error("Already Applied");
        }

        const coupon = result.rows[0]
        if(!coupon?.is_active){
            throw new Error("Coupon is Expired");
        }
        if(coupon?.usage_limit <= coupon?.used_count){
            throw new Error("Coupon used maximum time");
        }
        if(parseFloat(coupon?.min_order) > parseFloat(user_order_value)){
            console.log("coupon?.min_order", parseFloat(coupon?.min_order))
            console.log("user_order_value", user_order_value)
            throw new Error(`Minimum order value is ${coupon?.min_order}`);
        }
        const currentTime = new Date();
        if(coupon?.end_date <= currentTime){
            throw new Error(`Coupon is Expired`);
        }
        // Update the Session.
        const paymentSessionQuery = `UPDATE paymentSession 
                                    SET is_coupon_applied = $1, 
                                        coupon_code = $2, 
                                        amount_after_coupon = $3
                                        WHERE session_id = $4
                                        RETURNING *`
        let amountAfterCoupen = 0;
        if (coupon.discount_type === 0){
            // Fixed discount
            amountAfterCoupen = (amountInSession - coupon.discount_value)
        }
        else {
            // Percentage Discount
            let discount_amount =  (amountInSession * coupon.discount_value ) / 100
            amountAfterCoupen = amountInSession - discount_amount;
        }
        const updateQuery  = pool.query(paymentSessionQuery, [true, coupon?.coupon_code,amountAfterCoupen,  session_id]); 
        
        
        return result.rows;
    } catch (error) {
        console.log(":error",error)
        throw new Error(error)
    }
}

const getTxsByCouponService = async(coupon_code, userId) => {
    try {
        const query = `SELECT * from transactions WHERE coupon_code = $1 AND user_id = $2 ORDER BY created_at DESC;`
        const result = await pool.query(query, [coupon_code, userId]);
        console.log("result", result.rows)
        if(result.rows.length === 0){
            // throw new Error("Details not found")
            return []
        }
        return result.rows;
    } catch (error) {
        console.log(":error",error)
        throw new Error(error)
    }
}

const getAllCouponByUserService = async(user_id) => {
    try {
        // const query = `SELECT * from users RETURNING *;`
        const query = `SELECT * from coupon WHERE user_id = $1 ORDER BY created_at DESC;`
        const result = await pool.query(query, [user_id]);
        console.log("result", result.rows)
        if(result.rows.length === 0){
            // throw new Error("Details not found")
            return []
        }
        return result.rows;
    } catch (error) {
        console.log(":error",error)
        throw new Error(error)
    }
}

module.exports = {createCouponService, updateCouponService, getCouponService, getTxsByCouponService, deleteCouponService, getAllCouponByUserService
}