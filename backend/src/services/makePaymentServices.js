const { default: axios } = require('axios');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const emailQueue = require('../emails/queus/emailQueue');
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const { generateWalletAddress } = require('../blockchain/generateWalletAddress');


const makePaymentService = async (user_id, domain, amount, blockchain, token, title, description, wallet_address, blockchain_confirmation, redirect_url, cancel_url, webhook_url) => {
    const session_id = uuidv4(); 
    try {
        const createSession = await pool.query(`
                INSERT INTO paymentSession (session_id, user_id, amount, domain, title, description, token, blockchain, 
                payment_status, wallet_address, blockchain_confirmation, redirect_url, cancel_url, webhook_url) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING * 
            `, [session_id, user_id, amount, domain, title, description, token, blockchain, 
                'initiated', wallet_address, blockchain_confirmation, redirect_url, cancel_url, webhook_url]);
    
        if(createSession?.rowCount > 0){
            let payment_url = process.env.HOSTED_PAYMENT_PAGE_URL; // @note this is the hosted payment page URL.
            return {
                session_id: session_id,
                payment_url: `${payment_url}/${session_id}`,
            }
        }
        else {
            console.log("unable to store data.")
            return {
                session_id: "",
                payment_url: "",
            }
        }
    } catch (error) {
        console.log("error", error);
        throw new Error(error);
    }
}

const getPaymentSessionService = async(sessionId) => {
    try {
        let sessionData = await pool.query(`SELECT *, created_at AT TIME ZONE 'UTC' AS created_at_utc 
                FROM paymentSession 
                WHERE session_id = $1;`, [sessionId]);
        if (sessionData.rows.length === 0) {
            throw new Error("Session not found");
        }
        
        if (sessionData?.rows[0].payment_status === 'initiated') {
            const createdAt = sessionData?.rows[0].created_at_utc;
            const createdTime = new Date(createdAt);
            const currentTime = new Date();
            const timeDifference = currentTime - createdTime;
            const timeDifferenceInMinutes = timeDifference / (1000 * 60);
            console.log("timeDifferenceInMinutes", timeDifferenceInMinutes)
            if (timeDifferenceInMinutes > 30) {
                throw new Error("Session expired");
            }
            return sessionData?.rows[0]
        }
        else {
            
            throw new Error("Session already initiated");
        }
        
        
    } catch (error) {
        console.log("Error, Unable to reterive session.", error);
        throw error
    }
}

const updatePaymentService = async (sessionId, paymentStatus, blockchain, token, transactionHash, fromWalletAddress, coupon_code, transactionURL='' ) => {
    const currentTime = new Date()
    let webhook_url_;
    
    if (paymentStatus==="Completed" ||  paymentStatus==="Failed" ) {

        try {
            const queryUpdateSession = `
            UPDATE paymentSession
            SET payment_status = $1,
                updated_at = $2
            WHERE session_id = $3
            RETURNING user_id, amount, wallet_address, webhook_url;
            ;
        `
        const { rows: sessionRows } = await pool.query(queryUpdateSession, [paymentStatus, currentTime, sessionId]);
        if (sessionRows.length === 0) {
            throw new Error(`Session with ID ${sessionId} not found.`);
        }

        const { user_id, amount: amountUSD, wallet_address: toWalletAddress, webhook_url } = sessionRows[0];
        webhook_url_ = webhook_url
        const transactionId = uuidv4();
        
        const queryInsertTransaction = `
            INSERT INTO transactions (transaction_id, user_id, session_id, status, transaction_hash, created_at, amount, from_wallet_address,
                to_wallet_address, token, blockchain, coupon_code ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (session_id) DO NOTHING;;
        `
        const insertTransaction = await pool.query(queryInsertTransaction, [transactionId, user_id, sessionId, paymentStatus, transactionHash, currentTime,  amountUSD, fromWalletAddress, toWalletAddress, 
            token, blockchain, coupon_code
        ]);
        if(webhook_url!== "" && paymentStatus==="Completed"){
            let name = " "
            await sendUserUpdateRegardingPayment(sessionId, name, webhook_url, amountUSD, blockchain, token, fromWalletAddress, transactionHash,  currentTime, transactionURL, user_id);
        }
        if(webhook_url!== "" && paymentStatus==="Failed"){
            sendFailedWebHookResponse(sessionId, webhook_url, user_id)
        }
        
        try {
            const updateVolumeQuery = `UPDATE company SET 
                                        total_volume = total_volume + $1,
                                        txs_count = txs_count + 1 
                                        WHERE user_id = $2;`
            const updateCompanyVolume = await pool.query(updateVolumeQuery, [amountUSD, user_id]);
            
        } catch (error) {
            console.log("Unable to update the company details");
            console.log("Error,. ", error);
        }
        // Update the coupon code counter if it's used
        try {
            
            if (coupon_code){
                const updateCountQuery = `UPDATE coupon SET
                                           used_count = used_count + 1
                                           WHERE coupon_code = $1 AND user_id = $2;`
                const updateCounter = await pool.query(updateCountQuery, [coupon_code, user_id])
            }
            return "Data updated successfully"
        } catch (error) {
            console.log("Unable to add the coupen details");
            console.log("Error, ", error)
            
        }
            
        } catch (error) {
            console.log("Error inside IF", error);
            return false
        }
        
    }else {
        // Payment is unable to complete. (Failed)
        try {
            const queryUpdateSession = `
            UPDATE paymentSession
            SET payment_status = $1,
            updated_at = $2
            WHERE session_id = $3;
            `
            const updatePaymentSession = await pool.query(queryUpdateSession, ["Failed", currentTime, sessionId]);
            sendFailedWebHookResponse(sessionId, webhook_url_, user_id)
        } catch (error) {
            console.log("error here:: ", error)
        }
    }

}

/**
 * A function to send Update to client directly to user backend. Sending Webhook response.
 * 
 * @param {String} webhook_url Either Email or Webhook URL
 * @param {Float} amount 
 * @param {String} blockchain 
 * @param {String} token 
 * @param {String} from_wallet_address 
 * @param {String} transaction_hash 
 */
// Webhook endpoint
const sendUserUpdateRegardingPayment= async(session_id, name, webhook_url, amount, blockchain, token, from_wallet_address, transaction_hash='', currentTime, transactionURL='', user_id) => {
    
    let txTime = getFormattedDateTime();
    
    const isEmail = validator.isEmail(webhook_url);
    if (isEmail) {
        console.log("We are sending the email")
        // Send the email to user
        // webhook_url is Email here.
        // await sendPaymentMail(name,amount,blockchain, token, from_wallet_address, transaction_hash, webhook_url)
        let p = await emailQueue.add('sendPaymentMail', {name,amount,blockchain, token, from_wallet_address, transaction_hash, webhook_url, txTime, transactionURL});
    }
    else {
        const response_ = {
            session_id,
            amount, 
            blockchain, 
            token,
            from_wallet_address,
            transaction_hash,
            txTime,
            status:true
        }       
        // Creating signature.
        const getUserWebHookSecretQuery = `SELECT * FROM users WHERE user_id = $1;`;
        const getUserWebHookSecret = await pool.query(getUserWebHookSecretQuery, [user_id]); 

        const WEBHOOK_SECRET_KEY = getUserWebHookSecret?.rows[0]?.callback_secret;
        const signature = generateHMAC(response_, WEBHOOK_SECRET_KEY);
        // Send the POST request
        axios.post(webhook_url, response_, { 
            headers: { 
                'Content-Type': 'application/json',
                "X-Signature": signature,
             } 
        })
        .then((res) => {
            console.log('Response sent successfully:', res.data);
        })
        .catch((error) => {
            console.error('Error sending response:', error);
        });
    }
}
// Webhook endpoint
const sendFailedWebHookResponse = async (session_id, webhook_url, user_id) => {
    const isEmail = validator.isEmail(webhook_url);
    if(isEmail) {
        return
    }
    let txTime = getFormattedDateTime();
    const response_ = {
        session_id,
        txTime,
        status:false
    }
    // const WEBHOOK_SECRET_KEY = ""// Reterice it from the users DB
    // const signature = generateHMAC(response_, WEBHOOK_SECRET_KEY);
    const getUserWebHookSecretQuery = `SELECT * FROM users WHERE user_id = $1;`;
    const getUserWebHookSecret = await pool.query(getUserWebHookSecretQuery, [user_id]); 

    const WEBHOOK_SECRET_KEY = getUserWebHookSecret?.rows[0]?.callback_secret;
    const signature = generateHMAC(response_, WEBHOOK_SECRET_KEY);

    // Send the POST request
    axios.post(webhook_url, response_, { 
        headers: { 
            'Content-Type': 'application/json',
            "X-Signature": signature,
         } 
    })
    .then((res) => {
        console.log('Response sent successfully:', res.data);
    })
    .catch((error) => {
        console.error('Error sending response:', error);
    });
}

const generateTempWalletAddressService = async(blokchain, factory_contract_address, client_address) => {
    try {
       const {predictedAddress, salt} = await generateWalletAddress(blokchain, factory_contract_address, client_address) 
       return {predictedAddress, salt};
        
    } catch (error) {
        console.log("Error, Unable to reterive session.", error);
        throw error
    }
}

// A funciton to check the session exists, Valid, Cross checks the amount received from front-end and stored in the session.
const checkPaymentSessionServiceInternal = async(session_id, amount) =>{
    try {
        let sessionData = await pool.query(`SELECT *, created_at AT TIME ZONE 'UTC' AS created_at_utc 
                FROM paymentSession 
                WHERE session_id = $1;`, [session_id]);
        if (sessionData.rows.length === 0) {
            throw new Error("Session not found");
        }
        
        if (sessionData?.rows[0].payment_status === 'initiated') {
            const createdAt = sessionData?.rows[0].created_at_utc;
            const createdTime = new Date(createdAt);
            const currentTime = new Date();
            const timeDifference = currentTime - createdTime;
            const timeDifferenceInMinutes = timeDifference / (1000 * 60);
            // console.log("timeDifferenceInMinutes", timeDifferenceInMinutes)
            if (timeDifferenceInMinutes > 30) {
                throw new Error("Session expired");
            }
            
            const dbAmount = sessionData?.rows[0]?.amount_after_coupon !== null 
                ? parseFloat(sessionData?.rows[0]?.amount_after_coupon) 
                : parseFloat(sessionData?.rows[0]?.amount);

            // if (parseFloat(sessionData?.rows[0].amount) > parseFloat(amount)){
            if (dbAmount > parseFloat(amount)){
                throw new Error("Amount mismatch");
            }
            
            return true;
        }
        else {
            return false;
            throw new Error("Session already initiated");
        }
        
        
    } catch (error) {
        console.log("Error, Unable to reterive session.", error);
        throw error
    }
}

const getFormattedDateTime = () => {
    const now = new Date();
    return now.toLocaleString("en-US", { 
        timeZone: "UTC", // Use "Asia/Kolkata" for IST or other time zones
        year: "numeric", 
        month: "short", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: false // Set to false for 24-hour format
    });
};


const updatePaymentSubscriptionService = async(session_id) => {
    
    const getDetailsQuery = `SELECT * FROM paymentSession WHERE session_id = $1;`
    const getDetails = await pool.query(getDetailsQuery, [session_id])
    let user_id = getDetails.rows[0]?.user_id
    const getDetailsFromTempData = await pool.query(`SELECT * FROM BuySubscriptionTempData WHERE user_id = $1`,[user_id])
    let tier = getDetailsFromTempData.rows[0]?.tier
    let month = getDetailsFromTempData.rows[0]?.subscriptionmonth
    let transaction_id = session_id
    console.log("transaction_id", transaction_id)

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


// Helper Function
// Generates the signature for the data, 
function generateHMAC(payload, secretKey) {
    const data = JSON.stringify(payload);
    const hmac = CryptoJS.HmacSHA256(data, secretKey);
    return hmac.toString(CryptoJS.enc.Hex);
  }

module.exports = { makePaymentService, getPaymentSessionService, updatePaymentService, generateTempWalletAddressService, checkPaymentSessionServiceInternal, updatePaymentSubscriptionService };