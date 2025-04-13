
const nodemailer = require("nodemailer");
const welcomeEmailTemplate = require("./templates/welcomeEmail");

const sendWelcomeMail = async(name, _receiverEmail) => {
    
    const template = welcomeEmailTemplate(name);
    
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
            to: _receiverEmail,
            subject: `Welcome to Resmic! Let's Get You Started 🚀`,
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
module.exports = {sendWelcomeMail}