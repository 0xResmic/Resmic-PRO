const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const redisClient = require('../config/redisClient');


// Function to delete the cache data.
async function invalidateCache(user_id) {
    const cacheKey = `user_id:${user_id}`;
    await redisClient.del(cacheKey);
}

// api_key: Name of API_KEY by the user.
const generateAPIKeyService = async(user_id, api_key) => {
    
    let API_KEY = uuidv4(); 
    const hash = await bcrypt.hashSync(API_KEY, 10);
    const api_created_on = new Date();

    await invalidateCache(user_id);// Deletes the KEY if exists.


    // const check_key = await bcrypt.compareSync(API_KEY, hash);
    // console.log("check_key", check_key)

    const checkUserBoughtPlanQuery = `SELECT * FROM users WHERE user_id = $1`;
    const isPlanBought = await pool.query(checkUserBoughtPlanQuery, [user_id])
    if (isPlanBought.rows[0].tier === 0){
        throw new Error("No valid plan exists")
    }
    try {
        const query = `
            UPDATE users 
            SET 
                api_key = $1,
                api_secret = $2,
                api_created_on = $3,
                is_api_generated = true
                WHERE user_id = $4 AND is_api_generated = false AND isActive = true
            RETURNING *;
        `
        let result = await pool.query(query, [api_key, hash, api_created_on, user_id]);
        if(result.rowCount === 0) {
            throw new Error("Users doesn not exist or API already exists");
        }
        let key = {
            user_id: result.rows[0]?.user_id,
            api_key:api_key,
            api_secret:API_KEY
        }
        return key; 
        
    } catch (error) {
        throw new Error(error)
    }
}

const deleteAPIKeyService = async(user_id) => {
    const query = `
        UPDATE users 
        SET 
            api_key = $1,
            api_secret = $2,
            api_created_on = $3,
            is_api_generated = $4
    WHERE user_id = $5
        RETURNING *;
    `
    let result = await pool.query(query, [null, null, null, false, user_id]);
    let key = {
        user_id: result.rows[0]?.user_id,
    }
    await invalidateCache(user_id);// Deletes the KEY if exists.
    return key; 
}

const getAPIKeyService = async(user_id) => {
    let result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    result = result.rows[0];
    console.log("result", result)
    const data = {
        user_id: result?.user_id,
        api_key: result?.api_key,
        api_created_on: result?.api_created_on,
        api_expiry: result?.api_expiry,
        tier: result?.tier,
        isactive: result?.isactive,
        kyc_status: result?.kyc_status,
        callback_secret: result?.callback_secret,
        callback_secret_created_on: result?.callback_secret_created_on
    }
    return data; 
}

const updateAPIKeyService = async(email) => {
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows; 
}


const generateWebhookSecretService = async(user_id) => {

    let SECRET = uuidv4(); 
    const secretCreatedOn = new Date();

    await invalidateCache(user_id);// Deletes the KEY if exists.
    // const check_key = await bcrypt.compareSync(API_KEY, hash);
    // console.log("check_key", check_key)

    const checkUserBoughtPlanQuery = `SELECT * FROM users WHERE user_id = $1`;
    const isPlanBought = await pool.query(checkUserBoughtPlanQuery, [user_id])
    if (isPlanBought.rows[0].tier === 0){
        throw new Error("No valid plan exists")
    }
    try {
        const query = `
            UPDATE users 
            SET 
                callback_secret = $1,
                callback_secret_created_on = $2
                WHERE user_id = $3
            RETURNING *;
        `
        let result = await pool.query(query, [SECRET, secretCreatedOn, user_id]);
        if(result.rowCount === 0) {
            throw new Error("Users doesn not exist or API already exists");
        }
        let key = {
            user_id: result.rows[0]?.user_id,
            webbhook_secret:SECRET
        }
        return key; 
        
    } catch (error) {
        throw new Error(error)
    }
}

const deleteWebhookSecretService = async(user_id) => {
    const query = `
        UPDATE users 
        SET 
            callback_secret = $1
    WHERE user_id = $2
        RETURNING *;
    `
    let result = await pool.query(query, [null, user_id]);
    let key = {
        user_id: result.rows[0]?.user_id,
    }
    await invalidateCache(user_id);// Deletes the KEY if exists.
    return key; 
}

module.exports = { getAPIKeyService, generateAPIKeyService, updateAPIKeyService, deleteAPIKeyService, generateWebhookSecretService, deleteWebhookSecretService}