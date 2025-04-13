const pool = require('../config/db');
const {nanoid} = require('nanoid');
const { v4: uuidv4 } = require('uuid');

const emailQueue = require('../emails/queus/emailQueue');



const createUserService = async(email, name, domain ) => {
    let user_id = nanoid(7);
    try {
        let result = await pool.query('INSERT INTO users (user_id, email, name, domain) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, email, name, domain]);
        let addCompany = await pool.query('INSERT INTO company (user_id, email, name) VALUES ($1, $2, $3)', [user_id, email, ""])
        await emailQueue.add('sendWelcomeMail', {name, email});
        // await sendWelcomeMail(name, email)
        return result.rows[0];
        
    } catch (error) {
        throw new Error
    }
}

const delteUserService = async(user_id, email) => {
    if(email){
        let result = await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
        return result.rows[0];
    }
    else {
        let result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [user_id]);
        return result.rows[0];
    }
}

const updateUserService = async(user_id, email, name, domain, callback_url) => {

        if (!user_id && !email) {
            throw new Error("user_id' or email is required to update a user.")
        }
    
        let query = "UPDATE users SET ";
        let queryParams = [];
        let fieldCount = 1;
    
        // Dynamically adding fields to update based on input
        if (name) {
            query += `name = $${fieldCount}, `;
            queryParams.push(name);
            fieldCount++;
        }
    
        if (email) {
            query += `email = $${fieldCount}, `;
            queryParams.push(email);
            fieldCount++;
        }
    
        if (domain) {
            query += `domain = $${fieldCount}, `;
            queryParams.push(domain);
            fieldCount++;
        }
    
        if (callback_url) {
            query += `callback_url = $${fieldCount}, `;
            queryParams.push(callback_url);
            fieldCount++;
        }
    
        // Removing the last comma and space
        query = query.slice(0, -2);
    
        if (email){
            query += ` WHERE email = $${fieldCount}`;
            queryParams.push(email);
            fieldCount ++;
        }
    
        try {
            // Execute the query
            const result = await pool.query(query, queryParams);
    
            if (result.rowCount === 0) {
                return result.rows[0];
            }
    
            return result.rows[0];
        } catch (error) {
            console.error("Error updating user:", error);
        }
    
}

const getAllUsersService = async() => {
    let result = await pool.query('SELECT * FROM users');
    return result.rows;
}
const getUserByEmailService = async(email) => {
    let result = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
    console.log("first,", result.rows)
    if(result.rowCount === 0){
        throw new Error("User not found")
    }
    const data = result.rows[0];
    const res = {
        user_id: data.user_id,
        email: data.email,
        name: data.name,
        domain: data.domain,
        joined_on: data.joined_on,
        api_key: data.api_key,
        api_created_on: data.api_created_on,
        api_expiry: data.api_expiry,
        tier: data.tier,
        kyc_status: data.kyc_status,
        isactive: data.isactive
    }

    return res;
}
const getUserByIdService = async(user_id) => {
    let result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if(result.rows.length === 0){
        throw new Error("User not found")
    }
    const data = result.rows[0];
    const res = {
        user_id: data.user_id,
        email: data.email,
        name: data.name,
        domain: data.domain,
        joined_on: data.joined_on,
        api_key: data.api_key,
        api_created_on: data.api_created_on,
        api_expiry: data.api_expiry,
        tier: data.tier,
        kyc_status: data.kyc_status,
        isactive: data.isactive
    }

    return res;
}

const  addCompanyDetailsService= async(email, name, description, logo, support_email, valid_id, mobile, support_mobile, address, country, company_identification_no, tax_number,currency) => {
    // @note Handle the edge cases. 
    try {
        const getUserId = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const userId = getUserId.rows[0]?.user_id;
        console.log("userId", userId)
        const insertdDataQuery = `
            INSERT INTO company (user_id, name, description, logo, email, support_email, valid_id, mobile, support_mobile, address, country, company_identification_no, tax_number,currency) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING user_id, name, description, logo, email;
        `
        const insertCompanuDetails = await pool.query(insertdDataQuery, [userId, name, description, logo, email, support_email, valid_id, mobile, support_mobile, address, country, company_identification_no, tax_number, currency])
        console.log("insertCompanuDetails", insertCompanuDetails.rows)
        if(insertCompanuDetails.rows.length === 0) {
            throw new Error("User Already Exists");
        }
        return insertCompanuDetails.rows[0];
    } catch (error) {
        console.log("Error while inserting", error);
        throw new Error("User Already Exists");
    }
}
const  updateCompanyDetailsService= async(user_id, email, name, description, logo, support_email, valid_id, mobile, support_mobile, address, country, 
    company_identification_no, tax_number,currency, other) => {
    if (!user_id && !email) {
            
        throw new Error("user_id' or email is required to update a user.")
    }

    let query = "UPDATE company SET ";
    let queryParams = [];
    let fieldCount = 1;

    // Dynamically adding fields to update based on input
    if (name) {
        query += `name = $${fieldCount}, `;
        queryParams.push(name);
        fieldCount++;
    }
    if (email) {
        query += `email = $${fieldCount}, `;
        queryParams.push(email);
        fieldCount++;
    }
    if (other) {
        query += `other = $${fieldCount}, `;
        queryParams.push(other);
        fieldCount++;
    }
    if (description) {
        query += `description = $${fieldCount}, `;
        queryParams.push(description);
        fieldCount++;
    }
    if (logo) {
        query += `logo = $${fieldCount}, `;
        queryParams.push(logo);
        fieldCount++;
    }

    if (support_email) {
        query += `support_email = $${fieldCount}, `;
        queryParams.push(support_email);
        fieldCount++;
    }
    if (valid_id) {
        query += `valid_id = $${fieldCount}, `;
        queryParams.push(valid_id);
        fieldCount++;
    }
    if (mobile) {
        query += `mobile = $${fieldCount}, `;
        queryParams.push(mobile);
        fieldCount++;
    }
    if (support_mobile) {
        query += `support_mobile = $${fieldCount}, `;
        queryParams.push(support_mobile);
        fieldCount++;
    }
    if (country) {
        query += `country = $${fieldCount}, `;
        queryParams.push(country);
        fieldCount++;
    }
    if (address) {
        query += `address = $${fieldCount}, `;
        queryParams.push(address);
        fieldCount++;
    }
    if (company_identification_no) {
        query += `company_identification_no = $${fieldCount}, `;
        queryParams.push(company_identification_no);
        fieldCount++;
    }
    if (tax_number) {
        query += `tax_number = $${fieldCount}, `;
        queryParams.push(tax_number);
        fieldCount++;
    }
    if (currency) {
        query += `currency = $${fieldCount}, `;
        queryParams.push(currency);
        fieldCount++;
    }


    // Removing the last comma and space
    query = query.slice(0, -2);

    // Adding the WHERE clause for user_id
    if (user_id){
        query += ` WHERE user_id = $${fieldCount}`;
        queryParams.push(user_id);
        fieldCount ++;
    }

    try {
        // Execute the query
        const result = await pool.query(query, queryParams);

        if (result.rowCount === 0) {
            return result.rows[0];
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error updating user:", error);
    }
}

// The following endpoint will be called after user makes payment.
const buySubscriptionService = async(user_id, tier, month, transaction_id) => {
    const updateUserPaymentQuery = `
        UPDATE users
        SET isActive = $1,
            tier = $2,
            kyc_status = $3
        WHERE user_id = $4
        RETURNING *;
    `
    const updateUserActive = await pool.query(updateUserPaymentQuery, [true, tier, true, user_id ]);
    const email = updateUserActive.rows[0].email;
    
    const currentTime = new Date();
    let nextMonthTime = new Date(currentTime);
    nextMonthTime.setMonth(nextMonthTime.getMonth() + month);

    const updateCompanyPaymentDetailsQuery = `
    UPDATE company
    SET 
        total_fees_collected = total_fees_collected + $1,
        last_payment = $2,
        valid_till = CASE 
                        WHEN valid_till IS NULL THEN $3
                        ELSE valid_till + CAST($4 AS INTERVAL)
                    END
    WHERE user_id = $5;
    `
    let userAmount;
    if (tier === 1) {
        userAmount = process.env.TIER1 * month;
    }
    else if (tier === 2) {
        userAmount = process.env.TIER2 * month;
    }
    else {
        userAmount = process.env.TIER3 * month;
    }
    
    const updattCompanyDates = await pool.query(updateCompanyPaymentDetailsQuery, [userAmount, currentTime, nextMonthTime, `${month} month`, user_id ]);

    let payment_id =  uuidv4();
    const paymentHistoryQuery  = `INSERT INTO paymenthistory (payment_id, user_id, email, created_at, amount, transaction_id, start_date, end_date, tier ) 
                                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING * ;`
    const addPaymentHistory = await pool.query(paymentHistoryQuery, [payment_id, user_id, email, currentTime, userAmount, transaction_id, currentTime, nextMonthTime, tier ])
    let name = addPaymentHistory.rows[0].name || " ";
    // await sendThanksForSubscription(name, email)
    await emailQueue.add('sendThanksForSubscription', {name, email});

    return "Payment Details updated successfully";
}

const getFreeTrialPlanService = async(user_id) => {
    const currentTime = new Date();
    let next20Days = new Date(currentTime);
    next20Days.setDate(next20Days.getDate() + 20);

    const updateCompanyPaymentDetailsQuery = `
    UPDATE company
    SET 
        free_activated = true,
        valid_till = CASE 
                        WHEN valid_till IS NULL THEN $1::TIMESTAMP
                    END
    WHERE user_id = $2 AND free_activated = false RETURNING *;
    `
    const updattCompanyDates = await pool.query(updateCompanyPaymentDetailsQuery, [next20Days, user_id ]);
    if (updattCompanyDates.rows.length === 0){
        throw new Error ("Free trial not activated. Either already activated or company not found")
    }
    const updateUserPaymentQuery = `
        UPDATE users
        SET isActive = $1,
            tier = $2,
            kyc_status = $3
        WHERE user_id = $4
        RETURNING *;
    `
    const updateUserActive = await pool.query(updateUserPaymentQuery, [true, 99, true,user_id ]);
    let payment_id =  uuidv4();

    const updateFreePaymentQuery = `INSERT INTO paymenthistory (payment_id, user_id, email, created_at, amount, transaction_id, start_date, end_date, tier ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING * ;`
    
    let name = updateUserActive.rows[0]?.name;
    let email = updateUserActive.rows[0]?.email;
    const updateUserPaymentHistory = await pool.query(updateFreePaymentQuery, [payment_id, user_id, email, currentTime, 0, payment_id, currentTime, next20Days, 99  ]);
    // let sendEmail = await sendFreeTrialStarted(name, email)
    await emailQueue.add('sendFreeTrialStarted', {name, email});
    return "Free trial started";
}

const getPlanDetailsService = async(user_id) => {
    try {
        const query = `SELECT * from paymenthistory WHERE user_id = $1 ORDER BY created_at DESC;`
        const result = await pool.query(query, [user_id]);
        console.log("result", result.rows)
        if(result.rows.length === 0){
            // throw new Error("No Result found")
            return []
        }
        return result.rows;
    } catch (error) {
        console.log(":Error:",error)
        throw new Error(error)
    }
}

const getCompanyDetailsByIdService = async(user_id) => {
    let result = await pool.query('SELECT * FROM company WHERE user_id = $1;', [user_id]);
    if(result.rowCount === 0){
        throw new Error("Details not found")
    }
    const data = result.rows[0];
    const res = {
        user_id: data.user_id,
        email: data.email,
        name: data.name,
        domain: data.domain,
        joined_on: data.joined_on,
        api_key: data.api_key,
        api_created_on: data.api_created_on,
        api_expiry: data.api_expiry,
        tier: data.tier,
        kyc_status: data.kyc_status,
        isactive: data.isactive
    }

    return data;
}

const tempUpdateSubscriptionDetailsService = async(user_id,tier, month) => {
    
    try {
        
        const updateTempDetailsQuery = `INSERT INTO BuySubscriptionTempData (user_id, tier, subscriptionmonth) VALUES ($1, $2, $3) RETURNING * ;`
        const updateTempDetails= await pool.query(updateTempDetailsQuery, [user_id,tier, month]);
        return "Details Updated successfully";
    } catch (error) {
        console.log("Error", error);
        throw new Error
    }
}
const getTransactionBywaletAddressService = async(subscription) => {}
const  editCompanyDetailsService= async(subscription) => {}
const editTransactionService = async(subscription) => {}

module.exports = { delteUserService, updateUserService, createUserService, getUserByIdService, getAllUsersService, getUserByEmailService,
    buySubscriptionService, getTransactionBywaletAddressService, addCompanyDetailsService, editTransactionService, editCompanyDetailsService,
    updateCompanyDetailsService, getFreeTrialPlanService, getPlanDetailsService, getCompanyDetailsByIdService, tempUpdateSubscriptionDetailsService
}