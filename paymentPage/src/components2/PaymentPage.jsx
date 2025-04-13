import React, { useState, useEffect } from "react";
import "../css/payment.css";
import styles from"../css/payment.module.css";
import ResmicLogo from "../assets/resmiclogo.png";
import { Select } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { makeEVMPayment } from "./EVM/EVMProcess";
import { Chains, SupportedBlockchains, SupportedTokens, TokenAddress, Tokens } from "./Constants/Constants";
import axios from "axios";
import CryptoJS, { HmacSHA224 } from "crypto-js";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
// import QRCodeStyling from "qr-code-styling";
import QRCodeComponent from "./QrCodeComponent";
import {getTempWalletAddress}  from "./EVM/GenerateQrCode";
import { getCurrentTokenPrice } from "./Constants/LivePrice";
// import { WebSocket } from "ws";
/*
  1. We get the session id from the URL
  2. With Session id, fetch the token details. Blockchains, Tokens, Amout, Description, compony name, 
*/

const PaymentPage = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [makePaymentBtn, setMakePaymentBtn] = useState("Make Payment");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [error, setError] = useState("");

  const [paymentStatusText, setPaymentStatusText] = useState("")

  const [data, setData] = useState(null); // State to store fetched data

  // Coupons
  const [coupon, setCoupon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponUpdated, setCouponUpdated] = useState(false);

  // Live token conversion
  const [liveTokenPrice, setLiveTokenPrice] = useState(2400);
  const [amountPayable, setAmountPayable] = useState(0);

  const [finalAmount, setFinalAmount] = useState(0);

  // Calculate time remaining for the payment
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [expired, setExpired] = useState(false);

  const [tempWalletAddress, setTempWalletAddress] = useState("resmic.com");
  // const [tempWalletAddress, setTempWalletAddress] = useState("0xf6aB5ec244845B35AE66bA5c3B6a009Ed7A21c0B");
  const [isWalletAddressGenerated, setIsWalletAddressGenerated] = useState(false)// @note Keep it false

  let tempBlockchainList = ["Sepolia", "Ethereum", "Polygon", "Binance-Chain"];
  let tempTokenList = ["SETH", "Polygon", "BTC", "USDT", "USDC", "ETH"];

  const [isQRSectionVisible, setQRSectionVisible] = useState(false); // @note Keep it false



  const url = window.location.pathname; // Get the path from the URL
  const sessionId = url.split("/")[1];

  const URL = `https://payments.resmic.com/api/v1/makepayment/22f48dcb-9d95-446d-b729-cb39d57a9ba6`;

  // UserEffect to reterive the details from Payment Session
  //@note Commented the API call for development.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        // const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/makepayment/session?session_id=${sessionId}`);
        // if (!response?.data?.success) {
        //   toast.error("Session expired!", {
        //     position: "top-center",
        //     theme: "dark",
        //   });
        // }
        // let result = response.data?.data;
        // if(response?.data?.data?.amount_after_coupon){
        //   setFinalAmount(response?.data?.data?.amount_after_coupon)
        // }
        // else{
        //   setFinalAmount(response?.data?.data?.amount)
        // }
        // setData(result); // Store data in state
        

        
        // @note For Testing
        let p = {
          status: 200,
          success: true,
          message: "Session reterived",
          data: {
            session_id: "bb0dd35f-7483-49a0-a63b-c00e52360f58",
            user_id: "ZAJ5_Bg",
            created_at: "2025-02-08T05:02:09.318Z",
            updated_at: null,
            amount: "10",
            domain: "",
            title: "Payment for purchase xyz product.",
            description: "Secure your RobloX Runners Sneakers Sneakers with a seamless blockchain payment. Pay using ETH, USDT, USDC, or DAI on Ethereum, Polygon, or Sepolia",
            token: ["USDT", "USDC", "DAI", "ETH", "BNB", "XDC" ],
            blockchain: ["Ethereum", "Polygon", "XDC-Network", "Sepolia", "Starknet"],
            payment_status: "initiated",
            wallet_address: "0x92382c1EC09a72cd4a6bA024C4553a16a2250C2F",
            temp_wallet_address: null,
            blockchain_confirmation: 2,
            redirect_url: "http://localhost:5174/success",
            cancel_url: "http://localhost:5174/failed",
            webhook_url: "",
            other: null,
            is_coupon_applied: false,
            coupon_code: null,
            amount_after_coupon: null,
            temp_wallet_salt: null,
            created_at_utc: "2025-02-08T10:32:09.318Z",
          },
        };
        setData(p["data"]); // Store data in state
      } catch (err) {
        console.log("err", err);
          toast.error("Session expired!", {
            position: "top-center",
            theme: "dark",
          });
        setError(err.message); // Handle error
      } finally {
        // setLoading(false); // Stop loading
        // ws.onopen = () => console.log('ws opened');
        // ws.onclose = () => console.log('ws closed');
      }
    };

    fetchData();
  }, [sessionId, couponUpdated]);

  // UseEffect to fetch the live token price to display the conversion.
  useEffect(() => {
    if(selectedBlockchain && selectedToken){
      let tokenDetails = Tokens[selectedToken];
      let tokenName =  tokenDetails?.dname
      let decimal = tokenDetails?.decimal
      let tokenType = tokenDetails?.type

      fetchLiveData(tokenName, decimal, tokenType, finalAmount)
    }
  }, [selectedToken, selectedBlockchain]);

  // UseEffect to track the time remainig for the users.
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);
  const fetchLiveData = async (token, decimal, tokenType, amount) => {
    if(tokenType === 'stable'){
      setLiveTokenPrice(amount);
      setAmountPayable(amount);
    }
    else {
      const getLivePrice = await getCurrentTokenPrice(token);
      setLiveTokenPrice(getLivePrice);
      let calculatedAmount = amount / getLivePrice;
		  // calculatedAmount = BigNumber(Math.floor((parseFloat(calculatedAmount) * (10 ** decimal))))
    	calculatedAmount = calculatedAmount.toFixed(5)
      setAmountPayable(calculatedAmount)
    }
  }
  
  const makePayment = async () => {
    if (selectedBlockchain === "" || selectedToken === "") {      
      toast.warning("Please select payment method!", {
        position: "top-center",
        theme: "dark",
      });
    } else {
      switch (selectedBlockchain) {
        case "Starknet":
          // setIsLoading(true)
          // let makePaymentStarknet = await makeStarknetPayment(selectedToken, Address, Amount, noOfBlockConformation);
          // setPaymentStatus(makePaymentStarknet);
          // // if (makePaymentStarknet) setIsPopUpOpen(false);
          // setIsLoading(false)
          break;

        case "Solana":
          // setIsLoading(true)
          // let makePaymentSolana = await makeSolanaPayment(selectedToken, Address, Amount, noOfBlockConformation);
          // setPaymentStatus(makePaymentSolana);
          // // if (makePaymentSolana) setIsPopUpOpen(false);
          // setIsLoading(false)
          break;

        default: // All EVM blockchain will be redirected as default.
          setIsLoading(true);
          // let p = getTempWalletAddress(selectedBlockchain, selectedToken, data?.wallet_address  )
          // break;
          // return false;
          let Address = { EVM: data?.wallet_address };
          let Amount = finalAmount;
          let noOfBlockConformation = data?.blockchain_confirmation;

          let makePaymentEVM = await makeEVMPayment(
            selectedBlockchain,
            selectedToken,
            Address,
            Amount,
            noOfBlockConformation
          );
          // setPaymentStatus(makePaymentEVM?.paymentStatus);
          await updateTransactionDetails(
            makePaymentEVM.paymentStatus,
            makePaymentEVM.hash,
            makePaymentEVM.fromWalletAddress
          );
          setIsLoading(false);
          // if (makePaymentEVM) setIsPopUpOpen(false)
          break;
      }
    }
  };

  const updateTransactionDetails = async (
    payment_status,
    transaction_hash,
    from_wallet_address
  ) => {
    // let status_= if paymentStatus ? "Completd": "Failed";
    let status_ = payment_status === true ? "Completed" : "Failed";
    let session_id = data?.session_id;

    // Data you want to send
    const requestPayload = {
      session_id: data?.session_id,
      payment_status: status_,
      blockchain: selectedBlockchain,
      token: selectedToken,
      transaction_hash,
      from_wallet_address,
      coupon_code: data?.coupon_code,
    };

    // API Key and Shared Secret Key
    const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
    const SHARED_SECRET_KEY = import.meta.env.VITE_HMAC_SECRET_KEY;

    // Generate the signature
    const signature = generateHMAC(requestPayload, SHARED_SECRET_KEY);

    // Send API request
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/makepayment`,
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
            "X-Signature": signature,
          },
        }
      );
      // console.log("Response from backend:", response?.data?.success);
      const isPaymentStatusUpdated = response?.data?.success === true;
      // console.log("isPaymentStatusUpdated", isPaymentStatusUpdated)
      if(!isPaymentStatusUpdated){
        setPaymentStatusText("Payment Failed to complete");
        redirectUserBack(data?.cancel_url);

      }
      setPaymentStatus(isPaymentStatusUpdated);
      if(payment_status){
        setPaymentStatusText("Payment Completed")
        redirectUserBack(data?.redirect_url);
      }
      else{
        redirectUserBack(data?.cancel_url);
      }
    } 
    catch (error) {
      console.error( "Error:",error.response ? error.response.data : error.message)
      redirectUserBack(data?.cancel_url);
    }
  };

  const handleApplyCoupon = async () => {
    if(!coupon){
      // console.log("Enter valid coupon code")
      toast.warning("Please enter valid coupon code!", {
        position: "top-center",
        theme: "dark",
      });
    }
    const requestPayloadCoupon = {
      coupon_code: coupon.toString(),
      user_id: data?.user_id,
      amount: parseFloat(finalAmount),
      session_id: data?.session_id,
    };
    const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
    const SHARED_SECRET_KEY = import.meta.env.VITE_HMAC_SECRET_KEY;
    const signature = generateHMAC(requestPayloadCoupon, SHARED_SECRET_KEY);
    let message;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/coupon/apply-coupon`, requestPayloadCoupon,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
            "X-Signature": signature,
          },
        }
      );
      // console.log("response", response);
      setIsCouponApplied(true);
      setErrorMessage("")
      message = response?.data?.message
      if(response.status){
        toast.success("Coupon applied successfully", { position: "top-center", theme: "dark" });
        setCouponUpdated(!couponUpdated)
      }
    } catch (error) {
      console.log("Error", error);
      // message = response?.data?.message;
      let message_ = error?.response?.data?.message || "Something went wrong"
      setErrorMessage(message_);
      // setErrorMessage("Coupon is Expired or Invalid.");
      // toast.success("Coupon applied successfully", { position: "top-center", theme: "dark" });
    }
  };

  const generateQrCode = async() => {
    
    if (selectedBlockchain === "" || selectedToken === "") {
      toast.warning("Please select payment method!", {
        position: "top-center",
        theme: "dark",
      });
    }
    if(selectedBlockchain === "Starknet" || selectedBlockchain === "Solana" || selectedBlockchain === "Ethereum" || selectedBlockchain === "XDC-Network" || selectedBlockchain === "Solana" || selectedBlockchain === "Base" || selectedBlockchain === "BNB-Chain"){
      toast.warning(`${selectedBlockchain} is not supported for QR payments yet!`, {
        position: "top-center",
        theme: "dark",
      });
    }
    else {
      // ✅ Send the Request to Generate the wallet Address
      //    a. ✅ Make the Signature.
      //    b. Get the live price quote after user select the payment method.
      // ✅ Start to listen using WS.
      // ✅ Update the WS status.
      // ✅ Close the window as above.
      setIsLoading(true)
      let tokenDetails = Tokens[selectedToken]
      let tokenName =  tokenDetails?.dname
      let decimal = tokenDetails?.decimal
      let tokenType = tokenDetails?.type
      let factoryContractAddress = Chains[selectedBlockchain];
      // console.log("factoryContractAddress", factoryContractAddress)
      factoryContractAddress = factoryContractAddress?.FactoryContract
      let tokenContractAddress = TokenAddress[selectedBlockchain][selectedToken] || ""

      let p = await generateWalletAndListenToPayment(factoryContractAddress, tokenName, tokenContractAddress, decimal, tokenType)
      
    }
  }

  function generateHMAC(payload, secretKey) {
    const data = JSON.stringify(payload);
    const hmac = CryptoJS.HmacSHA256(data, secretKey);
    return hmac.toString(CryptoJS.enc.Hex);
  }

  async function generateWalletAndListenToPayment(factoryContractAddress, tokenName,  tokenContractAddress, decimal, token_type) {

    const requestPayload = {
            user_id: data?.user_id,
            session_id: data?.session_id,
            factory_contract_address: factoryContractAddress,
            client_address: data?.wallet_address,
            blockchain: selectedBlockchain,
            token: tokenName,
            token_address: tokenContractAddress,
            amount: finalAmount,
            coupon_code: data?.coupon_code,
            blockchain_confirmation:data?.blockchain_confirmation,
            decimal:decimal,
            token_type:token_type
      };

    // API Key and Shared Secret Key
    const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
    const SHARED_SECRET_KEY = import.meta.env.VITE_HMAC_SECRET_KEY;

    const signature = generateHMAC(requestPayload, SHARED_SECRET_KEY);

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/makepayment/qrpayments`,
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
            "X-Signature": signature,
          },
        }
      );
    if(response?.data?.success){
      let address_ = response?.data?.data?.temp_address
        setTempWalletAddress(address_);
        setIsWalletAddressGenerated(!isWalletAddressGenerated); //

        // const ws = new WebSocket(`ws://localhost:8080?user_id=${data?.user_id}`);
      const ws = new WebSocket(`${import.meta.env.VITE_WSS_BACKEND_URL}user_id=${data?.user_id}`);
      let paymentStatus;
      let response_;
      ws.onopen = () => {
        ws.send('Hello Server!');
      };
    
      ws.onmessage = async (event) => {
        try {
              const paymentData = JSON.parse(event.data);
              if (paymentData.status) {
                // console.log("✅ Payment received successfully! TxHash:", paymentData.txHash);
                paymentStatus = true;
                // console.log("paymentData", paymentData)
                response_ = {
                  message:"Payment received successfully",
                  sender_address: paymentData?.address,
                  tx_hash: paymentData?.txHash
                }
                await updateTransactionDetails(paymentData.status, paymentData?.txHash, paymentData?.address )
                toast.success("Payment received successfully", { position: "top-center", theme: "dark" });
              } 
              else {
                // console.log("⚠️ Unhandled payment status:", paymentData);
                toast.error("Something went wrong.", { position: "top-center", theme: "dark" });
                paymentStatus = false;
                response_ = {
                  message:"Something went wrong.",
                }
                await updateTransactionDetails(paymentStatus, paymentData?.txHash, paymentData?.address )
              }
            } catch (error) {
              paymentStatus = false;
              console.error("Error parsing WebSocket message:", error);
              toast.error("Something went wrong.", { position: "top-center", theme: "dark" });
              paymentStatus = false;
              response_ = {
                message:"Something went wrong.",
              }
              await updateTransactionDetails(paymentStatus, paymentData?.txHash, paymentData?.address )
          }
      };
      // ws.on('close', () => {
        ws.onclose = () => {
          console.log('Disconnected from server');
          setTimeout(() => {
            setPaymentStatus(paymentStatus);
            if(paymentStatus){
              redirectUserBack(data?.redirect_url);
            }
            else{
              redirectUserBack(data?.cancel_url);
            }
          }, 100)
        };  
      }
    } catch (error) {
      console.log("error", error)
      redirectUserBack(data?.cancel_url);
    }
  }

  async function redirectUserBack(url_){
    window.location.href = `${url_}?session_id=${data?.session_id}`;
  }
const filteredTokens = selectedBlockchain && data?.token? data.token.filter((token) =>SupportedTokens[selectedBlockchain]?.includes(token)): [];
  
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5 sec
  };

return (
    <div className="payment-page">
      {/* Navbar */}
      <div className="navbar">
        <div className="logo-container">
          <img src={ResmicLogo} alt="PayU Logo" className="navbar-logo" />
          {/* <img src="payu-logo.png" alt="PayU Logo" className="navbar-logo" /> */}
        </div>
        <span className="navbar-text">
          PAY ${parseFloat(finalAmount).toFixed(2)}
        </span>
      </div>

      {/* User Details */}
      <div className="user-details">
        <div className="user-info">
          <p className="email">{data?.title}</p>
        </div>
        <p className="email">{data?.description}</p>
      </div>

      {/* Payment Box */}
      <div className="payment-box">
        {/* Payment Option Header */}
        {
          expired ? 
          <div className="payment-option-header-expired">
            <span>Payment Session Expired</span>
          </div>
        :
          <div className="payment-option-header">
            <span>Make payment in: {(timeLeft/60).toFixed(2)} (do not refresh or close the page)</span>
          </div>
          
        }

        <div className="makePaymentDiv">
          <h4>{data?.title}</h4>
          <h4>Amount Payable: ${finalAmount}</h4>
        </div>


    <div className="container">
      {isQRSectionVisible && (
        <button className="scan-qr-btn" onClick={() =>{ setQRSectionVisible(false); setIsWalletAddressGenerated(false)}}>
          Connect Wallet
        </button>
      )}

      {/* Dropdowns */}
      {/* <div className="dropdown-section"> */}
      {/* <div className="mainDivForSections"> */}
      <div className={isQRSectionVisible ? styles.mainDivForSectionsActive : styles.mainDivForSectionsDefault}>

      
      <div className={isQRSectionVisible ? styles.active : styles.inactive}>
      <div className="selectDropdownDiv">
            <div className="labelSelectDiv">
              <label>Network</label>
              <Select 
                disabled={expired}
                style={{ width: 150 }}
                showSearch
                placeholder="Select Blockchain"
                optionFilterProp="label"
                onChange={(value) => setSelectedBlockchain(value)}
                options={data?.blockchain.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </div>

            <div className="labelSelectDiv">
              <label>Coin</label>
              <Select 
              style={{ width: 150, textAlign: 'center' }}
                disabled={expired}
                showSearch
                placeholder="Select Token"
                optionFilterProp="label"
                onChange={(value) => setSelectedToken(value)}
                // options={data?.token.map((item) => ({
                options={filteredTokens.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </div>
          </div>

          { selectedBlockchain && selectedToken &&
            <div className="livePriceDiv">
              <p className="tokenPrice">Amount to Pay: {amountPayable} {selectedToken}</p>
              <p className="tokenConversionPrice">Conversion Rate 1 {selectedToken} = $ {liveTokenPrice} USD</p>
            </div>
          }

          <div className="coupon-container">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="coupon-input"
              disabled={expired}
              
            />
            <button onClick={handleApplyCoupon} className="apply-btn" disabled={expired}>
            {/* <button onClick={handleApplyCoupon} className="apply-btn" disabled={expired || isCouponApplied}> */}
              Apply
            </button>
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </div>

      {!isQRSectionVisible && (
        <>
        {paymentStatus ? (
            <p>{paymentStatusText}</p>
          ) : isLoading ? (
            <Box>
              <CircularProgress size="1rem" />
            </Box>
          ) : (
            <button className="paymentBtn" onClick={makePayment} disabled={expired}>Connect Wallet  </button>
          )}
        </>
      )}

</div>

      <div className="ScanBtnDiv">
      {!isQRSectionVisible && (
        <button className="scan-qr-btn2" onClick={() => setQRSectionVisible(true)}>
          📸 Scan QR Code
        </button>
      )}
      </div>

      {isQRSectionVisible && (
        <div className="qr-section fade-in">
          {/* <h3>📸 Scan QR Code</h3> */}
          {isWalletAddressGenerated? 
            <div>
                <QRCodeComponent data={tempWalletAddress}/>
                {/* <div>
                  <p>{tempWalletAddress}</p>
                </div> */}

                <div className="wallet-container">
                  <p className="wallet-address">{tempWalletAddress}</p>
                  <button className="copy-btn" onClick={copyToClipboard}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
            </div> 
            :
            <div className="blur-effect">
              <QRCodeComponent data={tempWalletAddress}/>
            </div> 
          }
          { !isWalletAddressGenerated &&
            <button className="paymentBtn2" onClick={generateQrCode} disabled={expired}>Reveal Address or QR Code</button>
          }
        </div>
      )}

<>
        {isLoading && (
            <Box>
              <CircularProgress size="1rem" />
            </Box>
          )}
        </>
    </div>
    </div>
        {/* Promo Section */}
        <div className="promo-strip">
          <span>Built with ❤️ by </span>
          <a href="https://resmic.com">Resmic</a>
        </div>
      </div>

      {/* Footer Icons */}
      <div className="footer-icons">
        {/* <img src="visa.png" alt="Visa" />
        <img src="mastercard.png" alt="Mastercard" />
        <img src="geotrust.png" alt="GeoTrust" /> */}
      </div>
    </div>
  );
};

export default PaymentPage;
