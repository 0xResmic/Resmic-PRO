// Standard output

const { createUserService, getAllUsersService, updateUserService, delteUserService, getUserByIdService, getUserByEmailService, buySubscriptionService, addCompanyDetailsService, updateCompanyDetailsService, getFreeTrialPlanService, getPlanDetailsService, getCompanyDetailsByIdService, tempUpdateSubscriptionDetailsService } = require("../services/userServices");

const handleResponse = (res, status, success, message, data = null) => {
    res.status(status).json({
        status,
        success,
        message,
        data,
    })
}

const createUser = async (req, res, next) => {
    const {name, email, domain} = req.body;
    if (!name || !email || !domain) {
        return res.status(400).json({
            success: false,
            message: "'name', 'email', 'domain' must be provided."
        });
    }
    else{
        try {
            const newUser = await createUserService(email, name, domain);
            console.log("newUser", newUser)
            handleResponse(res, 201, true, "User Created Successfully", newUser);
        } catch (error) {
            next(error);   
        }
    }
}

const deleteUser = async (req, res, next) => {
    const {user_id, email} = req.body;
    if (!user_id && !email) {
        return res.status(400).json({
            success: false,
            message: "Either 'user_id' or 'email' must be provided."
        });
    }
    else{
        try {
            const deleteUser = await delteUserService(user_id, email);
            handleResponse(res, 201, true, "User deleted Successfully", deleteUser);
        } catch (error) {
            next(error);   
        }
    }
}
const getAllUser = async (req, res, next) => {
    try {
        const newUser = await getAllUsersService();
        handleResponse(res, 200, true, "User fetched", newUser);
    } catch (error) {
        next(error);   
    }
}
const getUserById = async (req, res, next) => {
    // const userId = req.user.user_id;
    const { user_id } = req.query;
    try {
        const newUser = await getUserByIdService(user_id);
        handleResponse(res, 200, true, "User retrieved", newUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);   
    }
}
const getUserByEmail = async (req, res, next) => {
    const { email } = req.query;
    console.log("ererer")
    try {
        const newUser = await getUserByEmailService(email);
        handleResponse(res, 200, true, "User retrieved", newUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);   
    }
}
const updateUser = async (req, res, next) => {
    const { user_id, email, name, domain, callback_url } = req.body;
    try {
        const updateUser = await updateUserService(user_id, email, name, domain, callback_url);
        handleResponse(res, 201, true, "User updated Successfully", updateUser);
    } catch (error) {
        if (error.message === "user_id' or email is required to update a user.") {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);   
    }
}

const addCompanyDetails = async (req, res, next) => {
    const {email, name, description, logo, support_email, valid_id, mobile, support_mobile, address, country, company_identification_no, tax_number,currency } = req.body;
    try {
        const updateUser = await addCompanyDetailsService(email, name, description, logo, support_email, valid_id, mobile, support_mobile, address, country, company_identification_no, tax_number,currency);
        handleResponse(res, 201, true, "Company Details added Successfully", updateUser);
    } catch (error) {
        if (error.message === "User Already Exists") {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        
        next(error);   
    }
}
const updateCompanyDetails = async (req, res, next) => {
    const { 
        user_id, email, name, description, logo, support_email, valid_id, mobile, support_mobile, address, country, 
    company_identification_no, tax_number,currency, other
    } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: "Email is required to update company details" });
    }
    
    try {
            const updateUser = await updateCompanyDetailsService(user_id, email, name, description, logo, support_email, valid_id, mobile, support_mobile, address, country, 
            company_identification_no, tax_number,currency, other);
            handleResponse(res, 201, true, "Company Details added Successfully", updateUser);
    } catch (error) {
        if (error.message === "User Already Exists") {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        
        next(error);   
    }
}

const buySubscription = async (req, res, next) => {
    const {user_id, tier, month, transaction_id } = req.body;
    try {
        const updateUser = await buySubscriptionService(user_id, tier, month,transaction_id);
        handleResponse(res, 201, true, "Subscription bought successfully", updateUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);   
    }
}
const getFreeTrialPlan = async (req, res, next) => {
    const {user_id} = req.body;
    try {
        const updateUser = await getFreeTrialPlanService(user_id);
        handleResponse(res, 200, true, "Free tiral activated", updateUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);   
    }
}
const getUserPlanDetails = async (req, res, next) => {
    const {user_id} = req.query;
    try {
        const updateUser = await getPlanDetailsService(user_id);
        handleResponse(res, 200, true, "User Plan Details fetched successfully", updateUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        console.log(error)
        next(error);   
    }
}

const getCompanyDetailsById = async (req, res, next) => {
    // const userId = req.user.user_id;
    const { user_id } = req.query;
    try {
        const company = await getCompanyDetailsByIdService(user_id);
        handleResponse(res, 200, true, "Company data retrieved", company);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);   
    }
}

const tempUpdateSubscriptionDetails = async (req, res, next) => {
    const {user_id,tier, month } = req.body;
    try {
        const updateUser = await tempUpdateSubscriptionDetailsService(user_id,tier, month);
        handleResponse(res, 201, true, "Details Updated successfully", updateUser);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);   
    }
}


module.exports = {deleteUser, updateUser, getAllUser, getUserById, createUser, getUserByEmail, addCompanyDetails, 
            buySubscription, updateCompanyDetails, getFreeTrialPlan, getUserPlanDetails, getCompanyDetailsById, tempUpdateSubscriptionDetails

}
