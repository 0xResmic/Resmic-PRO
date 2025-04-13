
const bcrypt = require("bcrypt")
const  pool  = require('../config/db');
const redisClient = require("../config/redisClient");

const validateAPIKey = async (user_id, api_secret, host, req) => {  
  
  // 1️⃣ Check if API key is cached in Redis
  let userData;
  const cachedUserData = await redisClient.get(`user_id:${user_id}`);
  // console.log("cachedUserData", cachedUserData)
  if (cachedUserData) {
    // req.user = JSON.parse(cachedUserData); // Attach user data to request
    console.log("Getting from cache")
    userData = JSON.parse(cachedUserData)
  }
  else {
    console.log("getting the data from DB")
    const getUserData = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if(!getUserData.rows[0]) {
      return [false, "Invalid User ID"]
    }
    // 5 Hrs
    // Caching the User Id and details for upto 5 hrs.
    await redisClient.setEx(`user_id:${user_id}`, (5 * 60 * 60), JSON.stringify(getUserData.rows[0]));
    userData = getUserData.rows[0]
  }
  req.user = userData;

  const api_secret_db = userData['api_secret'];
  const isAPIActive = userData['isactive'];
  const userDomain = userData['domain'];
  
  if(!isAPIActive){
    return [false, "API is not active"]
  }
  else {
    const is_API_KEY_valid = await bcrypt.compareSync(api_secret, api_secret_db);
    if (is_API_KEY_valid) {
      let domainCheck = userDomain === host;
      console.log("domainCheck", domainCheck);
      return [true, "API is active and live."]
    }
    else{
      return [ false, "API KEY is wrong"]
    }
  }
}

const authenticateApiKey = async(req, res, next) => {
    const apiKey = req.headers['x-api-key']; // API key passed via the header
    const user_id = req.headers['x-user-id'];  
    // let hostUrl = req.headers['host']
    const hostUrl = req.headers['origin'];
    const referer = req.headers['referer'];

    if (!apiKey) {
      return res.status(401).json({ error: "API key is missing" });
    }
    const [isValid, message] = await validateAPIKey(user_id, apiKey, hostUrl, req);
    if (!isValid) {
      return res.status(403).json({ error: message });
    }
    console.log("validated")
    next(); // API key is valid, proceed to the next middleware or route  
  };


module.exports = authenticateApiKey;