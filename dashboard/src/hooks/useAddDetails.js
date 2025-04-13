import axios from "axios";
import { useSelector } from "react-redux";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const RESMIC_API_SECRET = import.meta.env.VITE_RESMIC_API_SECRET;

export async function useAddDetail(endpoint, body) {
    try {
        const response = await axios.post(`${BACKEND_URL}${endpoint}`, body, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw (error?.message || 'Something went wrong');
    } 
}

export async function useMakePayment(endpoint, paymentDetails, userId) {
    console.log("API Key:", RESMIC_API_SECRET);
    console.log("User ID:", userId);

    try {
        const response = await axios.post(`${BACKEND_URL}${endpoint}`, paymentDetails, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': RESMIC_API_SECRET,
                'x-user-id': userId
            },
            withCredentials : true
        });
        
        if (response.data?.success) {
            let payment_url = response.data?.data?.payment_url;
            window.location.assign(payment_url); 
        } else {
            throw new Error("Unable to generate payment session.");
        }
    } catch (error) {
        console.error("Payment Error:", error);
        throw (error?.message || 'Something went wrong');
    }
}