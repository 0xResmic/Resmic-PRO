const crypto = require("crypto");

function verifyHMAC(payload, signature, secretKey) {
  const data = JSON.stringify(payload);
  const computedSignature = crypto.createHmac("sha256", secretKey).update(data).digest("hex");
  return computedSignature === signature;
}


const hostedPageAuth = async(req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const requestBody = req.body; // Payload from the request
  const clientSignature = req.headers["x-signature"]; 
  
    if (!apiKey || !(process.env.HOST_PAGE_SECRET_API_KEY === apiKey)) {
      return res.status(401).json({ error: "Invalid or missing API key" });
    }

    const isValid = verifyHMAC(requestBody, clientSignature, process.env.HOST_PAGE_HMAC_SECRET_KEY);
    if (!isValid) {
      return res.status(403).json({ error: "Invalid HMAC signature" });
    }
    console.log("er are aere")
    next(); // API request is is valid, proceed to the next middleware or route  
}

module.exports = {hostedPageAuth};