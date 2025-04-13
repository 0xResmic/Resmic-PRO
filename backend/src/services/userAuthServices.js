const pool = require('../config/db');
const {nanoid} = require('nanoid');
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');

const emailQueue = require('../emails/queus/emailQueue');
const otpGenerator = require('otp-generator');



const sendOTPService = async(email) => {
    const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    // First Check if the OTP for the email already exists.
    const getUerOtpsQuery = `
        SELECT * FROM userOTP WHERE email = $1;
    `
    const getUerOtps = await pool.query(getUerOtpsQuery, [email]);
    if(getUerOtps.rowCount!== 0) {

        const createdAtUTC = new Date(getUerOtps.rows[0]?.created_at + "Z"); 
        let timeElapsed = (new Date() - new Date(createdAtUTC)) > 5 * 60 * 1000;
        if (!timeElapsed ) {
            throw new Error("Email already Sent!");
        }
    }

    try {
        const saveOtpQuery = `
            INSERT INTO userOTP (email, otp) VALUES ($1, $2);
        `
        const appendData = await pool.query(saveOtpQuery, [email, OTP]);
        if (appendData.rowCount === 0) {
            throw new Error;
        }
        console.log("OTP", OTP);
        await emailQueue.add('sendOTPMail', { email, otp:OTP});

        return "Email send successfully";
        
    } catch (error) {
        console.log("error", error)
        throw new Error;
        
    }

    
}

const resendOTPService = async(email) => {
    const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const getUerOtpsQuery = `
        SELECT * FROM userOTP WHERE email = $1;
    `
    try {
        const getUerOtps = await pool.query(getUerOtpsQuery, [email]);
        if(getUerOtps.rowCount!== 0) {
            const createdAtUTC = new Date(getUerOtps.rows[0]?.created_at + "Z"); 
            let timeElapsed = (new Date() - new Date(createdAtUTC)) > 3 * 60 * 1000
            console.log("new Date(createdAtUTC)",new Date(createdAtUTC))
            let waitTime =  3 - (new Date() - new Date(createdAtUTC)) / 60000;
            if (!timeElapsed){
                return `Please wait ${waitTime.toFixed(2)} minutes more.`;
            }

        }

        const deleteOTPQuery = `DELETE from userOTP WHERE email = $1;`
        const deleteOTP = await pool.query(deleteOTPQuery, [email]);
        const saveOtpQuery = `
            INSERT INTO userOTP (email, otp) VALUES ($1, $2);
        `
        const appendData = await pool.query(saveOtpQuery, [email, OTP]);
        if (appendData.rowCount === 0) {
            throw new Error;
        }
        await emailQueue.add('sendOTPMail', { email, otp:OTP});

        return "Email send successfully";
        
    } catch (error) {
        console.log("error", error)
        throw new Error;
        
    }

    
}

const verifyOTPService = async(email, otp) => {
    const query = `
        SELECT * FROM userOTP
            WHERE email = $1 AND otp = $2 and expires_at > NOW();
    `
    try {
        const getOtpDetails = await pool.query(query, [email, otp]);
        if(getOtpDetails.rowCount === 0){
            throw new Error("Unable to login user");
        }
        const queryUser = `
            SELECT * FROM users WHERE email = $1;
        `
        
        // New User creation.
        const checkUserExists = await pool.query(queryUser, [email]);
        let user_id = checkUserExists.rows[0]?.user_id;
        if(checkUserExists.rowCount === 0) {
            const createUser = await createUserService(email);
            user_id = createUser;
        }

        // Delete OTP
        const deleteOTPQuery = `DELETE from userOTP WHERE email = $1 AND otp = $2;`
        const deleteOTP = await pool.query(deleteOTPQuery, [email, otp]);
        
        // Create JWT token;
        var jwtToken = jwt.sign({ user_id, email }, process.env.JWTSECRET, { expiresIn: "40d" });
        return {jwtToken, user_id};
        
    } catch (error) {
        console.log("Error: ", error);
        throw new Error(error)
    }
}

const createUserService = async(email) => {
    let user_id = nanoid(7);
    let result = await pool.query('INSERT INTO users (user_id, email, name, domain) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, email, '', '']);
    let addCompany = await pool.query('INSERT INTO company (user_id, email, name) VALUES ($1, $2, $3) RETURNING *', [user_id, email, '']);
    let name = '';
    await emailQueue.add('sendWelcomeMail', {name, email});
    return user_id;
}

module.exports = { sendOTPService, verifyOTPService, resendOTPService} ;