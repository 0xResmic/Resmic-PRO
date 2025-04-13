const { makePaymentService, getPaymentSessionService, updatePaymentService, generateTempWalletAddressService, updatePaymentSubscriptionService } = require("../services/makePaymentServices")


const handleResponse = (res, status, success, message, data = null) => {
    res.status(status).json({
        status,
        success,
        message,
        data,
    })
}

const makePayment = async (req, res, next) => {
    try {
        const user_id = req.headers['x-user-id'];
        let domain = req.headers['origin'];
        console.log("domain", domain)
        domain = ""
        const { amount, blockchain, token, title, description, wallet_address, blockchain_confirmation, redirect_url, cancel_url, webhook_url } = req.body;
        let result = await makePaymentService(user_id, domain, amount, blockchain, token, title, description, wallet_address, blockchain_confirmation, redirect_url, cancel_url, webhook_url);
        console.log("REs", result)
        handleResponse(res, 200, true, "Sessions created successfully", result);        
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error)
    }
}

const getPaymentSession = async (req, res, next) => {
    try {
        let {session_id} = req.query
        // let result = await getPaymentSessionService(req.params.id)
        let result = await getPaymentSessionService(session_id)
        handleResponse(res, 200, true, "Session reterived", result);
    } catch (error) {
        if (error.message === "Session not found") {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        if (error.message === "Session expired") {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        if (error.message === "Session already initiated") {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error)
    }
}

const updatePayment = async(req, res, next) => {
    try {
        const {session_id, payment_status, blockchain, token, transaction_hash, from_wallet_address, coupon_code, transactionURL} = req.body; 
        const result = await updatePaymentService(session_id, payment_status, blockchain, token, transaction_hash, from_wallet_address, coupon_code, transactionURL);
        handleResponse(res, 200, true, "Sessions updated successfully", result);
        
    } catch (error) {
        next(error);
    }
}

const updatePaymentSubscription = async(req, res, next) => {
    try {
        const {
            session_id,
            amount,
            blockchain,
            token,
            from_wallet_address,
            transaction_hash,
            txTime,
            status,} = req.body; 
            console.log("we are here")
        const result = await updatePaymentSubscriptionService(session_id);
        handleResponse(res, 200, true, "Payment Buy update successful", result);
        
    } catch (error) {
        next(error);
    }
}

const generateTempWalletAddress = async(payment_session, factory_contract_address, client_address, blockchain, token_address, amount) => {
    // const {payment_session, factory_contract_address, client_address, blockchain, token_address, amount} = req.body;
    try {
        console.log("we are here")
        const result = await generateTempWalletAddressService(payment_session, factory_contract_address, client_address, blockchain, token_address, amount);
        handleResponse(res, 200, true, "Temperory Wallet Generate Successfully", result);
        
    } catch (error) {
        if(error.message){
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);
    }
}


module.exports = { makePayment, getPaymentSession, updatePayment, generateTempWalletAddress, updatePaymentSubscription };