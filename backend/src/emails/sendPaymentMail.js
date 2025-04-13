const nodemailer = require("nodemailer");
const paymentReceivedTemplate = require("./templates/paymentReceived");

const sendPaymentMail = async(name,amount,blockchain, token, walletAddress, transactionHash, _receiverEmail, txTime, transactionURL) => {
    let blockchain_ = blockchain.toUpperCase();
    const template = paymentReceivedTemplate(name,amount, blockchain_, token, walletAddress, transactionHash, txTime='', transactionURL='')
    
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:465,
            secure:true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.MAILPASS,
            }
        })
        const info = await transporter.sendMail({
			from: process.env.FROM_EMAIL,
            to: _receiverEmail,
            subject: `Paymet received $${amount} (via Resmic)`,
            // text: mailText,
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

// sendMail("fromWalletAddress", "blockchain", "token", "transactionHash", 356, "adityakaklij11@gmail.com")
module.exports = {sendPaymentMail}