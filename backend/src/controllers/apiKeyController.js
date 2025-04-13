const { generateAPIKeyService, getAPIKeyService, updateAPIKeyService, deleteAPIKeyService, generateWebhookSecretService, deleteWebhookSecretService } = require("../services/apiKeyServices");


const handleResponse = (res, status, success, message, data = null) => {
    res.status(status).json({
        status,
        success,
        message,
        data,
    })
}

const generateAPIKey = async (req, res, next) => {
    const { user_id, api_key} = req.body;
    if(!user_id || user_id ===  "" || !api_key || api_key ===  "") {
        return res.status(400).json({
            success: false,
            message: "user_id & api_key is required"
        })
    }
    try {
        const createAPI = await generateAPIKeyService(user_id, api_key);
        handleResponse(res, 201, true, "API-KEY Generate Successfully", createAPI);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);
    }
}



const getAPIKey = async (req, res, next) => {
    const { user_id } = req.query;
    try {
        const createAPI = await getAPIKeyService(user_id);
        handleResponse(res, 200, true, "API-KEY reterived Successfully", createAPI);
    } catch (error) {
        next(error);
    }
}
const deleteAPIKey = async (req, res, next) => {
    const {user_id} = req.body;
    try {
        const deleteAPI = await deleteAPIKeyService(user_id);
        handleResponse(res, 201, true, "API-KEY deleted Successfully", deleteAPI);
    } catch (error) {
        next(error);
    }
}
const updateAPIKey = async (req, res, next) => {
    const { user_id, email} = req.body;
    try {
        const createAPI = await updateAPIKeyService(user_id);
        handleResponse(res, 201, "API-KEY Generate Successfully", createAPI);
    } catch (error) {
        next(error);
    }
}


const generateWebhookSecret = async (req, res, next) => {
    const { user_id} = req.body;
    if(!user_id || user_id ===  "" ) {
        return res.status(400).json({
            success: false,
            message: "user_id required"
        })
    }
    try {
        const createAPI = await generateWebhookSecretService(user_id);
        handleResponse(res, 201, true, "Secret Key Generate Successfully", createAPI);
    } catch (error) {
        if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
        next(error);
    }
}
const deleteWebhookSecret = async (req, res, next) => {
    const {user_id} = req.body;
    try {
        const deleteAPI = await deleteWebhookSecretService(user_id);
        handleResponse(res, 201, true, "Webhook secret deleted Successfully", deleteAPI);
    } catch (error) {
        next(error);
    }
}

module.exports = { getAPIKey, deleteAPIKey, updateAPIKey, generateAPIKey, generateWebhookSecret, deleteWebhookSecret }