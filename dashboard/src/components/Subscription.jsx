import SubscriptionTopCard from "./Subscription/SubscriptionTopCard";
import { useState, useEffect } from "react";
import { useFetchDetail } from "../hooks/useFetchDetail";
import PaymentHistory from "./Subscription/PaymentHistory";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddDetail } from "../hooks/useAddDetails";
import { useMakePayment } from "../hooks/useAddDetails";
import axios from 'axios'

function Subscription() {
    const [subscriptionTopCardData, setSubscriptionTopCardData] = useState([]);
    const [paymentHistoryData, setPaymentHistoryData] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const [loading2, setLoading2] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [buySubscriptionData, setBuySubscriptionData] = useState({
        tier: "1",
        month: "1",
        user_id: token,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBuySubscriptionData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

const makePaymentRedirect = async(_amount, _month, planName) => {
    try {
        const paymentDetails = {
            amount: _amount, // Amount in USD $
            blockchain: ["Base", "Polygon",],
            token: ["USDT", "USDC", "DAI"],
            title: "Resmic PRO Subscription",
            description: `Resmic PRO Subscription. \n Plan: ${planName} \n Duration: ${_month} month `,
            wallet_address: "0x056397760b973BfB921Bc10Be9DA5034B1e921d7",
            blockchain_confirmation: 2,
            redirect_url:"https://dashboard.resmic.com/subscription",
            cancel_url:"https://dashboard.resmic.com/subscription",
            webhook_url: "adityakaklij11@gmail.com", // Provide webhook endpoint or use email for status updates
        }
        // Initiate the payment session.
        let response = await axios.post(`https://api.resmic.com/api/v1/makepayment`, paymentDetails, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_RESMIC_PRO_SECRET,
                'x-user-id': import.meta.env.VITE_RESMIC_PRO_USER_ID
            }
        })
        // Redirection to Payment Page.
        if (response.data?.success){
            let payment_url = response.data?.data?.payment_url
            window.location.assign(payment_url)
        }
        else{
            alert("Unable to generate payment session.")
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

    const handleBuySubscription = async () => {
        if (!buySubscriptionData.tier.trim() || !buySubscriptionData.month) {
            return toast.error("All input field is required!", {
                position: 'top-center'
            });
        }
    
        setLoading2(true);
        try {
            let amount;
            let plan ='';

            let userSelectedTier = Number(buySubscriptionData.tier);
            let userSelectedMonth = Number(buySubscriptionData.month);

            
            if (userSelectedMonth === 12) {
                if(userSelectedTier === 1) {
                    let perMonth = 35;
                    amount = perMonth * userSelectedMonth;
                    plan = "Starter";
                    
                }
                else if(userSelectedTier === 2) {
                    let perMonth = 134
                    amount = perMonth * userSelectedMonth;
                    plan = 'Growth';
                }
                
            }
            else {
                if(userSelectedTier === 1) {
                    let perMonth = 39
                    plan = "Starter";
                    amount = perMonth * userSelectedMonth;
                }
                else if(userSelectedTier === 2) {
                    let perMonth = 149
                    amount = perMonth * userSelectedMonth;
                    plan = 'Growth';
                }
            }


            console.log("userSelectedTier", userSelectedTier)
            console.log("userSelectedMonth", userSelectedMonth)
            makePaymentRedirect(amount,userSelectedMonth, plan)


        //   const response = await useAddDetail('api/v1/user/update-temp-subscription', {
        //     ...buySubscriptionData,
        //     month: Number(buySubscriptionData.month),
        //     tier: Number(buySubscriptionData.tier),
        //   })
        //     console.log("Response is : ",response);
        //     let totalPay = 0 ;
        //     if(buySubscriptionData.tier == "1" ){
        //         totalPay = 39 * Number(buySubscriptionData.month)
        //     } else if(buySubscriptionData.tier == "2" ){
        //         totalPay = 149 * Number(buySubscriptionData.month)
        //     }
        //     proceedToBuySubscription(totalPay)
          // Clear input
        } catch (error) {
          toast.error("Buying Subscription Fail!", {
                position: "top-center",
                autoClose: 4000 
            });
        } finally {
            setShowBuyModal(false);
            setLoading2(false);
        }
      };

      async function proceedToBuySubscription(totalAmount) {
        console.log("subscription func call");
        
        try {
            const paymentDetails = {
                    amount: totalAmount, // Amount in USD
                    blockchain: ["Ethereum", "Polygon", "Binance", "XDC-Network"],
                    token: ["USDT", "USDC", "BUSD", "ETH", "DAI", "XDC", "Matic", "BNB"],
                    title: "Resmic PRO Subscription",
                    description: "Payment for Resmic PRO Subscription",
                    wallet_address: "0x056397760b973BfB921Bc10Be9DA5034B1e921d7",
                    blockchain_confirmation: 2,
                    redirect_url:"https://dashboard.resmic.com/success",
                    cancel_url: "https://dashboard.resmic.com/failed",
                    webhook_url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/makepayment/subscription/payment-status`,
            }
    
            const response = await useMakePayment('api/v1/makepayment', paymentDetails, token);
        } catch (error) {
            toast.error("Buying Subscription Fail!", {
                position: "top-center",
                autoClose: 4000 
            });
        } finally {
            setShowBuyModal(false);
            setLoading2(false);
            setBuySubscriptionData({
                tier: "1",
                month: "1",
                user_id: token,
         })
        }
    }

    useEffect(()=>{
        getSubscriptionTopCardData();
        getPaymentHistoryData();
    },[])
        
        
    async function getSubscriptionTopCardData() {
        try {
            const response = await useFetchDetail(`api/v1/user/plan-details?user_id=${token}`);
            console.log(response[0]);
            // setSubscriptionTopCardData(response[0]);
            // Assuming response[0] contains the data
            const formattedData = {
                ...response[0],
                created_at: response[0]?.created_at?.split("T")[0], // Extract only the date part
                end_date: response[0]?.end_date?.split("T")[0] // Extract only the date part
            };
            
            // Set the formatted data in state
            setSubscriptionTopCardData(formattedData);
        } catch (error) {  
            if(error == "Error: No Result found") return;
            toast.error(error || "Something went wrong!", {
                position: "top-center", 
                autoClose: 4000
            });
        }
    }

    async function getPaymentHistoryData() {
            const response = await useFetchDetail(`api/v1/user/plan-details?user_id=${token}`);
            console.log(response);
            setPaymentHistoryData(response);
    }

    return(
        <>
            <div className="w-[100%] lg:w-[85%] min-h-screen p-4">
            <div className="flex justify-between items-end flex-wrap mb-6">
                <h1 className="text-3xl font-bold">Subscriptions</h1>
                
                {/* <button className="px-2 py-1 text-sm bg-primary text-white rounded-md cursor-pointer font-semibold" onClick={() => setShowBuyModal(true)}>
                <i className="bi bi-plus-lg"></i> Buy Subscription
                </button> */}
            </div>

                <SubscriptionTopCard data={subscriptionTopCardData}/>
                <PaymentHistory data={paymentHistoryData}/>
            </div>
            {/* Buy Subscription Modal */}
            {showBuyModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="mt-[10vh] mx-2 bg-white rounded-lg p-6 max-w-[500px] max-h-[80vh] overflow-y-auto shadow-lg">
                    <div className="flex justify-between items-center">
                    <h2 className="text-md font-bold mb-4">Buy Subscription</h2>
                    <p className="text-xl font-bold cursor-pointer text-primary" onClick={() => setShowBuyModal(false)}>X</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-xs">
            
                        {/* Plan Type */}
                        <div>
                        <label className="text-xs font-semibold">Select Plan</label>
                        <select
                            name="tier"
                            className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                            value={buySubscriptionData.tier}
                            onChange={handleChange}
                        >
                            <option value={1}>Starter</option>
                            <option value={2}>Growth</option>
                            {/* <option value={3}>Gold</option> */}
                        </select>
                        </div>

                        {/* PLan Duration */}
                        <div>
                        <label className="text-xs font-semibold">Plan Duration</label>
                        <select
                            name="month"
                            className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border focus:border-primary mt-2"
                            value={buySubscriptionData.month}
                            onChange={handleChange}
                        >
                            <option value={1}>1 Month</option>
                            <option value={3}>3 Months</option>
                            <option value={6}>6 Months</option>
                            <option value={12}>12 Months</option>
                        </select>
                        </div>
             
                    </div>
            
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                        onClick={() => setShowBuyModal(false)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleBuySubscription}
                        className="px-3 py-2 bg-primary text-white rounded-md text-sm"
                        >
                        {loading2 ? "Buying..." : "Buy"}
                        </button>
                    </div>
                    </div>
                </div>
                )}
            <ToastContainer/>
        </>
    )
}

export default Subscription;