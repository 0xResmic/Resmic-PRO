// External imports
const express = require('express');
require('dotenv').config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {WebSocketServer} = require("ws");
const { default: BigNumber } = require('bignumber.js');

const pool = require("./config/db")
// Routes Import
const userRoutes = require('./routes/userRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const makePaymentRoutes = require('./routes/makePaymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const couponRoutes = require('./routes/couponRoutes');

const errorHandler = require("./middlewares/errorHandler");
const { getCurrentTokenPrice } = require('./blockchain/tokenPrice');
const { deployAndWithdraw } = require('./blockchain/contractInteractions');
const { checkPaymentSessionServiceInternal, generateTempWalletAddressService } = require('./services/makePaymentServices');

const app = express();
const PORT = process.env.PORT || 5001;

const wss = new WebSocketServer({ port: 8080, host:'0.0.0.0' });
let wsClients = new Set();

wss.on('connection', (ws) => {
    wsClients.add(ws);
    ws.on('close', () => wsClients.delete(ws));
});

const cookieAuth = async(req, res, next) => {
    const token = req.cookies.uid;
	console.log("token", token)
    if (token) {
		try {
		  const decoded = jwt.verify(token, process.env.JWTSECRET);
		 console.log("decoded", decoded) 
		  req.user = decoded 
		  next();
		} catch (err) {
			console.log("Err", err)
		  res.status(401).json({status: false,  message: 'Invalid token' });
		}
	  } else {
		res.status(401).json({ status: false, message: 'Unauthorized user access' });
	  }
  };


// app.use(cors());
const publicCors2 = cors({
	origin: "*", // Allows all origins
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-signature", "X-Signature", "X-API-Key"]
});

const publicCors = cors({
	origin: "*", // Allows all origins
	methods: "GET,POST,PUT,DELETE,OPTIONS"
	// allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-signature"]
  });
  
  // Restricted CORS for Dashboard
  const dashboardCors = cors({
	origin: ["http://localhost:5173", "http://localhost:3001", "http://localhost:8080", "http://localhost:3000", "http://localhost:5174", "https://dashboard.resmic.com", "https://resmic-pro-hosted-payment-page.vercel.app", "https://payments.resmic.com", "https://resmic-pro-dashboard.vercel.app", "https://resmic-checkout-gateway.vercel.app"], 
	credentials: true, // Required for cookies, authentication
	methods: "GET,POST,PUT,DELETE,OPTIONS",
	allowedHeaders: "Content-Type,Authorization",
  });

app.use(express.json());

app.use(cookieParser());

// Login Auth
app.use('/api/v1/makepayment',publicCors, makePaymentRoutes);
app.use("/api/v1/auth", dashboardCors, userAuthRoutes); 

// JET Auth
app.use("/api/v1/user", dashboardCors,cookieAuth, userRoutes); 
app.use('/api/v1/dashboard', dashboardCors, cookieAuth, dashboardRoutes);
app.use('/api/v1/',dashboardCors, cookieAuth, apiKeyRoutes);
app.use('/api/v1/coupon', publicCors2, cookieAuth, couponRoutes);

// Error Handling
app.use(errorHandler);



app.get('/',  async (req, res) => {
    res.send("Server is up and running");
})


// Make-payment endpoint.
app.post('/api/v1/makepayment/qrpayments', publicCors, async (req, res) => {
	const {user_id, session_id, factory_contract_address, client_address, blockchain, token_address, token, amount, decimal, token_type, coupon_code, blockchain_confirmation} = req.body;
	
	if(!factory_contract_address, !client_address, !session_id, !blockchain, !token, !decimal){
		res.status(404).json({status: 404, success: false, message: "Insufficient params", data:{error:error}})
	}
	try {
		const checkPaymentSession = await checkPaymentSessionServiceInternal(session_id, amount);
		console.log("checkPaymentSession", checkPaymentSession)
		if(!checkPaymentSession){
			res.status(404).json({status: 404, success: false, message: "Session is expired or wrong params", data:{error:checkPaymentSession}})
			return false
		}
		
	} catch (error) {
		console.log("Error: ", error)
		res.status(404).json({status: 404, success: false, message: "Session is expired or wrong params", data:{error:error}})
		return false
	}
	
	
	let predictedAddress_;
	let salt_;
	console.log("factory_contract_address", factory_contract_address)
	console.log("client_address", client_address)
	try {
			let {predictedAddress, salt} = await generateTempWalletAddressService(
				blockchain,
				factory_contract_address,
			client_address,
		);

		predictedAddress_ = predictedAddress;
		salt_ = salt;
		res.status(200).json({status: 200, success: true, message: "Address retrieved successfully", data:{temp_address: predictedAddress_}})
		
	} catch (error) {
		if (error.message) {
            return res.status(404).json({ status:400, success: false, message: error.message });
        }
	}

	let calculatedAmount;
	if(token_type === 'stable'){
		calculatedAmount = amount;
		calculatedAmount = BigNumber(Math.floor((parseFloat(calculatedAmount) * (10 ** decimal))))
    	calculatedAmount = calculatedAmount.toFixed()
	}
	else {
		const liveTokePrice = await getCurrentTokenPrice(token);
		calculatedAmount = amount / liveTokePrice;
		calculatedAmount = BigNumber(Math.floor((parseFloat(calculatedAmount) * (10 ** decimal))))
    	calculatedAmount = calculatedAmount.toFixed()
	}
	console.log("calculatedAmount", calculatedAmount)

    const deployAndWaitResult = deployAndWithdraw(
		session_id,
		predictedAddress_,
		salt_,
		client_address,
		calculatedAmount,
		factory_contract_address,
		blockchain,
		token,
		token_address, 
		coupon_code,
		blockchain_confirmation,
		wsClients,
	);
	console.log("deployAndWaitResult", deployAndWaitResult)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
