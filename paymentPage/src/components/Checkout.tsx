import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import BlockchainSelector from "./BlockchainSelector";
import TokenSelector from "./TokenSelector";
import CouponInput from "./CouponInput";
import QRCodeComponent from "../components2/QrCodeComponent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Copy, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Chains, SupportedTokens, TokenAddress, Tokens } from "../components2/Constants/Constants";
import { getCurrentTokenPrice } from "../components2/Constants/LivePrice";
import { makeEVMPayment } from "../components2/EVM/EVMProcess";
import { Input } from "@/components/ui/input";

interface CheckoutProps {
  className?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ className }) => {
  const [blockchain, setBlockchain] = useState("Base");
  const [token, setToken] = useState("USDC");
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "qrcode" | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const { toast } = useToast();

  const [selectedBlockchain, setSelectedBlockchain] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [makePaymentBtn, setMakePaymentBtn] = useState("Make Payment");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [error, setError] = useState("");
  const [blockchainList, setBlockchainList] = useState([]);
  const [tokenList, setTokenList] = useState([]);

  const [isClicked, setIsClicked] = useState(false);
  const [isQrComponentOpen, setIsQrComponentOpen] = useState(false);

  const [paymentStatusText, setPaymentStatusText] = useState("");

  const [data, setData] = useState(null);

  const [coupon, setCoupon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponUpdated, setCouponUpdated] = useState(false);

  const [liveTokenPrice, setLiveTokenPrice] = useState(2400);
  const [amountPayable, setAmountPayable] = useState(0);

  const [finalAmount, setFinalAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [expired, setExpired] = useState(false);

  const [tempWalletAddress, setTempWalletAddress] = useState("resmic.com");
  const [isWalletAddressGenerated, setIsWalletAddressGenerated] = useState(false);

  const url = window.location.pathname;
  const sessionId = url.split("/")[1];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/makepayment/session?session_id=${sessionId}`);
        if (!response?.data?.success) {
          toast({
            title: "Session expired!",
            description: "Session expired or does not exists.",
            variant: "destructive",
          });
        }
        let result = response.data?.data;
        if (response?.data?.data?.amount_after_coupon) {
          setFinalAmount(response?.data?.data?.amount_after_coupon);
        } else {
          setFinalAmount(response?.data?.data?.amount);
        }
        setData(result);
        setFinalAmount(result['amount']);
        setBlockchainList(result['blockchain']);
        setTokenList(result['token']);

        let p = {
          "status": 200,
          "success": true,
          "message": "Session retrieved",
          "data": {
            "session_id": "25ed73a7-9340-4758-85bd-b5a5a2b27557",
            "user_id": "qg9NIEn",
            "created_at": "2025-03-20T01:29:33.300Z",
            "updated_at": null,
            "amount": "0.1",
            "domain": "",
            "title": "Payment for purchase xyz product.",
            "description": "Payment for XYZ purchase by Reliance Ltd.",
            "token": [
              "USDT", "USDC", "DAI", "ETH", "PUSH", "WETH", "SETH", "MATIC"
            ],
            "blockchain": [
              "Ethereum", "Polygon", "XDC", "Sepolia", "Base"
            ],
            "payment_status": "initiated",
            "wallet_address": "0xcb1009bED174F5aad7103a61b71Ac0F2d5358684",
            "temp_wallet_address": null,
            "blockchain_confirmation": 1,
            "redirect_url": "localhost:3000",
            "cancel_url": "localhost:3000",
            "webhook_url": "adityakaklij11@gmail.com",
            "other": null,
            "is_coupon_applied": false,
            "coupon_code": null,
            "amount_after_coupon": null,
            "temp_wallet_salt": null,
            "created_at_utc": "2025-03-20T01:29:33.300Z"
          }
        };
      } catch (err) {
        console.log("err", err);
        toast({
          title: "Something went wrong!",
          description: "Unable to retrieve session.",
          variant: "destructive",
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, couponUpdated]);

  useEffect(() => {
    if (token && blockchain) {
      let tokenDetails = Tokens[token];
      let tokenName = tokenDetails?.dname;
      let decimal = tokenDetails?.decimal;
      let tokenType = tokenDetails?.type;

      fetchLiveData(tokenName, decimal, tokenType, finalAmount);
    }
  }, [token, blockchain]);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const fetchLiveData = async (token: any, decimal: any, tokenType: any, amount: any) => {
    if (tokenType === 'stable') {
      setLiveTokenPrice(amount);
      setAmountPayable(amount);
    } else {
      const getLivePrice = await getCurrentTokenPrice(token);
      setLiveTokenPrice(getLivePrice);
      let calculatedAmount: any = amount / getLivePrice;
      calculatedAmount = calculatedAmount.toFixed(5);
      setAmountPayable(calculatedAmount);
    }
  };

  const makePayment = async () => {
    let selectedBlockchain = blockchain;
    let selectedToken = token;

    if (selectedBlockchain === "" || selectedToken === "") {
      toast({
        title: "Select payment method!",
        description: "Please select payment Blockchain & Token",
        variant: "destructive",
      });
    } else {
      switch (selectedBlockchain) {
        case "Starknet":
          break;

        case "Solana":
          break;

        default:
          setIsLoading(true);
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
          await updateTransactionDetails(
            makePaymentEVM.paymentStatus,
            makePaymentEVM.hash,
            makePaymentEVM.fromWalletAddress
          );
          setIsLoading(false);
          break;
      }
    }
  };

  const updateTransactionDetails = async (
    payment_status: any,
    transaction_hash: any,
    from_wallet_address: any
  ) => {
    let status_ = payment_status === true ? "Completed" : "Failed";

    const requestPayload = {
      session_id: data?.session_id,
      payment_status: status_,
      blockchain: blockchain,
      token: token,
      transaction_hash,
      from_wallet_address,
      coupon_code: data?.coupon_code,
    };

    const API_KEY = import.meta.env.VITE_SECRET_API_KEY;
    const SHARED_SECRET_KEY = import.meta.env.VITE_HMAC_SECRET_KEY;

    const signature = generateHMAC(requestPayload, SHARED_SECRET_KEY);

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
      const isPaymentStatusUpdated = response?.data?.success === true;
      if (!isPaymentStatusUpdated) {
        setPaymentStatusText("Payment Failed to complete");
        redirectUserBack(data?.cancel_url);
      }
      setPaymentStatus(isPaymentStatusUpdated);
      if (payment_status) {
        setPaymentStatusText("Payment Completed");
        redirectUserBack(data?.redirect_url);
      } else {
        redirectUserBack(data?.cancel_url);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      redirectUserBack(data?.cancel_url);
    }
  };

  const openQrWindow = async () => {
    let selectedBlockchain = blockchain;
    let selectedToken = token;
    let showQR = true;
    if (selectedBlockchain === "" || selectedToken === "") {
      toast({
        title: "Something went wrong!",
        description: "Please select payment method!",
        variant: "destructive",
      });
      showQR = false;
    }
    if (selectedBlockchain === "Starknet" || selectedBlockchain === "Solana" || selectedBlockchain === "Ethereum" || selectedBlockchain === "XDC-Network" || selectedBlockchain === "Solana" || selectedBlockchain === "BNB-Chain") {
      toast({
        title: "Blockchain not supported",
        description: `${selectedBlockchain} is not supported for QR payments yet!`,
        variant: "destructive",
      });
      showQR = false;
    }
    if (showQR) {
      setPaymentMethod('qrcode');
      await generateQrCode();
    }
  };

  const generateQrCode = async () => {
    let selectedBlockchain = blockchain;
    let selectedToken = token;

    if (selectedBlockchain === "" || selectedToken === "") {
      toast({
        title: "Something went wrong!",
        description: "Please select payment method!",
        variant: "destructive",
      });
      return;
    } else if (selectedBlockchain === "Starknet" || selectedBlockchain === "Solana" || selectedBlockchain === "Ethereum" || selectedBlockchain === "XDC-Network" || selectedBlockchain === "Solana" || selectedBlockchain === "BNB-Chain") {
      toast({
        title: "Blockchain not supported",
        description: `${selectedBlockchain} is not supported for QR payments yet!`,
        variant: "destructive",
      });
      return;
    } else {
      setIsLoading(true);
      let tokenDetails = Tokens[selectedToken];
      let tokenName = tokenDetails?.dname;
      let decimal = tokenDetails?.decimal;
      let tokenType = tokenDetails?.type;
      let factoryContractAddress = Chains[selectedBlockchain];
      factoryContractAddress = factoryContractAddress?.FactoryContract;
      let tokenContractAddress = TokenAddress[selectedBlockchain][selectedToken] || "";

      await generateWalletAndListenToPayment(factoryContractAddress, tokenName, tokenContractAddress, decimal, tokenType);
      setIsQrComponentOpen(true);
      setIsLoading(false);
    }
  };

  function generateHMAC(payload: any, secretKey: string) {
    const data = JSON.stringify(payload);
    const hmac = CryptoJS.HmacSHA256(data, secretKey);
    return hmac.toString(CryptoJS.enc.Hex);
  }

  async function generateWalletAndListenToPayment(
    factoryContractAddress: any,
    tokenName: any,
    tokenContractAddress: any,
    decimal: any,
    token_type: any
  ) {
    const requestPayload = {
      user_id: data?.user_id,
      session_id: data?.session_id,
      factory_contract_address: factoryContractAddress,
      client_address: data?.wallet_address,
      blockchain: blockchain,
      token: tokenName,
      token_address: tokenContractAddress,
      amount: finalAmount,
      coupon_code: data?.coupon_code,
      blockchain_confirmation: data?.blockchain_confirmation,
      decimal: decimal,
      token_type: token_type
    };

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
      if (response?.data?.success) {
        let address_ = response?.data?.data?.temp_address;
        setTempWalletAddress(address_);
        setIsWalletAddressGenerated(!isWalletAddressGenerated);

        const ws = new WebSocket(`${import.meta.env.VITE_WSS_BACKEND_URL}user_id=${data?.user_id}`);
        let paymentStatus: any;
        
        ws.onopen = () => {
          ws.send('Hello Server!');
        };

        ws.onmessage = async (event) => {
          try {
            const paymentData: any = JSON.parse(event.data);
            if (paymentData.status) {
              paymentStatus = true;
              await updateTransactionDetails(paymentData.status, paymentData?.txHash, paymentData?.address);
              toast({
                title: "Payment Completed",
                description: `Payment received successfully.`,
                variant: "default",
              });
            } else {
              toast({
                title: "Something went wrong!",
                description: "Error while making payment!",
                variant: "destructive",
              });
              paymentStatus = false;
              await updateTransactionDetails(paymentStatus, paymentData?.txHash, paymentData?.address);
            }
          } catch (error) {
            paymentStatus = false;
            console.error("Error parsing WebSocket message:", error);
            toast({
              title: "Something went wrong!",
              description: "Error while making payment!",
              variant: "destructive",
            });
            await updateTransactionDetails(paymentStatus, "paymentData?.txHash", "paymentData?.address");
          }
        };
        
        ws.onclose = () => {
          console.log('Disconnected from server');
          setTimeout(() => {
            setPaymentStatus(paymentStatus);
            if (paymentStatus) {
              redirectUserBack(data?.redirect_url);
            } else {
              redirectUserBack(data?.cancel_url);
            }
          }, 100);
        };
      }
    } catch (error) {
      console.log("error", error);
      redirectUserBack(data?.cancel_url);
    }
  }

  async function redirectUserBack(url_: any) {
    console.log("User get redirect here.");
    window.location.href = `${url_}?session_id=${data?.session_id}`;
  }

  const handleApplyCoupon = async () => {
    if (!coupon) {
      toast({
        title: "Enter valid code!",
        description: "Please enter valid coupon code!",
        variant: "destructive",
      });
      return;
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

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/coupon/apply-coupon`,
        requestPayloadCoupon,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
            "X-Signature": signature,
          },
        }
      );
      
      setIsCouponApplied(true);
      setErrorMessage("");
      
      if (response.status) {
        toast({
          title: "Coupon Applied",
          description: `Coupon applied successfully.`,
          variant: "default",
        });
        setCouponUpdated(!couponUpdated);
      }
    } catch (error) {
      console.log("Error", error);
      let message_ = error?.response?.data?.message || "Something went wrong";
      setErrorMessage(message_);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempWalletAddress);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Wallet address has been copied to your clipboard.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTokens = blockchain && data?.token ? data.token.filter((token: any) => SupportedTokens[blockchain]?.includes(token)) : [];

  return (
    <div className={cn(
      "transition-all duration-300",
      fadeIn ? "opacity-100" : "opacity-0",
      className
    )}>
      <div className="flex flex-col md:flex-row">
        {/* Left column - Order summary */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">${finalAmount}</h1>
            
            <div className="border-b pb-4 mb-4">
              <h2 className="font-medium text-lg">{data?.title || "Payment"}</h2>
              <p className="text-gray-600 text-sm mt-1">{data?.description || "Complete your payment"}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${finalAmount}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between py-2 text-green-600">
                  <span>Discount</span>
                  <span>-${(parseFloat(finalAmount) * discount / 100).toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-t border-gray-200 pt-4 font-medium">
                <span>Total due</span>
                <span>${finalAmount}</span>
              </div>
            </div>
          </div>
          
          {/* @note Apply coupon option */}
          {/* <div className="mb-4">
            <div className="flex space-x-2 items-end">
              <div className="flex-1">
                <Input
                  id="coupon"
                  type="text"
                  placeholder="Add promotion code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border-gray-300 focus:border-gray-500"
                  disabled={isCouponApplied}
                />
              </div>
              <Button 
                onClick={handleApplyCoupon} 
                variant="outline" 
                disabled={!coupon || isCouponApplied}>
                Apply
              </Button>
            </div>
            {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
          </div> */}
        </div>
        
        {/* Right column - Payment options */}
        <div className="w-full md:w-1/2 p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Payment method</h2>
          
          {paymentMethod === "qrcode" ? (
            <div className="space-y-6">
              <Button
                variant="ghost"
                size="sm"
                className="group -ml-2"
                onClick={() => setPaymentMethod(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Options
              </Button>
              
              <div className="rounded-lg border p-6 space-y-4">
                <h3 className="font-medium">Scan QR code to pay {amountPayable} {token} on {blockchain} </h3>
                
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : isQrComponentOpen ? (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-3 rounded-lg w-48 h-48 shadow-sm mb-4">
                        <QRCodeComponent data={tempWalletAddress} />
                      </div>

                      <div className="w-full space-y-2">
                        <br />
                        <div className="text-sm font-medium">Wallet Address:</div>
                        <div className="flex items-center">
                          <div className="bg-gray-100 rounded-l-lg p-3 flex-1 overflow-hidden">
                            <div className="truncate text-sm">{tempWalletAddress}</div>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className={cn(
                              "min-w-[3rem] h-11 rounded-r-lg flex items-center justify-center transition-colors",
                              copied
                                ? "bg-green-500 text-white"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                          >
                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    Failed to generate QR code. Please try again.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <BlockchainSelector
                  value={blockchain}
                  onChange={setBlockchain}
                  blockchains={blockchainList}
                />
                
                <TokenSelector
                  blockchain={blockchain}
                  value={token}
                  onChange={setToken}
                  tokens={filteredTokens}
                />
                
                {blockchain && token && (
                  <div className="px-4 py-3 bg-gray-50 border rounded-md text-sm space-y-1">
                    <p>Amount to pay: <span className="font-medium">{amountPayable} {token}</span></p>
                    <p className="text-gray-500 text-xs">Conversion rate: 1 {token} = ${liveTokenPrice} USD</p>
                  </div>
                )}
                
                <div className="pt-4 grid grid-cols-1 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto py-4 flex flex-row justify-center items-center space-x-2"
                    onClick={openQrWindow}
                    disabled={!blockchain || !token || isLoading}
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <QrCode className="h-5 w-5" />
                    )}
                    <div className="text-left">
                      <span className="block font-medium">Scan QR Code</span>
                      <span className="block text-xs text-gray-500">Pay using your wallet app</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
            <p>Secured by <span className="font-medium"> <a href="https://resmic.com" target="_blank">Resmic</a> </span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
