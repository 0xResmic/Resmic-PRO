
const nodemailer = require("nodemailer");
const OTPTemplate = require("./templates/emailOTP");

const sendOTPMail = async(name, email, otp) => {
    
    const template = OTPTemplate(name, email, otp);
    
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:465,
            secure:true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.MAILPASS
            }
        })
        const info = await transporter.sendMail({
			from: process.env.FROM_EMAIL,
            to: email,
            subject: `Login OTP | Resmic`,
            html: template
        });
        console.log(" info", info)
        if(info){
            return true;
        }
        else {
            return false;
        }
        
    } catch (error) {
        console.log("Error", error)
		return false;
    }
}

// sendMail("Aditya", "adityakaklij11@gmail.com", "451567")
module.exports = {sendOTPMail}