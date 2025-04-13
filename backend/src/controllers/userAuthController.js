const { sendOTPService, verifyOTPService, resendOTPService, TestService } = require("../services/userAuthServices");

const handleResponse = (res, status, success, message, data=null) => {
    res.status(status).json({
        status,
        success,
        message,
        data
    })
}

const sendEmailOTP = async(req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }
    try {
        const sendOTP_ = await sendOTPService(email);
        handleResponse(res, 200, true, sendOTP_ )
    } catch (error) {
        if (error){
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);
        
    }
}
const reSendEmailOTP = async(req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }
    try {
        const sendOTP_ = await resendOTPService(email);
        handleResponse(res, 200, true, sendOTP_ )
    } catch (error) {
        if (error){
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);
        
    }
}

const verifyEmailOTP = async(req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: "email & otp is required" });
    }
    try {
        const {jwtToken, user_id } = await verifyOTPService(email, otp); // It returns the JWT token as string
          res.cookie('uid', jwtToken, { 
            httpOnly: true, // Prevents JavaScript from accessing the cookie
            secure: true, // Use this in production with HTTPS
            sameSite: 'None' // Prevents CS/RF attacks
          });
          const data = {"user_id": user_id}
        handleResponse(res, 200, true, "OTP Verified successfully", data );
    } catch (error) {
        if (error.message){
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);
        
    }
}


module.exports = { sendEmailOTP, verifyEmailOTP, reSendEmailOTP}